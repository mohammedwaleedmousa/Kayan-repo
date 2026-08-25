# 10 — QA & ACCEPTANCE: nothing ships without this

## §1 Strategy & tooling

- **Vitest** — unit + property tests (`fast-check`) for everything in `src/domain/`; services with a test DB (Testcontainers or compose Postgres). Coverage gate on `domain/`: 100% branch on `escrow.ts`, `ids.ts`, `audit.ts`, `rbac.ts`, `sla.ts`.
- **Playwright** — e2e; projects: `desktop-ar` (1440×900), `mobile-ar` (390×844, mid-tier CPU ×4 throttle), `desktop-en`. RTL asserted per project.
- `pnpm verify` = `typecheck && lint && test && build` — green before any commit that closes a session.
- Factories/seeds: `tests/factories.ts` builds accounts, applications, engagements; staging seed = production reference data + `SEED_DEMO` fixtures.
- Static gates (CI greps): no `scrollIntoView`; no emoji in source; no `console.log` in `src/`; no `http://` asset URLs; `\u2066` isolates present in files that render codes inside Arabic prose.

## §2 Fidelity review protocol (per page, per session)

A page passes fidelity only when reviewed **side-by-side with its design file** (open the `.dc.html` from `design-reference/` in a browser next to the built page):

1. Widths 1440 / 768 / 390; both languages where designed; light conditions only (no dark mode exists).
2. **Copy**: rendered text diffed against `copy-baseline/<page>.txt` (`09-CONTENT-I18N.md §4`) — empty diff required. Manual spot-check of BiDi around codes.
3. **Tokens**: colors exact hex (spot-check with eyedropper: page bg `#F4EEDD`, dark `#052E2B`, gold text-on-cream `#8F7218`); radii (pills 999, inputs 12, cards 20–24); type scale and weights (hero Alexandria 200; kickers mono uppercase, tracked, LTR).
4. **Layout**: section paddings `clamp(40px,6vw,80px)` / `clamp(16px,4vw,44px)`, max-width 1160, grid gaps 12–14; spacing tolerance ±2px.
5. **Motion**: reveal `.7s cubic-bezier(.23,1,.32,1)` + 2.6s failsafe; hover lift −3px; sheen follows cursor on `[data-sheen]`; `prefers-reduced-motion` renders everything static and visible.
6. **States**: every state the design encodes (empty, draft, submitted, error, denied-capability, session-absent redirect panel) reproduced and reachable.
7. Record the review as a checklist block in `PROGRESS.md` (page, date, widths, verdicts).

## §3 Unit vectors (must pass verbatim)

**Registry check digit** — digits are `YY` + 5-digit serial, weights `[8,7,6,5,4,3,2]`, `check = (11 − sum % 11) % 11`, `10 → 'X'`:

| Input (prefix-year-serial) | Check digit |
|---|---|
| KY-C-26-00417 | **8** |
| KY-T-26-00088 | **1** |
| KY-T-26-00001 | **6** |
| KY-C-26-12345 | **2** |
| KY-T-26-00030 | **X** |
| KY-C-26-00200 | **0** |

Also assert: parser rejects wrong check digits; formatter zero-pads serials (KY-* five, POD three, APP/REG four).

**Escrow worked example** (from the admin design, KY-J-26-00417): deposit +$3,000 → release D-01 −$600 ⇒ held **$2,400**; releasing a final deliverable releases the full remainder; sum of entries at close = **0**.

**Escrow properties** (fast-check): balance never negative (release/refund > held rejected); entries append-only; same `Idempotency-Key` replayed ⇒ one entry; ledger sum always equals held; adjust only via accepted change order reference.

**SLA math** (week Sun–Thu): filed Thu → +3 working days = Tue; filed Fri → clock starts Sun. Doors: client 3 wd, talent 5 wd, applications 7 wd (settings-driven).

**Audit chain**: build 3 entries, verify OK; tamper middle payload ⇒ verify reports first broken index.

## §4 E2E suites (Playwright; the binding list)

| Suite | Covers |
|---|---|
| `auth.spec` | signup/signin/signout both roles; 5 wrong passwords ⇒ 15-min lockout; reset flow; cookie flags; session expiry |
| `access-fidelity.spec` | Access page states, AR/EN, keyed errors, Enter-to-submit, departure wipe (reduced-motion variant) |
| `public-crawl.spec` | crawl every public route: status 200, zero console errors, **zero external requests** (route interception allowlist = self), link graph of README fully reachable |
| `apply.spec` | 14 stations end-to-end; autosave + resume after re-login; consent 9/13 enforcement (UI + forged POST); refs 2–3; uploads (wrong type by magic bytes, oversize, EXIF stripped); OTP |
| `portal.spec` | 5-step file, server stage-gating (POST step N+1 with N incomplete ⇒ 422), submit ⇒ KY-F, bridges both directions |
| `client-space.spec` | ledger renders; acceptance with typed signature releases exact amount; double-submit releases once; non-authority ⇒ 403 + designed refusal state; warranty starts; change-order accept adjusts price |
| `talent-space.spec` | ladder, availability persistence, call interest, earnings reconcile with payouts |
| `pod.spec` | non-member blocked; join by code; task lane moves persist + lane-3 auto-journal; chat via SSE to a second context; 4/5 checks ⇒ gate request rejected server-side |
| `admin-rbac.spec` | **generated from the matrix**: 12 capabilities × 9 roles — API allowed/denied + UI state per `06-ADMIN.md §5` |
| `admin-flows.spec` | approve ⇒ KY-T + mail; refuse requires reason ⇒ appeal window opens; convert ⇒ engagement + deposit ⇒ release (3 preconditions, incl. negative cases); gate approval reflects in pod room live; deliverable wip→review→accepted path; position open/close (≥14-day rule rejected at 13); call-for-pods publish + interest; pod member/split edit keeps lead T3/T4; reasoned tier change audited; People reply stamps REG + SLA; publish pipeline draft→review→publish (second live announcement rejected); user invite + role change audited; settings danger zone requires TOTP step-up |
| `emails.spec` | outbox rows per event; subject carries registry number; AR-leads layout snapshot |
| `security.spec` | headers per `07-SECURITY.md §10`; private file unreachable without auth (raw fetch); admin host isolation; CSRF origin check; rate limits fire (429 envelope) |

## §5 Security tests

`pnpm audit` clean (or documented exceptions in `PROGRESS.md`); ZAP baseline scan against staging: no Medium+; upload fuzz (polyglot files, zip bombs, SVG with script, 0-byte, 100MB) all rejected safely; session fixation attempt fails (token rotates on login); IDOR sweep: every object route tried with the other role's session ⇒ 403/404.

## §6 Performance budgets (gates, throttled "Slow 4G" + 4× CPU, mobile-ar project)

| Surface | Budget |
|---|---|
| Any public page, first visit | ≤ 900 KB transfer total (HTML+CSS+JS+fonts+above-fold images); Home ≤ 1.2 MB |
| Repeat visit (warm cache) | ≤ 150 KB |
| Route JS (gzip) | public ≤ 180 KB; portal/space ≤ 300 KB; admin ≤ 350 KB |
| Fonts total | ≤ 380 KB woff2 |
| LCP | ≤ 2.5 s (public), ≤ 3 s (spaces) |
| CLS / TBT | ≤ 0.05 / ≤ 300 ms |
| Atlas / Dimension islands | lazy, excluded from page budget, vendored bundle ≤ 1.5 MB each, never loaded unless visited |
| Planet honesty gate | measured transfer of every public page ≤ 2.5 MB (= 1 g CO₂e at SWDM v4 0.81 kWh/GB × 494 g/kWh); Planet page itself must display its own real number |
| API p95 (staging) | reads ≤ 200 ms, writes ≤ 400 ms; SSE first byte ≤ 1 s |

Verify with Lighthouse CI + a Playwright transfer-size assertion; DB hot paths (`admin queues`, ledger, session lookup) `EXPLAIN ANALYZE` documented in `PROGRESS.md` with index used.

## §7 Accessibility gates

Lighthouse a11y ≥ 95 on Home, Access, Apply, Client Space, Admin; axe: zero critical. Keyboard: every form, board and rail operable (boards expose move buttons/menu — drag is an enhancement); focus-visible gold outline everywhere; `aria-live="polite"` on async results (receipts, OTP, ledger updates); labels + `aria-describedby` errors on all inputs; contrast: body on cream uses `#33544D`+ (7:1 floor — `#4A6B64` only for secondary ≥14px); Arabic screen-reader labels on icon-only controls; `prefers-reduced-motion` path tested in every e2e suite.

## §8 Launch checklist (Session 12 — paste into PROGRESS.md with evidence)

1. Domains + TLS live (`kayanwork.com`, `admin.kayanwork.com`), HTTP→HTTPS, HSTS on.
2. Env review against `08-DEPLOY-EASYPANEL.md §4`: secrets rotated from staging, `SEED_DEMO=false`, `DEMO_OTP=false`; production boot **refuses** demo flags (test it).
3. Grep-proof: no `2026` demo OTP path, no `demo.kayan`, no bootstrap token in env after use.
4. Migrations applied; `/api/health` green; worker heartbeat fresh.
5. Reference seeds verified by count: 20 families / 455+ specs / 16 banks / 6 wallets / 19 languages / 23 governorates / 13 consents / 8 doc kinds / products / 3 positions / settings / flags.
6. First sys-admin created via bootstrap, TOTP enrolled, bootstrap disabled; second staff account invited per real role.
7. Nightly backup ran on schedule; **restore drill performed into scratch DB, row counts matched** — runbook link.
8. Uptime monitor watching `/api/health`; 5xx alert mail tested.
9. Production smoke: read-only crawl green; canary talent application filed → visible in admin → withdrawn; canary contact message answered → SLA stamp.
10. Security headers verified on both hosts (curl transcript attached); admin unreachable on public host.
11. Owner sign-off line with date. Tag `session-12`, archive `PROGRESS.md` copy into `docs/`.

## §9 Regression pack

After launch, the standing regression = `public-crawl` + `auth` + `client-space` money path + `admin-rbac` + headers. Run on every deploy; a red regression blocks the deploy (EasyPanel: deploy staging → run pack → promote).
