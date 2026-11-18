import assert from 'node:assert/strict';
import { createIsolatedSession, captureElementPng, comparePngBuffers } from './lib/harness.mjs';
import {
  ALL_SLIDE_IDS,
  assertMatchesAll,
  assertNoTelemetryErrors,
  assertPathnameInvariant,
  closeDrawer,
  getCurrentSlideId,
  getOdometerState,
  getPathname,
  navigateToSlide,
  openDrawerTab,
  parseNumericValue,
  stepNext,
  waitForPdfRendered,
  waitForSlide
} from './lib/assertions.mjs';

function makeTest(id, title, fn) {
  return { id, tier: 4, feature: 'E2E-Journey', title, run: fn };
}

export function getTier4Tests() {
  const tests = [
    makeTest('T4-01', 'Full Live Thesis Defense Walkthrough (S00 -> S35 across Prologue & all 4 Acts)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const initPath = await getPathname(page);
        assert.equal(await getCurrentSlideId(page), 'S00');

        const actSnapshots = {};
        const snapshotSlides = new Set(['S00', 'S06', 'S20', 'S27', 'S34']);

        for (let i = 0; i < 36; i += 1) {
          const id = ALL_SLIDE_IDS[i];
          await waitForSlide(page, id);
          const odo = await getOdometerState(page);
          assert.equal(odo.index0, i, `Odometer mismatch at ${id}: ${odo.raw}`);

          if (i >= 1 && i <= 34) {
            const chipCount = await page.locator('[data-testid="ref-chip"]').count();
            assert.ok(chipCount >= 1, `Missing ref-chip on content slide ${id}`);
          }

          if (snapshotSlides.has(id)) {
            await page.waitForTimeout(350);
            const cap = await captureElementPng(page, 'canvas[data-testid="stage-webgl"]');
            assert.ok(cap.stats.stdDev > 2.0, `Blank WebGL frame on ${id}`);
            actSnapshots[id] = cap.pngBuf;
          }

          if (i < 35) {
            if (i === 0) {
              await page.keyboard.press('Enter');
            } else {
              await page.locator('[data-testid="btn-next"]').click();
            }
          }
        }

        assert.equal(await getCurrentSlideId(page), 'S35');
        assert.ok(comparePngBuffers(actSnapshots.S00, actSnapshots.S06) > 0.02);
        assert.ok(comparePngBuffers(actSnapshots.S06, actSnapshots.S20) > 0.02);
        assert.ok(comparePngBuffers(actSnapshots.S20, actSnapshots.S27) > 0.02);
        assert.ok(comparePngBuffers(actSnapshots.S27, actSnapshots.S34) > 0.02);
        await assertPathnameInvariant(page, initPath, 'T4-01');
        assertNoTelemetryErrors(telemetry, 'T4-01');
      } finally {
        await session.close();
      }
    }),

    makeTest('T4-02', 'Jury Deep-Dive on Database & Concurrency (S06 -> S07 -> S20 -> Evidencias -> Documento)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S06');
        assertMatchesAll(await page.locator('[data-testid="slide-container"]').innerText(), ['Productos', 'Facturas', '8'], 'T4-02 S06');

        await stepNext(page, 1);
        await waitForSlide(page, 'S07');
        await page.locator('[data-testid="sim-s07-sell-1"]').click();
        assert.match(await page.locator('[data-testid="sim-s07-stock"]').innerText(), /\b2\b/);
        await page.locator('[data-testid="sim-s07-sell-5"]').click();
        assert.match(await page.locator('[data-testid="sim-s07-status"]').innerText(), /RAISE EXCEPTION|45000/i);
        assert.match(await page.locator('[data-testid="sim-s07-stock"]').innerText(), /\b2\b/);
        await page.locator('[data-testid="sim-s07-reset"]').click();
        assert.match(await page.locator('[data-testid="sim-s07-stock"]').innerText(), /\b3\b/);

        await openDrawerTab(page, 'documento', 'key');
        await waitForPdfRendered(page);
        await closeDrawer(page, 'esc');

        await navigateToSlide(page, 'S20');
        await page.locator('[data-testid="sim-s20-run-race"]').click();
        await page.waitForFunction(() => /\b0\b/.test(document.querySelector('[data-testid="sim-s20-stock"]')?.textContent || ''));
        assert.match(await page.locator('[data-testid="sim-s20-result"]').innerText(), /quantity__gte/);

        await openDrawerTab(page, 'evidencias', 'button');
        await page.locator('[data-testid="evidencias-list"] button, [data-testid="evidencias-list"] [role="button"], [data-testid="evidencias-list"] li').filter({ hasText: /500|concurrencia/i }).first().click();
        assert.match(await page.locator('[data-testid="evidencias-detail"]').innerText(), /1[.,]142/);
        assertNoTelemetryErrors(telemetry, 'T4-02');
      } finally {
        await session.close();
      }
    }),

    makeTest('T4-03', 'Jury Financial Audit & Sensitivity Interrogation (S24 -> S28 -> Excel 9 sheets)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S24');
        assert.match(await page.locator('[data-testid="slide-container"]').innerText(), /10[.,]162[.,]14/);

        await stepNext(page, 1);
        await waitForSlide(page, 'S25');
        await page.locator('[data-testid="sim-s25-toggle-4"]').click();
        assert.match(await page.locator('[data-testid="sim-s25-wq"]').innerText(), /20[.,]6\s*s/);

        await stepNext(page, 1);
        await waitForSlide(page, 'S26');
        assertMatchesAll(await page.locator('[data-testid="slide-container"]').innerText(), [/8[.,]757/, /3[.,]500/], 'T4-03 S26');

        await stepNext(page, 1);
        await waitForSlide(page, 'S27');
        assert.match(await page.locator('[data-testid="slide-container"]').innerText(), /13[.,]662[.,]14/);

        await stepNext(page, 1);
        await waitForSlide(page, 'S28');
        assert.match(await page.locator('[data-testid="sim-s28-van"]').innerText(), /15[.,\s]?176[.,]26/);

        await page.locator('[data-testid="sim-s28-scenario-pesimista"]').click();
        const slider = page.locator('[data-testid="sim-s28-tmar-slider"]');
        await slider.fill('30');
        await slider.dispatchEvent('input');
        assert.ok(parseNumericValue(await page.locator('[data-testid="sim-s28-van"]').innerText()) < 0);

        await page.locator('[data-testid="sim-s28-scenario-base"]').click();
        await slider.fill('12');
        await slider.dispatchEvent('input');
        assert.match(await page.locator('[data-testid="sim-s28-van"]').innerText(), /15[.,\s]?176[.,]26/);

        await page.locator('button, [role="button"]').filter({ hasText: /Comprobar en Excel/i }).first().click();
        await page.waitForFunction(() => document.querySelector('[data-testid="evidence-drawer"]')?.getAttribute('data-active-tab') === 'excel');
        for (const sheet of ['Resumen', 'COCOMO', 'Infraestructura', 'Flujos']) {
          await page.locator(`[data-testid="excel-sheet-tab-${sheet}"]`).click();
          assert.ok((await page.locator('[data-testid="excel-grid"]').innerText()).length > 20);
        }
        assertNoTelemetryErrors(telemetry, 'T4-03');
      } finally {
        await session.close();
      }
    }),

    makeTest('T4-04', 'Live POS & RBAC Security Demonstration (S17 -> Sistema POS -> S18 -> Evidencias)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S17');
        await openDrawerTab(page, 'sistema', 'button');
        await page.locator('[data-testid="sistema-open-shift"]').click();
        await page.locator('[data-testid="sistema-add-item"]').first().click();
        await page.locator('[data-testid="sistema-confirm-sale"]').click();
        assert.match(await page.locator('[data-testid="sistema-receipt"]').innerText(), /F-\d{8}/);

        const roleSelect = page.locator('[data-testid="sistema-role-select"]');
        const options = await roleSelect.locator('option').allInnerTexts();
        const bodegaIdx = options.findIndex((o) => /bodega/i.test(o));
        assert.ok(bodegaIdx >= 0);
        await roleSelect.selectOption({ index: bodegaIdx });
        await closeDrawer(page, 'esc');

        await stepNext(page, 1);
        await waitForSlide(page, 'S18');
        assertMatchesAll(await page.locator('[data-testid="slide-container"]').innerText(), ['30 min', '403'], 'T4-04 S18');

        await openDrawerTab(page, 'evidencias', 'button');
        await page.locator('[data-testid="evidencias-list"] button, [data-testid="evidencias-list"] [role="button"], [data-testid="evidencias-list"] li').filter({ hasText: /regresi[oó]n|120/i }).first().click();
        assert.match(await page.locator('[data-testid="evidencias-detail"]').innerText(), /120/);
        assertNoTelemetryErrors(telemetry, 'T4-04');
      } finally {
        await session.close();
      }
    }),

    makeTest('T4-05', 'Q&A Jump-Around From Epilogue (S35 -> O -> S13 -> S29 -> S31 -> S33)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S35');
        await openDrawerTab(page, 'documento', 'button');
        await closeDrawer(page, 'esc');
        await openDrawerTab(page, 'excel', 'button');
        await closeDrawer(page, 'esc');
        await openDrawerTab(page, 'sistema', 'button');
        await closeDrawer(page, 'esc');

        await navigateToSlide(page, 'S13');
        await page.locator('[data-testid="sim-s13-tab-raci"]').click();
        assert.match(await page.locator('[data-testid="sim-s13-panel"]').innerText(), /AAA|NIA|MNP/);

        await navigateToSlide(page, 'S29');
        assert.match(await page.locator('[data-testid="slide-container"]').innerText(), /Carlos Alberto Mendoza Guido/);

        await navigateToSlide(page, 'S31');
        assert.equal(await page.locator('[data-testid="sim-s31-row"]').count(), 16);

        await navigateToSlide(page, 'S33');
        await openDrawerTab(page, 'documento', 'key');
        await waitForPdfRendered(page, 349);
        assertNoTelemetryErrors(telemetry, 'T4-05');
      } finally {
        await session.close();
      }
    }),

    makeTest('T4-06', 'Hostile Offline Network & PDF Deep-Jump Search Stress Test (6 chapters)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const initPath = await getPathname(page);
        await openDrawerTab(page, 'documento', 'key');

        const targets = [
          [10, 'Moto Repuestos'],
          [117, 'Matriz'],
          [185, 'M-UC-01'],
          [249, 'PostgreSQL'],
          [314, 'COCOMO'],
          [349, 'Dictamen']
        ];

        for (const [pageNum, query] of targets) {
          const pageInput = page.locator('[data-testid="pdf-page-input"]');
          await pageInput.fill(String(pageNum));
          await pageInput.press('Enter');
          const dims = await waitForPdfRendered(page, pageNum);
          assert.ok(dims.hasNonEmptyPixels, `PDF page ${pageNum} rendered empty`);

          const searchInput = page.locator('[data-testid="pdf-search-input"]');
          await searchInput.fill(query);
          await searchInput.press('Enter');
          await page.waitForTimeout(200);
          await assertPathnameInvariant(page, initPath, `T4-06 page ${pageNum}`);
        }
        assertNoTelemetryErrors(telemetry, 'T4-06');
      } finally {
        await session.close();
      }
    }),

    makeTest('T4-07', 'Accessibility & Degraded Hardware Resilience (reducedMotion + WebGL unavailable)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin, {
        reducedMotion: 'reduce',
        disableWebGL: true
      });
      try {
        const { page, telemetry } = session;
        await page.locator('[data-testid="stage-fallback"]').waitFor({ state: 'visible', timeout: 8000 });
        for (const id of ['S00', 'S06', 'S16', 'S25', 'S28', 'S35']) {
          await navigateToSlide(page, id);
        }
        await navigateToSlide(page, 'S25');
        await page.locator('[data-testid="sim-s25-toggle-4"]').click();
        assert.match(await page.locator('[data-testid="sim-s25-wq"]').innerText(), /20[.,]6\s*s/);
        await navigateToSlide(page, 'S28');
        await openDrawerTab(page, 'excel', 'key');
        assert.equal(await page.locator('[data-testid="evidence-drawer"]').getAttribute('data-open'), 'true');
        assertNoTelemetryErrors(telemetry, 'T4-07');
      } finally {
        await session.close();
      }
    }),

    makeTest('T4-08', 'Interrupted Navigation & State Hygiene Recovery + Reload Verification', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S15');
        await page.locator('[data-testid="btn-next"]').click();
        await page.waitForTimeout(100);
        await navigateToSlide(page, 'S28');
        const slider = page.locator('[data-testid="sim-s28-tmar-slider"]');
        await slider.fill('22');
        await slider.dispatchEvent('input');
        await openDrawerTab(page, 'documento', 'key');
        await openDrawerTab(page, 'excel', 'button');
        await closeDrawer(page, 'esc');
        await page.reload({ waitUntil: 'domcontentloaded' });
        await waitForSlide(page, 'S00');
        const cap = await captureElementPng(page, 'canvas[data-testid="stage-webgl"]');
        assert.ok(cap.stats.stdDev > 2.0, 'WebGL failed to reinitialize cleanly after reload');
        assertNoTelemetryErrors(telemetry, 'T4-08');
      } finally {
        await session.close();
      }
    })
  ];

  assert.equal(tests.length, 8, `Tier 4 must contain exactly 8 tests, got ${tests.length}`);
  return tests;
}
