# 05 — FRONTEND: porting the 31 design pages

The `.dc.html` files are the truth. This doc gives the route map, the token layer, the shared component vocabulary, the porting method, and the meta/SEO set. Fidelity gates: `10-QA-ACCEPTANCE.md §2`.

## §1 Route map

| Design file | Route | Rendering |
|---|---|---|
| Kayan Home | `/` | SSR + client islands (yemen-map canvas, clock) |
| Kayan Record | `/record` | SSR — the public record (السجل العام); static copy in v1, linked from Home footer + Civic Wing |
| Kayan Seal | `/seal` | SSR — seal registry explainer, linked from the Home footer seal badge |
| Kayan Charter | `/charter` | SSR |
| Kayan Journey | `/journey` | SSR |
| Kayan for Clients | `/clients` | SSR + intake teaser form |
| Kayan Client Profile | `/clients/account` | SSR — client account explainer (حساب العميل), linked from for-Clients |
| Kayan for Talent | `/talent` | SSR |
| Kayan Talent Profile | `/talent/profile` | SSR — executor profile (ملف المنفذ) + kayan-card, linked from for-Talent |
| Kayan Toolkit — Scoping Form | `/tools/scope` | client page — scope-drafting tool (تحرير النطاق), linked from for-Clients, Client Profile, Line I EN |
| Line I — Managed Delivery (+EN) | `/lines/delivery` · `/en/lines/delivery` | SSR twins |
| Line I — Ready Products | `/lines/products` | SSR, data from DB |
| Line II — Hub & Café (+EN) | `/lines/hub` · `/en/lines/hub` | SSR twins |
| Kayan Hub (location) | `/hub-location` | SSR |
| Line III — Forge (+EN) | `/lines/forge` · `/en/lines/forge` | SSR twins |
| Civic Wing K4Y | `/k4y` | SSR (own `k4y-lang`) |
| Kayan People | `/people` | SSR + forms |
| Kayan Planet | `/planet` | SSR + live meter island |
| Kayan Legal | `/legal` | SSR (+ image attribution colophon) |
| Kayan Atlas | `/atlas` | client-only island (vendored d3/topojson), lazy |
| Kayan Dimension | `/voyage` | client-only island (vendored three.js), lazy, fallbacks |
| Kayan Access | `/access` | client page |
| Kayan Apply | `/apply` | client page (14 stations) |
| Kayan Portal | `/portal` | client page (doors + capply) |
| Kayan Space — Client | `/space/client` | client page, session-gated |
| Kayan Space — Talent | `/space/talent` | client page, session-gated |
| Kayan Pod Room | `/pod/[code]` | client page, membership-gated |
| Kayan Admin | `admin.kayanwork.com/admin` | client shell, staff-gated (`06-ADMIN.md`) |
| + derived | `/access/reset`, `/access/verify`, `/404`, `/500` | from Access/site vocabulary |

Gated pages render the design's **redirect/refusal panel** (not a blank bounce) when the session is absent or the role is wrong.

## §2 Design tokens (CSS variables — the only styling constants)

Define once in `globals.css`, consume via Tailwind v4 `@theme`; **never restate hex literals in components**.

```css
:root {
  /* surfaces */
  --deep-900:#03201D; --deep-800:#052E2B; --deep-700:#0A3A34; --deep-600:#0E4A44;
  --cream-bg:#F4EEDD; --cream-card:#FAF6EC; --cream-band:#EDE5D2;
  --line-cream:#E0D6BD; --line-cream-2:#E3D9C2;
  /* gold */
  --gold-grad:linear-gradient(135deg,#C9A227,#E9C96B);
  --gold-ink:#8F7218; --gold-light:#E9C96B; --gold:#C9A227;
  /* text */
  --ink:#052E2B; --body:#33544D; --muted:#4A6B64;
  --on-dark:#FAF6EC; --on-dark-85:rgba(250,246,236,.85); --on-dark-60:rgba(250,246,236,.6);
  /* semantic */
  --action:#0E6E66; --mint:#7CE0B8; --mint-bg:rgba(126,224,184,.08);
  --err:#C96B4A; --err-ink:#A9532F; --err-on-dark:#F0B9A0;
  /* line accents */
  --client-blue:#2E7CBC; --client-dark:#0A2434; --pod-purple:#5B4A8E; --pod-dark:#1D1433;
  --k4y-green:#2F6B3A; --forge-ember:#FF6250; --hub-amber:#FFB627;
  /* geometry */
  --r-pill:999px; --r-input:12px; --r-card-sm:16px; --r-card:22px;
  --shadow-card:0 18px 40px -18px rgba(5,46,43,.3);
  --shadow-gold:0 12px 26px -12px rgba(201,162,39,.7);
  --pad-section:clamp(40px,6vw,80px); --pad-inline:clamp(16px,4vw,44px); --max-content:1160px;
  --ease-k:cubic-bezier(.23,1,.32,1);
}
```

Text-color law: on cream — headings `--ink`, body `--body` (#33544D, 7.7:1), secondary `--muted` only ≥ 14px; on dark — `--on-dark` and its opacities. Gold as TEXT on cream is always `--gold-ink`, never #C9A227.

## §3 Component vocabulary (`src/components/`)

Port each once, from the design that defines it; every page then composes these.

| Component | Source of truth | Contract |
|---|---|---|
| `SiteHeader` / Compass | `kayan-compass.js` | sticky, current-page aware, ⌘K palette (routes + actions), golden scroll-progress thread, lang toggle, session chip, **footprint chip** (below) |
| `FootprintChip` | `kayan-compass.js` (v2) | on every public page: measured transfer of the visit → ≈ g CO₂e (SWDM v4: 0.81 kWh/GB × 494 g/kWh) vs the 1 g/view floor — mint within, warn over, links to `/planet`; production impl reads real `PerformanceObserver` data + the page-weight budget from `10-QA §6`; hidden ≤ 560px |
| `SiteFooter` | Home footer | 4 link columns, **live Aden clock** (ticking, `Asia/Aden`), registry seal chip, tagline verbatim |
| `AnnouncementBar` | Home | reads published announcement (DB); dismiss persists per announcement id |
| `MonoKicker` | everywhere | IBM Plex Mono, 8.5–12px, tracking .12–.24em, uppercase, `dir="ltr"` |
| `GoldCTA` | Home/Access | gold gradient pill, `--shadow-gold`, cursor sheen `[data-sheen]`: radial `130px circle at (--mx,--my), rgba(255,255,255,.28)→62%`, one shared document pointermove listener |
| `Card` | all cream pages | `[data-card]`: hover (fine pointer) translateY(-3px)+shadow .35s var(--ease-k); active scale(.98) |
| `Reveal` | all pages | IO threshold .1: from `opacity:0; translateY(16px)` → shown, .7s var(--ease-k); **2.6s failsafe reveals all**; reduced-motion ⇒ static |
| `StageRail` | Portal/Client Space | stages 0–5 with gold current, mint done |
| `GateRail` | Pod Room/Admin | G0–G9; done mint bar, current gold gradient, rest 14% white |
| `TierBadge` / `KayanCard` | `kayan-card.js` | T0–T4 tiers, flip front/back |
| `AxisMeter` | Apply/Admin | 5 verification axes, labeled bars |
| `StatusChip` | Admin/Spaces | gold `rgba(201,162,39,.14)/#8F7218` · mint `rgba(14,110,102,.1)/#0E6E66` · warn `rgba(201,107,74,.12)/#A9532F` |
| `Field`/`Select`/`OtpBoxes`/`ConsentRow` | Access/Apply | 12px radius, cream bg, focus gold outline; keyed AR/EN errors under field; date inputs `direction:ltr;text-align:right` |
| `LedgerTable` | Client Space/Admin | mono amounts, +mint/−salmon, memo lines verbatim |
| `Board` | Pod Room | 4 lanes, drag + keyboard move menu, lane-3 auto-journal toast |
| `YemenMap` | `yemen-map.js` | canvas, port as ref-driven component |
| `SealBadge`, `BirdMark` | `kayan-mark.js`, assets | header `kayan-logo-gold.png`, hero `kayan-bird-elite-gold.png`, footer `kayan-mark-cream.png`, per-line birds |
| `LineAudio` (optional) | `kayan-line-audio.js` | consent-gated maqam cues; OFF by default; never autoplay |

## §4 Porting method (per page, mechanical)

1. Open the `.dc.html`; the template sits between `<x-dc>` tags; page logic in the `<script data-dc-script>` class. `{{ holes }}` = state/props; `sc-for`/`sc-if` = map/conditional; `style-hover` etc. = pseudo-states.
2. Recreate structure with token classes; keep exact values (the tokens cover 95% — anything else stays a literal, flagged in review).
3. `renderVals()` state → React hooks + the API of `04-API.md` (mapping table §13). Demo seams (`setTimeout` fake OTP, localStorage) are replaced, UI states kept.
4. Copy through the extraction baseline (`09-CONTENT-I18N.md §4`), never retyped.
5. Fidelity review, both languages, three widths → `PROGRESS.md`.

`support.js` is the design runtime — reference only, never shipped.

## §5 Motion spec (global, exactly this)

Reveal + card hover + sheen + `kIn` entrance (fade/14px rise .8s, stagger .15s) as tokenized utilities; departure wipe on Access→Space (gold overlay wipe, then route); `prefers-reduced-motion: reduce` kills ALL of it globally (transition/animation none, sheen off, wipe replaced by instant route). Focus: `outline:2px solid #C9A227; outline-offset:2px` on `:focus-visible` only.

## §6 RTL rules

Root `dir="rtl" lang="ar"`; logical properties ONLY (`padding-inline-start`, `margin-inline-end`, `inset-inline-start`, `border-inline-start`, `text-align:start`) — physical left/right are lint errors (`stylelint` rule / eslint-plugin). Mono/EN runs wrapped `dir="ltr"`; BiDi isolates around codes in prose (`09 §7`); icons that imply direction flip via `rtl:` variant; `/en` twins render `dir="ltr"` from the same components.

## §7 Islands & heavy pages

- **Atlas**: vendored `public/vendor/d3.v7.min.js` + `topojson-client` + `world-atlas` TopoJSON committed to the repo. Real astronomical terminator recomputed every minute on Aden time — port the design's solar-position math verbatim; verify against the reference per QA. `next/dynamic` `ssr:false`, loaded only on `/atlas`.
- **Dimension**: vendored three.js (replace deprecated `THREE.Clock` with `THREE.Timer`). Keep built-in fallbacks: reduced-motion → static frames; no WebGL → designed fallback panel. Never referenced by any critical path.
- **Planet meter**: reads real `performance.getEntriesByType('resource')` transfer sizes + SWDM v4 constants (0.81 kWh/GB × 494 g/kWh, 1 g/view budget); shows the page's actual number.
- **Home photos**: mirror the 7 Wikimedia Commons images into `public/img/aden/` (originals + AVIF/WebP derivatives via `sharp` at build); attribution lines in the Legal colophon. No hotlinks anywhere.

## §8 Meta, SEO, PWA-lite

- `sitemap.xml` (public routes + twins with `hreflang` ar/en pairs), `robots.txt` (allow public, disallow `/space`, `/pod`, `/portal`, `/apply` internals, admin host entirely).
- OG: 1200×630 per page family (Home, Lines, People, Planet, K4Y) — dark green field, gold mark, page title in Alexandria; generated at build (satori or committed PNGs). Twitter `summary_large_image`.
- Favicons: `favicon.ico`, `icon.svg` (gold bird mark), `apple-touch-icon.png` 180, `manifest.webmanifest` (name كيان, theme `#052E2B`, background `#F4EEDD`).
- Per-page `<title>`/description AR (EN on twins); canonical URLs; `theme-color #052E2B`.
- Admin host: `noindex` header + robots disallow all.

## §9 Performance practices (budgets live in `10-QA §6`)

Server components for public pages (zero client JS unless the page owns an island); `next/image` with AVIF/WebP + explicit sizes (no CLS); fonts per `09 §6`; route-level code splitting — Access/Apply/Portal/Spaces/Pod/Admin each their own bundle; no polyfills for evergreen browsers; SSE not polling where live data exists; memoized ledger/board renders; `Cache-Control: immutable` on hashed assets.
