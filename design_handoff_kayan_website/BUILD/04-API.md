# 04 — API: the complete contract (`/api/v1`)

Every endpoint: JSON in/out, Zod-validated (`strict()` — unknown keys rejected), session cookie auth, envelope + error codes per §1. The UI is a view; **every rule here is enforced server-side regardless of what the client sent**.

## §1 Conventions

**Envelope**
```json
{ "ok": true,  "data": { … } }
{ "ok": false, "error": { "code": "escrow_insufficient", "message_ar": "…", "message_en": "…", "field": "amount", "req_id": "…" } }
```
Messages come from the shared keyed AR/EN error map (`09-CONTENT-I18N.md §3`) — the same texts the designs show.

**Error codes** (HTTP → codes): `400 invalid_input` (with `field`) · `401 auth_required`, `session_expired` · `403 forbidden`, `capability_denied`, `not_authority`, `totp_required`, `demo_disabled` · `404 not_found` (also used instead of 403 where existence itself is private) · `409 conflict`, `already_submitted`, `duplicate_application`, `stage_incomplete`, `gate_checks_incomplete`, `co_not_accepted` · `410 expired` (OTP/reset/appeal window) · `413 too_large` · `415 bad_file_type` · `422 rule_violation` (business rules: consents missing, refs count, escrow_insufficient, lead_tier_low, position_closed) · `423 locked` (login lockout, with `retry_at`) · `429 rate_limited` (with `retry_at`) · `500 internal` (req_id only).

**Auth**: opaque session cookie (`07-SECURITY.md §3`). Staff endpoints additionally require capability (`06-ADMIN.md §3`); step-up endpoints require a fresh TOTP (`stepup` token ≤ 5 min old). Mutations require `Origin` matching the host (CSRF, `07-SECURITY.md §8`).

**Idempotency**: money mutations (`deposit`, `release`, `refund`, `adjust`, `accept`) require an `Idempotency-Key` header (UUID). Replays return the original result, never a second entry.

**Pagination**: `?cursor=<opaque>&limit=50` → `{items, next_cursor}`. **Rate limits**: §14. All timestamps ISO-8601 UTC.

## §2 Auth (`/auth`)

| Method & path | Body → Data | Notes |
|---|---|---|
| POST `/auth/signup` | `{role:'client'∣'talent', name, email, password, org?}` → `{account, session}` | Zxcvbn-style strength ≥ the design's meter; sends verify mail; links visitor token + portal draft (§5) |
| POST `/auth/signin` | `{role, email, password}` → `{account, session}` | 5 fails / 15 min lockout per identifier+IP (423). Talent sign-in also accepts a submitted Apply email → migrates (design behavior) |
| POST `/auth/signout` | — → `{}` | revokes session |
| GET `/auth/session` | → `{kind, account?/staff?, caps?}` | introspection; Spaces + admin shell boot from this |
| POST `/auth/otp/request` | `{purpose, target}` → `{sent:true, resend_at}` | purposes: `verify-email`, `apply-phone`, `portal-phone`, `signin-verify`. 6 digits, TTL 10 min, resend 60 s |
| POST `/auth/otp/verify` | `{purpose, target, code}` → `{verified:true, token?}` | ≤ 5 attempts then 410 |
| POST `/auth/password/reset-request` | `{email}` → `{sent:true}` | always `ok` (no user enumeration) |
| POST `/auth/password/reset` | `{token, password}` → `{}` | token single-use, 30 min; revokes all sessions |
| POST `/auth/staff/signin` | `{email, password}` → `{totp_required:true, pending}` | never a session before TOTP |
| POST `/auth/staff/totp` | `{pending, code}` → `{staff, session}` | 8h absolute / 60 min idle |
| POST `/auth/staff/invite/accept` | `{token, password}` → `{enroll:{otpauth_url, backup_codes}}` | then `/auth/staff/totp/confirm {code}` activates |

## §3 Talent Apply (`/apply`) — the 14 stations

| Method & path | Purpose |
|---|---|
| GET `/apply/registry` | reference bundle (families→specs, banks, wallets, languages+CEFR, governorates, doc kinds, consents, refRules) — cacheable, `ETag` |
| GET `/apply/draft` | current draft `{stations, station_done, version}` (auth: talent) |
| PUT `/apply/draft/station/:n` | autosave one station `{payload, version}` → `{version+1}`; 409 on version conflict; server validates station shape AND gating (station n requires 0…n−1 complete) |
| POST `/apply/uploads` | multipart `{kind}`; per `07-SECURITY.md §6`; ID/selfie kinds flagged `sensitive` → `{file_id}` |
| POST `/apply/submit` | full server re-validation: 14/14 complete, quiz passed, specs ≤ 5 with primary, langs valid CEFR, docs required present, refs 2–3 per refRules, consents: all 9 required true individually, charter scroll pledge → `{app_no}` + receipt mail. 409 if already submitted |
| GET `/apply/status` | `{status, app_no, decided?, reason?, appeal?}` — drives the design's submitted/decision states |
| POST `/apply/appeal` | `{grounds}` within 21 days of refusal → `{appeal_id, window_ends_at}`; 410 after |

## §4 Client file — Portal (`/portal`)

| Method & path | Purpose |
|---|---|
| GET `/portal/state` | doors state: session? role? file stage/status? pod membership? — Portal renders from this |
| GET `/portal/file` | current draft/submitted file (auth or visitor token) |
| PUT `/portal/file/step/:n` | save step n (1 org · 2 authority+proof+phone OTP · 3 compliance[4] · 4 scope · 5 review); **server stage-gating**: step n requires 1…n−1 complete → 409 `stage_incomplete` |
| POST `/portal/uploads` | scope files (brief docs) |
| POST `/portal/file/submit` | re-validates all 5 → `{file_no}` (KY-F) + receipt mail; appears in admin clients queue |

## §5 Bridges — the client doctrine (one key, one document)

`Access` owns the ACCOUNT; `Portal` owns the REQUEST. They prefill each other, never duplicate:

1. **Anonymous draft → sign-up prefill.** Anonymous Portal drafts save under the `kyn_v` visitor cookie (`POST/PUT /portal/file*` work unauthenticated with that cookie). `GET /bridge/signup-prefill` → `{name?, org?, email?}` from the draft. On `/auth/signup`, the server links the draft: `client_files.account_id` set, visitor rows merged.
2. **Session → file prefill.** Signed-in client with no submitted file: `GET /portal/file` returns a draft pre-populated from the account (name/org/email) with `prefilled:true` — UI shows the back-to-Space strip as designed.
3. **Tie by email.** On signup and on submit, server matches `client_files.email` ↔ `accounts.email` (citext) and links; conflicts (file already linked to another account) → 409 `conflict`.
4. Access ↔ Portal links are plain navigation; state crosses only through these endpoints — never through client storage.

## §6 Client Space & money (`/space/client`, `/engagements`)

| Method & path | Purpose |
|---|---|
| GET `/space/client/overview` | `{engagement{job_no,title,pod,lead,price_cents,deadline_at,stage,dod[]}, ledger[], held_cents, deliverables[], change_orders[], unread, warranty?}` — everything the dashboard renders |
| GET `/engagements/:job/ledger` | entries (mono memo lines exactly as designed) |
| POST `/engagements/:job/deliverables/:id/accept` | `{signature}` + Idempotency-Key. Server checks: session account **is the file's authority** (403 `not_authority`); deliverable `review`; then in one tx: mark accepted, escrow `release` (item amount; **final item releases the whole remainder**), audit, payout batch rows, notify. Full acceptance ⇒ `warranty_ends_at = now()+30d`, stage 5 |
| POST `/engagements/:job/change-orders/:id/decision` | `{decision:'accepted'∣'declined', signature?}`; accepted CO enables an `adjust` entry (admin executes) |
| GET/POST `/engagements/:job/messages` | thread; POST `{body}`; marks read via `POST /messages/read` |
| GET `/engagements/:job/files` · POST `/engagements/:job/uploads` | docs area |
| PUT `/space/client/settings` | contact prefs, password change (requires current password) |

## §7 Talent Space (`/space/talent`)

| Method & path | Purpose |
|---|---|
| GET `/space/talent/overview` | `{profile{registry_id,tier,axes,specs,langs}, pods[], calls[], earnings{rows[],total_cents}, record[], k4y_hours, week[]}` |
| PUT `/space/talent/availability` | `{availability, week[7]}` |
| POST `/calls/:id/interest` | register interest (dedup by PK); 422 `tier_low` if below `tier_min` |
| GET `/space/talent/earnings` | payout rows + statuses (from payouts) |
| PUT `/space/talent/payout-accounts` | add/update rails (bank primary / wallet capped — service checks channel rules); details encrypted at rest |

## §8 Pod Room (`/pods`)

Access rule on every route: talent session AND pod membership (or valid join code for `join`).

| Method & path | Purpose |
|---|---|
| POST `/pods/join` | `{code}` — `POD-…` or its `KY-J-…`; joins only if the account is a listed member (invite model); else 404 |
| GET `/pods/:code` | `{pod{code,job_no,deadline_at,current_gate,split}, members[], tasks[], journal[], files[], checks_state}` |
| POST `/pods/:code/tasks` · PUT `/pods/:code/tasks/:id` | create / edit / move `{lane, sort}`; **move into lane 3 auto-writes a journal entry** (kind `auto`) |
| GET/POST `/pods/:code/journal` | manual entries |
| GET/POST `/pods/:code/chat` | team channel; SSE delivery (§11) |
| GET/POST `/pods/:code/files` | shared files |
| POST `/pods/:code/gate-request` | `{checks[5]}` — server **re-validates all five true** against its own state (409 `gate_checks_incomplete` on forged POST), one pending request max, → admin queue |

## §9 People (`/people`) — receipts & the visitor token

Anonymous-friendly: the first POST sets `kyn_v` (opaque cookie, 1 year, HttpOnly). Receipts are scoped to it; signup links it to the account.

| Method & path | Purpose |
|---|---|
| GET `/people/positions` | open positions (published location + salary band; auto-close honored) |
| GET `/people/sla?door=…` | `{working_days, due_date}` — the SLA the UI shows **before** send |
| POST `/people/applications` | `{position_code∣null, name, contact, note}` → `{app_no, sla_due_at}`; **dedupe** per position per visitor (409 `duplicate_application` — UI shows رشحت ✓); `position_code:null` = GEN-POOL; 422 `position_closed` |
| GET `/people/mine` | `{applications:[{app_no, position, at}], messages:[{reg_no, due}]}` — «أرقام ترشحك» strip |
| POST `/people/contact` | `{door, subject, body, contact}` → `{reg_no, sla_due_at}` + receipt mail if contact is an email; door routes the admin assignment |

## §10 Public content

GET `/content/products` (published only, card JSON verbatim) · GET `/content/announcement` (current published) · GET `/content/positions` = §9. All cacheable (`s-maxage=300, stale-while-revalidate`), locale-aware fields returned both-language.

## §11 Notifications & SSE

- GET `/notifications` · POST `/notifications/read` `{ids[]}`.
- SSE endpoints: `/events` (per session: `notification`, `engagement.update`, `ledger.entry`, `message.new`), `/pods/:code/events` (`chat.new`, `task.moved`, `journal.new`, `gate.decided`), `/admin/events` (queue counter deltas). Event frame: `id` = audit/journal row id (enables `Last-Event-ID` resume), `event` = name, `data` = JSON payload. Heartbeat comment every 25 s. Clients fall back to 15 s polling of the matching GET after 3 failed reconnects.

## §12 Admin (`/admin/*` — staff session + capability; all mutations audited)

| Endpoint | Cap | Notes |
|---|---|---|
| GET `/admin/overview` | 0 | KPIs + queues + audit feed (the design's overview numbers) |
| GET `/admin/talent` · GET `/admin/talent/:id` | 1 | queue w/ filters (ready/missing/verifying); detail = stations + files + refs + events |
| POST `/admin/talent/:id/request-fix` | 1 | `{items[]}` → status `needs_fix` + mail |
| PUT `/admin/talent/:id/refs/:refId` | 1 | mark وردت / تعذر الوصول on a جهة تزكية |
| PUT `/admin/talent/:id/tier` | 2 | reasoned tier change T0–T4 `{tier, reason}` — audited; feeds the trust ladder |
| POST `/admin/talent/:id/approve` | 2 | issues `KY-T-…` (counter+check digit), creates profile (tier 1 default), mail, **schedules ID-image purge** |
| POST `/admin/talent/:id/refuse` | 3 | `{reason}` (≥ 20 chars or 422) → refusal mail + 21-day appeal window; purge scheduled |
| GET `/admin/appeals` · POST `/admin/appeals/:id/decide` | 3 | `{decision, reason}` |
| GET `/admin/clients` · GET `/admin/clients/:id` | 4 | files queue + detail |
| POST `/admin/clients/:id/convert` | 5 | `{title, line, price_cents, deadline_at, dod[], pod:{code?, lead_account_id, members[]}}` → engagement KY-J + pod POD (lead must be T3/T4 → 422 `lead_tier_low`) + client notified; file `converted` |
| POST `/admin/clients/:id/refer-k4y` / `decline` | 5 / 3 | decline requires reason (human, reasoned) |
| POST `/admin/engagements/:job/deposit` | 6 | `{amount_cents, memo_ar}` + Idempotency-Key → `deposit` entry; stage advances per design |
| POST `/admin/engagements/:job/release` | 6 | `{deliverable_id}` + Idempotency-Key. **Three preconditions, server-checked**: (1) deliverable accepted with signed محضر; (2) held ≥ amount; (3) engagement active & no blocking CO. Any failure → 422 with the specific code |
| POST `/admin/engagements/:job/refund` · `/adjust` | 6 | refund `{amount_cents, reason}`; adjust requires accepted CO id (409 `co_not_accepted`) |
| POST `/admin/engagements/:job/deliverables` · PUT `…/deliverables/:id` | 5 / 7 | created at convert by clientdesk (code/name/amount — amounts must sum to price); delivery moves `wip→review`; **only the client authority accepts** (§6) |
| POST `/admin/engagements/:job/messages` | 4 | staff reply in the client thread (SSE to the Space) |
| GET `/admin/pods` · POST `/admin/gates/:id/decide` | 7 | `{decision:'approved'∣'declined', reason?}` — approve advances `current_gate`, notifies pod live |
| PUT `/admin/pods/:code/members` | 7 | membership + split edits (lead must remain T3/T4 → 422 `lead_tier_low`; splits sum to 1,000,000 ppm) |
| GET/POST `/admin/calls` · PUT `/admin/calls/:id` | 7 | calls-for-pods CRUD + close; GET includes interest lists (tier-checked) |
| GET `/admin/people/applications` · POST `…/:id/reply` | 8 | reply `{body}` → mail + status `replied` + SLA stamp |
| GET `/admin/people/inbox` · POST `…/:id/assign` · `…/:id/reply` | 8 | reply stamps REG number + promised date; closes SLA timer |
| GET/POST `/admin/people/positions` · PUT `…/:code` | 8 | vacancy CRUD: location + salary band mandatory; `closes_at ≥ opens_at + 14d` enforced (422) |
| POST `/admin/k4y/hours` | 8 | record verified K4Y volunteer hours `{account_id, hours, note}` |
| GET/PUT `/admin/content/products/:code` · POST `…/publish` | 9 | pipeline draft→review→published (publish audited) |
| GET/PUT `/admin/content/announcement` · POST `…/publish` | 9 | one live announcement max |
| GET `/admin/users` · POST `/admin/users/invite` | 10 | invite `{name, email, role}` → ADM- id + invite mail (TOTP enrollment on accept) |
| PUT `/admin/users/:id/role` · POST `…/suspend` | 10 | audited; cannot demote the last active `sys` (422) |
| GET `/admin/audit` | 0 (view) | filters: الكل/الضمان/السجل/البوابات/الدخول والحسابات (as designed) |
| POST `/admin/audit/verify` | 0 | runs chain verify → `{ok, checked, broken_at?}` |
| GET/PUT `/admin/settings` | 11 | settings cards; **danger zone** (payout channels, maintenance, flags) requires step-up: `POST /admin/step-up {totp_code}` ≤ 5 min prior |
| GET `/admin/payouts/batches` · POST `…/:id/status` · GET `…/export.csv` | 6 | status trail pending→instructed→confirmed; CSV reconciles with ledger |
| GET `/admin/backups` · POST `/admin/backups/run` | 11 | history + manual trigger |
| GET `/admin/logins` | 10 | staff login history (from login_attempts + sessions) |

## §13 localStorage → API mapping (the designs' contracts, ported)

| Design key | Becomes |
|---|---|
| `kyn-lang` | `kyn_lang` cookie (client-readable) — stays client-side by design (`09 §2`) |
| `kyn-auth-v1` | session cookie + `GET /auth/session` |
| `kyn-accounts-v1` | `accounts` table + `/auth/*` (passwords hashed server-side) |
| `kayan-apply-v1` | `talent_applications.stations` + `/apply/*` (same station payload shapes; demo OTP `2026` only behind `DEMO_OTP`) |
| `kyn-portal-v2` | `client_files` + `/portal/*`; `c.prog` ⇒ engagement stage; pod gate rule (`submitted && prog≥3`) ⇒ real membership check |
| `kyn-cws-<id>` | engagement + deliverables + escrow + change_orders + messages + `/space/client/*` |
| `kyn-tws-<id>` | talent_profiles.availability/week + call_interests + `/space/talent/*` |
| `kyn-pod-041` | pods/pod_tasks/pod_journal/pod_chat/gate_requests + `/pods/*` |
| `kyn-people-apps-v1` | job_applications + visitor token + `/people/*` |
| `kyn-contact-v1` | contact_messages + `/people/contact` |
| `k4y-lang` | stays client-side (deliberate sub-brand exception) |

## §14 Rate limits (per IP unless noted; DB-backed fixed window; 429 + `retry_at`)

signin 5/15 min (also per identifier) · otp request 3/10 min per target · otp verify 5 per token · signup 5/h · reset-request 3/h per email · uploads 20/h per session · people POSTs 5/day per visitor token · messages/chat 60/h per session · gate requests 3/h per pod · admin step-up 5/15 min · SSE connections 4 per session. Traefik provides the real client IP (`X-Forwarded-For`, one trusted hop).
