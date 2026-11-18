import zlib from 'node:zlib';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { CHROME_EXECUTABLE_PATH, PLAYWRIGHT_CORE_PATH } from './server.mjs';

export async function loadPlaywright() {
  const pwUrl = pathToFileURL(PLAYWRIGHT_CORE_PATH).href;
  let playwright;
  try {
    playwright = await import(pwUrl);
  } catch (err) {
    throw new Error(
      `Cannot resolve playwright-core at ${PLAYWRIGHT_CORE_PATH}. Run offline npm install first. Original error: ${err.message}`
    );
  }
  return playwright;
}

export async function launchHeadlessChrome(playwright) {
  const { chromium } = playwright;
  return chromium.launch({
    executablePath: CHROME_EXECUTABLE_PATH,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--enable-webgl',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--enable-unsafe-swiftshader',
      '--ignore-gpu-blocklist'
    ]
  });
}

/**
 * Creates a fresh isolated BrowserContext + Page with:
 * - Strict non-localhost external request blocker (data:/blob:/baseOrigin only)
 * - Telemetry collectors from t=0 (consoleErrors, pageErrors, httpErrors, blockedExternalRequests, requestFailures)
 * - Optional reducedMotion ('reduce' | 'no-preference')
 * - Optional disableWebGL (forces getContext('webgl'|'webgl2') -> null before app boots)
 */
export async function createIsolatedSession(browser, baseOrigin, options = {}) {
  const {
    viewport = { width: 1280, height: 720 },
    reducedMotion = 'no-preference',
    disableWebGL = false,
    urlPath = '/'
  } = options;

  const telemetry = {
    consoleErrors: [],
    pageErrors: [],
    httpErrors: [],
    blockedExternalRequests: [],
    requestFailures: []
  };

  const context = await browser.newContext({
    viewport,
    reducedMotion
  });

  if (disableWebGL) {
    await context.addInitScript(() => {
      const origGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function patchedGetContext(type, ...args) {
        if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
          return null;
        }
        return origGetContext.call(this, type, ...args);
      };
    });
  }

  await context.route('**/*', (route) => {
    const url = route.request().url();
    const allowed =
      url.startsWith(`${baseOrigin}/`) ||
      url === baseOrigin ||
      url.startsWith('data:') ||
      url.startsWith('blob:');

    if (!allowed) {
      telemetry.blockedExternalRequests.push({
        url,
        resourceType: route.request().resourceType()
      });
      return route.abort('blockedbyclient');
    }
    return route.continue();
  });

  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      telemetry.consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    telemetry.pageErrors.push(err?.stack || err?.message || String(err));
  });

  page.on('response', (res) => {
    if (res.status() >= 400) {
      telemetry.httpErrors.push({ url: res.url(), status: res.status() });
    }
  });

  page.on('requestfailed', (req) => {
    const errText = req.failure()?.errorText || 'unknown';
    // Ignore aborted requests only if they were already logged as blockedExternalRequests
    const isExternalBlocked = telemetry.blockedExternalRequests.some((b) => b.url === req.url());
    if (!isExternalBlocked) {
      telemetry.requestFailures.push({ url: req.url(), error: errText });
    }
  });

  const targetUrl = urlPath.startsWith('http') ? urlPath : `${baseOrigin}${urlPath}`;
  await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-testid="slide-container"]', { timeout: 15000 });
  await page.evaluate(() => document.fonts?.ready);

  return {
    context,
    page,
    telemetry,
    async close() {
      await context.close();
    }
  };
}

function paethPredictor(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  if (pb <= pc) return b;
  return c;
}

/**
 * Pure Node PNG decoder using zlib.inflateSync + PNG scanline filter reconstruction.
 * Supports 8-bit Grayscale (0), RGB (2), Grayscale+Alpha (4), and RGBA (6).
 * Returns { width, height, rgba: Uint8Array }.
 */
export function decodePngBuffer(pngBuf) {
  const sig = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  for (let i = 0; i < sig.length; i += 1) {
    if (pngBuf[i] !== sig[i]) {
      throw new Error('Invalid PNG signature');
    }
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idatChunks = [];

  while (offset + 8 <= pngBuf.length) {
    const length = pngBuf.readUInt32BE(offset);
    const type = pngBuf.toString('ascii', offset + 4, offset + 8);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;

    if (type === 'IHDR') {
      width = pngBuf.readUInt32BE(dataStart);
      height = pngBuf.readUInt32BE(dataStart + 4);
      bitDepth = pngBuf[dataStart + 8];
      colorType = pngBuf[dataStart + 9];
    } else if (type === 'IDAT') {
      idatChunks.push(pngBuf.subarray(dataStart, dataEnd));
    } else if (type === 'IEND') {
      break;
    }

    offset = dataEnd + 4; // skip CRC
  }

  if (bitDepth !== 8) {
    throw new Error(`Unsupported PNG bit depth: ${bitDepth}`);
  }

  const channelsMap = { 0: 1, 2: 3, 4: 2, 6: 4 };
  const bpp = channelsMap[colorType];
  if (!bpp) {
    throw new Error(`Unsupported PNG colorType: ${colorType}`);
  }

  const raw = zlib.inflateSync(Buffer.concat(idatChunks));
  const stride = width * bpp;
  const unpacked = new Uint8Array(height * stride);

  for (let y = 0; y < height; y += 1) {
    const rowInStart = y * (stride + 1);
    const filterType = raw[rowInStart];
    const rowOutStart = y * stride;

    for (let x = 0; x < stride; x += 1) {
      const val = raw[rowInStart + 1 + x];
      const a = x >= bpp ? unpacked[rowOutStart + x - bpp] : 0;
      const b = y > 0 ? unpacked[rowOutStart - stride + x] : 0;
      const c = y > 0 && x >= bpp ? unpacked[rowOutStart - stride + x - bpp] : 0;

      let recon = val;
      if (filterType === 1) recon = (val + a) & 0xff;
      else if (filterType === 2) recon = (val + b) & 0xff;
      else if (filterType === 3) recon = (val + ((a + b) >> 1)) & 0xff;
      else if (filterType === 4) recon = (val + paethPredictor(a, b, c)) & 0xff;

      unpacked[rowOutStart + x] = recon;
    }
  }

  const rgba = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    const srcIdx = i * bpp;
    const dstIdx = i * 4;
    if (bpp === 4) {
      rgba[dstIdx] = unpacked[srcIdx];
      rgba[dstIdx + 1] = unpacked[srcIdx + 1];
      rgba[dstIdx + 2] = unpacked[srcIdx + 2];
      rgba[dstIdx + 3] = unpacked[srcIdx + 3];
    } else if (bpp === 3) {
      rgba[dstIdx] = unpacked[srcIdx];
      rgba[dstIdx + 1] = unpacked[srcIdx + 1];
      rgba[dstIdx + 2] = unpacked[srcIdx + 2];
      rgba[dstIdx + 3] = 255;
    } else if (bpp === 2) {
      rgba[dstIdx] = unpacked[srcIdx];
      rgba[dstIdx + 1] = unpacked[srcIdx];
      rgba[dstIdx + 2] = unpacked[srcIdx];
      rgba[dstIdx + 3] = unpacked[srcIdx + 1];
    } else {
      rgba[dstIdx] = unpacked[srcIdx];
      rgba[dstIdx + 1] = unpacked[srcIdx];
      rgba[dstIdx + 2] = unpacked[srcIdx];
      rgba[dstIdx + 3] = 255;
    }
  }

  return { width, height, rgba };
}

/**
 * Computes RGB variance and non-uniformity across decoded PNG pixels.
 */
export function decodePngVariance(pngBuf, step = 4) {
  const { width, height, rgba } = decodePngBuffer(pngBuf);
  const totalPixels = width * height;
  if (totalPixels === 0) {
    return { width, height, sampledCount: 0, stdDev: 0, nonBgRatio: 0, sha256: '' };
  }

  // Reference corner background pixel
  const bgR = rgba[0];
  const bgG = rgba[1];
  const bgB = rgba[2];

  let count = 0;
  let sumLuma = 0;
  let sumSqLuma = 0;
  let nonBgCount = 0;

  for (let i = 0; i < totalPixels; i += step) {
    const idx = i * 4;
    const r = rgba[idx];
    const g = rgba[idx + 1];
    const b = rgba[idx + 2];
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    sumLuma += luma;
    sumSqLuma += luma * luma;
    count += 1;

    const delta = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
    if (delta > 14) {
      nonBgCount += 1;
    }
  }

  const meanLuma = sumLuma / Math.max(1, count);
  const variance = Math.max(0, sumSqLuma / Math.max(1, count) - meanLuma * meanLuma);
  const stdDev = Math.sqrt(variance);
  const nonBgRatio = nonBgCount / Math.max(1, count);
  const sha256 = crypto.createHash('sha256').update(pngBuf).digest('hex');

  return {
    width,
    height,
    sampledCount: count,
    meanLuma,
    stdDev,
    nonBgRatio,
    sha256,
    rgba
  };
}

/**
 * Computes fraction of pixels whose RGB differs by L1 > 12 between two PNG buffers.
 */
export function comparePngBuffers(pngBufA, pngBufB, step = 4) {
  const decA = decodePngBuffer(pngBufA);
  const decB = decodePngBuffer(pngBufB);

  const pixelsA = decA.width * decA.height;
  const pixelsB = decB.width * decB.height;
  if (pixelsA !== pixelsB) {
    return 1.0;
  }

  let compared = 0;
  let changed = 0;
  for (let i = 0; i < pixelsA; i += step) {
    const idx = i * 4;
    const diff =
      Math.abs(decA.rgba[idx] - decB.rgba[idx]) +
      Math.abs(decA.rgba[idx + 1] - decB.rgba[idx + 1]) +
      Math.abs(decA.rgba[idx + 2] - decB.rgba[idx + 2]);
    compared += 1;
    if (diff > 15) {
      changed += 1;
    }
  }

  return changed / Math.max(1, compared);
}

export async function captureElementPng(page, selector = 'canvas[data-testid="stage-webgl"]') {
  const el = page.locator(selector).first();
  await el.waitFor({ state: 'visible', timeout: 10000 });
  const box = await el.boundingBox();
  if (!box || box.width <= 0 || box.height <= 0) {
    throw new Error(`Element ${selector} has invalid bounding box: ${JSON.stringify(box)}`);
  }

  // Wait 2 animation frames so Three.js WebGL compositor buffer settles
  await page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
  );

  const clip = {
    x: Math.max(0, Math.floor(box.x)),
    y: Math.max(0, Math.floor(box.y)),
    width: Math.max(1, Math.floor(box.width)),
    height: Math.max(1, Math.floor(box.height))
  };

  const pngBuf = await page.screenshot({ clip });
  return { box, pngBuf, stats: decodePngVariance(pngBuf) };
}
