import assert from 'node:assert/strict';
import { createIsolatedSession, captureElementPng } from './lib/harness.mjs';
import {
  assertMatchesAll,
  assertNoTelemetryErrors,
  assertPathnameInvariant,
  closeDrawer,
  closeOverview,
  getCurrentSlideId,
  getOdometerState,
  getPathname,
  navigateToSlide,
  openDrawerTab,
  openOverview,
  parseNumericValue,
  stepNext,
  waitForPdfRendered,
  waitForSlide
} from './lib/assertions.mjs';

function makeTest(id, title, fn) {
  return { id, tier: 3, feature: 'Integration', title, run: fn };
}

export function getTier3Tests() {
  const tests = [
    makeTest('T3-01', 'Overview (O) -> Act II (S16) + WebGL + Chrome sync', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openOverview(page);
        await page.locator('[data-testid="overview-chapter-08"]').click();
        await page.locator('[data-testid="overview-modal"]').waitFor({ state: 'hidden', timeout: 5000 });
        await waitForSlide(page, 'S16');
        assert.match(await page.locator('[data-testid="act-chapter-label"]').innerText(), /Acto\s*II\b/i);
        assert.match(await page.locator('[data-testid="presenter-badge"]').innerText(), /Ángel/i);
        assert.equal((await getOdometerState(page)).index0, 16);
        const cap = await captureElementPng(page, 'canvas[data-testid="stage-webgl"]');
        assert.ok(cap.stats.stdDev > 2.0);
        assertNoTelemetryErrors(telemetry, 'T3-01');
      } finally {
        await session.close();
      }
    }),

    makeTest('T3-02', 'Slide Ref Chip (S10) -> Documento (pág. 117) -> Esc -> Next (S11)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const initPath = await getPathname(page);
        await navigateToSlide(page, 'S10');
        await page.locator('[data-testid="ref-chip"][data-ref-type="pdf"]').first().click();
        await waitForPdfRendered(page, 117);
        await assertPathnameInvariant(page, initPath, 'T3-02');
        await closeDrawer(page, 'esc');
        await stepNext(page, 1);
        await waitForSlide(page, 'S11');
        assertNoTelemetryErrors(telemetry, 'T3-02');
      } finally {
        await session.close();
      }
    }),

    makeTest('T3-03', 'S28 Sensitivity (Pesimista 12%) -> Comprobar en Excel (Flujos) -> Close preserves Pesimista', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S28');
        await page.locator('[data-testid="sim-s28-scenario-pesimista"]').click();
        await page.locator('button, [role="button"]').filter({ hasText: /Comprobar en Excel/i }).first().click();
        await page.waitForFunction(() => document.querySelector('[data-testid="evidence-drawer"]')?.getAttribute('data-active-tab') === 'excel');
        assert.match(await page.locator('[data-testid="excel-grid"]').innerText(), /15[.,]176/);
        await closeDrawer(page, 'esc');
        const van = parseNumericValue(await page.locator('[data-testid="sim-s28-van"]').innerText());
        assert.ok(Math.abs(van - 4361.8) < 2.0, `Expected preserved Pesimista VAN ~4361.86, got ${van}`);
        assertNoTelemetryErrors(telemetry, 'T3-03');
      } finally {
        await session.close();
      }
    }),

    makeTest('T3-04', 'S17 UX (Ver en vivo) -> Sistema POS checkout (F-00000001) -> Switch to Evidencias', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S17');
        const liveBtn = page.locator('button, [role="button"]').filter({ hasText: /Ver en vivo/i }).first();
        if ((await liveBtn.count()) > 0) {
          await liveBtn.click();
        } else {
          await openDrawerTab(page, 'sistema', 'button');
        }
        await page.locator('[data-testid="sistema-pos-view"]').waitFor({ state: 'visible', timeout: 5000 });
        await page.locator('[data-testid="sistema-open-shift"]').click();
        await page.locator('[data-testid="sistema-add-item"]').first().click();
        await page.locator('[data-testid="sistema-confirm-sale"]').click();
        assert.match(await page.locator('[data-testid="sistema-receipt"]').innerText(), /F-\d{8}/);
        await openDrawerTab(page, 'evidencias', 'button');
        assert.equal(await page.locator('[data-testid="evidence-drawer"]').getAttribute('data-open'), 'true');
        assertNoTelemetryErrors(telemetry, 'T3-04');
      } finally {
        await session.close();
      }
    }),

    makeTest('T3-05', 'S15 Exploded UML (M-SEQ-01) -> Documento (pág. 191) -> Advance across Act I->II (S16)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S15');
        const umlBtn = page.locator('button, [role="button"], .scene-label').filter({ hasText: /M-SEQ-01/i }).first();
        if ((await umlBtn.count()) > 0) {
          await umlBtn.click();
          await waitForPdfRendered(page);
          await closeDrawer(page, 'esc');
        }
        await stepNext(page, 1);
        await waitForSlide(page, 'S16');
        assert.match(await page.locator('[data-testid="act-chapter-label"]').innerText(), /Acto\s*II\b/i);
        assertNoTelemetryErrors(telemetry, 'T3-05');
      } finally {
        await session.close();
      }
    }),

    makeTest('T3-06', 'S07 Trigger (Vender 1 -> 2) -> Documento (pág. 33) -> Close -> Vender 5 (RAISE EXCEPTION)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S07');
        await page.locator('[data-testid="sim-s07-sell-1"]').click();
        assert.match(await page.locator('[data-testid="sim-s07-stock"]').innerText(), /\b2\b/);
        await openDrawerTab(page, 'documento', 'key');
        await waitForPdfRendered(page);
        await closeDrawer(page, 'key-d');
        await page.locator('[data-testid="sim-s07-sell-5"]').click();
        assert.match(await page.locator('[data-testid="sim-s07-stock"]').innerText(), /\b2\b/);
        assert.match(await page.locator('[data-testid="sim-s07-status"]').innerText(), /RAISE EXCEPTION|45000/i);
        assertNoTelemetryErrors(telemetry, 'T3-06');
      } finally {
        await session.close();
      }
    }),

    makeTest('T3-07', 'S25 Toggle (4 POS) -> Excel (Beneficios) -> Close -> Toggle (2 cajas)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S25');
        await page.locator('[data-testid="sim-s25-toggle-4"]').click();
        await openDrawerTab(page, 'excel', 'key');
        await page.locator('[data-testid="excel-sheet-tab-Beneficios"]').click();
        assert.match(await page.locator('[data-testid="excel-grid"]').innerText(), /10[.,]400|4[.,]239/);
        await closeDrawer(page, 'esc');
        assert.match(await page.locator('[data-testid="sim-s25-wq"]').innerText(), /20[.,]6\s*s/);
        await page.locator('[data-testid="sim-s25-toggle-2"]').click();
        assert.match(await page.locator('[data-testid="sim-s25-wq"]').innerText(), /22[.,]8\s*min/);
        assertNoTelemetryErrors(telemetry, 'T3-07');
      } finally {
        await session.close();
      }
    }),

    makeTest('T3-08', 'S20 Concurrency Race -> Evidencias (500 ventas) -> Close -> Repeat Race', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S20');
        await page.locator('[data-testid="sim-s20-run-race"]').click();
        await page.waitForFunction(() => /\b0\b/.test(document.querySelector('[data-testid="sim-s20-stock"]')?.textContent || ''));
        await openDrawerTab(page, 'evidencias', 'button');
        await page.locator('[data-testid="evidencias-list"] button, [data-testid="evidencias-list"] [role="button"], [data-testid="evidencias-list"] li').filter({ hasText: /500|concurrencia/i }).first().click();
        assert.match(await page.locator('[data-testid="evidencias-detail"]').innerText(), /1[.,]142/);
        await closeDrawer(page, 'esc');
        await page.locator('[data-testid="sim-s20-run-race"]').click();
        await page.waitForFunction(() => /quantity__gte/i.test(document.querySelector('[data-testid="sim-s20-result"]')?.textContent || ''));
        assertNoTelemetryErrors(telemetry, 'T3-08');
      } finally {
        await session.close();
      }
    }),

    makeTest('T3-09', 'Mini-Moto Progress Click -> Presenter Notes (P) -> Next Slide sync', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S20');
        const seg = page.locator('[data-testid="mini-moto-progress"] [role="button"], [data-testid="mini-moto-progress"] button, [data-testid="mini-moto-progress"] [data-slide]').first();
        await seg.click();
        const jumpedId = await getCurrentSlideId(page);
        await page.keyboard.press('p');
        const notes = page.locator('[data-testid="presenter-notes"], [aria-label*="Notas"], .presenter-notes').first();
        await notes.waitFor({ state: 'visible', timeout: 5000 });
        await stepNext(page, 1);
        assert.notEqual(await getCurrentSlideId(page), jumpedId);
        assertNoTelemetryErrors(telemetry, 'T3-09');
      } finally {
        await session.close();
      }
    }),

    makeTest('T3-10', 'prefers-reduced-motion: reduce + Cross-Act (S15->S16) + Documento Drawer (D)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin, { reducedMotion: 'reduce' });
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S15');
        await stepNext(page, 1);
        await waitForSlide(page, 'S16');
        await openDrawerTab(page, 'documento', 'key');
        const dims = await waitForPdfRendered(page);
        assert.ok(dims.hasNonEmptyPixels);
        await closeDrawer(page, 'esc');
        assertNoTelemetryErrors(telemetry, 'T3-10');
      } finally {
        await session.close();
      }
    }),

    makeTest('T3-11', 'WebGL Failure Fallback + S00 -> S20 -> S28 -> S35 + Simulations', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin, { disableWebGL: true });
      try {
        const { page, telemetry } = session;
        await page.locator('[data-testid="stage-fallback"]').waitFor({ state: 'visible', timeout: 8000 });
        await navigateToSlide(page, 'S20');
        await page.locator('[data-testid="sim-s20-run-race"]').click();
        await page.waitForFunction(() => /\b0\b/.test(document.querySelector('[data-testid="sim-s20-stock"]')?.textContent || ''));
        await navigateToSlide(page, 'S28');
        await page.locator('[data-testid="sim-s28-scenario-optimista"]').click();
        assert.match(await page.locator('[data-testid="sim-s28-van"]').innerText(), /24[.,\s]?548/);
        await navigateToSlide(page, 'S35');
        assertNoTelemetryErrors(telemetry, 'T3-11');
      } finally {
        await session.close();
      }
    }),

    makeTest('T3-12', 'S30 9-Sheet Cards -> Excel (Capacidades) -> Formula Bar + Download Link', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S30');
        await page.locator('[data-testid="slide-container"] button, [data-testid="slide-container"] [role="button"]').filter({ hasText: /Capacidades/i }).first().click();
        await page.waitForFunction(() => document.querySelector('[data-testid="evidence-drawer"]')?.getAttribute('data-active-tab') === 'excel');
        assertMatchesAll(await page.locator('[data-testid="excel-grid"]').innerText(), [/58/, /1[.,]?000/], 'T3-12 Capacidades');
        const href = await page.locator('[data-testid="excel-download-link"]').getAttribute('href');
        assert.ok(href && href.includes('03_Modelo_Financiero_mrec.xlsx'));
        assertNoTelemetryErrors(telemetry, 'T3-12');
      } finally {
        await session.close();
      }
    }),

    makeTest('T3-13', 'S23 Rack/Backup -> Excel (Capacidades) -> Evidencias (Backup SHA-256)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S23');
        await openDrawerTab(page, 'excel', 'key');
        await page.locator('[data-testid="excel-sheet-tab-Capacidades"]').click();
        assert.match(await page.locator('[data-testid="excel-grid"]').innerText(), /58/);
        await openDrawerTab(page, 'evidencias', 'button');
        await page.locator('[data-testid="evidencias-list"] button, [data-testid="evidencias-list"] [role="button"], [data-testid="evidencias-list"] li').filter({ hasText: /respaldo|backup|usb/i }).first().click();
        assert.match(await page.locator('[data-testid="evidencias-detail"]').innerText(), /SHA-256/);
        assertNoTelemetryErrors(telemetry, 'T3-13');
      } finally {
        await session.close();
      }
    }),

    makeTest('T3-14', 'S26 COCOMO (8.757 KLOC, $3,500) -> Excel (COCOMO) -> Documento (pág. 314)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S26');
        await openDrawerTab(page, 'excel', 'key');
        await page.locator('[data-testid="excel-sheet-tab-COCOMO"]').click();
        assertMatchesAll(await page.locator('[data-testid="excel-grid"]').innerText(), [/8[.,]757/, /3[.,]500/], 'T3-14 COCOMO');
        await openDrawerTab(page, 'documento', 'button');
        await page.locator('[data-testid="pdf-page-input"]').fill('314');
        await page.locator('[data-testid="pdf-page-input"]').press('Enter');
        await waitForPdfRendered(page, 314);
        assertNoTelemetryErrors(telemetry, 'T3-14');
      } finally {
        await session.close();
      }
    }),

    makeTest('T3-15', 'S24 DGA Proforma ($10,162.14) -> Excel (Infraestructura) -> Documento (pág. 300)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S24');
        await openDrawerTab(page, 'excel', 'key');
        await page.locator('[data-testid="excel-sheet-tab-Infraestructura"]').click();
        assert.match(await page.locator('[data-testid="excel-grid"]').innerText(), /10[.,]162[.,]14|7[.,]770[.,]09/);
        await openDrawerTab(page, 'documento', 'button');
        await page.locator('[data-testid="pdf-page-input"]').fill('300');
        await page.locator('[data-testid="pdf-page-input"]').press('Enter');
        await waitForPdfRendered(page, 300);
        assertNoTelemetryErrors(telemetry, 'T3-15');
      } finally {
        await session.close();
      }
    }),

    makeTest('T3-16', 'S31 Traceability Row Click -> Documento (pág. 345) -> Evidencias (regresión 120/120)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S31');
        await page.locator('[data-testid="sim-s31-row"]').first().click();
        await openDrawerTab(page, 'documento', 'key');
        await waitForPdfRendered(page);
        assert.match(await page.locator('[data-testid="pdf-page-indicator"]').innerText(), /345|346/);
        await openDrawerTab(page, 'evidencias', 'button');
        await page.locator('[data-testid="evidencias-list"] button, [data-testid="evidencias-list"] [role="button"], [data-testid="evidencias-list"] li').filter({ hasText: /regresi[oó]n|120/i }).first().click();
        assert.match(await page.locator('[data-testid="evidencias-detail"]').innerText(), /120/);
        assertNoTelemetryErrors(telemetry, 'T3-16');
      } finally {
        await session.close();
      }
    }),

    makeTest('T3-17', 'Keyboard-Only Flow (Enter -> ArrowRight x5 -> D -> Esc -> E -> Esc -> O -> Esc)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await page.keyboard.press('Enter');
        await waitForSlide(page, 'S01');
        for (let i = 0; i < 5; i += 1) {
          await page.keyboard.press('ArrowRight');
        }
        await waitForSlide(page, 'S06');
        await openDrawerTab(page, 'documento', 'key');
        await closeDrawer(page, 'esc');
        await openDrawerTab(page, 'excel', 'key');
        await closeDrawer(page, 'esc');
        await openOverview(page);
        await closeOverview(page, 'esc');
        assert.equal(await getCurrentSlideId(page), 'S06');
        assertNoTelemetryErrors(telemetry, 'T3-17');
      } finally {
        await session.close();
      }
    }),

    makeTest('T3-18', 'S35 Epilogue Quick Buttons (Documento, Excel, Sistema) + Overview Jump', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S35');
        for (const tab of ['documento', 'excel', 'sistema']) {
          await openDrawerTab(page, tab, 'button');
          assert.equal(await page.locator('[data-testid="evidence-drawer"]').getAttribute('data-active-tab'), tab);
          await closeDrawer(page, 'esc');
        }
        await navigateToSlide(page, 'S10');
        assert.equal(await getCurrentSlideId(page), 'S10');
        assertNoTelemetryErrors(telemetry, 'T3-18');
      } finally {
        await session.close();
      }
    }),

    makeTest('T3-19', 'Viewport Resize (1280x720 -> 1024x640) While Documento Drawer Open', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S10');
        await openDrawerTab(page, 'documento', 'key');
        await waitForPdfRendered(page, 117);
        await page.setViewportSize({ width: 1024, height: 640 });
        await page.waitForTimeout(250);
        const drawerBox = await page.locator('[data-testid="evidence-drawer"]').boundingBox();
        assert.ok(drawerBox && drawerBox.width > 250 && drawerBox.height > 400);
        assertNoTelemetryErrors(telemetry, 'T3-19');
      } finally {
        await session.close();
      }
    }),

    makeTest('T3-20', 'Multi-Presenter Flow (Mendell S05 -> Ángel S06 -> Noel S08) + Presenter Notes (P)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S05');
        await page.keyboard.press('p');
        assert.match(await page.locator('[data-testid="presenter-badge"]').innerText(), /Mendell/i);
        await stepNext(page, 1);
        await waitForSlide(page, 'S06');
        assert.match(await page.locator('[data-testid="presenter-badge"]').innerText(), /Ángel/i);
        await navigateToSlide(page, 'S08');
        assert.match(await page.locator('[data-testid="presenter-badge"]').innerText(), /Noel/i);
        assertNoTelemetryErrors(telemetry, 'T3-20');
      } finally {
        await session.close();
      }
    })
  ];

  assert.equal(tests.length, 20, `Tier 3 must contain exactly 20 tests, got ${tests.length}`);
  return tests;
}
