# `TEST_READY.md` — Opaque-Box E2E Test Suite Readiness ("El Ensamblaje")

**Target Application:** `/home/n/Escritorio/Proyectos/proyecto-ing-software/v3/presentations/iv_entrega_ensamblaje`  
**Architecture Spec:** `TEST_INFRA.md`  
**Status:** **READY FOR M5 EXECUTION** *(Suite implemented and structurally verified; **has NOT yet been executed against a completed application** — M2, M3, and M4 modules are not yet built, so no passing E2E run is claimed here.)*

---

## 1. Execution Command

After building the completed application (`npm run build` producing `dist/`):

```bash
# Run the complete 193-test opaque-box E2E suite (Tiers 1–4)
node tests/run-e2e.mjs

# Optional targeted execution & reporting flags
node tests/run-e2e.mjs --help
node tests/run-e2e.mjs --tier=1,2
node tests/run-e2e.mjs --filter=T1-15
node tests/run-e2e.mjs --tier=4 --json=e2e-summary.json
```

**Environment:** Executed with Node `v22+` (`tests/*.mjs` native ES modules), dynamic `playwright-core` import, `/usr/bin/google-chrome` headless with SwiftShader WebGL, and built-in `node:http` static server over `127.0.0.1:<ephemeral-port>` with strict offline `context.route` blocking.

---

## 2. Suite Inventory (`193` Tests Across Tiers 1–4)

| Tier | File | Count | Coverage Scope |
|---|---|---|---|
| **Tier 1** | `tests/tier1.mjs` | **90** | Core functional happy-path cases (`6 × 15` features: `T1-01-01`..`T1-15-06`) |
| **Tier 2** | `tests/tier2.mjs` | **75** | Edge, negative, boundary, clamping, WebGL-fallback, `prefers-reduced-motion`, and data-truth cases (`5 × 15` features: `T2-01-01`..`T2-15-05`) |
| **Tier 3** | `tests/tier3.mjs` | **20** | Pairwise cross-feature integration journeys (`T3-01`..`T3-20`) |
| **Tier 4** | `tests/tier4.mjs` | **8** | Full end-to-end thesis defense & adversarial failure-recovery journeys (`T4-01`..`T4-08`) |
| **Total** | `tests/run-e2e.mjs` | **193** | **All 15 features (`UF-01`..`UF-15`)** (exceeds `11N + max(5, ceil(N/2)) = 173` threshold) |

### Support Modules (`tests/lib/`)
- `tests/lib/server.mjs` — Local `node:http` static server for `dist/` on `127.0.0.1:0` with MIME types and HTTP `Range` support for PDF streaming.
- `tests/lib/harness.mjs` — Headless Chromium + SwiftShader launcher, offline route blocker, zero-error telemetry collector (`console.error`, `pageerror`, HTTP `>= 400`, `requestfailed`, blocked external requests), and compositor PNG `IDAT` decoder for WebGL non-blank and cross-act visual progression checks.
- `tests/lib/assertions.mjs` — Opaque-box DOM, odometer, navigation, drawer, and numerical simulation assertion helpers.

---

## 3. Feature Coverage Matrix (`UF-01`..`UF-15`)

All 15 user-facing features defined in `TEST_INFRA.md` are covered across Tiers 1–4:

| Feature ID | Feature Name | Covered In |
|---|---|---|
| `UF-01` | Offline Build & Zero-External-Request Integrity | Tiers 1, 2, 3, 4 |
| `UF-02` | Prologue & Ignition Sequence (`S00`–`S01`) | Tiers 1, 2, 3, 4 |
| `UF-03` | Full 36-Slide Spanish Narrative (`S00`–`S35`) | Tiers 1, 2, 3, 4 |
| `UF-04` | Persistent Chrome, Odometer, Mini-Moto & Shortcuts | Tiers 1, 2, 3, 4 |
| `UF-05` | Persistent 3D WebGL Stage, Progressive Assembly & Fallbacks | Tiers 1, 2, 3, 4 |
| `UF-06` | 3D Chapter Scenes, Interactive Inspection & Act Transitions | Tiers 1, 2, 3, 4 |
| `UF-07` | Overview Highway Map (`O`) | Tiers 1, 2, 3, 4 |
| `UF-08` | Exact Reference Chips & Documento PDF Drawer (`D`) | Tiers 1, 2, 3, 4 |
| `UF-09` | Excel 9-Sheet Financial Drawer (`E`) | Tiers 1, 2, 3, 4 |
| `UF-10` | Offline Sistema POS Drawer (`S`) | Tiers 1, 2, 3, 4 |
| `UF-11` | Evidencias Drawer (Regression, Load, Backup) | Tiers 1, 2, 3, 4 |
| `UF-12` | S07 SABD Trigger & S10/S12/S13 Planning Simulations | Tiers 1, 2, 3, 4 |
| `UF-13` | S20 Concurrency Race & Ignition Climax | Tiers 1, 2, 3, 4 |
| `UF-14` | S25 M/M/c Queue Toggle & S31 Traceability Matrix | Tiers 1, 2, 3, 4 |
| `UF-15` | S28 Financial Sensitivity & TMAR Live Slider | Tiers 1, 2, 3, 4 |

---

## 4. Next Step (Milestone M5)

Once Milestones M2 (`src/three/`), M3 (`src/ui/`), and M4 (`src/drawers/`) are integrated into `src/main.js` and `npm run build` succeeds:
1. Execute `node tests/run-e2e.mjs` against the complete `dist/` bundle.
2. Confirm `193/193` tests pass with zero console errors, zero page errors, zero HTTP errors, and zero blocked external requests.
