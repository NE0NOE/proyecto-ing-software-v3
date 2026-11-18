import assert from 'node:assert/strict';
import { createIsolatedSession, captureElementPng, comparePngBuffers } from './lib/harness.mjs';
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
  stepPrev,
  waitForPdfRendered,
  waitForSlide
} from './lib/assertions.mjs';

function makeTest(id, feature, title, fn) {
  return { id, tier: 1, feature, title, run: fn };
}

export function getTier1Tests() {
  const tests = [];

  // =========================================================================
  // UF-01: Offline Build & Zero-External-Request Integrity (T1-01-01..T1-01-06)
  // =========================================================================
  tests.push(
    makeTest('T1-01-01', 'UF-01', 'Root document loads HTTP 200 with mounted app and zero external requests', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const res = await page.request.get(`${baseOrigin}/`);
        assert.equal(res.status(), 200);
        const bodyLen = (await page.locator('[data-testid="slide-container"]').innerText()).trim().length;
        assert.ok(bodyLen > 10, 'Initial slide container should render non-empty Spanish content');
        assertNoTelemetryErrors(telemetry, 'T1-01-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-01-02', 'UF-01', 'Zero console.error and zero pageerror on initial boot at S00', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        assert.equal(await getCurrentSlideId(page), 'S00');
        await page.waitForTimeout(300);
        assertNoTelemetryErrors(telemetry, 'T1-01-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-01-03', 'UF-01', 'All stylesheets, scripts, and @font-face rules resolve locally on 127.0.0.1', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const externalRefs = await page.evaluate(() => {
          const urls = [];
          document.querySelectorAll('link[href], script[src]').forEach((el) => {
            const val = el.getAttribute('href') || el.getAttribute('src') || '';
            if (/^https?:\/\//i.test(val) && !val.startsWith(window.location.origin)) {
              urls.push(val);
            }
          });
          return urls;
        });
        assert.deepEqual(externalRefs, [], `Unexpected external DOM asset URLs: ${JSON.stringify(externalRefs)}`);
        const fontStatus = await page.evaluate(async () => {
          await document.fonts.ready;
          return { size: document.fonts.size, status: document.fonts.status };
        });
        assert.equal(fontStatus.status, 'loaded');
        assertNoTelemetryErrors(telemetry, 'T1-01-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-01-04', 'UF-01', 'Local unified 352-page PDF is served from localhost with size > 2 MB', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const pdfUrl = `${baseOrigin}/docs/Documento_Final_Unificado_MotoRepuestosElCentenario.pdf`;
        const headRes = await page.request.head(pdfUrl);
        assert.equal(headRes.status(), 200);
        const len = Number(headRes.headers()['content-length'] || 0);
        assert.ok(len > 2_000_000, `Expected unified PDF > 2 MB, got ${len} bytes`);
        const rangeRes = await page.request.get(pdfUrl, { headers: { Range: 'bytes=0-1023' } });
        assert.equal(rangeRes.status(), 206);
        assertNoTelemetryErrors(telemetry, 'T1-01-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-01-05', 'UF-01', 'Local Excel 9-sheet workbook is reachable via download link HTTP 200', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'excel', 'key');
        const link = page.locator('[data-testid="excel-download-link"]').first();
        await link.waitFor({ state: 'visible', timeout: 8000 });
        const href = await link.getAttribute('href');
        assert.ok(href && href.includes('03_Modelo_Financiero_mrec.xlsx'), `Unexpected excel download href: ${href}`);
        const resolvedUrl = new URL(href, `${baseOrigin}/`).href;
        assert.ok(resolvedUrl.startsWith(baseOrigin), `Download URL must be local: ${resolvedUrl}`);
        const res = await page.request.get(resolvedUrl);
        assert.equal(res.status(), 200);
        const body = await res.body();
        assert.ok(body.byteLength > 30_000, `Expected .xlsx > 30 KB, got ${body.byteLength}`);
        assertNoTelemetryErrors(telemetry, 'T1-01-05');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-01-06', 'UF-01', 'Full 36-slide traversal produces zero HTTP >= 400 or failed requests', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        for (let i = 0; i < 35; i += 1) {
          await stepNext(page, 1);
        }
        assert.equal(await getCurrentSlideId(page), 'S35');
        assertNoTelemetryErrors(telemetry, 'T1-01-06');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-02: Prologue & Ignition Sequence S00-S01 (T1-02-01..T1-02-06)
  // =========================================================================
  tests.push(
    makeTest('T1-02-01', 'UF-02', 'Initial load opens on S00 Llave de contacto', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        assert.equal(await getCurrentSlideId(page), 'S00');
        const title = await page.locator('[data-testid="slide-title"]').innerText();
        assert.ok(title.trim().length > 0);
        assertNoTelemetryErrors(telemetry, 'T1-02-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-02-02', 'UF-02', 'S00 renders institutional metadata for MREC / UNI / DACTIC / 4S1-COM-S', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const text = await page.locator('[data-testid="slide-container"]').innerText();
        assertMatchesAll(text, ['Moto Repuestos El Centenario', 'UNI', 'DACTIC', 'Roberto Alfaro', '4S1-COM-S'], 'T1-02-02');
        assertNoTelemetryErrors(telemetry, 'T1-02-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-02-03', 'UF-02', 'S00 displays all 3 team members and university IDs', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const text = await page.locator('[data-testid="slide-container"]').innerText();
        assertMatchesAll(text, ['2021-0087U', '2022-0376U', '2020-1014U', /Ángel/i, /Noel/i, /Mendell/i], 'T1-02-03');
        assertNoTelemetryErrors(telemetry, 'T1-02-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-02-04', 'UF-02', 'Clicking btn-start-route or pressing Enter on S00 advances to S01', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const startBtn = page.locator('[data-testid="btn-start-route"]');
        await startBtn.waitFor({ state: 'visible', timeout: 5000 });
        await startBtn.click();
        await waitForSlide(page, 'S01');
        assert.equal(await getCurrentSlideId(page), 'S01');
        assertNoTelemetryErrors(telemetry, 'T1-02-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-02-05', 'UF-02', 'S01 displays all 4 deliveries and 20 chapters with PDF starting pages', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await page.keyboard.press('Enter');
        await waitForSlide(page, 'S01');
        const text = await page.locator('[data-testid="slide-container"]').innerText();
        assertMatchesAll(text, [/Entrega\s*I\b/i, /Entrega\s*II\b/i, /Entrega\s*III\b/i, /Entrega\s*IV\b/i, '199', '282', '342'], 'T1-02-05');
        assertNoTelemetryErrors(telemetry, 'T1-02-05');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-02-06', 'UF-02', 'Clicking a route milestone on S01 navigates directly to its chapter slide', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await page.locator('[data-testid="btn-start-route"]').click();
        await waitForSlide(page, 'S01');
        const milestone = page
          .locator('[data-testid="slide-container"] button, [data-testid="slide-container"] [role="button"]')
          .filter({ hasText: /04|Arquitectura/i })
          .first();
        await milestone.waitFor({ state: 'visible', timeout: 5000 });
        await milestone.click();
        await waitForSlide(page, 'S10');
        assert.equal(await getCurrentSlideId(page), 'S10');
        assertNoTelemetryErrors(telemetry, 'T1-02-06');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-03: Full 36-Slide Spanish Narrative S00-S35 (T1-03-01..T1-03-06)
  // =========================================================================
  tests.push(
    makeTest('T1-03-01', 'UF-03', 'All 36 slides S00..S35 reachable sequentially with non-empty titles', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const titles = [];
        for (let i = 0; i < 36; i += 1) {
          const expectedId = ALL_SLIDE_IDS[i];
          await waitForSlide(page, expectedId);
          const title = (await page.locator('[data-testid="slide-title"]').innerText()).trim();
          assert.ok(title.length > 2, `Slide ${expectedId} has empty title`);
          titles.push(title);
          if (i < 35) {
            await page.locator('[data-testid="btn-next"]').click();
          }
        }
        assert.equal(titles.length, 36);
        assertNoTelemetryErrors(telemetry, 'T1-03-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-03-02', 'UF-03', 'Act I (S02-S15) displays verified Delivery I facts and metrics', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const checks = [
          ['S06', ['8', 'Productos', 'Facturas']],
          ['S08', ['15', '16', '30', '72']],
          ['S10', ['72', '96', '74']],
          ['S12', ['Incremental', '88', '79', '78', '54']],
          ['S13', ['12', '60']],
          ['S14', ['90', '86', '66']],
          ['S15', ['M-UC-01', 'M-SEQ-01', 'M-DEP-01']]
        ];
        for (const [id, pats] of checks) {
          await navigateToSlide(page, id);
          const text = await page.locator('[data-testid="slide-container"]').innerText();
          assertMatchesAll(text, pats, `Act I ${id}`);
        }
        assertNoTelemetryErrors(telemetry, 'T1-03-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-03-03', 'UF-03', 'Act II (S16-S21) displays verified Delivery II facts and metrics', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const checks = [
          ['S16', ['SOLID', 'pricing.py']],
          ['S17', [/4\s*pantallas/i]],
          ['S18', ['30 min', '403']],
          ['S19', ['120', /289[.,]28/]],
          ['S20', [/0[.,]029/, /1[.,]142/]],
          ['S21', ['6 VLAN', 'PostgreSQL']]
        ];
        for (const [id, pats] of checks) {
          await navigateToSlide(page, id);
          const text = await page.locator('[data-testid="slide-container"]').innerText();
          assertMatchesAll(text, pats, `Act II ${id}`);
        }
        assertNoTelemetryErrors(telemetry, 'T1-03-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-03-04', 'UF-03', 'Act III (S22-S29) displays verified Delivery III financial and legal facts', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const checks = [
          ['S22', ['325']],
          ['S23', ['SRV1', '58', /5[.,]8/]],
          ['S24', [/7[.,]770[.,]09/, /10[.,]162[.,]14/]],
          ['S25', [/22[.,]8\s*min/, /20[.,]6\s*s/]],
          ['S26', [/8[.,]757/, /3[.,]500/]],
          ['S27', [/13[.,]662[.,]14/, /8[.,]000/]],
          ['S28', [/15[.,]176[.,]26/, /50[.,]84/]],
          ['S29', ['12', 'Carlos Alberto Mendoza Guido']]
        ];
        for (const [id, pats] of checks) {
          await navigateToSlide(page, id);
          const text = await page.locator('[data-testid="slide-container"]').innerText();
          assertMatchesAll(text, pats, `Act III ${id}`);
        }
        assertNoTelemetryErrors(telemetry, 'T1-03-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-03-05', 'UF-03', 'Act IV and Epilogue (S30-S35) display verified Delivery IV facts', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const checks = [
          ['S30', ['Resumen', 'Flujos', 'Capacidades']],
          ['S31', ['15', '16', '30', '72', '120']],
          ['S32', ['46', '120']],
          ['S33', [/Dictamen.*Favorable/i, /17 de noviembre de 2026/i]],
          ['S34', ['20.1', '20.2', '20.3', '20.4']],
          ['S35', [/Preguntas/i]]
        ];
        for (const [id, pats] of checks) {
          await navigateToSlide(page, id);
          const text = await page.locator('[data-testid="slide-container"]').innerText();
          assertMatchesAll(text, pats, `Act IV ${id}`);
        }
        assertNoTelemetryErrors(telemetry, 'T1-03-05');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-03-06', 'UF-03', 'Sampled slides contain zero English placeholders (Loading..., undefined, NaN, Lorem)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        for (const id of ['S00', 'S02', 'S07', 'S13', 'S17', 'S20', 'S25', 'S28', 'S31', 'S35']) {
          await navigateToSlide(page, id);
          const text = await page.locator('body').innerText();
          assert.doesNotMatch(text, /\b(Loading\.\.\.|Lorem ipsum|undefined|NaN)\b/i, `Forbidden placeholder on ${id}`);
        }
        assertNoTelemetryErrors(telemetry, 'T1-03-06');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-04: Persistent Chrome, Odometer, Mini-Moto & Shortcuts (T1-04-01..T1-04-06)
  // =========================================================================
  tests.push(
    makeTest('T1-04-01', 'UF-04', 'Persistent header, act-chapter-label, odometer, mini-moto, and presenter badge stay visible across acts', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        for (const id of ['S01', 'S06', 'S16', 'S24', 'S31', 'S35']) {
          await navigateToSlide(page, id);
          for (const sel of ['header-bar', 'act-chapter-label', 'odometer', 'mini-moto-progress', 'presenter-badge']) {
            await page.locator(`[data-testid="${sel}"]`).waitFor({ state: 'visible', timeout: 5000 });
          }
        }
        assertNoTelemetryErrors(telemetry, 'T1-04-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-04-02', 'UF-04', 'Odometer increments monotonically +1 per slide from S00 to S35', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        for (let i = 0; i < 36; i += 1) {
          await waitForSlide(page, ALL_SLIDE_IDS[i]);
          const odo = await getOdometerState(page);
          assert.equal(odo.index0, i, `Expected odometer index0=${i} on ${ALL_SLIDE_IDS[i]}, got ${odo.raw}`);
          if (i < 35) {
            await page.locator('[data-testid="btn-next"]').click();
          }
        }
        assertNoTelemetryErrors(telemetry, 'T1-04-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-04-03', 'UF-04', 'Presenter badge updates accurately across Ángel, Mendell, and Noel', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const expectations = [
          ['S00', /Ángel/i],
          ['S02', /Mendell/i],
          ['S06', /Ángel/i],
          ['S08', /Noel/i],
          ['S12', /Mendell/i],
          ['S19', /Noel/i],
          ['S25', /Noel/i],
          ['S28', /Noel/i],
          ['S33', /Ángel/i]
        ];
        for (const [id, pat] of expectations) {
          await navigateToSlide(page, id);
          const badge = await page.locator('[data-testid="presenter-badge"]').innerText();
          assert.match(badge, pat, `Expected presenter ${pat} on ${id}, got "${badge}"`);
        }
        assertNoTelemetryErrors(telemetry, 'T1-04-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-04-04', 'UF-04', 'Clicking a materialized segment in mini-moto-progress navigates to its chapter slide', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S20');
        const clickableParts = page.locator('[data-testid="mini-moto-progress"] [role="button"], [data-testid="mini-moto-progress"] button, [data-testid="mini-moto-progress"] [data-slide]');
        const count = await clickableParts.count();
        assert.ok(count > 0, 'Expected interactive segments inside mini-moto-progress');
        await clickableParts.first().click();
        const afterId = await getCurrentSlideId(page);
        assert.notEqual(afterId, 'S20', 'Clicking a mini-moto segment should jump to its corresponding slide');
        assertNoTelemetryErrors(telemetry, 'T1-04-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-04-05', 'UF-04', 'Keyboard shortcuts ArrowRight, Space, and ArrowLeft navigate forward and backward', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await page.keyboard.press('ArrowRight');
        await waitForSlide(page, 'S01');
        await page.keyboard.press('Space');
        await waitForSlide(page, 'S02');
        await page.keyboard.press('ArrowLeft');
        await waitForSlide(page, 'S01');
        assert.equal(await getCurrentSlideId(page), 'S01');
        assertNoTelemetryErrors(telemetry, 'T1-04-05');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-04-06', 'UF-04', 'Presenter notes toggle (P / btn-notes) opens and closes Spanish speaker cues', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S06');
        const btnNotes = page.locator('[data-testid="btn-notes"]');
        await btnNotes.click();
        const notesPanel = page.locator('[data-testid="presenter-notes"], [aria-label*="Notas"], .presenter-notes').first();
        await notesPanel.waitFor({ state: 'visible', timeout: 5000 });
        const notesText = await notesPanel.innerText();
        assert.ok(notesText.trim().length > 15, 'Presenter notes should display non-empty Spanish cues');
        await page.keyboard.press('p');
        await notesPanel.waitFor({ state: 'hidden', timeout: 5000 });
        assertNoTelemetryErrors(telemetry, 'T1-04-06');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-05: Persistent 3D WebGL Stage, Progressive Assembly & Fallbacks (T1-05-01..T1-05-06)
  // =========================================================================
  tests.push(
    makeTest('T1-05-01', 'UF-05', 'WebGL canvas mounts on load with bounding dimensions >= 800x450 at 1280x720', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const canvas = page.locator('canvas[data-testid="stage-webgl"]');
        await canvas.waitFor({ state: 'visible', timeout: 8000 });
        const box = await canvas.boundingBox();
        assert.ok(box && box.width >= 800 && box.height >= 450, `Invalid WebGL canvas box: ${JSON.stringify(box)}`);
        assertNoTelemetryErrors(telemetry, 'T1-05-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-05-02', 'UF-05', 'Compositor PNG capture of stage-webgl on S00 is non-blank (stdDev > 2.0)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const cap = await captureElementPng(page, 'canvas[data-testid="stage-webgl"]');
        assert.ok(cap.stats.stdDev > 2.0 && cap.stats.nonBgRatio > 0.01, `S00 WebGL canvas appears blank: ${JSON.stringify({ stdDev: cap.stats.stdDev, nonBgRatio: cap.stats.nonBgRatio })}`);
        assertNoTelemetryErrors(telemetry, 'T1-05-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-05-03', 'UF-05', 'Compositor PNG captures across Acts I-IV (S06, S16, S27, S34) are all non-blank', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        for (const id of ['S06', 'S16', 'S27', 'S34']) {
          await navigateToSlide(page, id);
          await page.waitForTimeout(350);
          const cap = await captureElementPng(page, 'canvas[data-testid="stage-webgl"]');
          assert.ok(cap.stats.stdDev > 2.0 && cap.stats.nonBgRatio > 0.01, `${id} WebGL frame blank: stdDev=${cap.stats.stdDev}`);
        }
        assertNoTelemetryErrors(telemetry, 'T1-05-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-05-04', 'UF-05', 'Cross-act pixel delta between S00, S11, S20, and S34 exceeds 2% visual change', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const captures = [];
        for (const id of ['S00', 'S11', 'S20', 'S34']) {
          await navigateToSlide(page, id);
          await page.waitForTimeout(450);
          captures.push({ id, ...(await captureElementPng(page, 'canvas[data-testid="stage-webgl"]')) });
        }
        for (let i = 0; i < captures.length - 1; i += 1) {
          const delta = comparePngBuffers(captures[i].pngBuf, captures[i + 1].pngBuf);
          assert.ok(
            delta > 0.02,
            `Expected > 2% WebGL pixel delta between ${captures[i].id} and ${captures[i + 1].id}, got ${(delta * 100).toFixed(2)}%`
          );
        }
        assertNoTelemetryErrors(telemetry, 'T1-05-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-05-05', 'UF-05', 'Single persistent WebGL canvas element survives navigation without recreation', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await page.evaluate(() => {
          const c = document.querySelector('canvas[data-testid="stage-webgl"]');
          if (c) c.dataset.e2eInstanceToken = 'persistent-stage-token';
        });
        await navigateToSlide(page, 'S11');
        await navigateToSlide(page, 'S25');
        await navigateToSlide(page, 'S35');
        const token = await page.evaluate(() => document.querySelector('canvas[data-testid="stage-webgl"]')?.dataset?.e2eInstanceToken);
        assert.equal(token, 'persistent-stage-token', 'WebGL canvas element was unexpectedly recreated across slides');
        assertNoTelemetryErrors(telemetry, 'T1-05-05');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-05-06', 'UF-05', 'Under prefers-reduced-motion: reduce, act navigation completes rapidly (< 1000 ms)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin, { reducedMotion: 'reduce' });
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S01');
        const t0 = Date.now();
        await stepNext(page, 1);
        await waitForSlide(page, 'S02');
        const elapsed = Date.now() - t0;
        assert.ok(elapsed < 1000, `Reduced-motion inter-act transition took ${elapsed} ms (expected < 1000 ms)`);
        assertNoTelemetryErrors(telemetry, 'T1-05-06');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-06: 3D Chapter Scenes, Interactive Inspection & Act Transitions (T1-06-01..T1-06-06)
  // =========================================================================
  tests.push(
    makeTest('T1-06-01', 'UF-06', 'Intra-act transition S06 -> S07 settles with interactive slide controls', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S06');
        await stepNext(page, 1);
        await waitForSlide(page, 'S07');
        await page.locator('[data-testid="sim-s07-sell-1"]').click();
        const stock = await page.locator('[data-testid="sim-s07-stock"]').innerText();
        assert.match(stock, /2/);
        assertNoTelemetryErrors(telemetry, 'T1-06-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-06-02', 'UF-06', 'Inter-act transition Prologue -> Act I (S01 -> S02) updates act-chapter-label', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S01');
        await stepNext(page, 1);
        await waitForSlide(page, 'S02');
        const label = await page.locator('[data-testid="act-chapter-label"]').innerText();
        assert.match(label, /Acto\s*I\b|El Plano/i);
        assertNoTelemetryErrors(telemetry, 'T1-06-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-06-03', 'UF-06', 'Inter-act transition Act I -> Act II (S15 -> S16) updates act-chapter-label', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S15');
        await stepNext(page, 1);
        await waitForSlide(page, 'S16');
        const label = await page.locator('[data-testid="act-chapter-label"]').innerText();
        assert.match(label, /Acto\s*II\b|Construcción/i);
        assertNoTelemetryErrors(telemetry, 'T1-06-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-06-04', 'UF-06', 'Inter-act transitions S21->S22 (Act III) and S29->S30 (Act IV) update act labels', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S21');
        await stepNext(page, 1);
        await waitForSlide(page, 'S22');
        assert.match(await page.locator('[data-testid="act-chapter-label"]').innerText(), /Acto\s*III\b|Taller/i);
        await navigateToSlide(page, 'S29');
        await stepNext(page, 1);
        await waitForSlide(page, 'S30');
        assert.match(await page.locator('[data-testid="act-chapter-label"]').innerText(), /Acto\s*IV\b|Entrega/i);
        assertNoTelemetryErrors(telemetry, 'T1-06-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-06-05', 'UF-06', 'Interactive inspection on S06 (DB tables) and S15 (UML M-… models) works cleanly', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S06');
        const s06Trigger = page.locator('button, [role="button"], .scene-label').filter({ hasText: /Productos|Facturas/i }).first();
        if ((await s06Trigger.count()) > 0) {
          await s06Trigger.click();
        }
        await navigateToSlide(page, 'S15');
        const s15Text = await page.locator('body').innerText();
        assertMatchesAll(s15Text, ['M-UC-01', 'M-SEQ-01', 'M-DEP-01'], 'T1-06-05 S15');
        assertNoTelemetryErrors(telemetry, 'T1-06-05');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-06-06', 'UF-06', 'Interactive inspection on S21 (6 VLAN / LAN topology) exposes VLAN/IP info', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S21');
        const vlanBtn = page.locator('button, [role="button"], .scene-label').filter({ hasText: /VLAN|POS01|SRV1/i }).first();
        if ((await vlanBtn.count()) > 0) {
          await vlanBtn.click();
        }
        const text = await page.locator('body').innerText();
        assert.match(text, /VLAN|10\.20\./i);
        assertNoTelemetryErrors(telemetry, 'T1-06-06');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-07: Overview Highway Map O (T1-07-01..T1-07-06)
  // =========================================================================
  tests.push(
    makeTest('T1-07-01', 'UF-07', 'Pressing O or clicking btn-overview opens overview-modal', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openOverview(page);
        assert.equal(await page.locator('[data-testid="overview-modal"]').isVisible(), true);
        assertNoTelemetryErrors(telemetry, 'T1-07-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-07-02', 'UF-07', 'Overview modal renders all 20 chapters overview-chapter-01..20', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openOverview(page);
        for (let ch = 1; ch <= 20; ch += 1) {
          const num = String(ch).padStart(2, '0');
          const el = page.locator(`[data-testid="overview-chapter-${num}"]`);
          await el.waitFor({ state: 'visible', timeout: 3000 });
        }
        assertNoTelemetryErrors(telemetry, 'T1-07-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-07-03', 'UF-07', 'Overview modal exposes direct slide selectors overview-slide-S00..S35', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openOverview(page);
        for (const id of ALL_SLIDE_IDS) {
          const count = await page.locator(`[data-testid="overview-slide-${id}"]`).count();
          assert.ok(count > 0, `Missing overview selector for ${id}`);
        }
        assertNoTelemetryErrors(telemetry, 'T1-07-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-07-04', 'UF-07', 'Clicking overview-chapter-04 jumps to Cap. 04 (S10) and closes overview', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openOverview(page);
        await page.locator('[data-testid="overview-chapter-04"]').click();
        await page.locator('[data-testid="overview-modal"]').waitFor({ state: 'hidden', timeout: 5000 });
        await waitForSlide(page, 'S10');
        assert.equal(await getCurrentSlideId(page), 'S10');
        assertNoTelemetryErrors(telemetry, 'T1-07-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-07-05', 'UF-07', 'Clicking overview-chapter-15 jumps to Cap. 15 and updates odometer & presenter', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openOverview(page);
        await page.locator('[data-testid="overview-chapter-15"]').click();
        await page.locator('[data-testid="overview-modal"]').waitFor({ state: 'hidden', timeout: 5000 });
        const slideId = await getCurrentSlideId(page);
        assert.ok(['S25', 'S26', 'S27', 'S28'].includes(slideId), `Expected Cap. 15 slide, got ${slideId}`);
        const odo = await getOdometerState(page);
        assert.ok(odo.index0 >= 25 && odo.index0 <= 28);
        assertNoTelemetryErrors(telemetry, 'T1-07-05');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-07-06', 'UF-07', 'Pressing O again or Esc closes overview-modal while preserving current slide', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S08');
        await openOverview(page);
        await closeOverview(page, 'esc');
        assert.equal(await getCurrentSlideId(page), 'S08');
        assertNoTelemetryErrors(telemetry, 'T1-07-06');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-08: Exact Reference Chips & Documento PDF Drawer D (T1-08-01..T1-08-06)
  // =========================================================================
  tests.push(
    makeTest('T1-08-01', 'UF-08', 'Every content slide S01-S34 renders at least one ref-chip with page reference', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        for (let i = 1; i <= 34; i += 1) {
          await navigateToSlide(page, ALL_SLIDE_IDS[i]);
          const chips = page.locator('[data-testid="ref-chip"]');
          const count = await chips.count();
          assert.ok(count >= 1, `Slide ${ALL_SLIDE_IDS[i]} must display at least 1 ref-chip`);
          const firstText = await chips.first().innerText();
          assert.match(firstText, /pág\.|Cap\.|Portada|Índice|Dictamen/i, `Ref chip on ${ALL_SLIDE_IDS[i]} unexpected: "${firstText}"`);
        }
        assertNoTelemetryErrors(telemetry, 'T1-08-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-08-02', 'UF-08', 'Clicking ref-chip on S10 (pág. 117) opens Documento drawer without changing pathname', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const initPath = await getPathname(page);
        await navigateToSlide(page, 'S10');
        await page.locator('[data-testid="ref-chip"][data-ref-type="pdf"]').first().click();
        await page.waitForFunction(() => {
          const d = document.querySelector('[data-testid="evidence-drawer"]');
          return d && d.getAttribute('data-open') === 'true' && d.getAttribute('data-active-tab') === 'documento';
        });
        await assertPathnameInvariant(page, initPath, 'T1-08-02');
        assertNoTelemetryErrors(telemetry, 'T1-08-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-08-03', 'UF-08', 'PDF canvas renders non-empty pixels and indicator shows page 117 on S10 ref click', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S10');
        await page.locator('[data-testid="ref-chip"][data-ref-type="pdf"]').first().click();
        const dims = await waitForPdfRendered(page, 117);
        assert.ok(dims.width > 100 && dims.height > 100 && dims.hasNonEmptyPixels, `PDF canvas failed to render non-empty page: ${JSON.stringify(dims)}`);
        const indText = await page.locator('[data-testid="pdf-page-indicator"]').innerText();
        assert.match(indText, /117/);
        assertNoTelemetryErrors(telemetry, 'T1-08-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-08-04', 'UF-08', 'Pressing D on S20 opens Documento at Cap. 12 (pág. 249..253) and D again closes it', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S20');
        await openDrawerTab(page, 'documento', 'key');
        await waitForPdfRendered(page);
        const ind = await page.locator('[data-testid="pdf-page-indicator"]').innerText();
        assert.match(ind, /249|250|251|252|253/);
        await closeDrawer(page, 'key-d');
        assertNoTelemetryErrors(telemetry, 'T1-08-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-08-05', 'UF-08', 'Entering 349 in pdf-page-input navigates PDF viewer to page 349', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'documento', 'key');
        await waitForPdfRendered(page);
        const input = page.locator('[data-testid="pdf-page-input"]');
        await input.fill('349');
        await input.press('Enter');
        const dims = await waitForPdfRendered(page, 349);
        assert.ok(dims.hasNonEmptyPixels, 'Page 349 PDF canvas did not render pixels');
        assertNoTelemetryErrors(telemetry, 'T1-08-05');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-08-06', 'UF-08', 'Typing Spanish phrase in pdf-search-input searches locally with zero network requests', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'documento', 'key');
        await waitForPdfRendered(page);
        const searchInput = page.locator('[data-testid="pdf-search-input"]');
        await searchInput.fill('Matriz de evaluación comparativa');
        await searchInput.press('Enter');
        await page.waitForTimeout(500);
        assertNoTelemetryErrors(telemetry, 'T1-08-06');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-09: Excel 9-Sheet Financial Drawer E (T1-09-01..T1-09-06)
  // =========================================================================
  tests.push(
    makeTest('T1-09-01', 'UF-09', 'Pressing E opens evidence-drawer on excel tab with pathname unchanged', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const initPath = await getPathname(page);
        await openDrawerTab(page, 'excel', 'key');
        await assertPathnameInvariant(page, initPath, 'T1-09-01');
        assertNoTelemetryErrors(telemetry, 'T1-09-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-09-02', 'UF-09', 'All 9 Excel sheet tabs exist with canonical names', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'excel', 'key');
        for (const sheet of EXCEL_SHEETS) {
          await page.locator(`[data-testid="excel-sheet-tab-${sheet}"]`).waitFor({ state: 'visible', timeout: 5000 });
        }
        assertNoTelemetryErrors(telemetry, 'T1-09-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-09-03', 'UF-09', 'Clicking Flujos tab renders excel-grid with verified NPV, I0, and IRR figures', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'excel', 'key');
        await page.locator('[data-testid="excel-sheet-tab-Flujos"]').click();
        const gridText = await page.locator('[data-testid="excel-grid"]').innerText();
        assertMatchesAll(gridText, [/15[.,]176/, /13[.,]662[.,]14/, /51[.,]13%|50[.,]84%/], 'T1-09-03 Flujos');
        assertNoTelemetryErrors(telemetry, 'T1-09-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-09-04', 'UF-09', 'Clicking a formula cell in excel-grid populates excel-formula-bar with "=" formula', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'excel', 'key');
        await page.locator('[data-testid="excel-sheet-tab-Resumen"]').click();
        const formulaCell = page.locator('[data-testid="excel-grid"] [data-formula^="="], [data-testid="excel-grid"] td.has-formula, [data-testid="excel-grid"] td').filter({ hasText: /15,176|51\.13%|192\.78%/ }).first();
        await formulaCell.click();
        const fxText = (await page.locator('[data-testid="excel-formula-bar"]').innerText()).trim();
        assert.ok(fxText.includes('='), `Expected formula starting/containing "=" in formula bar, got "${fxText}"`);
        assertNoTelemetryErrors(telemetry, 'T1-09-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-09-05', 'UF-09', 'Clicking Excel chip on S26 opens COCOMO sheet with 8.757 and 3,500', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S26');
        await page.locator('[data-testid="ref-chip"][data-ref-type="excel"]').first().click();
        await page.waitForFunction(() => {
          const d = document.querySelector('[data-testid="evidence-drawer"]');
          return d && d.getAttribute('data-open') === 'true' && d.getAttribute('data-active-tab') === 'excel';
        });
        const gridText = await page.locator('[data-testid="excel-grid"]').innerText();
        assertMatchesAll(gridText, [/8[.,]757/, /3[.,]500/], 'T1-09-05 COCOMO');
        assertNoTelemetryErrors(telemetry, 'T1-09-05');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-09-06', 'UF-09', 'Excel download link targets local .xlsx file and returns HTTP 200', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'excel', 'key');
        const link = page.locator('[data-testid="excel-download-link"]');
        await link.waitFor({ state: 'visible', timeout: 5000 });
        const href = await link.getAttribute('href');
        assert.ok(href && href.endsWith('.xlsx'));
        const res = await page.request.get(new URL(href, `${baseOrigin}/`).href);
        assert.equal(res.status(), 200);
        assertNoTelemetryErrors(telemetry, 'T1-09-06');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-10: Offline Sistema POS Drawer S (T1-10-01..T1-10-06)
  // =========================================================================
  tests.push(
    makeTest('T1-10-01', 'UF-10', 'Pressing S opens sistema-pos-view inside evidence-drawer with pathname unchanged', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const initPath = await getPathname(page);
        await openDrawerTab(page, 'sistema', 'key');
        await page.locator('[data-testid="sistema-pos-view"]').waitFor({ state: 'visible', timeout: 5000 });
        await assertPathnameInvariant(page, initPath, 'T1-10-01');
        assertNoTelemetryErrors(telemetry, 'T1-10-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-10-02', 'UF-10', 'sistema-role-select lists 4 MREC RBAC roles (37/14/74/47 permissions)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'sistema', 'key');
        const select = page.locator('[data-testid="sistema-role-select"]');
        await select.waitFor({ state: 'visible', timeout: 5000 });
        const roleText = await select.innerText();
        assertMatchesAll(roleText, [/Vendedor/i, /Bodega/i, /Administración/i, /Gerencia/i], 'T1-10-02 roles');
        assertNoTelemetryErrors(telemetry, 'T1-10-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-10-03', 'UF-10', 'Clicking sistema-open-shift opens cash shift in C$', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'sistema', 'key');
        await page.locator('[data-testid="sistema-open-shift"]').click();
        const viewText = await page.locator('[data-testid="sistema-pos-view"]').innerText();
        assert.match(viewText, /Turno abierto|C\$/i);
        assertNoTelemetryErrors(telemetry, 'T1-10-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-10-04', 'UF-10', 'Adding an ACA-* item computes subtotal and IVA 15%', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'sistema', 'key');
        await page.locator('[data-testid="sistema-open-shift"]').click();
        await page.locator('[data-testid="sistema-add-item"]').first().click();
        const viewText = await page.locator('[data-testid="sistema-pos-view"]').innerText();
        assertMatchesAll(viewText, [/ACA-/, /IVA/i, /15%/], 'T1-10-04 POS cart');
        assertNoTelemetryErrors(telemetry, 'T1-10-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-10-05', 'UF-10', 'Confirming sale emits invoice receipt F-000000xx', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'sistema', 'key');
        await page.locator('[data-testid="sistema-open-shift"]').click();
        await page.locator('[data-testid="sistema-add-item"]').first().click();
        await page.locator('[data-testid="sistema-confirm-sale"]').click();
        const receipt = page.locator('[data-testid="sistema-receipt"]');
        await receipt.waitFor({ state: 'visible', timeout: 5000 });
        const receiptText = await receipt.innerText();
        assert.match(receiptText, /F-\d{8}/);
        assertNoTelemetryErrors(telemetry, 'T1-10-05');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-10-06', 'UF-10', 'Switching role from Vendedor to Bodega restricts POS checkout capability', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'sistema', 'key');
        const select = page.locator('[data-testid="sistema-role-select"]');
        const options = await select.locator('option').allInnerTexts();
        const bodegaIdx = options.findIndex((o) => /bodega/i.test(o));
        assert.ok(bodegaIdx >= 0, 'Bodega option missing in sistema-role-select');
        await select.selectOption({ index: bodegaIdx });
        const viewText = await page.locator('[data-testid="sistema-pos-view"]').innerText();
        assert.match(viewText, /14|Bodega|restringido|solo.*vendedor/i);
        assertNoTelemetryErrors(telemetry, 'T1-10-06');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-11: Evidencias Drawer (T1-11-01..T1-11-06)
  // =========================================================================
  tests.push(
    makeTest('T1-11-01', 'UF-11', 'Opening Evidencias drawer renders evidencias-list and evidencias-detail', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'evidencias', 'button');
        await page.locator('[data-testid="evidencias-list"]').waitFor({ state: 'visible', timeout: 5000 });
        await page.locator('[data-testid="evidencias-detail"]').waitFor({ state: 'visible', timeout: 5000 });
        assertNoTelemetryErrors(telemetry, 'T1-11-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-11-02', 'UF-11', 'Selecting regression evidence shows 104 -> 111 -> 113 -> 120 and 289.28 s', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'evidencias', 'button');
        const item = page.locator('[data-testid="evidencias-list"] button, [data-testid="evidencias-list"] [role="button"], [data-testid="evidencias-list"] li').filter({ hasText: /regresi[oó]n|120/i }).first();
        await item.click();
        const detail = await page.locator('[data-testid="evidencias-detail"]').innerText();
        assertMatchesAll(detail, ['104', '111', '113', '120', /289[.,]28/], 'T1-11-02');
        assertNoTelemetryErrors(telemetry, 'T1-11-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-11-03', 'UF-11', 'Selecting 20,000 catalog evidence shows P95 0.029 s', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'evidencias', 'button');
        const item = page.locator('[data-testid="evidencias-list"] button, [data-testid="evidencias-list"] [role="button"], [data-testid="evidencias-list"] li').filter({ hasText: /20[\s.,]?000|cat[aá]logo/i }).first();
        await item.click();
        const detail = await page.locator('[data-testid="evidencias-detail"]').innerText();
        assertMatchesAll(detail, [/20[\s.,]?000/, /0[.,]029/], 'T1-11-03');
        assertNoTelemetryErrors(telemetry, 'T1-11-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-11-04', 'UF-11', 'Selecting 500 concurrent sales evidence shows P95 1.142 s and 10 report sessions 0.648 s', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'evidencias', 'button');
        const item = page.locator('[data-testid="evidencias-list"] button, [data-testid="evidencias-list"] [role="button"], [data-testid="evidencias-list"] li').filter({ hasText: /500|concurrencia/i }).first();
        await item.click();
        const detail = await page.locator('[data-testid="evidencias-detail"]').innerText();
        assertMatchesAll(detail, ['500', /1[.,]142/, /0[.,]648/], 'T1-11-04');
        assertNoTelemetryErrors(telemetry, 'T1-11-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-11-05', 'UF-11', 'Selecting backup/restore evidence displays backup_database, verify_restore, SHA-256, BitLocker, 46 migraciones', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await openDrawerTab(page, 'evidencias', 'button');
        const item = page.locator('[data-testid="evidencias-list"] button, [data-testid="evidencias-list"] [role="button"], [data-testid="evidencias-list"] li').filter({ hasText: /respaldo|backup|usb/i }).first();
        await item.click();
        const detail = await page.locator('[data-testid="evidencias-detail"]').innerText();
        assertMatchesAll(detail, ['backup_database', 'verify_restore', 'SHA-256', 'BitLocker', '46'], 'T1-11-05');
        assertNoTelemetryErrors(telemetry, 'T1-11-05');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-11-06', 'UF-11', 'Switching across all 4 drawer tabs preserves data-open="true" and pathname', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        const initPath = await getPathname(page);
        await openDrawerTab(page, 'documento', 'button');
        for (const tab of ['excel', 'sistema', 'evidencias', 'documento']) {
          await openDrawerTab(page, tab, 'button');
          assert.equal(await page.locator('[data-testid="evidence-drawer"]').getAttribute('data-open'), 'true');
          await assertPathnameInvariant(page, initPath, `switch->${tab}`);
        }
        assertNoTelemetryErrors(telemetry, 'T1-11-06');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-12: S07 SABD Trigger & S10/S12/S13 Planning Simulations (T1-12-01..T1-12-06)
  // =========================================================================
  tests.push(
    makeTest('T1-12-01', 'UF-12', 'On S07, sim-s07-stock initializes at 3 (Pistón 150cc)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S07');
        const stockText = await page.locator('[data-testid="sim-s07-stock"]').innerText();
        assert.match(stockText, /\b3\b/);
        assertNoTelemetryErrors(telemetry, 'T1-12-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-12-02', 'UF-12', 'On S07, clicking sim-s07-sell-1 decrements stock 3 -> 2 and updates status', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S07');
        await page.locator('[data-testid="sim-s07-sell-1"]').click();
        assert.match(await page.locator('[data-testid="sim-s07-stock"]').innerText(), /\b2\b/);
        const status = await page.locator('[data-testid="sim-s07-status"]').innerText();
        assert.match(status, /2|deduc|éxito|trigger|ok/i);
        assertNoTelemetryErrors(telemetry, 'T1-12-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-12-03', 'UF-12', 'On S07, clicking sim-s07-sell-5 triggers RAISE EXCEPTION leaving stock unchanged', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S07');
        await page.locator('[data-testid="sim-s07-sell-1"]').click();
        await page.locator('[data-testid="sim-s07-sell-5"]').click();
        assert.match(await page.locator('[data-testid="sim-s07-stock"]').innerText(), /\b2\b/);
        const status = await page.locator('[data-testid="sim-s07-status"]').innerText();
        assert.match(status, /RAISE EXCEPTION|45000|insuficiente|bloque/i);
        assertNoTelemetryErrors(telemetry, 'T1-12-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-12-04', 'UF-12', 'On S07, clicking sim-s07-reset restores stock to 3', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S07');
        await page.locator('[data-testid="sim-s07-sell-1"]').click();
        await page.locator('[data-testid="sim-s07-reset"]').click();
        assert.match(await page.locator('[data-testid="sim-s07-stock"]').innerText(), /\b3\b/);
        assertNoTelemetryErrors(telemetry, 'T1-12-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-12-05', 'UF-12', 'S10 and S12 render exact architecture and methodology decision scores', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S10');
        const s10Text = await page.locator('[data-testid="slide-container"]').innerText();
        assertMatchesAll(s10Text, ['72', '96', '74', /Monolito modular/i], 'T1-12-05 S10');
        await navigateToSlide(page, 'S12');
        const s12Text = await page.locator('[data-testid="slide-container"]').innerText();
        assertMatchesAll(s12Text, ['Incremental', '88', '79', '78', '54', 'DESCARTADO'], 'T1-12-05 S12');
        assertNoTelemetryErrors(telemetry, 'T1-12-05');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-12-06', 'UF-12', 'On S13, clicking WBS/CPM/Gantt/RACI tabs switches sim-s13-panel content', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S13');
        const panel = page.locator('[data-testid="sim-s13-panel"]');
        await page.locator('[data-testid="sim-s13-tab-wbs"]').click();
        assert.match(await panel.innerText(), /I1|1\.0|WBS|Incremento/i);
        await page.locator('[data-testid="sim-s13-tab-cpm"]').click();
        assert.match(await panel.innerText(), /crítica|holgura|60/i);
        await page.locator('[data-testid="sim-s13-tab-gantt"]').click();
        assert.match(await panel.innerText(), /12\s*semanas|S1|I1/i);
        await page.locator('[data-testid="sim-s13-tab-raci"]').click();
        assert.match(await panel.innerText(), /AAA|NIA|MNP/);
        assertNoTelemetryErrors(telemetry, 'T1-12-06');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-13: S20 Concurrency Race & Ignition Climax (T1-13-01..T1-13-06)
  // =========================================================================
  tests.push(
    makeTest('T1-13-01', 'UF-13', 'On S20, initial stock displays 1 and sim-s20-run-race button is enabled', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S20');
        const btn = page.locator('[data-testid="sim-s20-run-race"]');
        await btn.waitFor({ state: 'visible', timeout: 5000 });
        assert.equal(await btn.isEnabled(), true);
        assert.match(await page.locator('[data-testid="sim-s20-stock"]').innerText(), /\b1\b/);
        assertNoTelemetryErrors(telemetry, 'T1-13-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-13-02', 'UF-13', 'Clicking sim-s20-run-race executes deterministic race and leaves stock at 0', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S20');
        await page.locator('[data-testid="sim-s20-run-race"]').click();
        await page.waitForFunction(() => {
          const el = document.querySelector('[data-testid="sim-s20-stock"]');
          return el && /\b0\b/.test(el.textContent || '');
        }, null, { timeout: 6000 });
        assert.match(await page.locator('[data-testid="sim-s20-stock"]').innerText(), /\b0\b/);
        assertNoTelemetryErrors(telemetry, 'T1-13-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-13-03', 'UF-13', 'sim-s20-result reports 1 confirmed sale and 1 blocked sale citing quantity__gte', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S20');
        await page.locator('[data-testid="sim-s20-run-race"]').click();
        await page.waitForFunction(() => {
          const el = document.querySelector('[data-testid="sim-s20-result"]');
          return el && /quantity__gte/i.test(el.textContent || '');
        }, null, { timeout: 6000 });
        const resultText = await page.locator('[data-testid="sim-s20-result"]').innerText();
        assertMatchesAll(resultText, ['quantity__gte', /1/, /confirm|éxito|acept/i, /rechaz|bloque/i], 'T1-13-03');
        assertNoTelemetryErrors(telemetry, 'T1-13-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-13-04', 'UF-13', 'sim-s20-metrics displays verified P95 0.029 s, 1.142 s, and 120 / 120 (0 fallos)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S20');
        const metricsText = await page.locator('[data-testid="sim-s20-metrics"]').innerText();
        assertMatchesAll(metricsText, [/0[.,]029\s*s/, /1[.,]142\s*s/, /120\s*\/\s*120/, /0\s*fallos/i], 'T1-13-04');
        assertNoTelemetryErrors(telemetry, 'T1-13-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-13-05', 'UF-13', 'Clicking sim-s20-run-race a second time repeats deterministic 1 -> 0 race', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S20');
        const btn = page.locator('[data-testid="sim-s20-run-race"]');
        await btn.click();
        await page.waitForFunction(() => /\b0\b/.test(document.querySelector('[data-testid="sim-s20-stock"]')?.textContent || ''));
        await btn.click();
        await page.waitForFunction(() => /quantity__gte/i.test(document.querySelector('[data-testid="sim-s20-result"]')?.textContent || ''));
        assert.match(await page.locator('[data-testid="sim-s20-stock"]').innerText(), /\b0\b/);
        assertNoTelemetryErrors(telemetry, 'T1-13-05');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-13-06', 'UF-13', 'Navigating S20 -> S21 -> S20 keeps sim-s20-run-race cleanly operational', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S20');
        await stepNext(page, 1);
        await waitForSlide(page, 'S21');
        await stepPrev(page, 1);
        await waitForSlide(page, 'S20');
        await page.locator('[data-testid="sim-s20-run-race"]').click();
        await page.waitForFunction(() => /\b0\b/.test(document.querySelector('[data-testid="sim-s20-stock"]')?.textContent || ''));
        assertNoTelemetryErrors(telemetry, 'T1-13-06');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-14: S25 M/M/c Queue Toggle & S31 Traceability Matrix (T1-14-01..T1-14-06)
  // =========================================================================
  tests.push(
    makeTest('T1-14-01', 'UF-14', 'On S25, 2-cajas default displays 22.8 min Wq and 95% utilization', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S25');
        assert.match(await page.locator('[data-testid="sim-s25-wq"]').innerText(), /22[.,]8\s*min/);
        assert.match(await page.locator('[data-testid="sim-s25-rho"]').innerText(), /95(\.0+)?\s*%/);
        assertNoTelemetryErrors(telemetry, 'T1-14-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-14-02', 'UF-14', 'On S25, clicking sim-s25-toggle-4 switches Wq to 20.6 s and rho to 47.5%', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S25');
        await page.locator('[data-testid="sim-s25-toggle-4"]').click();
        assert.match(await page.locator('[data-testid="sim-s25-wq"]').innerText(), /20[.,]6\s*s/);
        assert.match(await page.locator('[data-testid="sim-s25-rho"]').innerText(), /47[.,]5\s*%/);
        assertNoTelemetryErrors(telemetry, 'T1-14-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-14-03', 'UF-14', 'On S25, clicking sim-s25-toggle-2 restores 22.8 min and 95%', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S25');
        await page.locator('[data-testid="sim-s25-toggle-4"]').click();
        await page.locator('[data-testid="sim-s25-toggle-2"]').click();
        assert.match(await page.locator('[data-testid="sim-s25-wq"]').innerText(), /22[.,]8\s*min/);
        assert.match(await page.locator('[data-testid="sim-s25-rho"]').innerText(), /95(\.0+)?\s*%/);
        assertNoTelemetryErrors(telemetry, 'T1-14-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-14-04', 'UF-14', 'S25 displays ticket C$ 240.38, 1,040 facturas/mes, and abandonment figures', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S25');
        const text = await page.locator('[data-testid="slide-container"]').innerText();
        assertMatchesAll(text, [/240[.,]38/, /1[.,\s]?040/, /6[.,]5\s*%/, /5[.,]298[.,]84/], 'T1-14-04');
        assertNoTelemetryErrors(telemetry, 'T1-14-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-14-05', 'UF-14', 'On S31, sim-s31-matrix renders exactly 16 sim-s31-row entries (100% OK)', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S31');
        await page.locator('[data-testid="sim-s31-matrix"]').waitFor({ state: 'visible', timeout: 5000 });
        const rows = page.locator('[data-testid="sim-s31-row"]');
        assert.equal(await rows.count(), 16, 'Cap. 18 traceability matrix must have exactly 16 rows');
        const matrixText = await page.locator('[data-testid="sim-s31-matrix"]').innerText();
        assert.match(matrixText, /100\s*%\s*OK/i);
        assertNoTelemetryErrors(telemetry, 'T1-14-05');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-14-06', 'UF-14', 'On S31, clicking a sim-s31-row highlights and displays its full traced chain', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S31');
        const row = page.locator('[data-testid="sim-s31-row"]').first();
        await row.click();
        const slideText = await page.locator('[data-testid="slide-container"]').innerText();
        assert.match(slideText, /RF-01|RN-|ST-REQ-|SYS-FN-|SRS-/);
        assertNoTelemetryErrors(telemetry, 'T1-14-06');
      } finally {
        await session.close();
      }
    })
  );

  // =========================================================================
  // UF-15: S28 Financial Sensitivity & TMAR Live Slider (T1-15-01..T1-15-06)
  // =========================================================================
  tests.push(
    makeTest('T1-15-01', 'UF-15', 'On S28, default Base 12.00% TMAR displays VAN $15,176.26 and TIR 50.84%', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S28');
        const vanText = await page.locator('[data-testid="sim-s28-van"]').innerText();
        const tirText = await page.locator('[data-testid="sim-s28-tir"]').innerText();
        assert.match(vanText, /15[.,\s]?176[.,]26/);
        assert.match(tirText, /50[.,]84\s*%/);
        assertNoTelemetryErrors(telemetry, 'T1-15-01');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-15-02', 'UF-15', 'Selecting Pesimista at 12% updates VAN to ~$4,361.86 and TIR to 24.23%', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S28');
        await page.locator('[data-testid="sim-s28-scenario-pesimista"]').click();
        const vanVal = parseNumericValue(await page.locator('[data-testid="sim-s28-van"]').innerText());
        assert.ok(Math.abs(vanVal - 4361.8) < 2.0, `Expected Pesimista VAN ~4361.86, got ${vanVal}`);
        assert.match(await page.locator('[data-testid="sim-s28-tir"]').innerText(), /24[.,]23\s*%/);
        assertNoTelemetryErrors(telemetry, 'T1-15-02');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-15-03', 'UF-15', 'Selecting Optimista at 12% updates VAN to ~$24,548.74 and TIR to 72.51%', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S28');
        await page.locator('[data-testid="sim-s28-scenario-optimista"]').click();
        const vanVal = parseNumericValue(await page.locator('[data-testid="sim-s28-van"]').innerText());
        assert.ok(Math.abs(vanVal - 24548.7) < 2.0, `Expected Optimista VAN ~24548.74, got ${vanVal}`);
        assert.match(await page.locator('[data-testid="sim-s28-tir"]').innerText(), /72[.,]51\s*%/);
        assertNoTelemetryErrors(telemetry, 'T1-15-03');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-15-04', 'UF-15', 'Adjusting sim-s28-tmar-slider to 20% lowers VAN below $15,176.26', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S28');
        const slider = page.locator('[data-testid="sim-s28-tmar-slider"]');
        await slider.fill('20');
        await slider.dispatchEvent('input');
        await slider.dispatchEvent('change');
        assert.match(await page.locator('[data-testid="sim-s28-tmar-value"]').innerText(), /20([.,]00)?\s*%/);
        const vanVal = parseNumericValue(await page.locator('[data-testid="sim-s28-van"]').innerText());
        assert.ok(vanVal < 15176.26 && vanVal > 9000, `Expected Base VAN at 20% ~10262.76, got ${vanVal}`);
        assertNoTelemetryErrors(telemetry, 'T1-15-04');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-15-05', 'UF-15', 'Returning TMAR slider to 12% on Base restores exact $15,176.26 VAN', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S28');
        const slider = page.locator('[data-testid="sim-s28-tmar-slider"]');
        await slider.fill('20');
        await slider.dispatchEvent('input');
        await slider.fill('12');
        await slider.dispatchEvent('input');
        await slider.dispatchEvent('change');
        assert.match(await page.locator('[data-testid="sim-s28-van"]').innerText(), /15[.,\s]?176[.,]26/);
        assertNoTelemetryErrors(telemetry, 'T1-15-05');
      } finally {
        await session.close();
      }
    }),
    makeTest('T1-15-06', 'UF-15', 'Clicking "Comprobar en Excel" on S28 opens Excel drawer on Flujos sheet', async ({ browser, baseOrigin }) => {
      const session = await createIsolatedSession(browser, baseOrigin);
      try {
        const { page, telemetry } = session;
        await navigateToSlide(page, 'S28');
        const excelBtn = page.locator('button, [role="button"]').filter({ hasText: /Comprobar en Excel/i }).first();
        await excelBtn.click();
        await page.waitForFunction(() => {
          const d = document.querySelector('[data-testid="evidence-drawer"]');
          return d && d.getAttribute('data-open') === 'true' && d.getAttribute('data-active-tab') === 'excel';
        });
        const gridText = await page.locator('[data-testid="excel-grid"]').innerText();
        assert.match(gridText, /15[.,]176/);
        assertNoTelemetryErrors(telemetry, 'T1-15-06');
      } finally {
        await session.close();
      }
    })
  );

  assert.equal(tests.length, 90, `Tier 1 must contain exactly 90 tests, got ${tests.length}`);
  return tests;
}
