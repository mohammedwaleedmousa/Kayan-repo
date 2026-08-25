# Kayan React migration

## Audit summary

The production route list comes from `HANDOFF.md` and the route table in the design handoff. The original `.dc.html` pages remain the visual and behavioural source of truth. Brand chapters, dossiers, print/deck artifacts, `Canvas*`, `scraps/`, screenshots, and the duplicated `design_handoff_kayan_website` directory are retained as references and are not public routes.

Shared runtime dependencies are `support.js`, `kayan-registry*.js`, `kayan-card.js`, `kayan-mark.js`, `kayan-compass.js`, `image-slot.js`, `kayan-line-audio.js`, `yemen-map.js`, `rp-core.js`, `rp-fixed.js`, and `rp-range.js`. State contracts use same-origin `localStorage` and `sessionStorage`.

## Fidelity strategy

React Router owns the application routes. Each route mounts its approved page in a same-origin compatibility boundary from `public/legacy`. This deliberately retains the exact authored DOM, inline CSS, DC runtime, animations, responsive rules, storage contracts, and interactions. A React navigation bridge maps internal `.html` links back to clean application routes.

This is an incremental migration boundary: individual DC screens can later be replaced route-by-route with native JSX after screenshot and interaction parity tests exist. Rewriting the complex templates and direct-DOM runtime all at once would create unnecessary visual and behavioural risk.

## Commands

```bash
npm install
npm run dev
npm run build
```
