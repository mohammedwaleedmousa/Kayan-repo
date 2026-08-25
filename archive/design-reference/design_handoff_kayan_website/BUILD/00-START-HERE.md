# KAYAN — Production Build Handover (READ THIS FIRST)

You are Claude Code, acting as the lead full-stack engineer for **kayanwork.com** — the production website and working-model platform of شركة كيان للابتكار وريادة الأعمال وبيئات العمل ذ.م.م (Kayan Innovation, Entrepreneurship & Work Environments LLC), Aden, Republic of Yemen.

This folder is a **complete handover**: high-fidelity HTML design references (27 pages), final bilingual copy, shared data files, brand assets, and the engineering documentation set (`BUILD/`). Your job is to build the real product — backend, database, frontend, admin console, security, deployment — to production quality, hostable on the company's own **EasyPanel** server.

## The documentation set (read in this order)

| Doc | What it governs |
|---|---|
| `00-START-HERE.md` | Mission, laws, stack decision, repo layout, how to work |
| `01-SESSIONS.md` | The build plan: 13 sessions, each with scope, gates, and exit criteria. **Binding order.** |
| `02-ARCHITECTURE.md` | System topology, module boundaries, adapters, jobs, request lifecycle |
| `03-DATABASE.md` | Full PostgreSQL schema (DDL), invariants, seeds, ID issuance, audit hash chain |
| `04-API.md` | Every endpoint: auth, validation, errors, rate limits, SSE, localStorage→API mapping |
| `05-FRONTEND.md` | Porting the 27 design pages: routes, components, tokens, motion, RTL, performance |
| `06-ADMIN.md` | Admin console: 10 views, 9 staff roles, 12-capability RBAC matrix, workflows |
| `07-SECURITY.md` | Binding security standard (auth, sessions, TOTP, uploads, headers, audit, backups) |
| `08-DEPLOY-EASYPANEL.md` | Docker + EasyPanel services, env vars, domains, backups, restore drills |
| `09-CONTENT-I18N.md` | Bilingual model: Arabic source, English secondary; copy extraction rules |
| `10-QA-ACCEPTANCE.md` | Test plan, fidelity gates, launch checklist. Nothing ships without it. |
| `CLAUDE.md.template` | Copy to the new repo root as `CLAUDE.md` in Session 0 — your standing orders |

Design context: `../README.md` (design bundle index — page map, tokens, state contracts), `../ARABIC-COPY-RULES.md` (binding copy law).

## What Kayan is (so every technical call lands right)

Kayan sells **guaranteed managed delivery** (عمل مضمون): clients fund a scoped engagement into an escrow account (حساب الضمان); verified Yemeni talent pods execute through quality gates G0–G9; money releases only on the client authority's signed acceptance (محضر الاستلام). Three lines — Managed Delivery, The Hub (coworking, Corniche Aden), Kayan Forge (talent foundry) — plus the civic arm K4Y. The product is **trust**: verification before work, management during, guarantee after.

Founding rule, encoded everywhere: **لا عقد، لا ضمان، لا عمل** — no signed scope + no funded escrow → no work begins.

## The ten laws of this build

1. **The designs are the truth.** The `.dc.html` files in this bundle are pixel- and copy-level source of truth. Recreate them exactly — colors, spacing, type, motion, copy character-for-character. Where you must invent a screen the bundle lacks (password reset, 404, email templates, admin detail views), derive it strictly from the existing vocabulary; `06-ADMIN.md` and `05-FRONTEND.md` specify these.
2. **Arabic is authored, never translated.** All copy already exists in the designs — extract it verbatim. Any NEW line you must write follows `../ARABIC-COPY-RULES.md`: verb-led admin register, no «تم + مصدر», no تشكيل, no exclamation marks. English is secondary — smaller, lighter, never leads. If you cannot write it to that standard, flag it as `COPY-TODO` for the owner instead of inventing.
3. **Zero external dependence at runtime.** Everything self-hosted on EasyPanel: PostgreSQL in a container, files on a persistent volume, sessions in the DB, jobs via pg-boss (Postgres-backed), fonts self-hosted, JS libraries vendored into the repo. **Forbidden:** Auth0/Clerk/Supabase/Firebase/AWS-specific APIs, SaaS analytics, CDN-loaded runtime scripts, Vercel-only features. The ONLY runtime external is the SMTP relay you are given by env var (and an optional WhatsApp adapter behind an interface, off by default).
4. **Server is authoritative.** Every business rule enforced in the UI (escrow gating, RBAC, acceptance, SLA) is enforced again server-side. The client is a view. localStorage contracts in the designs become API + DB (mapping table in `04-API.md`).
5. **Money is sacred.** Integer cents, USD base. Escrow ledger is append-only, must always reconcile to zero at engagement close, and every mutation is idempotent, audited, and permission-gated. Test-first on every money path.
6. **Everything of consequence is audited.** Append-only `audit_log` with a hash chain (each entry binds the previous). Decisions, releases, gate approvals, role changes, logins.
7. **Negative decisions are human.** A machine may pass a person; only a person may fail one. Refusals carry a named role + written reason + one appeal within 21 days. Build the workflows this way.
8. **Privacy by design.** ID document images are deleted after verification (SHA-256 retained). PII minimized, uploads private, files served only through authenticated, authorized routes.
9. **Reach reality.** Mid-range Android on a weak connection is the target device. Performance budgets in `10-QA-ACCEPTANCE.md` are gates, not aspirations. `prefers-reduced-motion` honoured everywhere.
10. **Session discipline.** Work in the sessions of `01-SESSIONS.md`, in order, one at a time. A session is done only when its gates pass. Keep `PROGRESS.md` current. Never leave the repo red.

## Stack decision (final — do not re-litigate)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15+ (App Router, TypeScript, standalone output)** | One codebase for site + portals + admin + API; SSR for public pages; deploys as a single Node container on EasyPanel |
| Database | **PostgreSQL 16** (EasyPanel service) | Relational integrity for money/registry; JSONB for station payloads |
| ORM/migrations | **Drizzle ORM + drizzle-kit** | SQL-first, deterministic migrations committed to the repo |
| Auth | **Own implementation**: Argon2id + opaque DB sessions + TOTP (staff) | Law 3. No third-party identity |
| Jobs/cron | **pg-boss** (worker process, same image) | Queues + schedules on Postgres — no Redis to operate |
| Realtime | **SSE** (`EventSource`) + polling fallback | Proxy-friendly through Traefik; no websocket infra |
| Files | Persistent volume via a `Storage` adapter (S3/MinIO optional later) | Law 3; single-node EasyPanel reality |
| Email/OTP | **nodemailer → SMTP** behind a `Mailer`/`OtpChannel` adapter | Any relay; WhatsApp adapter optional, never blocking |
| Validation | **Zod** at every boundary (env, API, forms) | One schema, both sides |
| Styling | **Tailwind CSS v4 + CSS variables for the Kayan tokens** | Utility speed with the exact token palette; RTL via logical properties |
| i18n | **next-intl**, `ar` default (RTL), `/en` twins where designed | `09-CONTENT-I18N.md` |
| Testing | **Vitest** (unit) + **Playwright** (e2e) | Gates in `10-QA-ACCEPTANCE.md` |
| Lint/format | ESLint + Prettier, strict TS, CI on every push | Never leave the repo red |

## Repository layout (create in Session 0)

```
kayan-web/
  CLAUDE.md                  ← from CLAUDE.md.template
  PROGRESS.md                ← session ledger (you maintain it)
  docs/                      ← copy of this BUILD/ set + design bundle README
  design-reference/          ← the 27 .dc.html files + runtime JS + ARABIC-COPY-RULES.md (read-only truth)
  drizzle/                   ← generated SQL migrations (committed)
  src/
    app/                     ← Next App Router
      (site)/                ← public pages (ar default)
      en/                    ← English twins
      (portal)/access|apply|portal|space|pod/
      admin/                 ← staff console (host-gated to admin.kayanwork.com)
      api/v1/                ← route handlers
    components/              ← ported UI vocabulary (see 05-FRONTEND)
    domain/                  ← pure business logic: escrow, ids, rbac, gates, sla (unit-tested)
    server/                  ← db schema, repositories, services, adapters (mail, otp, storage), jobs
    i18n/                    ← messages ar/en
    lib/                     ← zod env, errors, logger, utils
  public/fonts|img|vendor/   ← self-hosted fonts, mirrored images, vendored d3/topojson/three
  worker.ts                  ← pg-boss worker entry
  Dockerfile · compose.yaml (local dev) · .env.example
  e2e/ · tests/
```

## Domains

- `kayanwork.com` — public site + portals (`/access`, `/apply`, `/portal`, `/space/*`, `/pod/*`)
- `admin.kayanwork.com` — staff console only (host-checked in middleware; also path-guarded)
- All HTTP → HTTPS; HSTS. TLS via EasyPanel/Traefik (Let's Encrypt).

## Working agreement (how you, Claude Code, operate)

- **Start of every session:** read `PROGRESS.md`, the session's entry in `01-SESSIONS.md`, and the docs it cites. Restate the plan in 5 lines. Then build.
- **End of every session:** run the full gate (`typecheck` + `lint` + `test` + `build` + the session's acceptance list), update `PROGRESS.md` (done / decisions / deviations / next), commit.
- **Commits:** Conventional Commits (`feat(escrow): …`, `fix(admin): …`), small and coherent; tag session ends `session-NN`. **Push to the GitHub remote at every session close at minimum** — work is not done until it is pushed; `.env` is git-ignored from Session 0 and secrets never leave the box.
- **Autonomy:** a kickoff like “create this design” means exactly this: execute the handover start to finish, session by session, at your own pace, without waiting for approvals between sessions. Only two owner inputs exist in the whole plan — SMTP credentials (Session 10) and DNS access (Session 12); if they haven't arrived, continue with staging placeholders and record them in `PROGRESS.md` under “awaiting owner”.
- **Dependencies:** adding any npm package beyond the stack table requires a one-line justification in `PROGRESS.md`; prefer zero-dependency solutions; no packages with postinstall scripts; commit the lockfile.
- **When the docs conflict:** the design files win on look/copy; `07-SECURITY.md` wins on security; `03-DATABASE.md` wins on data shape. Record the conflict and your resolution in `PROGRESS.md`.
- **When something is genuinely undecidable** (e.g. a missing price, a legal line): implement behind a clearly named setting or `COPY-TODO`, never invent facts (Law: no invented facts about Yemen, institutions, prices, dates).
- **Never** commit secrets, weaken an encoded business rule, or ship the demo credentials/OTP (`2026`) past Session 11.

Begin with `01-SESSIONS.md` → Session 0.

## Repository (matrix712/kayan--Maher--full-) — organization is part of the contract

The GitHub repo (`https://github.com/matrix712/kayan--Maher--full-`, branch `main`) is the single home of this build. It currently holds only a README stub — preserve history, never force-push. Lay it out in Session 0, commit-by-commit in this order, and keep it exactly this shape:

```
/
├─ README.md              THE LIVING DASHBOARD (see below) — replaces the stub in Session 0
├─ CLAUDE.md              from BUILD/CLAUDE.md.template, verbatim — your standing orders
├─ PROGRESS.md            session journal: done / decisions / deviations / awaiting owner / next
├─ docs/                  the engineering contract, unchanged content, numbered names kept:
│    00-start-here.md … 10-qa-acceptance.md   (+ runbooks/ added in S11: incident, restore, sync)
├─ design-reference/      the ENTIRE design bundle, verbatim & read-only after Session 0:
│    *.dc.html (31 pages) · *.js (15 runtime files) · assets/ · uploads/ ·
│    ARABIC-COPY-RULES.md · README.md (the bundle index — the sitemap the Screen map cites)
├─ .github/workflows/verify.yml   CI: pnpm verify on every push (S0) + Playwright pack (S9+)
├─ src/                   app/ · server/ · domain/ · lib/ · i18n/ per 02-ARCHITECTURE §2
├─ public/                fonts/ · img/ · vendor/ (d3, topojson, three — committed at exact versions)
├─ tests/                 unit/ · e2e/ · factories.ts
├─ drizzle/               generated migrations, one per session
├─ scripts/               seed.ts · extract-copy.ts · bootstrap-admin.ts · drill-verify.ts
├─ copy-baseline/         extracted copy fidelity baselines (S1, per 09 §4)
├─ Dockerfile · compose.yaml · docker-entrypoint.sh · .env.example
└─ package.json · pnpm-lock.yaml · tsconfig.json · next.config.ts
```

Session-0 commit order (each pushed as made): (1) `chore(repo): claim dashboard README` · (2) `docs: engineering contract` (docs/ + CLAUDE.md + PROGRESS.md) · (3) `docs(design): reference bundle` (design-reference/) · (4) `feat(scaffold): next + drizzle + ci walking skeleton`.

Rules:
- **Session 0 pushes first**: repo scaffold + docs + design-reference land on `main` before any product code. If the remote has content, preserve history — never force-push.
- **README.md is the living dashboard**, updated at EVERY session close: project one-liner + tagline, status table (session / date / shipped / gate result), quickstart (dev, test, deploy), links into docs/, and "awaiting owner" items. Outdated README = session not closed.
- Conventional Commits; tag `session-NN` at each close; push commits + tags together. `.env` and secrets never enter the repo; `design-reference/` is read-only after Session 0 (design changes come from the owner, not the build).
- Keep the tree clean: no dead experiments on `main`; short-lived branches only if a session needs one, merged or deleted by its close.
