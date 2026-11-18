import assert from 'node:assert/strict';

export const ALL_SLIDE_IDS = Array.from({ length: 36 }, (_, i) => `S${String(i).padStart(2, '0')}`);

export const SLIDE_TO_CHAPTER_MAP = {
  S00: null,
  S01: null,
  S02: '01',
  S03: '01',
  S04: '02',
  S05: '02',
  S06: '01',
  S07: '01',
  S08: '03',
  S09: '03',
  S10: '04',
  S11: '04',
  S12: '05',
  S13: '05',
  S14: '06',
  S15: '07',
  S16: '08',
  S17: '09',
  S18: '10',
  S19: '11',
  S20: '12',
  S21: '13',
  S22: '14',
  S23: '14',
  S24: '14',
  S25: '15',
  S26: '15',
  S27: '15',
  S28: '15',
  S29: '16',
  S30: '17',
  S31: '18',
  S32: '19',
  S33: '19',
  S34: '20',
  S35: null
};

export const EXCEL_SHEETS = [
  'Resumen',
  'Supuestos',
  'COCOMO',
  'Infraestructura',
  'Riesgos',
  'Inversion',
  'Beneficios',
  'Flujos',
  'Capacidades'
];

export function assertNoTelemetryErrors(telemetry, label = 'session') {
  assert.equal(
    telemetry.blockedExternalRequests.length,
    0,
    `[${label}] External network requests blocked: ${JSON.stringify(telemetry.blockedExternalRequests)}`
  );
  assert.equal(
    telemetry.consoleErrors.length,
    0,
    `[${label}] Console errors occurred: ${JSON.stringify(telemetry.consoleErrors)}`
  );
  assert.equal(
    telemetry.pageErrors.length,
    0,
    `[${label}] Uncaught pageerror occurred: ${JSON.stringify(telemetry.pageErrors)}`
  );
  assert.equal(
    telemetry.httpErrors.length,
    0,
    `[${label}] HTTP >= 400 responses occurred: ${JSON.stringify(telemetry.httpErrors)}`
  );
  assert.equal(
    telemetry.requestFailures.length,
    0,
    `[${label}] Failed local requests occurred: ${JSON.stringify(telemetry.requestFailures)}`
  );
}

export async function getPathname(page) {
  return page.evaluate(() => window.location.pathname);
}

export async function assertPathnameInvariant(page, initialPathname, label = 'operation') {
  const current = await getPathname(page);
  assert.equal(
    current,
    initialPathname,
    `[${label}] window.location.pathname changed from "${initialPathname}" to "${current}"`
  );
}

export async function getCurrentSlideId(page) {
  const el = page.locator('[data-testid="slide-container"]').first();
  await el.waitFor({ state: 'visible', timeout: 8000 });
  return el.getAttribute('data-slide-id');
}

export async function waitForSlide(page, slideId, timeoutMs = 6000) {
  const locator = page.locator(`[data-testid="slide-container"][data-slide-id="${slideId}"]`);
  await locator.waitFor({ state: 'visible', timeout: timeoutMs });
  // Ensure slide container is interactive and not hidden behind an act-transition blocker
  await page.waitForFunction(
    (expectedId) => {
      const container = document.querySelector('[data-testid="slide-container"]');
      if (!container || container.getAttribute('data-slide-id') !== expectedId) return false;
      const style = window.getComputedStyle(container);
      return style.visibility !== 'hidden' && Number(style.opacity) > 0.1;
    },
    slideId,
    { timeout: timeoutMs }
  );
  return locator;
}

export async function getOdometerState(page) {
  const odoEl = page.locator('[data-testid="odometer"]').first();
  await odoEl.waitFor({ state: 'visible', timeout: 5000 });
  const raw = (await odoEl.innerText()).trim();
  const match = /(\d{1,3})\s*\/\s*(\d{1,3})/.exec(raw);
  assert.ok(match, `Odometer text "${raw}" does not match NNN/NNN format`);
  const current = Number(match[1]);
  const total = Number(match[2]);
  const isOneBased = total === 36;
  assert.ok(total === 35 || total === 36, `Unexpected odometer total "${total}" in "${raw}"`);
  const index0 = isOneBased ? current - 1 : current;
  assert.ok(index0 >= 0 && index0 <= 35, `Odometer index0 out of range [0..35]: ${index0} (${raw})`);
  return { raw, current, total, index0, isOneBased };
}

export async function openOverview(page) {
  const modal = page.locator('[data-testid="overview-modal"]');
  const isAlreadyVisible = await modal.isVisible().catch(() => false);
  if (!isAlreadyVisible) {
    await page.keyboard.press('o');
    const visibleAfterKey = await modal.waitFor({ state: 'visible', timeout: 2500 }).then(() => true).catch(() => false);
    if (!visibleAfterKey) {
      await page.locator('[data-testid="btn-overview"]').click();
      await modal.waitFor({ state: 'visible', timeout: 5000 });
    }
  }
  return modal;
}

export async function closeOverview(page, method = 'key') {
  const modal = page.locator('[data-testid="overview-modal"]');
  const isVisible = await modal.isVisible().catch(() => false);
  if (!isVisible) return;
  if (method === 'esc') {
    await page.keyboard.press('Escape');
  } else {
    await page.keyboard.press('o');
  }
  await modal.waitFor({ state: 'hidden', timeout: 5000 });
}

export async function navigateToSlide(page, targetSlideId) {
  const current = await getCurrentSlideId(page);
  if (current === targetSlideId) {
    return waitForSlide(page, targetSlideId);
  }

  // Prefer direct Overview slide selector [data-testid="overview-slide-SXX"]
  await openOverview(page);
  const directSelector = page.locator(`[data-testid="overview-slide-${targetSlideId}"]`).first();
  if ((await directSelector.count()) > 0) {
    await directSelector.click();
    await page.locator('[data-testid="overview-modal"]').waitFor({ state: 'hidden', timeout: 5000 });
    return waitForSlide(page, targetSlideId);
  }

  // Fallback: close overview and step via btn-next / btn-prev
  await closeOverview(page, 'esc');
  const targetIdx = ALL_SLIDE_IDS.indexOf(targetSlideId);
  const currentIdx = ALL_SLIDE_IDS.indexOf(current);
  assert.ok(targetIdx >= 0, `Unknown target slide ID: ${targetSlideId}`);
  const diff = targetIdx - currentIdx;
  const btn = diff > 0 ? '[data-testid="btn-next"]' : '[data-testid="btn-prev"]';
  for (let i = 0; i < Math.abs(diff); i += 1) {
    await page.locator(btn).click();
  }
  return waitForSlide(page, targetSlideId);
}

export async function stepNext(page, count = 1) {
  for (let i = 0; i < count; i += 1) {
    const prevId = await getCurrentSlideId(page);
    const prevIdx = ALL_SLIDE_IDS.indexOf(prevId);
    await page.locator('[data-testid="btn-next"]').click();
    if (prevIdx >= 0 && prevIdx < 35) {
      await waitForSlide(page, ALL_SLIDE_IDS[prevIdx + 1]);
    }
  }
}

export async function stepPrev(page, count = 1) {
  for (let i = 0; i < count; i += 1) {
    const prevId = await getCurrentSlideId(page);
    const prevIdx = ALL_SLIDE_IDS.indexOf(prevId);
    await page.locator('[data-testid="btn-prev"]').click();
    if (prevIdx > 0) {
      await waitForSlide(page, ALL_SLIDE_IDS[prevIdx - 1]);
    }
  }
}

export async function openDrawerTab(page, tabName, trigger = 'button') {
  const drawer = page.locator('[data-testid="evidence-drawer"]');
  if (trigger === 'key') {
    const keyMap = { documento: 'd', excel: 'e', sistema: 's' };
    const k = keyMap[tabName];
    assert.ok(k, `No keyboard shortcut defined for drawer tab "${tabName}"`);
    await page.keyboard.press(k);
  } else {
    const isOpen = (await drawer.getAttribute('data-open')) === 'true';
    if (isOpen) {
      await page.locator(`[data-testid="drawer-tab-${tabName}"]`).click();
    } else {
      await page.locator(`[data-testid="btn-drawer-${tabName}"]`).click();
    }
  }
  await page.waitForFunction(
    (tab) => {
      const el = document.querySelector('[data-testid="evidence-drawer"]');
      return el && el.getAttribute('data-open') === 'true' && el.getAttribute('data-active-tab') === tab;
    },
    tabName,
    { timeout: 8000 }
  );
  return drawer;
}

export async function closeDrawer(page, method = 'button') {
  const drawer = page.locator('[data-testid="evidence-drawer"]');
  const isOpen = (await drawer.getAttribute('data-open')) === 'true';
  if (!isOpen) return;

  if (method === 'esc') {
    await page.keyboard.press('Escape');
  } else if (method === 'key-d') {
    await page.keyboard.press('d');
  } else if (method === 'key-e') {
    await page.keyboard.press('e');
  } else {
    await page.locator('[data-testid="drawer-close"]').click();
  }

  await page.waitForFunction(
    () => {
      const el = document.querySelector('[data-testid="evidence-drawer"]');
      return !el || el.getAttribute('data-open') === 'false';
    },
    null,
    { timeout: 5000 }
  );
}

export async function waitForPdfRendered(page, expectedPage = null) {
  const canvas = page.locator('[data-testid="pdf-canvas"]').first();
  await canvas.waitFor({ state: 'visible', timeout: 15000 });
  await page.waitForFunction(
    (expPage) => {
      const c = document.querySelector('[data-testid="pdf-canvas"]');
      const ind = document.querySelector('[data-testid="pdf-page-indicator"]');
      if (!c || c.width === 0 || c.height === 0) return false;
      if (expPage !== null && ind) {
        return new RegExp(`\\b${expPage}\\b`).test(ind.textContent || '');
      }
      return true;
    },
    expectedPage,
    { timeout: 15000 }
  );
  const dims = await canvas.evaluate((c) => {
    const ctx = c.getContext('2d');
    let hasNonEmptyPixels = false;
    if (ctx && c.width > 0 && c.height > 0) {
      const sampleW = Math.min(c.width, 120);
      const sampleH = Math.min(c.height, 120);
      const data = ctx.getImageData(0, 0, sampleW, sampleH).data;
      const r0 = data[0];
      const g0 = data[1];
      const b0 = data[2];
      const a0 = data[3];
      for (let i = 0; i < data.length; i += 16) {
        if (
          Math.abs(data[i] - r0) +
            Math.abs(data[i + 1] - g0) +
            Math.abs(data[i + 2] - b0) +
            Math.abs(data[i + 3] - a0) >
          10
        ) {
          hasNonEmptyPixels = true;
          break;
        }
      }
    }
    return { width: c.width, height: c.height, hasNonEmptyPixels };
  });
  return dims;
}

export function assertMatchesAll(text, patterns, label = 'text check') {
  for (const pat of patterns) {
    if (typeof pat === 'string') {
      assert.ok(
        text.toLowerCase().includes(pat.toLowerCase()),
        `[${label}] Expected text to include "${pat}". Actual snippet: "${text.slice(0, 400)}..."`
      );
    } else {
      assert.match(text, pat, `[${label}] Expected text to match ${pat}`);
    }
  }
}

export function parseNumericValue(raw) {
  const cleaned = String(raw)
    .replace(/USD|NIO|C\$|\$|%|años|año|min|s/gi, '')
    .replace(/\s+/g, '')
    .replace(/,/g, '');
  const val = Number.parseFloat(cleaned);
  assert.ok(Number.isFinite(val), `Cannot parse numeric value from "${raw}"`);
  return val;
}

export function computeExpectedVan(i0, fc, tmarPercent, years = 5) {
  const i = tmarPercent / 100;
  if (i === 0) {
    return -i0 + fc * years;
  }
  const factor = (1 - Math.pow(1 + i, -years)) / i;
  return -i0 + fc * factor;
}
