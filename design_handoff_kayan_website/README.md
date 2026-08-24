# Handoff: Kayan Website — Full Site (kayanwork.com)

Compiled 2026-08-14 · Aden, Republic of Yemen · «خلف كل نجاح، كيان» — *Behind every success, a Kayan.*

## Overview
Kayan is an Aden-based company selling **guaranteed managed delivery** (عمل مضمون): clients fund a scoped engagement into an escrow account (حساب الضمان), verified Yemeni talent pods execute through ten quality gates (G0–G9), and money releases only on signed acceptance (محضر الاستلام). This bundle is the complete public website plus the working-model portals: marketing pages, three business lines, registration (14 stations), unified auth, client/talent dashboards, a pod workspace, careers, environment, a live geographic atlas, a 3D scroll voyage, and the staff admin console.

## ⚠ Building this for production? Give Claude Code the one prompt in `KICKOFF-PROMPT.md`
It points to `BUILD/00-START-HERE.md`, grants build/commit/push rights, sets the GitHub organization (matrix712/kayan--Maher--full-), and starts Session 0. The build then runs unattended, session by session, pushing a `session-NN` tag at every close and keeping the repo README updated as a living dashboard.
The `BUILD/` folder is the **complete engineering handover for Claude Code**: mission + laws + final stack (`00-START-HERE.md`), the binding 13-session build plan (`01-SESSIONS.md`), architecture (`02`), full PostgreSQL DDL (`03`), the complete API contract (`04`), frontend porting spec (`05`), admin console + 9 roles + 12-capability RBAC (`06`), the binding security standard (`07`), EasyPanel deployment (`08`), bilingual content rules (`09`), QA gates + launch checklist (`10`), and `CLAUDE.md.template` for the new repo. This README is the design-bundle index those docs cite.

## About the design files
The files in this bundle are **design references created in HTML** — high-fidelity prototypes showing intended look, copy, and behavior. They are NOT production code to ship directly. The task is to **recreate these designs in the target codebase's environment** (Next.js/React, Vue, or whatever stack you choose if none exists) using its established patterns — while treating the HTML as the pixel- and copy-level source of truth.

Two file types:
- `*.dc.html` — self-contained pages (open directly in a browser; `support.js` is their tiny runtime). Markup lives between `<x-dc>` tags; page logic in the `<script data-dc-script>` class at the bottom (plain React-style class: `state`, `renderVals()`, handlers). All styling is **inline styles** on elements.
- `*.html` (Atlas, Dimension, Hub) — plain HTML/JS, directly readable.

**All copy is final.** Arabic is the authored source language (admin/contracting register); English is a secondary register. Reproduce copy character-for-character — see `ARABIC-COPY-RULES.md` (binding).

## Fidelity
**High-fidelity.** Colors, typography, spacing, copy, interactions, and empty/error/success states are final. Recreate pixel-perfectly. The only placeholder content is marked as demo data (see State management — demo accounts, seeded workspaces).

## Site map (31 pages — every file in this bundle ships; nothing is reference-only)

### Public
| File | Route suggestion | Purpose |
|---|---|---|
| Kayan Home.dc.html | `/` | Landing: hero + animated Yemen map (v3: hex-dot country, staggered city arrivals, pointer lens, Aden pulse), three lines (bird picker), city gallery + open-door card, **the model section** (problem statement, escrow→gates→acceptance rail, micro-spec pod constellation with lead + spec-code nodes, the two ledgers: what client and practitioner each take away), charter invite, doors, footer with live Aden clock + registry seal. AR/EN toggle (`kyn-lang`). |
| Kayan Charter.dc.html | `/charter` | من نحن + mission/vision + 4 governing articles. AR/EN. |
| Kayan Journey.dc.html | `/journey` | Engagement lifecycle: SOW → escrow → delivery → acceptance → warranty. |
| Kayan for Clients.dc.html | `/clients` | Client pitch + 4-step intake teaser form (STEP 01 WHO → 04 SETTLEMENT). |
| Kayan for Talent.dc.html | `/talent` | Talent pitch: trust ladder, Kayan Card, path to pods. |
| Line I - Managed Delivery.dc.html (+ EN) | `/lines/delivery` | Outcome model, price floor. Paired AR/EN files. |
| Line I - Ready Products.dc.html | `/lines/products` | Fixed-price catalogue (rp-core/fixed/range.js data). |
| Line II - The Hub and Cafe.dc.html (+ EN) | `/lines/hub` | Coworking hub: membership $20/mo = 30,000 YER, solar policy. |
| Line III - The Forge.dc.html (+ EN) | `/lines/forge` | Talent foundry: 9-stage cohort machine, sponsors. |
| Civic Wing - Kayan for Yemen.dc.html | `/k4y` | K4Y civic wing. Inline AR/EN spans, own `k4y-lang` key (deliberate). |
| Kayan People.dc.html | `/people` | Careers: 5-rule work charter, 12-week internship (4 tracks + W01–W12 phase arc), 3 open positions with in-page application form, دفتر الناس metrics, registry-office contact form. |
| Kayan Planet.dc.html | `/planet` | Environment: live page-weight footprint meter (SWDM v4: 0.81 kWh/GB × 494 g/kWh, 1 g/view budget), 6 commitments, 7 SDG mappings. |
| Kayan Legal.dc.html | `/legal` | Terms/clauses page. |
| Kayan Hub.html | `/hub-location` | Hub location/map page (linked from Line II). |
| Kayan Atlas.html | `/atlas` | Live d3 + world-atlas TopoJSON map: Yemen gold-lit, **real astronomical day/night terminator** recomputed every minute on Aden time, delivery arcs Aden→world, 14 hoverable city points, HUD chips. |
| Kayan Dimension.html | `/voyage` | 3D scroll voyage (three.js, pinned import map): lighthouse → 10 gates → escrow vault → pod constellation → sun finale. Reduced-motion + WebGL fallbacks built in. Parallel experience; classic site never depends on it. |
| The master one.dc.html | internal | Master identity/colour-system document (brand reference, not public nav). |

### Working model (auth + portals)
| File | Route suggestion | Purpose |
|---|---|---|
| Kayan Access.dc.html | `/access` | Unified sign-in/sign-up. Fully bilingual (kyn-lang), role tabs (client/talent), OTP, password strength, keyed AR/EN errors, Enter-to-submit, gold departure wipe to the right Space, session banner. |
| Kayan Apply.dc.html | `/apply` | Talent registration: 14 stations, 455+ specs from `kayan-registry*.js`, ID + selfie verification, languages (CEFR), docs, pod pre-registration, K4Y volunteering, 2–3 references, payout rails, 13 consents. Demo OTP: `2026`. |
| Kayan Portal.dc.html | `/portal` | Three doors: client (5-step وثيقة فتح النطاق + dashboard), talent dashboard, pod room gate. Session-aware: routes straight to Spaces when logged in. |
| Kayan Space - Client.dc.html | `/space/client` | Client dashboard: stage rail, escrow ledger, deliverables + typed-signature acceptance (releases escrow, starts 30-day warranty), change orders, messages, docs, settings. |
| Kayan Space - Talent.dc.html | `/space/talent` | Talent dashboard: trust ladder, availability, my pods, calls-for-pods, earnings, delivery record, 5 verification axes, K4Y hours, weekly readiness. |
| Kayan Pod Room.dc.html | `/pod/:code` | Pod workspace, gated by talent session + pod code: gate rail G0–G9, 4-lane task board, delivery journal, team channel, quality-guard checklist (all 5 checks arm the gate-request button), files + fixed split. |
| Kayan Admin.dc.html | `admin.kayanwork.com` | Staff console: sign-in gate (TOTP), 10 views (overview, talent registry, client files, escrow ledger, pods & gates, people desk, content, users & roles, audit log, settings), 9 staff roles, 12-capability RBAC matrix — the role select visibly reshapes queues, capability strip, and every action's allow/deny state. Build spec: `BUILD/06-ADMIN.md`. |
| Kayan Record.dc.html | `/record` | السجل العام — public record page (linked from Home footer + Civic Wing). |
| Kayan Seal.dc.html | `/seal` | Seal registry explainer (linked from the Home footer seal badge). |
| Kayan Client Profile.dc.html | `/clients/account` | حساب العميل — client account explainer (linked from for-Clients). |
| Kayan Talent Profile.dc.html | `/talent/profile` | ملف المنفذ — executor profile + Kayan Card (linked from for-Talent). |
| Kayan Toolkit - Scoping Form.dc.html | `/tools/scope` | تحرير النطاق — scope-drafting tool (linked from for-Clients, Client Profile, Line I EN). |

### Link graph (must survive the port)
Home → Charter, Journey, Lines I/II/III, People, Planet, Atlas, Dimension, Access, Portal, Civic Wing, Legal, Record, Seal. For-Clients → Client Profile, Toolkit. For-Talent → Talent Profile. People → Apply, Portal, Access, Planet. Access ↔ Portal (bidirectional bridges, see doctrine below). Portal → Pod Room, Spaces. Spaces → Access (when no session). Line II → Kayan Hub. Every footer: Home, Planet, Civic Wing, Legal.

## Global design system

### Design tokens
Colors (exact, reuse verbatim):
- Deep greens (surfaces): `#03201D` (footer/deepest), `#052E2B` (primary dark), `#0A3A34` (card on dark), `#0E4A44` (border on dark)
- Creams: `#F4EEDD` (page bg), `#FAF6EC` (card bg), `#EDE5D2` (alt band), borders `#E0D6BD` / `#E3D9C2`
- Gold: gradient `linear-gradient(135deg,#C9A227,#E9C96B)`; text-on-cream gold `#8F7218`; light gold `#E9C96B` (on dark)
- Action teal `#0E6E66`; success mint `#7CE0B8` on `rgba(126,224,184,.08)`; error `#C96B4A` / text `#F0B9A0`
- Line accents: client-blue `#2E7CBC` on `#0A2434`; pod-purple `#5B4A8E` on `#1D1433`; K4Y green `#2F6B3A`; Forge ember `#FF6250`; Hub amber `#FFB627`; RP reef teal
- Body text on cream: `#052E2B` headings, `#4A6B64` body, `#33544D` lists; on dark: `#FAF6EC` and `rgba(250,246,236,.6–.85)`

Typography (Google Fonts):
- **Alexandria** — display/headings. Hero: weight 200 at clamp(34–62px), bold spans weight 700–800 in gold
- **IBM Plex Sans Arabic** — Arabic body. 13–15px, line-height 1.95–2.15
- **Instrument Sans** — English body (secondary register, smaller + lighter)
- **IBM Plex Mono** — codes/kickers. 8.5–12px, letter-spacing .12–.24em, ALWAYS `dir="ltr"`, uppercase

Radii: pills `999px`, buttons/inputs `12px`, small cards `14–18px`, section cards `20–24px`.
Shadows: card hover `0 18px 40px -18px rgba(5,46,43,.3)`; gold CTA `0 12px 26px -12px rgba(201,162,39,.7)`.
Spacing: section padding `clamp(40px,6vw,80px)` vertical, `clamp(16px,4vw,44px)` horizontal; content max-width `1160px`; grid gaps 12–14px.

### RTL rules
`dir="rtl"` on the page root; every mono/EN block wrapped `dir="ltr"`. Use CSS logical properties (`padding-inline`, `border-inline-start`, `inset-inline-start`). Date inputs: `direction:ltr;text-align:right`.

### Motion vocabulary
- Reveal-on-scroll: elements start `opacity:0; translateY(16px)`, transition `.7s cubic-bezier(.23,1,.32,1)` via IntersectionObserver (threshold .1) + a 2.6s failsafe that reveals everything
- Card hover (`[data-card]`, fine pointers only): `translateY(-3px)` + shadow, `.35s` same easing; `:active` scale(.98)
- Cursor sheen (`[data-sheen]`, primary CTAs): gold radial highlight `radial-gradient(130px circle at var(--mx) var(--my), rgba(255,255,255,.28), transparent 62%)` tracking pointermove (one shared document listener)
- Entrances: `kIn` keyframe (fade + 14px rise, .8s, staggered .15s)
- **`prefers-reduced-motion: reduce` kills all of it** — every page carries the kill-switch; Dimension falls back to static
- Focus: `outline:2px solid #C9A227; outline-offset:2px` on `:focus-visible`

## Client doctrine — one key, one document
`Access` owns the ACCOUNT (credentials → session). `Portal → capply` owns the REQUEST (وثيقة فتح النطاق). They are different instruments, never rival sign-ups:
- Portal client door with session + no submitted file → opens the request form PREFILLED from the session, with a strip linking back to the Space
- Access sign-up prefills email/org/name from a draft Portal file
- Server ties file ↔ account by email

## State management (localStorage contracts → replace with API)
Every key below is a **data contract the UI already honors**. Port the shapes to your API; the UI states (empty/draft/submitted/error) all exist.

- `kyn-lang`: `'ar' | 'en'` — read by Home/Charter/Access toggles. Any new page must honor it. (Civic Wing uses its own `k4y-lang` — deliberate sub-brand.)
- `kyn-auth-v1`: session `{v:1, role:'client'|'talent', id, name, org, email, tier, at}` — written by Access; read by Spaces (redirect panel when absent/wrong role), Pod Room, Portal. Logout removes it.
- `kyn-accounts-v1`: `{v:1, clients:[{id,name,org,email,pw,at}], talents:[{id,name,email,pw,tier,spec,at}]}`. Demo: `client@demo.kayan`/`kayan2026` (KY-C-26-00417-8, مؤسسة الميناء للتجارة) and `talent@demo.kayan`/`kayan2026` (KY-T-26-00088-1, سلمى العمودي, T3). Talent sign-in also accepts a submitted apply file and migrates it. **Hash passwords server-side.**
- `kayan-apply-v1`: registration draft/submission — stations, acc (with OTP `2026` demo), idn (ID + selfie checks), prof, specs (max 5, [0] primary), langs, docs, links, pod, k4y, refs (2–3), pay, consents[13], submitted, appId. Full shape documented in the page's logic class.
- `kyn-portal-v2`: `{v:2, view, c:{stage, maxSeen, submitted, id, org{}, auth{proofOk,codeOk}, comp[4], final, scope{outcome,line,deadline,budget,desc,files[]}, prog:0–5, accepted, acceptDate, warrantyEnd, log[]}}`. Pod room opens only when `c.submitted && c.prog>=3`.
- `kyn-cws-<clientId>`: client workspace `{jobId, scopeTitle, pod, lead, price, deadlineTs, stage 0–5, dod[], ledger[], held, deliv[{id,name,note,st:'wip|review|accepted'}], cos[], msgs[], log[], accepted, warrantyEnd}`. Acceptance = typed signature → releases $600/item (remainder on last) — ledger must zero out.
- `kyn-tws-<talentId>`: `{avail, week[7], applied[]}`.
- `kyn-pod-041`: `{deadline, gate, checks[5], gateAsked, tasks[{id,t,lane 0–3,owner}], log[], chat[], files[]}`. Unlock: talent session + code `POD-26-041` or `KY-J-26-00417`. Lanes: تجهيز/تنفيذ/مراجعة داخلية/مقبول; lane-3 moves auto-log; 5/5 checks arm gate request.
- `kyn-people-apps-v1`: `{v:1, sent:{<POS code|GEN-POOL>:{id:'APP-…', name, contact, note, at}}}` — job applications; buttons flip to رشحت ✓; "أرقام ترشحك" strip lists filed IDs.
- `kyn-contact-v1`: `{v:1, last:{id:'REG-26-…', door, due, at}, list:[…]}` — registry-office contact: door pick → SLA shown BEFORE send (3–5 working days) → receipt number + promised reply date. Route by doorKey server-side.
- ID format: `KY-T-26-#####-C` / `KY-C-26-#####-C`. Check digit: weights [8,7,6,5,4,3,2] over 7 digits, `(11−sum%11)%11`, 10→'X'. **Registry numbers must become server-issued.**

## Business rules encoded in UI (do not weaken)
1. لا عقد، لا ضمان، لا عمل — escrow funds before execution (portal stage gating).
2. Verification ≠ assignment (Apply station 00 quiz; talent dashboard copy).
3. Only the client authority signs acceptance; signature releases escrow; 30-day warranty starts.
4. Negative decisions are human-signed with written reason; one appeal within 21 days.
5. ID document images deleted after verification (hash retained) — consent #2.
6. Payouts via official channels only (banks primary, wallets capped secondary).
7. Pods are execution units for live engagements — no waiting rooms.
8. Consents: 9 required + 4 optional, individually ticked; charter scroll-to-end unlocks the honesty pledge.
9. People page: every vacancy publishes location + salary band; stays open ≥2 weeks; SLA-stamped replies.

## Shared runtime files (in this bundle)
- `support.js` — dc.html runtime (reference only; not ported)
- `kayan-registry.js` + `-2/3/4.js` — **load all four in order** → `window.KAYAN_REGISTRY`: banks[16] (CBY-Aden licensed), wallets[6], languages[19] + CEFR levels, governorates[23], idTypes, refRules, consents[13], docKinds[8], families[20] → 455+ specs, 6,800+ micro-specs. Port this to a seed/fixture file — it is real reference data.
- `kayan-compass.js` — `<kayan-compass current="…">` shared site menu + ⌘K palette + golden scroll thread + **footprint chip**: every compass page shows its own measured transfer as ≈ g CO₂e against the Planet floor (1 g/view, SWDM v4) — mint within budget, warn-red over; links to `/planet`; `footprint="off"` opts a page out (web component)
- `kayan-mark.js`, `kayan-card.js` (Kayan Card, 5 tiers, flip), `kayan-line-audio.js` (maqam Rast sonic signatures), `yemen-map.js` (canvas map), `kayan-bird-filters.js`, `rp-core/fixed/range.js` (Ready Products data), `image-slot.js` (image placeholders)
- `assets/` — 80 brand images. Canonical: `kayan-logo-gold.png` (header), `kayan-bird-elite-gold.png` (hero), `kayan-mark-cream.png` (footer), per-line birds `bird-md/hub/forge/k4y.png`
- `ARABIC-COPY-RULES.md` — binding copy rules for any new Arabic line

## QA report (2026-08-14, this bundle as shipped)
- **Final pass (14 AUG, evening):** Dimension upgraded to v2 — shader-displaced living water, Aden ridge silhouettes, detailed lighthouse (gallery railing, lit windows, skerries), beveled gates with finials + threshold lines, vault studs/spokes + double coin-ring, pod orbit trails, bird-flock finale, film grain, English secondary line on every chapter, gate names AR+EN, `THREE.Clock` deprecation removed. Full-bundle crawl re-run: **0 broken refs across 45 HTML files** (the record/seal/profile/scoping pages and the brand chapters the master links are now bundled); the one `scrollIntoView` (a dead no-op in Forge) deleted.
- **Wiring:** all 31 pages audited programmatically — 0 broken links/assets; every cross-page href resolves within the bundle (brand-book pages removed from the bundle 14 AUG; only master-one/Dossier linked to them, both also removed).
- **Console:** 31/31 pages load with zero errors. Two benign warnings: THREE.Clock deprecation (Dimension — swap to THREE.Timer when porting), transient `{{ o }}` first-paint diagnostic (for Clients — select verified rendering populated).
- **Flows previously verified end-to-end:** Access sign-in/up (both roles, OTP, wrong-password errors, departure wipe), Portal 5-step client file + bridges, Apply 14 stations, client acceptance → escrow release → warranty, pod gate unlock, People job/contact forms with receipts, Planet live meter, Atlas terminator math, Dimension 6 scroll depths + fallbacks.
- **Known production notes:** (1) Home hotlinks 7 Wikimedia Commons photos — mirror them locally and keep attribution; (2) demo OTP `2026` and seeded demo accounts must die in production; (3) all registry/receipt numbers (REG-/APP-/KY-) become server-issued; (4) `k4y-lang` vs `kyn-lang` is intentional.

## Implementation priorities (server-side, in order)
1. Auth: hashed passwords, real OTP (email/WhatsApp), sessions replacing `kyn-auth-v1`.
2. Escrow + acceptance: server-authoritative ledger, signature audit trail, warranty clock.
3. Intake pipelines: Portal client file, Apply submission (+ file/ID upload with post-verification deletion), People applications + contact registry with SLA timers and door routing.
4. Pod room realtime: tasks/chat/files/gate requests.
5. Messaging + notifications (registry numbers in every subject line).
6. Mirror Wikimedia imagery; add analytics that respect the Planet page's 1 g/view budget.

## Files
Everything referenced above ships in this folder: 31 HTML pages (the public site, the working-model portals, the admin console, and the five wired companion pages: record, seal, client/talent profiles, scoping-form toolkit), 15 runtime JS files, `assets/` (80 images), 2 uploads logos, `ARABIC-COPY-RULES.md`, and `BUILD/` (12 engineering docs — the build contract). Brand-book documents (master identity file, brand chapters, stationery, decks, social) are deliberately NOT in this bundle — every file here is part of the shipping site. Open `Kayan Home.dc.html` first and click through — the site is fully wired offline except Google Fonts, Wikimedia photos, and the Atlas/Dimension CDN libraries (d3, topojson, three.js).
