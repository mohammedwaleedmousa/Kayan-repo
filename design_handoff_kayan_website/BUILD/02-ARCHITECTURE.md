# 02 — ARCHITECTURE: topology, boundaries, lifecycle

Everything runs as **two processes from one Docker image** (Next.js server + pg-boss worker) against **one PostgreSQL 16** service, on a single EasyPanel node. No other runtime infrastructure exists. Design constraint: the whole system must survive on one modest VPS.

## §1 Topology

```
                 ┌──────────────────────────── EasyPanel node ───────────────────────────┐
Internet ──TLS──►│ Traefik (EasyPanel-managed)                                           │
                 │   ├─ kayanwork.com        ──► [app]  next start (standalone)          │
                 │   ├─ admin.kayanwork.com  ──► [app]  (host-gated in middleware)       │
                 │                                │  ▲ SSE streams                       │
                 │ [worker] node worker.js ───────┤  │                                   │
                 │   pg-boss queues/cron          │  │ LISTEN/NOTIFY                     │
                 │                                ▼  │                                   │
                 │ [db] postgres:16 ◄── volume kayan-db-data                             │
                 │ [app+worker] ◄── volume kayan-files (/data/files, /data/backups)      │
                 │ outbound only: SMTP relay (env) — nothing else leaves the box         │
                 └────────────────────────────────────────────────────────────────────────┘
```

- `app` — serves public site, portals, admin console, and `/api/v1/*` route handlers. Stateless: all state in Postgres + the files volume.
- `worker` — same image, `WORKER=1 node worker.js`. Runs pg-boss subscriptions (mail, purge, SLA, backups, digests). Never serves HTTP except `:9100/healthz`.
- `db` — EasyPanel Postgres service. App connects over the internal network, never exposed publicly.

## §2 Module boundaries (dependency law)

```
src/domain/   pure TS. No imports from server/, next, node APIs beyond crypto. Unit-tested exhaustively.
src/server/   db, repositories, services, adapters, jobs. May import domain/. Never imports from app/.
src/app/      routes + UI. Calls services via server actions / route handlers. Never touches db directly.
src/lib/      env (zod), errors, logger, utils. Leaf module.
```

Enforce with ESLint `no-restricted-imports`. A PR that reaches from `app/` into `db/schema` directly is wrong even if it works.

### domain/ inventory (all pure, all unit-tested)
| Module | Responsibility |
|---|---|
| `ids.ts` | Registry code formatting + check digit (weights [8,7,6,5,4,3,2], mod-11, 10→'X'); parse/validate |
| `escrow.ts` | Ledger math: deposit/release/refund/adjust, remainder-on-final, zero-at-close invariant, balance |
| `rbac.ts` | 12 capabilities × 9 staff roles (the matrix of `06-ADMIN.md §3`), `can(role, cap)` |
| `gates.ts` | G0–G9 transitions; 5-check arming rule; who may request/approve |
| `sla.ts` | Working-day math (week = Sun–Thu; weekend Fri–Sat, Aden), due dates for doors/positions |
| `audit.ts` | Canonical-JSON serializer + hash chain (`sha256(prev_hash ‖ canonical_json)`), verify walk |
| `acceptance.ts` | Signature validation (authority-only), warranty clock (30 days), release amounts |
| `apply.ts` | Station order, per-station completeness, consent rules (9 required of 13), refs 2–3 |
| `otp.ts` | Code generation/expiry/attempt policy (pure parts) |

## §3 Request lifecycle

1. Traefik terminates TLS, sets `X-Forwarded-*` (trust exactly one hop).
2. `middleware.ts`: (a) host check — `admin.` host may only reach `/admin/*` + `/api/v1/admin/*` + auth routes, and `/admin/*` is unreachable on the public host; (b) locale resolution per `09-CONTENT-I18N.md §2`; (c) security headers + CSP nonce (`07-SECURITY.md §10`); (d) request id (`crypto.randomUUID()`), propagated to logs.
3. Route handler / server component: parse with Zod (reject unknown keys) → load session (opaque cookie → DB) → authorize (capability or ownership) → call service.
4. Service: one Drizzle transaction per use case; writes audit entries inside the same transaction; emits `pg_notify('kyn_events', json)` after commit.
5. Response: envelope per `04-API.md §1`; errors mapped from typed `AppError` — never a stack trace to the client.

## §4 Adapters (ports live in `server/adapters/`)

| Port | Production impl | Notes |
|---|---|---|
| `Mailer` | nodemailer → SMTP (env) | All sends queued through `email_outbox` + pg-boss; direct send only for OTP (latency), still recorded |
| `OtpChannel` | `EmailOtp` (via Mailer) | `WhatsAppOtp` = stub implementing the same interface, enabled only by `WHATSAPP_ENABLED=true`; the system must never *require* it |
| `Storage` | `VolumeStorage` (`/data/files`) | `put/getStream/delete/head`, sha256 on write, random storage names; S3/MinIO impl allowed later behind the same port |
| `Clock` | real | injectable for tests (SLA, warranty, appeal windows) |
| `Rng` | `crypto` | injectable for OTP/token tests |

## §5 Jobs (pg-boss, all idempotent, all audited)

| Job | Schedule/trigger | Effect |
|---|---|---|
| `mail.send` | queue | delivers `email_outbox` rows, retries ×5 backoff, marks failed |
| `otp.cleanup` | hourly | delete expired `auth_tokens` |
| `sla.scan` | hourly | flags due-soon/overdue on `contact_messages`, `job_applications`; notifies people desk |
| `warranty.expire` | daily 03:00 | closes engagements whose `warranty_ends_at` passed; audit |
| `appeal.close` | daily 03:10 | expires 21-day appeal windows |
| `id_images.purge` | on decision + daily sweep | deletes `sensitive` stored files for decided applications; keeps sha256 + row (`purged_at`) |
| `backup.nightly` | daily 02:00 Asia/Aden | `pg_dump -Fc` + files snapshot to `/data/backups`, retention prune, audit entry (`08-DEPLOY §6`) |
| `tier.dormancy` | weekly Sun 04:00 | tier-drop per dormancy rules; writes reasoned audit entries |
| `digest.weekly` | weekly Sun 08:00 | staff digest email (queues, SLA, escrow held) |

Worker startup registers schedules idempotently (`boss.schedule` with fixed names). All times computed in `Asia/Aden`, stored UTC.

## §6 Realtime

- Single SSE hub in the app process: route handlers subscribe to Postgres `LISTEN kyn_events`, filter by audience, stream.
- Endpoints and event names in `04-API.md §11`. Heartbeat comment every 25s (Traefik-safe); client `EventSource` with `Last-Event-ID` resume; automatic downgrade to 15s polling after 3 failed reconnects.
- Multi-replica note: because fan-out rides LISTEN/NOTIFY, scaling `app` horizontally later needs no change.

## §7 Errors, logging, observability

- `AppError(code, httpStatus, message_ar, message_en, meta?)`; full code table in `04-API.md §1`. Unknown errors → `internal` + request id, logged at `error`.
- pino JSON logs to stdout (EasyPanel collects): `{ts, level, reqId, actor, route, ms, code?}`. **Never log** passwords, tokens, OTPs, payout details, ID numbers, or file contents.
- `/api/health`: `{ok, db, migrations, version, worker_heartbeat}` — worker writes a heartbeat row each minute; health degrades if stale >5 min.
- 5xx spike alert: worker counts errors table entries; mails ops address when >10/5min (self-hosted alerting, Law 3).

## §8 Time, money, text — global policies

- **Time**: store `timestamptz` UTC; render Asia/Aden; SLA math in working days Sun–Thu (`domain/sla.ts`).
- **Money**: integer cents, USD; `bigint` in DB; formatting only at the edge. YER figures appearing in copy (e.g. Hub 30,000 YER) are copy, not computed.
- **Text**: UTF-8 everywhere; Arabic source; BiDi isolates around codes in Arabic prose (`09-CONTENT-I18N.md §7`).
- **IDs**: public codes issued only by `registry_counters` inside transactions (`03-DATABASE.md §5`); UUIDs internal.
