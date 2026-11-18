# `TEST_INFRA.md` — Opaque-Box E2E Verification Architecture ("El Ensamblaje")

**Target Application:** `/home/n/Escritorio/Proyectos/proyecto-ing-software/v3/presentations/iv_entrega_ensamblaje`  
**Authoritative Contracts:**
- `/home/n/Escritorio/Proyectos/proyecto-ing-software/v3/.agents/teamwork/ORIGINAL_REQUEST.md` (`R1`–`R5`, Acceptance Criteria)
- `/home/n/Escritorio/Proyectos/proyecto-ing-software/v3/.agents/teamwork/teamwork_preview_orchestrator_1/PROJECT.md` (`§ Interface Contracts`, `data-testid` DOM contracts)
- `/home/n/.gemini/antigravity/brain/f4c6c722-50f1-4176-972f-f87aee67d20a/propuesta_presentacion_interactiva_MREC.md` (36 slides `S00`–`S35`, 4 Acts, keyboard shortcuts, PDF map)
- `/home/n/Escritorio/Proyectos/proyecto-ing-software/v3/MotoRepuestosElCentenario_Angel_Noel_Mendell/III Entrega (13-16)/03_Modelo_Financiero_mrec.xlsx` (9 sheets & verified financial formulas/values)
- `/home/n/Escritorio/Proyectos/proyecto-ing-software/v3/MREC/docs/evidencias/` (verbatim test/load/backup logs)

---

## 1. Opaque-Box Principles & Scope Boundaries

1. **Zero `src/` coupling:** Tests never import, read, or instrument modules in `src/`. Every test runs strictly against the production static bundle in `dist/` served over `http://127.0.0.1:<ephemeral-port>/` inside headless Chromium (`/usr/bin/google-chrome` via `playwright-core`).
2. **Zero project-config mutation:** All files under `tests/` use native `.mjs` ES Modules (executed by Node `v22+`), dynamically importing `../../node_modules/playwright-core/index.mjs` without altering `package.json`, `vite.config.js`, `index.html`, `public/`, or `src/`.
3. **100% Offline Network Isolation:** Every Playwright `BrowserContext` installs `context.route('**/*', ...)` to **abort and fail** any request whose URL does not start with `http://127.0.0.1:<port>/`, `data:`, or `blob:`.
4. **Zero-Tolerance Telemetry:** Every test session attaches listeners before `page.goto()`:
   - `console.error` -> `telemetry.consoleErrors` (must be `0`)
   - `pageerror` -> `telemetry.pageErrors` (must be `0`)
   - HTTP response `status >= 400` -> `telemetry.httpErrors` (must be `0`)
   - `requestfailed` -> `telemetry.requestFailures` (must be `0`)
   - Non-localhost blocked requests -> `telemetry.blockedExternalRequests` (must be `0`)
5. **Compositor-Level WebGL Verification:** Because Three.js `WebGLRenderer` uses `preserveDrawingBuffer: false` by default, `canvas.toDataURL()` outside a render callback can yield empty pixels. `harness.mjs` captures `page.screenshot({ clip: canvasBox })` via Chromium's compositor, decodes PNG `IDAT` chunks using `node:zlib` (`inflateSync`) + PNG scanline unfiltering (`None`, `Sub`, `Up`, `Average`, `Paeth`), and checks:
   - **Non-blank rendering:** `stdDev > 2.0` and `nonBgRatio > 0.01` (`> 1%` non-uniform pixels).
   - **Cross-act visual progression:** L1 RGB pixel difference (`changedPixelRatio > 0.02`, i.e. `> 2%` changed pixels) across Prologue (`S00`) and Acts I–IV (`S06`, `S11`, `S20`, `S27`, `S34`).

---

## 2. Runner Architecture (`tests/`)

```
tests/
├── run-e2e.mjs           # CLI entrypoint (--tier=1,2,3,4, --filter=<substr>, --json=<path>, --help)
├── lib/
│   ├── server.mjs        # Built-in node:http server for ../dist on 127.0.0.1:0 (MIME types + HTTP Range for .pdf)
│   ├── harness.mjs       # Dynamic playwright-core import, headless Chrome + SwiftShader WebGL, route blocker, PNG decoder
│   └── assertions.mjs    # Opaque-box DOM, odometer, navigation, drawer, and numerical assertion helpers
├── tier1.mjs             # 90 Core Happy-Path cases (6 × 15 features)
├── tier2.mjs             # 75 Edge, Negative, Boundary & Resilience cases (5 × 15 features)
├── tier3.mjs             # 20 Pairwise Cross-Feature Integration cases
└── tier4.mjs             # 8 Full End-to-End Thesis Defense & Failure-Recovery journeys
```

### How to Run

```bash
# Help & usage (works without dist/ built)
node tests/run-e2e.mjs --help

# Run full 193-test suite against built dist/
node tests/run-e2e.mjs

# Run specific tier(s) or filter by test ID / title
node tests/run-e2e.mjs --tier=1,2
node tests/run-e2e.mjs --filter=T1-15
node tests/run-e2e.mjs --tier=4 --json=e2e-summary.json
```

---

## 3. Feature Inventory (`N = 15` User-Facing Features)

| ID | User-Facing Feature | Req / AC | Primary Contract / Selectors |
|---|---|---|---|
| **UF-01** | Offline Build & Zero-External-Request Integrity | R5 / AC-1, AC-2 | `dist/index.html`, `context.route` blocker, `console.error`, `pageerror`, HTTP `< 400`, local fonts/PDF/XLSX |
| **UF-02** | Prologue & Ignition Sequence (`S00`–`S01`) | R1, R2 / AC-3 | `S00` portada (`Moto Repuestos El Centenario`, `UNI`, `4S1-COM-S`, 3 carnets), `Enter` / `btn-start-route`, `S01` 4 deliveries / 20 chapters |
| **UF-03** | Full 36-Slide Spanish Narrative (`S00`–`S35`) | R1 / AC-3 | `[data-testid="slide-container"][data-slide-id="S00".."S35"]`, `slide-title`, truthful facts, Spanish UI |
| **UF-04** | Persistent Chrome, Odometer, Mini-Moto & Shortcuts | R1 / AC-3 | `header-bar`, `act-chapter-label`, `odometer`, `mini-moto-progress`, `presenter-badge`, `btn-prev/next`, `btn-notes`, `btn-fullscreen`, keys |
| **UF-05** | Persistent 3D WebGL Stage, Progressive Assembly & Fallbacks | R2 / AC-5 | `canvas[data-testid="stage-webgl"]` box & PNG variance across acts, `[data-testid="stage-fallback"]` when WebGL disabled, `prefers-reduced-motion` |
| **UF-06** | 3D Chapter Scenes, Interactive Inspection & Act Transitions | R2 / AC-5 | Intra-act transitions, inter-act transitions (`S01→S02`, `S15→S16`, `S21→S22`, `S29→S30`), no stuck overlay, interactive 3D labels (`S06`, `S15`, `S21`) |
| **UF-07** | Overview Highway Map (`O`) | R1 / AC-4 | `O` / `btn-overview`, `overview-modal`, `overview-chapter-01..20`, `overview-slide-S00..S35`, direct jump |
| **UF-08** | Exact Reference Chips & Documento PDF Drawer (`D`) | R3 / AC-6 | `ref-chip`, `D` key, `evidence-drawer[data-active-tab="documento"]`, `pdf-canvas`, `pdf-page-indicator`, `pdf-page-input`, `pdf-search-input`, invariant `pathname` |
| **UF-09** | Excel 9-Sheet Financial Drawer (`E`) | R3 / AC-7 | `E` key / `btn-drawer-excel`, 9 `excel-sheet-tab-<Name>`, `excel-formula-bar`, `excel-grid`, `excel-download-link` |
| **UF-10** | Offline Sistema POS Drawer (`S`) | R3 / AC-8 | `S` key / `btn-drawer-sistema`, `sistema-pos-view`, `sistema-role-select`, `sistema-open-shift`, `sistema-add-item`, `sistema-confirm-sale`, `sistema-receipt` |
| **UF-11** | Evidencias Drawer (Regression, Load, Backup) | R3 / AC-8 | `btn-drawer-evidencias` / `drawer-tab-evidencias`, `evidencias-list`, `evidencias-detail` (`104→111→113→120`, `20,000`, `500`, `backup_database`) |
| **UF-12** | S07 SABD Trigger & S10/S12/S13 Planning Simulations | R4 / AC-9 | `sim-s07-stock/sell-1/sell-5/reset/status`, S10/S12 matrices (`72/96/74`, `88/79/78/54/54`), `sim-s13-tab-wbs/cpm/gantt/raci`, `sim-s13-panel` |
| **UF-13** | S20 Concurrency Race & Ignition Climax | R4 / AC-10 | `sim-s20-run-race`, `sim-s20-stock` (`0`), `sim-s20-result` (`1` confirmed / `1` rejected `quantity__gte`), `sim-s20-metrics` (`0.029 s`, `1.142 s`, `120 / 120`) |
| **UF-14** | S25 M/M/c Queue Toggle & S31 Traceability Matrix | R4 / AC-11 | `sim-s25-toggle-2/4`, `sim-s25-wq` (`22.8 min` ↔ `20.6 s`), `sim-s25-rho` (`95%` ↔ `47.5%`), `sim-s31-matrix`, `16 × sim-s31-row` |
| **UF-15** | S28 Financial Sensitivity & TMAR Live Slider | R4 / AC-12 | `sim-s28-scenario-pesimista/base/optimista`, `sim-s28-tmar-slider`, `sim-s28-tmar-value`, `sim-s28-van` (`$15,176.26`), `sim-s28-tir` (`50.84%`) |

---

## 4. 4-Tier Coverage Summary (`193` Test Cases Total)

Threshold check: `N = 15` → required `>= 11*15 + max(5, ceil(15/2)) = 165 + 8 = 173`.  
Implemented total: **`90` (Tier 1) + `75` (Tier 2) + `20` (Tier 3) + `8` (Tier 4) = `193` test cases**.

- **Tier 1 (`tests/tier1.mjs` — 90 cases):** 6 core functional happy-path cases per feature (`T1-01-01`..`T1-15-06`).
- **Tier 2 (`tests/tier2.mjs` — 75 cases):** 5 edge, negative, boundary, clamping, WebGL-failure, reduced-motion, and discrepancy-audit cases per feature (`T2-01-01`..`T2-15-05`).
- **Tier 3 (`tests/tier3.mjs` — 20 cases):** Pairwise cross-feature integration tests (`T3-01`..`T3-20`) combining navigation, Overview, WebGL/fallback, all 4 drawers, presenter notes, keyboard-only control, and R4 simulations.
- **Tier 4 (`tests/tier4.mjs` — 8 cases):** Full thesis defense & adversarial recovery journeys (`T4-01`..`T4-08`).
