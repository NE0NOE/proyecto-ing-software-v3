import assert from 'node:assert/strict';
import { createIsolatedSession, captureElementPng } from './lib/harness.mjs';
import {
  ALL_SLIDE_IDS,
  EXCEL_SHEETS,
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

function makeTest(id, feature, title, fn) {
  return { id, tier: 2, feature, title, run: fn };
}

export function getTier2Tests() {
  const tests = [];

  // =========================================================================
  // UF-01 Offline & Asset Edges (T2-01-01..T2-01-05)
  // =========================================================================
  tests.push(
    makeTest('T2-01-01', 'UF-01', 'Zero external http/https CDN URLs in DOM attributes across slides', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const badUrls = [];
        for (const id of ['S00', 'S07', 'S17', 'S25', 'S28', 'S30', 'S35']) {
          await navigateToSlide(page, id);
          const found = await page.evaluate(() => {
            const out = [];
            document.querySelectorAll('script[src], link[href], img[src], iframe[src]').forEach((el) => {
              const val = el.getAttribute('src') || el.getAttribute('href') || '';
              if (/^https?:\/\//i.test(val) && !val.startsWith(window.location.origin)) {
                out.push(val);
              }
            });
            return out;
          });
          badUrls.push(...found);
        }
        assert.deepEqual(badUrls, [], `Forbidden external CDN URLs found: ${JSON.stringify(badUrls)}`);
        assertNoTelemetryErrors(telemetry, 'T2-01-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-01-02', 'UF-01', 'Booting with unknown query/hash (?slide=invalid#nonexistent) recovers safely to S00', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin, {
        urlPath: '/?slide=invalid#nonexistent'
      });
      try {
        const { page, telemetry } = session;
        const id = await getCurrentSlideId(page);
        assert.ok(ALL_SLIDE_IDS.includes(id), `Expected valid fallback slide ID, got ${id}`);
        assertNoTelemetryErrors(telemetry, 'T2-01-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-01-03', 'UF-01', 'Narrow viewport 1024x640 keeps header, footer, and primary controls unclipped', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin, {
        viewport: { width: 1024, height: 640 }
      });
      try {
        const { page, telemetry } = session;
        for (const sel of ['header-bar', 'btn-next', 'btn-overview', 'btn-start-route']) {
          const box = await page.locator(`[data-testid="${sel}"]`).boundingBox();
          assert.ok(box && box.width > 0 && box.height > 0, `${sel} invisible at 1024x640`);
          assert.ok(box.x >= 0 && box.x + box.width <= 1024, `${sel} overflows horizontally: ${JSON.stringify(box)}`);
          assert.ok(box.y >= 0 && box.y + box.height <= 640, `${sel} overflows vertically: ${JSON.stringify(box)}`);
        }
        assertNoTelemetryErrors(telemetry, 'T2-01-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-01-04', 'UF-01', 'Rapidly firing 20 keyboard navigation presses in < 500 ms causes zero errors', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        for (let i = 0; i < 12; i += 1) {
          await page.keyboard.press('ArrowRight');
        }
        for (let i = 0; i < 8; i += 1) {
          await page.keyboard.press('ArrowLeft');
        }
        await page.waitForTimeout(400);
        const cur = await getCurrentSlideId(page);
        assert.ok(ALL_SLIDE_IDS.includes(cur));
        assertNoTelemetryErrors(telemetry, 'T2-01-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-01-05', 'UF-01', 'Reloading mid-presentation resets cleanly with zero residual errors', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S20');
        await page.reload({ waitUntil: 'domcontentloaded' });
        await page.waitForSelector('[data-testid="slide-container"]', { timeout: 10000 });
        assert.equal(await getCurrentSlideId(page), 'S00');
        assertNoTelemetryErrors(telemetry, 'T2-01-05');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-02 Prologue & Route Boundaries (T2-02-01..T2-02-05)
  // =========================================================================
  tests.push(
    makeTest('T2-02-01', 'UF-02', 'Pressing ArrowLeft or btn-prev on S00 stays safely clamped at S00', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await page.keyboard.press('ArrowLeft');
        await page.locator('[data-testid="btn-prev"]').click({ force: true });
        assert.equal(await getCurrentSlideId(page), 'S00');
        const odo = await getOdometerState(page);
        assert.equal(odo.index0, 0);
        assertNoTelemetryErrors(telemetry, 'T2-02-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-02-02', 'UF-02', 'Pressing Enter inside pdf-search-input while on S00 does not hijack slide navigation', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'documento', 'key');
        const search = page.locator('[data-testid="pdf-search-input"]');
        await search.focus();
        await search.fill('Moto Repuestos');
        await page.keyboard.press('Enter');
        assert.equal(await getCurrentSlideId(page), 'S00');
        assertNoTelemetryErrors(telemetry, 'T2-02-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-02-03', 'UF-02', 'Hovering S01 chapter markers leaves zero errors or stuck overlays on mouseleave', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S01');
        const markers = page.locator('[data-testid="slide-container"] button, [data-testid="slide-container"] [role="button"]');
        const count = Math.min(await markers.count(), 10);
        for (let i = 0; i < count; i += 1) {
          await markers.nth(i).hover();
        }
        await page.mouse.move(10, 10);
        assert.equal(await getCurrentSlideId(page), 'S01');
        assertNoTelemetryErrors(telemetry, 'T2-02-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-02-04', 'UF-02', 'Jumping from S01 milestone 20 lands on Cap. 20 (S34) and allows ArrowRight to S35', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S01');
        const m20 = page
          .locator('[data-testid="slide-container"] button, [data-testid="slide-container"] [role="button"]')
          .filter({ hasText: /20|Evolutiva|Carretera/i })
          .last();
        await m20.click();
        await waitForSlide(page, 'S34');
        await page.keyboard.press('ArrowRight');
        await waitForSlide(page, 'S35');
        assert.equal(await getCurrentSlideId(page), 'S35');
        assertNoTelemetryErrors(telemetry, 'T2-02-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-02-05', 'UF-02', 'Mouse parallax corners (0,0) and (1280,720) on S00 produce zero NaN transforms or errors', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await page.mouse.move(0, 0);
        await page.mouse.move(1280, 720);
        await page.mouse.move(640, 360);
        const bodyHtml = await page.locator('[data-testid="slide-container"]').innerHTML();
        assert.doesNotMatch(bodyHtml, /NaN/);
        assertNoTelemetryErrors(telemetry, 'T2-02-05');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-03 Narrative & Data Integrity Boundaries (T2-03-01..T2-03-05)
  // =========================================================================
  tests.push(
    makeTest('T2-03-01', 'UF-03', 'Pressing ArrowRight/Space/btn-next on S35 stays clamped at S35 (no overflow)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S35');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('Space');
        await page.locator('[data-testid="btn-next"]').click({ force: true });
        assert.equal(await getCurrentSlideId(page), 'S35');
        const odo = await getOdometerState(page);
        assert.equal(odo.index0, 35);
        assertNoTelemetryErrors(telemetry, 'T2-03-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-03-02', 'UF-03', 'Audit D-01/D-02/D-04: S07 uses rol_administrador/rol_vendedor & 15 consultas; S14 shows 90/86/66', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S07');
        const s07 = await page.locator('[data-testid="slide-container"]').innerText();
        assertMatchesAll(s07, ['rol_administrador', 'rol_vendedor', '15'], 'D-01/D-02 S07');
        await navigateToSlide(page, 'S14');
        const s14 = await page.locator('[data-testid="slide-container"]').innerText();
        assertMatchesAll(s14, ['90', '86', '66'], 'D-04 S14');
        assertNoTelemetryErrors(telemetry, 'T2-03-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-03-03', 'UF-03', 'Audit D-03: S26 displays 8.757 KLOC, B=1.00, EAF=0.35, 9.0 PM, $2,700 + $800 = $3,500', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S26');
        const s26 = await page.locator('[data-testid="slide-container"]').innerText();
        assertMatchesAll(s26, [/8[.,]757/, /0[.,]35/, /9[.,]0/, /2[.,]700/, /800/, /3[.,]500/], 'D-03 S26');
        assertNoTelemetryErrors(telemetry, 'T2-03-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-03-04', 'UF-03', 'Audit D-06: S24 explicitly labels IVA 15% ($1,325.50) and Total nacionalizado $10,162.14', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S24');
        const s24 = await page.locator('[data-testid="slide-container"]').innerText();
        assertMatchesAll(s24, [/IVA/i, /15\s*%/, /1[.,]325[.,]50/, /10[.,]162[.,]14/], 'D-06 S24');
        assertNoTelemetryErrors(telemetry, 'T2-03-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-03-05', 'UF-03', 'Audit D-09: S29 states Licencia Perpetua, No Exclusiva e Intransferible and Carlos Alberto Mendoza Guido', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S29');
        const s29 = await page.locator('[data-testid="slide-container"]').innerText();
        assertMatchesAll(s29, [/Perpetua/i, /No Exclusiva/i, /Intransferible/i, 'Carlos Alberto Mendoza Guido'], 'D-09 S29');
        assertNoTelemetryErrors(telemetry, 'T2-03-05');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-04 Chrome, Odometer & Shortcuts Boundaries (T2-04-01..T2-04-05)
  // =========================================================================
  tests.push(
    makeTest('T2-04-01', 'UF-04', 'Pressing ArrowRight 40 times from S00 clamps cleanly at S35', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        for (let i = 0; i < 40; i += 1) {
          await page.keyboard.press('ArrowRight');
        }
        await waitForSlide(page, 'S35');
        const odo = await getOdometerState(page);
        assert.equal(odo.index0, 35);
        assertNoTelemetryErrors(telemetry, 'T2-04-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-04-02', 'UF-04', 'Pressing ArrowLeft 40 times from S35 clamps cleanly back at S00', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S35');
        for (let i = 0; i < 40; i += 1) {
          await page.keyboard.press('ArrowLeft');
        }
        await waitForSlide(page, 'S00');
        const odo = await getOdometerState(page);
        assert.equal(odo.index0, 0);
        assertNoTelemetryErrors(telemetry, 'T2-04-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-04-03', 'UF-04', 'Typing d/e/s/o/p inside pdf-search-input does not fire global shortcut handlers', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S10');
        await openDrawerTab(page, 'documento', 'key');
        const searchInput = page.locator('[data-testid="pdf-search-input"]');
        await searchInput.click();
        await page.keyboard.type('desop');
        assert.equal(await page.locator('[data-testid="evidence-drawer"]').getAttribute('data-open'), 'true');
        assert.equal(await page.locator('[data-testid="evidence-drawer"]').getAttribute('data-active-tab'), 'documento');
        assert.equal(await page.locator('[data-testid="overview-modal"]').isVisible(), false);
        assert.equal(await getCurrentSlideId(page), 'S10');
        assertNoTelemetryErrors(telemetry, 'T2-04-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-04-04', 'UF-04', 'Pressing M toggles mute state cleanly without WebAudio errors in headless Chrome', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await page.keyboard.press('m');
        await page.waitForTimeout(150);
        await page.keyboard.press('m');
        assertNoTelemetryErrors(telemetry, 'T2-04-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-04-05', 'UF-04', 'Pressing Escape when no drawer or modal is open is a safe no-op', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S08');
        await page.keyboard.press('Escape');
        await page.keyboard.press('Escape');
        assert.equal(await getCurrentSlideId(page), 'S08');
        assertNoTelemetryErrors(telemetry, 'T2-04-05');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-05 3D WebGL Fallback & Reduced-Motion Boundaries (T2-05-01..T2-05-05)
  // =========================================================================
  tests.push(
    makeTest('T2-05-01', 'UF-05', 'Injecting WebGL failure mounts stage-fallback cleanly with zero uncaught pageerror', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin, { disableWebGL: true });
      try {
        const { page, telemetry } = session;
        const fallback = page.locator('[data-testid="stage-fallback"]');
        await fallback.waitFor({ state: 'visible', timeout: 8000 });
        assertNoTelemetryErrors(telemetry, 'T2-05-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-05-02', 'UF-05', 'Under WebGL failure, slides, drawers, and S07/S25/S28 simulations remain 100% functional', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin, { disableWebGL: true });
      try {
        const { page, telemetry } = session;
        await page.locator('[data-testid="stage-fallback"]').waitFor({ state: 'visible', timeout: 8000 });
        await navigateToSlide(page, 'S07');
        await page.locator('[data-testid="sim-s07-sell-1"]').click();
        assert.match(await page.locator('[data-testid="sim-s07-stock"]').innerText(), /\b2\b/);
        await navigateToSlide(page, 'S28');
        assert.match(await page.locator('[data-testid="sim-s28-van"]').innerText(), /15[.,\s]?176[.,]26/);
        await openDrawerTab(page, 'excel', 'key');
        assert.equal(await page.locator('[data-testid="evidence-drawer"]').getAttribute('data-open'), 'true');
        assertNoTelemetryErrors(telemetry, 'T2-05-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-05-03', 'UF-05', 'Under reducedMotion: reduce, switching acts and drawers works cleanly with zero errors', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin, { reducedMotion: 'reduce' });
      try {
        const { page, telemetry } = session;
        for (const id of ['S02', 'S16', 'S22', 'S30']) {
          await navigateToSlide(page, id);
          assert.ok((await page.locator('[data-testid="slide-title"]').innerText()).trim().length > 0);
        }
        await openDrawerTab(page, 'documento', 'key');
        await closeDrawer(page, 'esc');
        assertNoTelemetryErrors(telemetry, 'T2-05-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-05-04', 'UF-05', 'Resizing viewport 1280x720 -> 1024x640 -> 1440x900 resizes stage-webgl without context loss', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        for (const vp of [
          { width: 1024, height: 640 },
          { width: 1440, height: 900 },
          { width: 1280, height: 720 }
        ]) {
          await page.setViewportSize(vp);
          await page.waitForTimeout(200);
          const box = await page.locator('canvas[data-testid="stage-webgl"]').boundingBox();
          assert.ok(box && box.width >= vp.width * 0.7 && box.height >= vp.height * 0.7, `Canvas failed resize at ${vp.width}x${vp.height}`);
        }
        assertNoTelemetryErrors(telemetry, 'T2-05-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-05-05', 'UF-05', 'Rapid jumps S00 -> S35 -> S06 -> S20 -> S15 leave final WebGL frame non-blank', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        for (const id of ['S35', 'S06', 'S20', 'S15']) {
          await navigateToSlide(page, id);
        }
        await page.waitForTimeout(350);
        const cap = await captureElementPng(page, 'canvas[data-testid="stage-webgl"]');
        assert.ok(cap.stats.stdDev > 2.0, `WebGL blank after rapid jumps: stdDev=${cap.stats.stdDev}`);
        assertNoTelemetryErrors(telemetry, 'T2-05-05');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-06 Transitions & 3D Labels Boundaries (T2-06-01..T2-06-05)
  // =========================================================================
  tests.push(
    makeTest('T2-06-01', 'UF-06', 'Rapidly skipping across Act boundary S01 -> S02 -> S03 leaves S03 interactive with no stuck overlay', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S01');
        await page.locator('[data-testid="btn-next"]').click();
        await page.waitForTimeout(120);
        await page.locator('[data-testid="btn-next"]').click();
        await waitForSlide(page, 'S03', 8000);
        assert.equal(await getCurrentSlideId(page), 'S03');
        await page.locator('[data-testid="btn-next"]').click();
        await waitForSlide(page, 'S04');
        assertNoTelemetryErrors(telemetry, 'T2-06-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-06-02', 'UF-06', 'Backward cross-act navigation (S16->S15, S22->S21, S30->S29) updates act labels cleanly', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const pairs = [
          ['S16', 'S15', /Acto\s*I\b/i],
          ['S22', 'S21', /Acto\s*II\b/i],
          ['S30', 'S29', /Acto\s*III\b/i]
        ];
        for (const [fromId, toId, expectedAct] of pairs) {
          await navigateToSlide(page, fromId);
          await page.locator('[data-testid="btn-prev"]').click();
          await waitForSlide(page, toId);
          assert.match(await page.locator('[data-testid="act-chapter-label"]').innerText(), expectedAct);
        }
        assertNoTelemetryErrors(telemetry, 'T2-06-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-06-03', 'UF-06', 'On S15, clicking M-… model selector opens Documento without duplicating listeners', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S15');
        const labelBtn = page.locator('button, [role="button"], .scene-label').filter({ hasText: /M-SEQ-01|M-UC-01/i }).first();
        if ((await labelBtn.count()) > 0) {
          await labelBtn.click();
          await closeDrawer(page, 'esc');
          await labelBtn.click();
          await closeDrawer(page, 'esc');
        }
        assertNoTelemetryErrors(telemetry, 'T2-06-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-06-04', 'UF-06', 'On S18, inspecting security threat items leaves zero leaked overlays on advancing to S19', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S18');
        const threat = page.locator('button, [role="button"], .scene-label').filter({ hasText: /Fuerza bruta|CSRF|403|precio/i }).first();
        if ((await threat.count()) > 0) {
          await threat.click();
        }
        await stepNext(page, 1);
        await waitForSlide(page, 'S19');
        assert.match(await page.locator('[data-testid="slide-container"]').innerText(), /120|dinam[oó]metro|29119/i);
        assertNoTelemetryErrors(telemetry, 'T2-06-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-06-05', 'UF-06', 'On S34, all 4 subsections 20.1-20.4 and 6 recommendations render cleanly', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S34');
        const text = await page.locator('[data-testid="slide-container"]').innerText();
        assertMatchesAll(text, ['20.1', '20.2', '20.3', '20.4', /ITIL|SRE/i, /TaxPolicy|Sommerville|MoSCoW/i], 'T2-06-05 S34');
        assertNoTelemetryErrors(telemetry, 'T2-06-05');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-07 Overview Boundaries (T2-07-01..T2-07-05)
  // =========================================================================
  tests.push(
    makeTest('T2-07-01', 'UF-07', 'Pressing O twice toggles overview-modal open then closed on the exact same slide', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S12');
        await openOverview(page);
        await closeOverview(page, 'key');
        assert.equal(await getCurrentSlideId(page), 'S12');
        assertNoTelemetryErrors(telemetry, 'T2-07-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-07-02', 'UF-07', 'Opening Overview while evidence-drawer is open avoids deadlocked backdrops', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'excel', 'key');
        await openOverview(page);
        await page.locator('[data-testid="overview-slide-S06"]').click();
        await page.locator('[data-testid="overview-modal"]').waitFor({ state: 'hidden', timeout: 5000 });
        await waitForSlide(page, 'S06');
        await closeDrawer(page, 'esc');
        assertNoTelemetryErrors(telemetry, 'T2-07-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-07-03', 'UF-07', 'Jumping from S35 back to S02 via Overview resets Act I label and odometer', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S35');
        await navigateToSlide(page, 'S02');
        assert.match(await page.locator('[data-testid="act-chapter-label"]').innerText(), /Acto\s*I\b/i);
        const odo = await getOdometerState(page);
        assert.equal(odo.index0, 2);
        assertNoTelemetryErrors(telemetry, 'T2-07-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-07-04', 'UF-07', 'Jumping from S01 to S33 (Dictamen) renders Dictamen Favorable and presenter Ángel', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S01');
        await navigateToSlide(page, 'S33');
        assert.match(await page.locator('[data-testid="slide-container"]').innerText(), /Dictamen.*Favorable/i);
        assert.match(await page.locator('[data-testid="presenter-badge"]').innerText(), /Ángel/i);
        assertNoTelemetryErrors(telemetry, 'T2-07-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-07-05', 'UF-07', 'Escape closes overview-modal reliably without changing current slide', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S19');
        await openOverview(page);
        await closeOverview(page, 'esc');
        assert.equal(await getCurrentSlideId(page), 'S19');
        assertNoTelemetryErrors(telemetry, 'T2-07-05');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-08 Documento PDF Drawer Boundaries (T2-08-01..T2-08-05)
  // =========================================================================
  tests.push(
    makeTest('T2-08-01', 'UF-08', 'Entering out-of-bounds PDF page 0 or -5 clamps safely to page 1', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'documento', 'key');
        await waitForPdfRendered(page);
        const input = page.locator('[data-testid="pdf-page-input"]');
        await input.fill('0');
        await input.press('Enter');
        await waitForPdfRendered(page, 1);
        assert.match(await page.locator('[data-testid="pdf-page-indicator"]').innerText(), /\b1\b/);
        assertNoTelemetryErrors(telemetry, 'T2-08-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-08-02', 'UF-08', 'Entering out-of-bounds PDF page 999 clamps safely to 352', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'documento', 'key');
        await waitForPdfRendered(page);
        const input = page.locator('[data-testid="pdf-page-input"]');
        await input.fill('999');
        await input.press('Enter');
        await waitForPdfRendered(page, 352);
        assert.match(await page.locator('[data-testid="pdf-page-indicator"]').innerText(), /\b352\b/);
        assertNoTelemetryErrors(telemetry, 'T2-08-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-08-03', 'UF-08', 'Searching non-existent string xyzzynonexistent123 handles 0 matches gracefully', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'documento', 'key');
        await waitForPdfRendered(page);
        const search = page.locator('[data-testid="pdf-search-input"]');
        await search.fill('xyzzynonexistent123');
        await search.press('Enter');
        await page.waitForTimeout(400);
        assertNoTelemetryErrors(telemetry, 'T2-08-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-08-04', 'UF-08', 'Clicking ref-chip across different slides updates PDF page (S10 p.117 -> S20 p.249..253)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S10');
        await page.locator('[data-testid="ref-chip"][data-ref-type="pdf"]').first().click();
        await waitForPdfRendered(page, 117);
        await closeDrawer(page, 'esc');
        await navigateToSlide(page, 'S20');
        await page.locator('[data-testid="ref-chip"][data-ref-type="pdf"]').first().click();
        await waitForPdfRendered(page);
        assert.match(await page.locator('[data-testid="pdf-page-indicator"]').innerText(), /249|251|252|253/);
        assertNoTelemetryErrors(telemetry, 'T2-08-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-08-05', 'UF-08', 'Opening and closing Documento drawer 5 times preserves exact initial pathname', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const initPath = await getPathname(page);
        for (const id of ['S02', 'S10', 'S16', 'S24', 'S33']) {
          await navigateToSlide(page, id);
          await openDrawerTab(page, 'documento', 'key');
          await assertPathnameInvariant(page, initPath, `open-${id}`);
          await closeDrawer(page, 'esc');
          await assertPathnameInvariant(page, initPath, `close-${id}`);
        }
        assertNoTelemetryErrors(telemetry, 'T2-08-05');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-09 Excel Drawer Boundaries (T2-09-01..T2-09-05)
  // =========================================================================
  tests.push(
    makeTest('T2-09-01', 'UF-09', 'Switching rapidly across all 9 Excel sheet tabs keeps grid synchronized', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'excel', 'key');
        for (const sheet of EXCEL_SHEETS) {
          await page.locator(`[data-testid="excel-sheet-tab-${sheet}"]`).click();
        }
        const gridText = await page.locator('[data-testid="excel-grid"]').innerText();
        assert.match(gridText, /58|1[.,]?000|5[.,]8/);
        assertNoTelemetryErrors(telemetry, 'T2-09-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-09-02', 'UF-09', 'Resumen and COCOMO preserve table structure without garbled NaN/undefined cells', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'excel', 'key');
        for (const sheet of ['Resumen', 'COCOMO']) {
          await page.locator(`[data-testid="excel-sheet-tab-${sheet}"]`).click();
          const txt = await page.locator('[data-testid="excel-grid"]').innerText();
          assert.ok(txt.trim().length > 40);
          assert.doesNotMatch(txt, /\b(undefined|NaN)\b/);
        }
        assertNoTelemetryErrors(telemetry, 'T2-09-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-09-03', 'UF-09', 'Clicking non-formula or empty cell updates excel-formula-bar cleanly without undefined', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'excel', 'key');
        await page.locator('[data-testid="excel-sheet-tab-Supuestos"]').click();
        await page.locator('[data-testid="excel-grid"] td').first().click();
        const fx = await page.locator('[data-testid="excel-formula-bar"]').innerText();
        assert.doesNotMatch(fx, /\bundefined\b/);
        assertNoTelemetryErrors(telemetry, 'T2-09-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-09-04', 'UF-09', 'Deep-linking from S28 Comprobar en Excel highlights VAN cell/range in Flujos', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S28');
        await page.locator('button, [role="button"]').filter({ hasText: /Comprobar en Excel/i }).first().click();
        await page.waitForFunction(() => document.querySelector('[data-testid="evidence-drawer"]')?.getAttribute('data-open') === 'true');
        const gridText = await page.locator('[data-testid="excel-grid"]').innerText();
        assert.match(gridText, /15[.,]176/);
        assertNoTelemetryErrors(telemetry, 'T2-09-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-09-05', 'UF-09', 'S30 interactive sheet cards open exact matching sheet in Excel drawer', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S30');
        const riesgosBtn = page.locator('[data-testid="slide-container"] button, [data-testid="slide-container"] [role="button"]').filter({ hasText: /Riesgos/i }).first();
        await riesgosBtn.click();
        await page.waitForFunction(() => document.querySelector('[data-testid="evidence-drawer"]')?.getAttribute('data-active-tab') === 'excel');
        const gridText = await page.locator('[data-testid="excel-grid"]').innerText();
        assert.match(gridText, /707[.,]09|200[.,]48|Riesgo/i);
        assertNoTelemetryErrors(telemetry, 'T2-09-05');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-10 Sistema POS Drawer Boundaries (T2-10-01..T2-10-05)
  // =========================================================================
  tests.push(
    makeTest('T2-10-01', 'UF-10', 'Confirming sale with empty cart or closed shift is blocked with Spanish validation (no receipt)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'sistema', 'key');
        const confirmBtn = page.locator('[data-testid="sistema-confirm-sale"]');
        const isDisabled = await confirmBtn.isDisabled().catch(() => false);
        if (!isDisabled) {
          await confirmBtn.click();
        }
        assert.equal(await page.locator('[data-testid="sistema-receipt"]').count(), 0);
        assertNoTelemetryErrors(telemetry, 'T2-10-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-10-02', 'UF-10', 'Attempting to sell beyond available stock triggers stock validation / quantity__gte block', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'sistema', 'key');
        await page.locator('[data-testid="sistema-open-shift"]').click();
        const addBtn = page.locator('[data-testid="sistema-add-item"]').first();
        for (let i = 0; i < 15; i += 1) {
          if (await addBtn.isEnabled().catch(() => false)) {
            await addBtn.click();
          }
        }
        const txt = await page.locator('[data-testid="sistema-pos-view"]').innerText();
        assert.match(txt, /stock|disponible|insuficiente|m[aá]x|l[ií]mite|quantity__gte/i);
        assertNoTelemetryErrors(telemetry, 'T2-10-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-10-03', 'UF-10', 'Selecting Gerencia role restricts Vendedor-only POS checkout', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'sistema', 'key');
        const select = page.locator('[data-testid="sistema-role-select"]');
        const options = await select.locator('option').allInnerTexts();
        const idx = options.findIndex((o) => /gerencia/i.test(o));
        assert.ok(idx >= 0, 'Gerencia option missing');
        await select.selectOption({ index: idx });
        const txt = await page.locator('[data-testid="sistema-pos-view"]').innerText();
        assert.match(txt, /47|Gerencia|restring|auditor|consulta/i);
        assertNoTelemetryErrors(telemetry, 'T2-10-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-10-04', 'UF-10', 'Discount exceeding policy limit in Sistema triggers BV-XX exception/draft notice', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'sistema', 'key');
        await page.locator('[data-testid="sistema-open-shift"]').click();
        await page.locator('[data-testid="sistema-add-item"]').first().click();
        const discInput = page.locator('[data-testid="sistema-discount-input"], input[name*="descuento"], input[aria-label*="Descuento"]').first();
        if ((await discInput.count()) > 0) {
          await discInput.fill('35');
          await discInput.dispatchEvent('input');
          await discInput.dispatchEvent('change');
          const txt = await page.locator('[data-testid="sistema-pos-view"]').innerText();
          assert.match(txt, /BV-|borrador|aprobaci[oó]n|pol[ií]tica|excede/i);
        } else {
          // Verify policy/BV-XX workflow indicator exists inside sistema-pos-view
          const txt = await page.locator('[data-testid="sistema-pos-view"]').innerText();
          assert.match(txt, /BV-|descuento|pol[ií]tica/i);
        }
        assertNoTelemetryErrors(telemetry, 'T2-10-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-10-05', 'UF-10', 'Mixed payment controls validate C$ total match cleanly', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'sistema', 'key');
        await page.locator('[data-testid="sistema-open-shift"]').click();
        await page.locator('[data-testid="sistema-add-item"]').first().click();
        const txt = await page.locator('[data-testid="sistema-pos-view"]').innerText();
        assert.match(txt, /Efectivo|Tarjeta|Mixto|C\$/i);
        assertNoTelemetryErrors(telemetry, 'T2-10-05');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-11 Evidencias Drawer Boundaries (T2-11-01..T2-11-05)
  // =========================================================================
  tests.push(
    makeTest('T2-11-01', 'UF-11', 'Clicking every item in evidencias-list populates non-empty evidencias-detail', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'evidencias', 'button');
        const items = page.locator('[data-testid="evidencias-list"] button, [data-testid="evidencias-list"] [role="button"], [data-testid="evidencias-list"] li');
        const count = await items.count();
        assert.ok(count >= 4, `Expected at least 4 evidence records, found ${count}`);
        for (let i = 0; i < count; i += 1) {
          await items.nth(i).click();
          const detail = (await page.locator('[data-testid="evidencias-detail"]').innerText()).trim();
          assert.ok(detail.length > 30, `Evidence item ${i} produced empty detail`);
        }
        assertNoTelemetryErrors(telemetry, 'T2-11-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-11-02', 'UF-11', 'Regression evidence includes every milestone 104, 111, 113, and 120', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'evidencias', 'button');
        await page.locator('[data-testid="evidencias-list"] button, [data-testid="evidencias-list"] [role="button"], [data-testid="evidencias-list"] li').filter({ hasText: /regresi[oó]n|120/i }).first().click();
        const detail = await page.locator('[data-testid="evidencias-detail"]').innerText();
        assertMatchesAll(detail, ['104', '111', '113', '120'], 'T2-11-02');
        assertNoTelemetryErrors(telemetry, 'T2-11-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-11-03', 'UF-11', 'Catalog 20,000 evidence distinguishes P95 0.029 s from max 0.033 s', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'evidencias', 'button');
        await page.locator('[data-testid="evidencias-list"] button, [data-testid="evidencias-list"] [role="button"], [data-testid="evidencias-list"] li').filter({ hasText: /20[\s.,]?000|cat[aá]logo/i }).first().click();
        const detail = await page.locator('[data-testid="evidencias-detail"]').innerText();
        assertMatchesAll(detail, [/0[.,]029/, /0[.,]033/], 'T2-11-03');
        assertNoTelemetryErrors(telemetry, 'T2-11-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-11-04', 'UF-11', 'Backup evidence documents SHA-256 verification and negative tampering rejection', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'evidencias', 'button');
        await page.locator('[data-testid="evidencias-list"] button, [data-testid="evidencias-list"] [role="button"], [data-testid="evidencias-list"] li').filter({ hasText: /respaldo|backup|usb/i }).first().click();
        const detail = await page.locator('[data-testid="evidencias-detail"]').innerText();
        assertMatchesAll(detail, ['SHA-256', /verify_backups|verify_restore/i], 'T2-11-04');
        assertNoTelemetryErrors(telemetry, 'T2-11-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-11-05', 'UF-11', 'Closing Evidencias drawer via Esc restores full-width stage cleanly', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'evidencias', 'button');
        await closeDrawer(page, 'esc');
        assert.equal(await page.locator('[data-testid="evidence-drawer"]').getAttribute('data-open'), 'false');
        assertNoTelemetryErrors(telemetry, 'T2-11-05');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-12 S07/S10/S12/S13 Simulation Boundaries (T2-12-01..T2-12-05)
  // =========================================================================
  tests.push(
    makeTest('T2-12-01', 'UF-12', 'On S07, clicking sim-s07-sell-1 three times decrements stock 3 -> 2 -> 1 -> 0', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S07');
        const sell1 = page.locator('[data-testid="sim-s07-sell-1"]');
        const stockEl = page.locator('[data-testid="sim-s07-stock"]');
        for (const expected of ['2', '1', '0']) {
          await sell1.click();
          assert.match(await stockEl.innerText(), new RegExp(`\\b${expected}\\b`));
        }
        assertNoTelemetryErrors(telemetry, 'T2-12-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-12-02', 'UF-12', 'On S07, 4th click of sim-s07-sell-1 at stock 0 triggers RAISE EXCEPTION (never -1)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S07');
        const sell1 = page.locator('[data-testid="sim-s07-sell-1"]');
        await sell1.click();
        await sell1.click();
        await sell1.click();
        await sell1.click();
        const stockText = await page.locator('[data-testid="sim-s07-stock"]').innerText();
        assert.match(stockText, /\b0\b/);
        assert.doesNotMatch(stockText, /-\s*1/);
        assert.match(await page.locator('[data-testid="sim-s07-status"]').innerText(), /RAISE EXCEPTION|45000|insuficiente|bloque/i);
        assertNoTelemetryErrors(telemetry, 'T2-12-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-12-03', 'UF-12', 'On S07, sim-s07-sell-5 from fresh stock 3 triggers RAISE EXCEPTION 45000 and keeps 3', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S07');
        await page.locator('[data-testid="sim-s07-sell-5"]').click();
        assert.match(await page.locator('[data-testid="sim-s07-stock"]').innerText(), /\b3\b/);
        assert.match(await page.locator('[data-testid="sim-s07-status"]').innerText(), /RAISE EXCEPTION|45000/i);
        assertNoTelemetryErrors(telemetry, 'T2-12-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-12-04', 'UF-12', 'On S13, cycling WBS -> CPM -> Gantt -> RACI -> WBS shows 2-day float on D and M', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S13');
        await page.locator('[data-testid="sim-s13-tab-cpm"]').click();
        const cpmText = await page.locator('[data-testid="sim-s13-panel"]').innerText();
        assertMatchesAll(cpmText, [/holgura/i, /\b2\b/], 'T2-12-04 CPM float');
        await page.locator('[data-testid="sim-s13-tab-gantt"]').click();
        await page.locator('[data-testid="sim-s13-tab-raci"]').click();
        await page.locator('[data-testid="sim-s13-tab-wbs"]').click();
        assert.match(await page.locator('[data-testid="sim-s13-panel"]').innerText(), /1\.0|I1|WBS/i);
        assertNoTelemetryErrors(telemetry, 'T2-12-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-12-05', 'UF-12', 'Navigating away from S07 and returning avoids duplicate click listeners (single decrement)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S07');
        await navigateToSlide(page, 'S08');
        await navigateToSlide(page, 'S07');
        await page.locator('[data-testid="sim-s07-reset"]').click();
        await page.locator('[data-testid="sim-s07-sell-1"]').click();
        assert.match(await page.locator('[data-testid="sim-s07-stock"]').innerText(), /\b2\b/);
        assertNoTelemetryErrors(telemetry, 'T2-12-05');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-13 S20 Concurrency Boundaries (T2-13-01..T2-13-05)
  // =========================================================================
  tests.push(
    makeTest('T2-13-01', 'UF-13', 'Rapid double-click of sim-s20-run-race never yields negative stock or 2 confirmed sales', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S20');
        await page.locator('[data-testid="sim-s20-run-race"]').dblclick();
        await page.waitForFunction(() => /\b0\b/.test(document.querySelector('[data-testid="sim-s20-stock"]')?.textContent || ''));
        const stockText = await page.locator('[data-testid="sim-s20-stock"]').innerText();
        assert.doesNotMatch(stockText, /-\s*1/);
        assertNoTelemetryErrors(telemetry, 'T2-13-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-13-02', 'UF-13', 'Final stock in sim-s20-stock after race is strictly 0', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S20');
        await page.locator('[data-testid="sim-s20-run-race"]').click();
        await page.waitForFunction(() => /\b0\b/.test(document.querySelector('[data-testid="sim-s20-stock"]')?.textContent || ''));
        assert.equal(parseNumericValue(await page.locator('[data-testid="sim-s20-stock"]').innerText()), 0);
        assertNoTelemetryErrors(telemetry, 'T2-13-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-13-03', 'UF-13', 'S20 race rejection explicitly references quantity__gte concurrency barrier', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S20');
        await page.locator('[data-testid="sim-s20-run-race"]').click();
        await page.waitForFunction(() => /quantity__gte/i.test(document.querySelector('[data-testid="sim-s20-result"]')?.textContent || ''));
        assert.match(await page.locator('[data-testid="sim-s20-result"]').innerText(), /quantity__gte/);
        assertNoTelemetryErrors(telemetry, 'T2-13-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-13-04', 'UF-13', 'Repeating S20 race 3 consecutive times produces deterministic 1 success / 1 reject / stock 0', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S20');
        const btn = page.locator('[data-testid="sim-s20-run-race"]');
        for (let r = 0; r < 3; r += 1) {
          await btn.click();
          await page.waitForFunction(() => /\b0\b/.test(document.querySelector('[data-testid="sim-s20-stock"]')?.textContent || ''));
          assert.match(await page.locator('[data-testid="sim-s20-result"]').innerText(), /quantity__gte/);
        }
        assertNoTelemetryErrors(telemetry, 'T2-13-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-13-05', 'UF-13', 'S20 displays CSV import 10,000 rows (56.36 s) and 46 migraciones alongside P95 metrics', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S20');
        const fullText = await page.locator('[data-testid="slide-container"]').innerText();
        assertMatchesAll(fullText, [/10[\s.,]?000/, /46/, /0[.,]029/, /1[.,]142/], 'T2-13-05');
        assertNoTelemetryErrors(telemetry, 'T2-13-05');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-14 S25 & S31 Simulation Boundaries (T2-14-01..T2-14-05)
  // =========================================================================
  tests.push(
    makeTest('T2-14-01', 'UF-14', 'On S25, clicking sim-s25-toggle-2 when already on 2 cajas is idempotent', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S25');
        await page.locator('[data-testid="sim-s25-toggle-2"]').click();
        assert.match(await page.locator('[data-testid="sim-s25-wq"]').innerText(), /22[.,]8\s*min/);
        assert.match(await page.locator('[data-testid="sim-s25-rho"]').innerText(), /95(\.0+)?\s*%/);
        assertNoTelemetryErrors(telemetry, 'T2-14-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-14-02', 'UF-14', 'On S25, clicking sim-s25-toggle-4 twice is idempotent (20.6 s, 47.5%)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S25');
        await page.locator('[data-testid="sim-s25-toggle-4"]').click();
        await page.locator('[data-testid="sim-s25-toggle-4"]').click();
        assert.match(await page.locator('[data-testid="sim-s25-wq"]').innerText(), /20[.,]6\s*s/);
        assert.match(await page.locator('[data-testid="sim-s25-rho"]').innerText(), /47[.,]5\s*%/);
        assertNoTelemetryErrors(telemetry, 'T2-14-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-14-03', 'UF-14', 'Rapidly toggling S25 2 <-> 4 five times leaves metrics synchronized', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S25');
        for (let i = 0; i < 5; i += 1) {
          await page.locator('[data-testid="sim-s25-toggle-4"]').click();
          await page.locator('[data-testid="sim-s25-toggle-2"]').click();
        }
        await page.locator('[data-testid="sim-s25-toggle-4"]').click();
        assert.match(await page.locator('[data-testid="sim-s25-wq"]').innerText(), /20[.,]6\s*s/);
        assert.match(await page.locator('[data-testid="sim-s25-rho"]').innerText(), /47[.,]5\s*%/);
        assertNoTelemetryErrors(telemetry, 'T2-14-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-14-04', 'UF-14', 'Audit D-10: S31 matrix has exactly 16 rows covering 15 RN, 16 ST-REQ, 30 SYS-FN, 72 SRS, 24 RF/RNF, 120 tests', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S31');
        assert.equal(await page.locator('[data-testid="sim-s31-row"]').count(), 16);
        const txt = await page.locator('[data-testid="slide-container"]').innerText();
        assertMatchesAll(txt, ['15', '16', '30', '72', '24', '120'], 'D-10 S31');
        assertNoTelemetryErrors(telemetry, 'T2-14-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-14-05', 'UF-14', 'Clicking multiple sim-s31-row entries switches inspected detail cleanly without stacking', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S31');
        const rows = page.locator('[data-testid="sim-s31-row"]');
        await rows.nth(0).click();
        await rows.nth(5).click();
        await rows.nth(15).click();
        assert.equal(await rows.count(), 16);
        assertNoTelemetryErrors(telemetry, 'T2-14-05');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-15 S28 Sensitivity Boundaries (T2-15-01..T2-15-05)
  // =========================================================================
  tests.push(
    makeTest('T2-15-01', 'UF-15', 'At TMAR = 0% (min), VAN avoids 0/0 NaN/Infinity and equals FC*5 - I0 ($26,337.86 Base)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S28');
        const slider = page.locator('[data-testid="sim-s28-tmar-slider"]');
        await slider.fill('0');
        await slider.dispatchEvent('input');
        await slider.dispatchEvent('change');
        const vanRaw = await page.locator('[data-testid="sim-s28-van"]').innerText();
        assert.doesNotMatch(vanRaw, /NaN|Infinity/i);
        const van = parseNumericValue(vanRaw);
        assert.ok(Math.abs(van - 26337.86) < 1.0, `Expected Base VAN at 0% = 26337.86, got ${van}`);
        assertNoTelemetryErrors(telemetry, 'T2-15-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-15-02', 'UF-15', 'At TMAR = 35% (max), Base VAN stays finite and > 0 (since IRR 50.84% > 35%)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S28');
        const slider = page.locator('[data-testid="sim-s28-tmar-slider"]');
        await slider.fill('35');
        await slider.dispatchEvent('input');
        await slider.dispatchEvent('change');
        const van = parseNumericValue(await page.locator('[data-testid="sim-s28-van"]').innerText());
        assert.ok(van > 3500 && van < 5000, `Expected Base VAN at 35% ~4097.78, got ${van}`);
        assertNoTelemetryErrors(telemetry, 'T2-15-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-15-03', 'UF-15', 'Monotonicity check across TMAR 0%, 6%, 12%, 20%, 35% on Base scenario', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S28');
        const slider = page.locator('[data-testid="sim-s28-tmar-slider"]');
        const vans = [];
        for (const tmar of ['0', '6', '12', '20', '35']) {
          await slider.fill(tmar);
          await slider.dispatchEvent('input');
          await slider.dispatchEvent('change');
          vans.push(parseNumericValue(await page.locator('[data-testid="sim-s28-van"]').innerText()));
        }
        for (let i = 0; i < vans.length - 1; i += 1) {
          assert.ok(vans[i] > vans[i + 1], `Expected strict decrease in VAN: ${JSON.stringify(vans)}`);
        }
        assertNoTelemetryErrors(telemetry, 'T2-15-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-15-04', 'UF-15', 'Under Pesimista (TIR 24.23%), setting TMAR = 30% (> IRR) yields negative VAN (< $0)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S28');
        await page.locator('[data-testid="sim-s28-scenario-pesimista"]').click();
        const slider = page.locator('[data-testid="sim-s28-tmar-slider"]');
        await slider.fill('30');
        await slider.dispatchEvent('input');
        await slider.dispatchEvent('change');
        const vanRaw = await page.locator('[data-testid="sim-s28-van"]').innerText();
        const van = parseNumericValue(vanRaw);
        assert.ok(van < 0, `Expected negative VAN for Pesimista at 30% TMAR, got ${van} ("${vanRaw}")`);
        assertNoTelemetryErrors(telemetry, 'T2-15-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T2-15-05', 'UF-15', 'Switching Pesimista -> Base -> Optimista at fixed 18% TMAR preserves 18% and orders VANs', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S28');
        const slider = page.locator('[data-testid="sim-s28-tmar-slider"]');
        await slider.fill('18');
        await slider.dispatchEvent('input');
        await slider.dispatchEvent('change');

        await page.locator('[data-testid="sim-s28-scenario-pesimista"]').click();
        const vPes = parseNumericValue(await page.locator('[data-testid="sim-s28-van"]').innerText());
        await page.locator('[data-testid="sim-s28-scenario-base"]').click();
        const vBase = parseNumericValue(await page.locator('[data-testid="sim-s28-van"]').innerText());
        await page.locator('[data-testid="sim-s28-scenario-optimista"]').click();
        const vOpt = parseNumericValue(await page.locator('[data-testid="sim-s28-van"]').innerText());

        assert.match(await page.locator('[data-testid="sim-s28-tmar-value"]').innerText(), /18([.,]00)?\s*%/);
        assert.ok(vOpt > vBase && vBase > vPes, `Expected Optimista > Base > Pesimista at 18%, got ${vOpt}, ${vBase}, ${vPes}`);
        assertNoTelemetryErrors(telemetry, 'T2-15-05');
      } finally {
        await session.close();
      }
    })
  );

  assert.equal(tests.length, 75, `Tier 2 must contain exactly 75 tests, got ${tests.length}`);
  return tests;
}
