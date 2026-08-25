# 08 — DEPLOY: EasyPanel, end to end

Target: the company's own **EasyPanel** server (Docker + Traefik under the hood). Two environments as separate EasyPanel projects: `kayan-staging`, `kayan-prod`. Everything below works with zero services outside the box except the SMTP relay.

## §1 Services & volumes (per environment)

| Service | Type | Image/source | Notes |
|---|---|---|---|
| `web` | App | repo `Dockerfile` (Git deploy or pushed image) | port 3000; domains attached here; healthcheck `/api/health` |
| `worker` | App | **same image**, start command `node worker.js` | no domains; healthcheck `:9100/healthz` |
| `db` | Postgres 16 | EasyPanel Postgres service | internal-only; strong generated password |

Volumes: `kayan-files` → mount `/data/files` on **web + worker**; `kayan-backups` → `/data/backups` on worker (and web read-only if the admin backup view streams files); DB service manages its own data volume. Files and backups are volumes, never image layers — a redeploy must lose nothing.

## §2 Image (`Dockerfile`, multi-stage)

```dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm i --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm build                     # next build (output: 'standalone') + tsc worker

FROM node:22-alpine AS run
RUN apk add --no-cache postgresql16-client tzdata   # pg_dump for backups; tz for Asia/Aden math
RUN addgroup -S kayan && adduser -S kayan -G kayan
WORKDIR /app
COPY --from=build --chown=kayan:kayan /app/.next/standalone ./
COPY --from=build --chown=kayan:kayan /app/.next/static ./.next/static
COPY --from=build --chown=kayan:kayan /app/public ./public
COPY --from=build --chown=kayan:kayan /app/dist-worker ./           # worker.js + migrate.js
COPY --chown=kayan:kayan docker-entrypoint.sh ./
USER kayan
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node","server.js"]
```

`docker-entrypoint.sh`: validate env (zod script) → run migrations under a Postgres **advisory lock** (web and worker race-safe) → exec CMD. Worker service overrides CMD to `node worker.js`. Local dev: `compose.yaml` = app + postgres:16 + mailpit (SMTP catcher).

## §3 Domains, TLS, proxy

- `kayanwork.com` + `www` (redirect → apex) → `web`; `admin.kayanwork.com` → `web` (middleware does host-gating). Staging: `staging.kayanwork.com`, `admin-staging.kayanwork.com` — protected by EasyPanel basic-auth at the proxy **plus** `SEED_DEMO` gates in-app.
- Let's Encrypt via EasyPanel (Traefik); force HTTPS on; HSTS set by the app (`07-SECURITY §10`).
- Proxy passes `X-Forwarded-For/Proto`; app trusts exactly one hop. Request body limit 15 MB (covers upload caps + envelope).

## §4 Environment variables (complete — `.env.example` mirrors this)

| Var | Example / format | Notes |
|---|---|---|
| `NODE_ENV` | `production` | |
| `APP_URL` | `https://kayanwork.com` | canonical origin |
| `ADMIN_URL` | `https://admin.kayanwork.com` | host-gate reference |
| `PORT` | `3000` | |
| `TZ` | `Asia/Aden` | display/SLA math; storage stays UTC |
| `DATABASE_URL` | `postgres://kayan:***@db:5432/kayan` | internal hostname from EasyPanel |
| `SESSION_SECRET` | 32B base64 | cookie signing; rotate ⇒ all sessions drop |
| `ENCRYPTION_KEY` | 32B base64 | AES-256-GCM (§7 security); **owner keeps offline copy** |
| `ENCRYPTION_KEY_PREVIOUS` | optional | rotation window |
| `OTP_PEPPER` | 32B base64 | OTP hash pepper |
| `SMTP_URL` | `smtps://user:pass@relay:465` | the ONLY external service |
| `MAIL_FROM` | `السجل — كيان <registry@kayanwork.com>` | SPF/DKIM/DMARC set at DNS for the relay |
| `OPS_ALERT_EMAIL` | `ops@…` | alarms (backup fail, 5xx, chain break) |
| `FILES_DIR` / `BACKUPS_DIR` | `/data/files` / `/data/backups` | volumes |
| `BACKUP_RETENTION_DAILY/WEEKLY` | `14` / `8` | prune policy |
| `SEED_DEMO` | `false` | staging-only fixtures; **prod boot refuses `true`** |
| `DEMO_OTP` | `false` | the `2026` seam; same refusal |
| `STAFF_PREVIEW` | `false` | admin role-preview select (staging only) |
| `BOOTSTRAP_ADMIN_TOKEN` | one-time 32B | enables `pnpm bootstrap:admin`; **unset after use** |
| `ADMIN_IP_ALLOWLIST` | optional CSV CIDRs | extra admin-host gate |
| `WHATSAPP_ENABLED` | `false` | adapter off by default; `WHATSAPP_*` creds only if ever enabled |
| `LOG_LEVEL` | `info` | pino |

Generate secrets with `openssl rand -base64 32`. Staging and production never share a secret.

## §5 Release process

1. Push to `main` (staging tracks `main`; production deploys tags `vX.Y.Z` / `session-NN`).
2. EasyPanel builds the Dockerfile → deploy staging → entrypoint migrates → run the regression pack (`10-QA §9`) against staging.
3. Promote: deploy the same image/tag to prod (web first, then worker). Migrations are expand-safe (`03-DATABASE §8`), so old code + new schema coexist during the minute of rollout.
4. Rollback = redeploy previous tag. Contract-phase migrations only ship one release after their expand phase, so rollback is always schema-safe.
5. Post-deploy: `/api/health` green on both hosts, worker heartbeat fresh, regression pack on prod read-only routes.

## §6 Backups & restore drill (the runbook)

- Worker job 02:00 Asia/Aden nightly: `pg_dump -Fc "$DATABASE_URL" > /data/backups/db-YYYYMMDD.dump` + `tar -zcf files-YYYYMMDD.tgz /data/files` → prune per retention → verify chain (`pnpm audit:verify`) → row in `backups` + audit entry → alarm mail on any failure. Manual trigger: admin settings card.
- Optional off-server copy: rclone to owner storage, `age`-encrypted archives (`07-SECURITY §12`).
- **Restore drill (quarterly + before launch):** create scratch DB in the EasyPanel Postgres service → `pg_restore -d kayan_drill db-latest.dump` → run `pnpm drill:verify` (compares table row counts + latest audit hash against production values recorded at dump time) → document in `PROGRESS.md` + `backups.note` → drop scratch DB. Files drill: extract one archive, spot-check 3 known sha256s.
- Full-disaster runbook: new EasyPanel project → create services §1 → set env §4 (secrets from the owner's vault) → restore DB + files volumes → deploy image tag → DNS. Target RTO 4h, RPO 24h — stated to the owner.

## §7 Logs, monitoring, alerts

Structured stdout logs (EasyPanel viewer; optional self-hosted Loki later). `/api/health` = DB ping + migration state + worker heartbeat age. Uptime: self-hosted **uptime-kuma** as a fourth EasyPanel service (optional but recommended) watching both hosts + staging, mail alerts through the same SMTP. In-app alarms per `07-SECURITY §11`. Resource starting points: web 1 vCPU/1 GB (limit 2 GB), worker 0.5 vCPU/512 MB, DB 1 vCPU/1–2 GB; watch and adjust in EasyPanel metrics.

## §8 Maintenance & scaling

`maintenance` feature flag: public site serves the designed maintenance page (dark green, mark, tagline, one line); admin host stays up; APIs return 503 except health + admin. Scale path when needed (in order): DB indexes/EXPLAIN → raise web resources → second web replica (works as-is: sessions in DB, SSE via LISTEN/NOTIFY) → move Postgres to a bigger node. Nothing in the architecture assumes a single replica except file writes (volume is single-node — S3/MinIO adapter is the designated exit, behind the existing `Storage` port).

## §9 DNS & go-live

Records: `A kayanwork.com → node IP`, `CNAME www → kayanwork.com`, `A admin → node IP` (+ staging twins); mail DNS for the relay (SPF include, DKIM key, DMARC `p=quarantine` to start). Cutover: drop TTL to 300 the day before → deploy prod → verify TLS on all hosts → run launch checklist (`10-QA §8`) → raise TTL. Keep staging alive after launch; it is the rehearsal stage for every future change.
