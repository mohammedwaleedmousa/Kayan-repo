# Kayan React migration

## Audit summary

The production route list comes from `HANDOFF.md` and the route table in the design handoff. The original `.dc.html` pages remain the visual and behavioural source of truth. Brand chapters, dossiers, print/deck artifacts, `Canvas*`, `scraps/`, screenshots, and the duplicated `design_handoff_kayan_website` directory are retained as references and are not public routes.

Shared runtime dependencies are `support.js`, `kayan-registry*.js`, `kayan-card.js`, `kayan-mark.js`, `kayan-compass.js`, `image-slot.js`, `kayan-line-audio.js`, `yemen-map.js`, `rp-core.js`, `rp-fixed.js`, and `rp-range.js`. State contracts use same-origin `localStorage` and `sessionStorage`.

## Fidelity strategy

React Router owns all 31 production routes, and every route now mounts a native React page. The native pages preserve the approved source DOM, CSS, assets, fonts, responsive rules, storage contracts, animations, and interactions. Shared native renderers handle the original DC templates and plain authored pages without an iframe, full-document injection, or `LegacyPage` route dependency.

The original source pages and `public/legacy` remain unchanged as visual and behavioural references. Internal legacy-style links are translated to the corresponding clean React routes.

## Commands

```bash
npm install
npm run dev
npm run build
```
