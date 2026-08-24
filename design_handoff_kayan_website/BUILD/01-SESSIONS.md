# 01 — SESSIONS: the binding build plan

Thirteen sessions, strict order. Each lists **Scope → Tasks → Gates (acceptance)**. A session closes only when every gate passes and `PROGRESS.md` is updated. Do not start work from a later session early; do not skip gates. Estimated shape: S0–S2 foundations, S3–S4 public site, S5–S8 working model, S9 admin, S10 comms, S11 hardening, S12 launch.

---

## Session 0 — Repo, toolchain, walking skeleton
**Scope:** a deployable empty product.
**Tasks**
1. Init `kayan-web` per the layout in `00-START-HERE.md`. Copy `CLAUDE.md.template` → `CLAUDE.md`; create `PROGRESS.md`; copy this BUILD set → `docs/`; copy all design files + shared JS + `ARABIC-COPY-RULES.md` → `design-reference/`.
2. Next.js 15 (App Router, TS strict), Tailwind v4 with the Kayan token variables (`05-FRONTEND.md §2`), ESLint/Prettier, Vitest, Playwright.
3. Zod-validated env loader (`lib/env.ts`) — fail fast on boot; `.env.example` complete per `08-DEPLOY-EASYPANEL.md §4`.
4. `Dockerfile` (multi-stage, standalone output, non-root user), `compose.yaml` for local dev (app + postgres16), `/api/health` (checks DB, returns version + migration state).
5. Drizzle wired; empty initial migration runs on boot (`migrate-then-start` entrypoint).
6. CI script (`pnpm verify` = typecheck + lint + test + build). Placeholder home page: dark-green `#03201D` screen, Kayan mark, tagline «خلف كل نجاح، كيان» — nothing else.
7. Git + GitHub: init repo, `.env` git-ignored, first commit; connect the remote (`gh repo create kayan-web --private --source=. --push` if `gh` is authenticated — otherwise ask the owner ONCE for the remote URL, then never ask again). From here on, every session close pushes its commits and the `session-NN` tag.
**Gates**
- `docker build` succeeds; container runs with only env vars; `/api/health` returns `{ok:true,db:true}`.
- `pnpm verify` green. Deployed once to EasyPanel staging per `08-DEPLOY-EASYPANEL.md` (proves the pipeline before any feature exists).

## Session 1 — Database, seeds, identity of records
**Scope:** the entire schema + reference data + the services every later session leans on.
**Tasks**
1. Implement the full DDL of `03-DATABASE.md` as Drizzle schema + one migration. Append-only protections (triggers) on `escrow_entries`, `audit_log`.
2. `domain/ids.ts`: registry counters + check digit (KY-T/KY-C), plain sequences (KY-J/POD/REG/APP/ADM). Unit tests: the vectors in `10-QA-ACCEPTANCE.md §3` pass.
3. `domain/audit.ts`: hash-chain writer (`sha256(prev_hash ‖ canonical_json)`), verify function.
4. Seed scripts (idempotent): registry families/specs/banks/wallets/languages/governorates/consents/doc-kinds from `design-reference/kayan-registry*.js`; Ready Products from `rp-core/fixed/range.js`; positions (POS-01..03) + settings defaults + feature flags; **staging-only** demo accounts (guarded by `SEED_DEMO=true`).
5. `domain/escrow.ts`: pure ledger math (deposit/release/refund/adjust, remainder-on-final rule, zero-at-close invariant) — property-tested.
**Gates**
- `drizzle-kit` migration is deterministic (re-run = no diff); seeds idempotent (run twice = same counts).
- Escrow property tests (incl. the worked example: +$3,000 deposit, −$600 release ⇒ held $2,400) and ID vectors green.
- Audit chain verify detects a tampered row in a test.

## Session 2 — Auth core + Access page
**Scope:** accounts, sessions, OTP, staff TOTP; the `/access` experience.
**Tasks**
1. Argon2id hashing, opaque DB sessions (cookie per `07-SECURITY.md §3`), login throttling + lockout (5 fails → 15 min), CSRF/origin protection, security headers + CSP (nonce), rate-limit middleware (trust Traefik `X-Forwarded-For`).
2. OTP service (email channel via SMTP adapter; 6 digits, 10 min, hashed at rest, 5 attempts, resend throttle 60s). WhatsApp adapter = interface stub, disabled.
3. Endpoints: sign-up (client / talent), sign-in, sign-out, session introspection, password reset (request + token + set), email verification. Staff sign-in with mandatory TOTP (used in S9 but built now).
4. Port **Kayan Access.dc.html** → `/access` pixel-exact, fully bilingual (`kyn-lang` behavior per `09-CONTENT-I18N.md`), keyed AR/EN errors, Enter-to-submit, gold departure wipe, session banner. Password-reset + verify screens derived from Access vocabulary.
5. Bridge rules (client doctrine): sign-up prefill from draft portal file; session hand-off per `04-API.md §5`.
**Gates**
- e2e: both roles sign up, sign in, sign out; wrong password ×5 locks 15 min; reset flow works; cookies `HttpOnly Secure SameSite=Lax`; headers pass the checklist in `07-SECURITY.md §10`.
- Access page passes fidelity review vs the design (`10-QA-ACCEPTANCE.md §2`), both languages.

## Session 3 — Design system + site shell + first public pages
**Scope:** the reusable vocabulary, then Home, Charter, Journey, Legal.
**Tasks**
1. Self-host fonts (Alexandria, IBM Plex Sans Arabic, Instrument Sans, IBM Plex Mono) via `next/font/local` — subsets per `09-CONTENT-I18N.md §6`; delete Google `<link>`s.
2. Build the component vocabulary of `05-FRONTEND.md §3` (Header/Compass, Footer with live Aden clock + seal, Card, GoldCTA + sheen, Reveal, StageRail, TierBadge, MonoKicker, …) with reduced-motion kill-switch.
3. i18n plumbing: `ar` root + `/en` twins, `kyn-lang` cookie, `<html dir lang>`; `k4y-lang` exception documented in code.
4. Port **Home** (incl. yemen-map canvas component, mirrored Wikimedia images with attribution in Legal/colophon), **Charter** (AR/EN), **Journey**, **Legal**. Announcement bar reads from DB (admin-published, S9).
**Gates**
- Zero external requests on these pages (fonts/images/scripts all first-party — verify in devtools/network assert in Playwright).
- Fidelity review per page green (both languages where designed); reveal/sheen/hover match motion spec; reduced-motion static; no console errors.
- Home transfer ≤ budget (`10-QA-ACCEPTANCE.md §6`).

## Session 4 — Remaining public site
**Scope:** everything a visitor can reach without an account.
**Tasks**
1. **Lines:** Managed Delivery (AR+EN), Hub & Café (AR+EN, + `Kayan Hub.html` location page), Forge (AR+EN). Preserve each line's accent identity + per-line bird assets.
2. **Ready Products** page driven from the DB catalogue (seeded S1; admin-editable S9) — cards keep the one card shape (name → what you get → who for → why worth it → time → price → protection line) with WhatsApp deep-link CTA (config-driven number).
3. **For Clients / For Talent** pitches; **Civic Wing (K4Y)** with its inline AR/EN spans.
4. **People**: positions from DB; in-page application form → `POST /people/applications` (APP- receipt, dedupe per POS, mailto fallback removed in favor of real submission); registry contact form → REG- receipt with SLA shown BEFORE send; «أرقام ترشحك» reads the signed-in visitor's own receipts (cookie-scoped anonymous token) per `04-API.md §9`.
5. **Planet**: live footprint meter reading real `performance` transfer data (SWDM v4 constants: 0.81 kWh/GB × 494 g/kWh, 1 g/view budget), commitments, SDG mappings.
6. **Atlas** (vendored d3 + world-atlas TopoJSON; real day/night terminator on Aden time) and **Dimension** (vendored three.js; reduced-motion + WebGL fallbacks) as client-only islands, lazy-loaded, never blocking the classic site.
7. 404 + 500 pages in the site vocabulary. Sitemap, robots, OG images, favicons per `05-FRONTEND.md §8`.
**Gates**
- All public routes render with zero console errors and zero external requests; link graph of `../README.md` fully wired (crawl test).
- Products render from DB; People forms create rows + receipts and enforce SLA copy; Planet meter shows real numbers.
- Atlas terminator matches the reference within visual tolerance; Dimension falls back cleanly with WebGL disabled.
- Full-site Playwright crawl: no broken href/src.

## Session 5 — Talent Apply (the 14 stations)
**Scope:** the registration instrument, server-backed end to end.
**Tasks**
1. Port **Kayan Apply.dc.html** exactly: 14 stations, station gating, ack cards + comprehension quiz, charter scroll-to-end unlocking the honesty pledge, specs picker (max 5, [0] primary) from the DB registry, languages (CEFR + proof), documents, links, pod pre-registration, K4Y volunteering, references (2–3 per refRules), payout rails (banks primary, wallets capped), 13 consents (9 required, individually ticked).
2. Server drafts: autosave per station to `talent_applications` (JSONB stations, versioned); resume on return; one submission → `APP` state machine (`draft→submitted`), server-issued `appId`.
3. Uploads per `07-SECURITY.md §6` (magic-byte sniff, size caps, image re-encode, private storage). ID + selfie flow flagged `sensitive` with purge-after-verification wiring (purge job runs in S9 when decisions exist).
4. Real OTP replaces demo `2026` (env-gated demo mode allowed on staging only).
**Gates**
- e2e: full 14-station run submits; draft survives logout/login; every validation state matches the design; refs count/relations enforced; consents 9/13 required enforced server-side.
- Uploaded files unreachable without auth; wrong-type/oversize rejected by magic bytes; EXIF stripped.
- Fidelity review green.

## Session 6 — Client intake (Portal) + bridges
**Scope:** وثيقة فتح النطاق and the Portal doors.
**Tasks**
1. Port **Kayan Portal.dc.html**: three doors, session-aware routing (straight to Spaces when logged in), unified-access strip.
2. Client file (capply) 5 steps server-backed: org, authority + proof + phone OTP, compliance [4], scope (outcome/line/deadline/budget/desc/files), review → submit (server `KY-F` id). Draft + prefill bridges both directions per the client doctrine (`04-API.md §5`).
3. Talent door + pod door read real session/state (pod room gate lands S8).
**Gates**
- e2e: draft file → sign-up prefills from it; signed-in client with no file → capply prefilled from session with back-strip; submit issues `KY-F` id; file visible in admin queue table (data only; admin UI lands S9).
- Stage gating server-enforced (cannot POST step N+1 with step N incomplete). Fidelity green.

## Session 7 — Client Space (escrow, acceptance, warranty)
**Scope:** the client dashboard on server-authoritative money.
**Tasks**
1. Port **Kayan Space - Client.dc.html**: stage rail (0–5), escrow ledger, deliverables board, typed-signature acceptance, change orders, messages, docs, settings.
2. Engagement model live: convert (admin S9 completes the loop, seed one staging engagement now), deposits recorded, per-item release ($600-style per deliverable amount, remainder on final), warranty clock (30 days) on full acceptance, ledger zeroes at close.
3. Acceptance = typed signature name + confirm → server verifies the signer is the file's authority, releases escrow idempotently, writes audit + ledger, starts warranty. Change orders: draft → sent → accepted/declined (accepted adjusts scope/price via ledger `adjust`).
4. Messages thread (client ↔ Kayan) with SSE updates; docs area lists engagement files.
**Gates**
- Property/e2e: acceptance releases exactly the item amount; final item releases remainder; ledger always ends at zero; double-submit of the same acceptance releases once (idempotency test).
- Only the authority account can sign; other sessions get 403 + the design's refusal state. Audit entries hash-chain verify. Fidelity green.

## Session 8 — Talent Space + Pod Room
**Scope:** the talent dashboard and the pod workspace.
**Tasks**
1. Port **Kayan Space - Talent.dc.html**: trust ladder (T0–T4 from DB), availability + weekly readiness, my pods, calls-for-pods (+interest), earnings (from payout records), delivery record, 5 verification axes, K4Y hours.
2. Port **Kayan Pod Room.dc.html**: gate rail G0–G9, 4-lane task board (تجهيز/تنفيذ/مراجعة داخلية/مقبول; lane-3 moves auto-journal), delivery journal, team channel (SSE), files, fixed split display, quality-guard checklist — 5/5 checks arm the gate request (server re-checks).
3. Access rule: talent session + pod membership (invite by code `POD-…`/`KY-J-…` joins if listed member). Gate request → admin approval queue (S9 closes the loop).
**Gates**
- e2e: non-member talent blocked; member joins by code; task moves persist + journal; chat delivers via SSE to a second session; 4/5 checks ⇒ request disabled server-side even with forged POST.
- Trust-ladder rule enforced: pod lead must be T3/T4 (seed data consistent — سلمى = T3). Fidelity green.

## Session 9 — Admin console (the whole of `06-ADMIN.md`)
**Scope:** admin.kayanwork.com, complete.
**Tasks**
1. Staff auth gate (TOTP mandatory, lockout, 8h absolute session, idle timeout, optional IP allowlist env), host-based routing, `ADM-` staff ids.
2. Port **Kayan Admin.dc.html** exactly, then extend with the detail views specced in `06-ADMIN.md §6` (talent file review incl. purge-on-decision, client file detail, engagement detail, appeal review, payout batches, backup status, login history). Remove the demo role-switcher — role comes from the session; keep it only behind `STAFF_PREVIEW=true` on staging.
3. Enforce the 12-capability RBAC matrix server-side (policy module + route guards + UI states for denied capabilities exactly as designed).
4. Workflows wired end-to-end: approve → issue KY-T + notify; refuse → written reason mandatory + 21-day appeal window; convert → engagement + deliverables (amounts sum to price) + escrow awaiting deposit; record deposit; release order (3 preconditions checked server-side); gate approvals; deliverable wip→review moves + staff replies in the client thread; calls-for-pods CRUD + pod membership/split edits; positions CRUD (≥ 2-week rule) + verified K4Y hours; reasoned talent tier changes; ref-check marking; People replies stamped with REG id + SLA timers; content publish (products + announcement, draft→review→publish); users invite/role change (audited); audit view with hash-verify action; settings incl. danger zone behind TOTP step-up.
5. pg-boss jobs live: SLA due/overdue flags, warranty expiry, appeal window close, ID-image purge after decision, nightly backup trigger + audit entry, dormancy tier-drop per rules, weekly digest.
**Gates**
- RBAC test auto-generated from the matrix: every capability × every role, allowed and denied paths (both API and UI state).
- e2e loop: talent approved gets id + email; refusal requires reason and opens appeal; client file converted → deposit recorded → release passes only with signed محضر; gate G4→G5 approval reflects in Pod Room live.
- Every workflow writes audit entries; chain verifies. Purge job deletes ID images post-decision (hash retained). Fidelity green incl. the RBAC denial states.

## Session 10 — Notifications, email, payouts record
**Scope:** everything that leaves the system.
**Tasks**
1. Bilingual email templates (AR leads, EN secondary; registry number in every subject) for: OTP, verification decision, appeal receipt, deposit confirmation, release/محضر receipt, SLA replies, application receipts, staff invites. Plain HTML, self-hosted assets, text alternative.
2. In-app notifications (bell in Spaces + admin queues) from the same events.
3. Payout records: batches per engagement release → talent payout rows (bank primary/wallet capped per settings), CSV export for the finance officer, status trail (pending→instructed→confirmed), payout-account data encrypted at rest (`07-SECURITY.md §7`).
**Gates**
- Mail renders correctly RTL in a client-matrix smoke (at minimum: Gmail web, Outlook web); every template carries the registry number; OTP mail delivers < 30s on staging SMTP.
- Release event produces payout rows matching the split; CSV reconciles with the ledger. Notifications mark-read persists.

## Session 11 — Hardening, performance, accessibility
**Scope:** make it production-grade; kill all demo surface.
**Tasks**
1. Run the full `07-SECURITY.md` checklist; fix every finding. Dependency audit; CSP tightened to final asset map; upload pipeline fuzzed.
2. Performance pass to the budgets (`10-QA-ACCEPTANCE.md §6`): image sizes, font subsets, route-level code-splitting (Atlas/Dimension lazy), DB indexes verified with `EXPLAIN` on the hot queries.
3. Accessibility pass: keyboard paths on every form/board, focus-visible everywhere, contrast per the token contract, `aria` on the boards/rails, screen-reader labels AR.
4. Remove/env-gate all demo data paths (`SEED_DEMO`, OTP `2026`, seeded accounts, staging engagement); verify production boot refuses demo flags.
**Gates**
- Security checklist 100%; `pnpm audit` clean or documented; ZAP baseline scan no medium+.
- Budgets met on throttled 3G profile; Lighthouse a11y ≥ 95 on key pages; axe: no critical.
- Grep-proof: no `2026` demo OTP, no `demo.kayan` in production code paths.

## Session 12 — Launch on EasyPanel
**Scope:** production go-live per `08-DEPLOY-EASYPANEL.md`.
**Tasks**
1. Production project: services, volumes, env, domains + TLS, healthchecks, resource limits; worker service; migrations-on-deploy verified.
2. Backups live (nightly pg_dump + files volume; retention) and a **restore drill actually performed** into a scratch DB; document the runbook.
3. Seed production reference data (registry, products, positions, settings; NO demo). Create the first sys-admin via the bootstrap command (one-time env token), enroll TOTP, then disable bootstrap.
4. Smoke e2e against production (read-only + a canary application that is then withdrawn); DNS cutover; uptime monitor (self-hosted uptime-kuma optional).
**Gates**
- `10-QA-ACCEPTANCE.md §8` launch checklist fully ticked and pasted into `PROGRESS.md` with evidence links.
- Restore drill proven (row counts match); health green 24h; owner sign-off recorded.

---

## Standing rule for every session
If you finish a session with spare capacity, do NOT pull work forward; spend it on tests, fidelity polish, or `PROGRESS.md` clarity. Sequence beats speed.
