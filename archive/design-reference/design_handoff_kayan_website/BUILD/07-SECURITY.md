# 07 — SECURITY: the binding standard

Non-negotiable. Where any other doc or convenience conflicts with this one, this one wins. Scope: everything that authenticates, authorizes, stores, uploads, or leaves the system.

## §1 Principles & threat model

Assets, in order: **escrow money records → identity documents/PII → account credentials → registry integrity (ids, audit) → availability**. Adversaries assumed: credential stuffing, phishing of staff, forged API calls from modified clients, malicious uploads, a stolen database dump, a curious insider. Design answers: server-authoritative rules, least-privilege RBAC with separation of duties, append-only + hash-chained records, encryption of the few truly secret fields, minimal PII with scheduled destruction, and no third-party runtime to compromise (Law 3).

## §2 Passwords & credentials

- **Argon2id** (`argon2` npm): memory 64 MiB, iterations 3, parallelism 1, salt 16B, hash 32B. Encoded string in `pw_hash`. Rehash-on-login when params change.
- Policy: min 10 chars users / 12 staff; block the top-10k list + `kayan`/`كيان` variants; strength meter as designed (Access). No forced rotation; forced reset on suspicion (`sys` action, audited).
- Login throttling: 5 failures per identifier or IP / 15 min ⇒ 423 with `retry_at` (the design's lockout copy). All attempts recorded (`login_attempts`).
- Password change/reset revokes **all** sessions of the subject; reset tokens 32B random, sha256-stored, 30 min, single-use. Responses never reveal whether an email exists.
- Secrets (env) never logged, never committed; `.env.example` carries placeholders only.

## §3 Sessions & cookies

- Opaque 256-bit random token; DB row stores `sha256(token)` only. Cookie: **`__Host-kyn_s`** — `HttpOnly; Secure; SameSite=Lax; Path=/`; no `Domain` attribute (host-bound: public and admin hosts get separate sessions by construction).
- Lifetimes — visitors: idle 14 days (rolling `last_seen_at`, refreshed at most once/hour), absolute 90 days. **Staff: idle 60 min, absolute 8 h** (the designed «جلسة الإدارة: 8 ساعات»). Expired/revoked ⇒ 401 `session_expired`; UI shows the designed session banner.
- Token rotates on privilege change (login, role change, step-up). Logout deletes the row. `sys` can revoke any session (audited). Sessions table is the single source — no JWTs anywhere.
- Non-session cookies: `kyn_lang` (locale; not HttpOnly — client toggle reads it), `kyn_v` (visitor receipts token; HttpOnly). Nothing else.

## §4 OTP & staff TOTP

- OTP: 6 digits from `crypto.randomInt`; TTL 10 min; ≤ 5 attempts; resend ≥ 60 s; stored `sha256(code + OTP_PEPPER)`; constant-time compare; invalidated on success and on new issue. Channels: email (SMTP); WhatsApp adapter only if `WHATSAPP_ENABLED` — the flow must fully work with email alone. **Demo `2026` exists only behind `DEMO_OTP=true`; production boot throws if set.**
- Staff TOTP (RFC 6238): 30 s step, ±1 window, secret 20B encrypted at rest (§7), enrollment QR shown once at invite-accept, **mandatory before first console access**; 8 single-use backup codes (hashed). Step-up for the settings danger zone = fresh TOTP ≤ 5 min. Lost device ⇒ `sys` resets enrollment (audited); the last `sys` recovers only via server-side bootstrap command.

## §5 Authorization (deny by default)

- Staff: capability check from `domain/rbac.ts` (the matrix in `06-ADMIN §3`) via `requireCap()` on every admin route; UI disabled-states are cosmetic — the API is the wall. `auditor` has **zero** mutating endpoints.
- Users: ownership checks on every object — client sees only their engagement/file/messages; **acceptance signature valid only from the file's authority account** (`not_authority` otherwise); talent must be a pod member for every pod route; visitor token scopes People receipts.
- Existence privacy: objects you cannot own return 404, not 403 (pods, files, applications).
- Server actions and route handlers both pass the same guards (no privileged server action bypasses).
- Admin host isolation per `06-ADMIN §1`; public host cannot reach admin routes at all.

## §6 File uploads & private storage

- Accept-list only: `image/jpeg`, `image/png`, `image/webp`, `application/pdf` (+ `docx/xlsx` for engagement docs if the design's doc-kinds require). **Magic-byte sniffing** (`file-type`) — extension and client MIME are ignored. Size caps: images 8 MB, PDF 12 MB, docs 10 MB; per-request 1 file; rate 20/h.
- Images re-encoded through `sharp` (strips EXIF/GPS, kills embedded payloads); PDFs scanned for `/JavaScript` and `/OpenAction` (reject); SVG **never** accepted from users.
- Storage: `/data/files/<scope>/<uuid>` — random names, no user-controlled paths, volume outside webroot; DB row = the only pointer (sha256, mime, bytes, sensitive flag).
- Serving: only through authenticated, authorized streaming routes; `Content-Disposition: attachment` (except staff inline doc viewer with sniffed image/pdf types), `X-Content-Type-Options: nosniff`, `Cross-Origin-Resource-Policy: same-origin`, `Cache-Control: private, no-store`.
- **Sensitive class** (ID docs + selfies): encrypted at rest (§7), `sensitive=true`, viewable only by caps 1–3 staff (each view audited), **purged after decision** (`purged_at` set, `storage_path` null, sha256 retained) — consent #2's promise, enforced by the purge job + a weekly sweep that alarms on stragglers.

## §7 Data protection & encryption at rest

- App-layer **AES-256-GCM** via `ENCRYPTION_KEY` (32B base64): random 12B nonce per value, AAD = `table.column:row_id`, stored `nonce‖ciphertext‖tag`. Applied to: payout account details, TOTP secrets, national-ID numbers inside `stations` (the JSONB stores the ciphertext envelope), sensitive files on disk.
- Key rotation: `ENCRYPTION_KEY_PREVIOUS` supported; `pnpm keys:rotate` re-encrypts; rotation audited.
- PII minimization: collect only what the designed forms collect; People contact keeps only what the sender typed; logs carry ids, never payloads (`02-ARCHITECTURE §7`); backups inherit DB encryption posture and live on the protected volume (§12).
- Retention: refused applications' station payloads redacted (docs purged, ID numbers deleted, name+reason+audit retained) after the appeal window closes + 90 days; contact threads kept 24 months; sessions/log/attempt rows pruned at 12 months (jobs, audited).
- Data-subject requests (deletion/export): manual `sys` runbook — export = JSON of the subject's rows; deletion = anonymize name/contact, keep registry numbers + money records (legal integrity), audited.

## §8 Input/output safety

- **Zod `.strict()` at every boundary** (env, params, body, form data); lengths capped; ids validated by format (incl. check digit) before any query.
- SQL exclusively through Drizzle parameterization; no string-built SQL (raw `sql` fragments require constants only).
- XSS: React escaping; `dangerouslySetInnerHTML` forbidden (lint rule); user text rendered as text (messages/chat/notes — no markdown/HTML rendering anywhere in v1); CSP as backstop.
- CSRF: `SameSite=Lax` + **Origin/Sec-Fetch-Site check on every mutating request** (403 on mismatch/absence); the SPA sends `X-Requested-With: kayan` as an extra signal. No cross-site embedding (frame-ancestors 'none').
- SSRF: the server fetches no user-supplied URLs, period (design needs none).
- Open redirects: `next`/`return` params validated against a relative-path allowlist.
- IDs shown to users are never enumerable handles: all lookups also scope by owner.

## §9 Rate limiting & abuse

Limits per `04-API §14`, enforced in middleware against Postgres (`login_attempts` + a fixed-window counters table) — no Redis. Behind Traefik trust exactly one `X-Forwarded-For` hop. 429s carry `retry_at` and the designed AR copy. Upload and OTP endpoints also carry per-subject daily ceilings (uploads 50/day, OTP 10/day/target). Abuse observability: counters surface in the admin overview when thresholds trip.

## §10 Security headers & CSP (the checklist — verify with curl on BOTH hosts)

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-<r>'; style-src 'self' 'unsafe-inline';
  img-src 'self' data:; font-src 'self'; connect-src 'self'; media-src 'self'; object-src 'none';
  base-uri 'none'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests
Strict-Transport-Security: max-age=63072000; includeSubDomains (add preload after 30 clean days)
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
X-Frame-Options: DENY
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
Cache-Control: private, no-store        (on every authenticated/API response)
```

`style-src 'unsafe-inline'` is the single tolerated relaxation (styled-inline vocabulary); everything else stays exact. No third-party origin ever appears in CSP — if one shows up, Law 3 is being broken. Session 11 tightens `img-src`/`media-src` to the final asset map and re-verifies.

## §11 Audit & monitoring

Hash-chained `audit_log` per `03-DATABASE §6`; minimum audited set listed there. Chain verified: nightly (backup job) + on demand (admin button). Alarms (self-hosted, mail): chain verification failure, 5xx spike, failed backup, purge stragglers, worker heartbeat stale, repeated lockouts on staff accounts. Staff logins/logouts/TOTP failures always audited.

## §12 Backups & recovery security

Nightly `pg_dump -Fc` + files-volume snapshot to `/data/backups` (retention 14 daily / 8 weekly), permissions 600, owned by the app user; the backup includes the encrypted columns as ciphertext (key lives ONLY in env — losing `ENCRYPTION_KEY` = losing payout/TOTP data; owner keeps an offline copy of the key). Optional off-server copy via rclone to owner-controlled storage — encrypted archive (age/gpg) before leaving the box. Restore drill per `08-DEPLOY §6` quarterly, drill result audited. Backups never contain `.env`.

## §13 Supply chain

Pinned lockfile (`pnpm-lock.yaml` committed); no postinstall scripts (`pnpm` config `ignore-scripts=true`, allowlist `argon2`/`sharp` build scripts explicitly); `pnpm audit` in CI (fail on high+ unless documented); dependency additions per the working agreement (justification in `PROGRESS.md`); vendored browser libs (d3, topojson, three) committed at exact versions with their LICENSE files; Docker base `node:22-alpine` digest-pinned, rebuilt monthly.

## §14 Incident basics (runbook stub — finish in Session 11)

Compromise suspected ⇒ maintenance flag ON → revoke all staff sessions → rotate `SESSION_SECRET`+`OTP_PEPPER` (+ passwords force-reset if credentials implicated) → verify audit chain + escrow reconciliation → restore from last good backup if data integrity failed → owner notified with a written, dated account (the same reasoned-decision culture as the product). Contact order and evidence-preservation steps documented in `docs/runbooks/incident.md`.
