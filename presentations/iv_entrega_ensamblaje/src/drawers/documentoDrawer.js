import { GlobalWorkerOptions, TextLayer, getDocument } from 'pdfjs-dist';
import { escapeHtml } from '../ui/charts.js';

GlobalWorkerOptions.workerSrc = './pdfjs/pdf.worker.min.mjs';

const PDF_DOC_URL = './docs/Documento_Final_Unificado_MotoRepuestosElCentenario.pdf';

function normalizeSearch(str) {
  return String(str || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

export function initDocumentoDrawer(panelEl, initialPayload = {}) {
  panelEl.innerHTML = `
    <div class="doc-viewer">
      <div class="doc-toolbar">
        <button type="button" class="doc-btn" data-testid="pdf-prev-btn" aria-label="Página anterior">‹</button>
        <input
          type="number"
          min="1"
          max="352"
          value="${Math.max(1, Number(initialPayload.page) || 1)}"
          data-testid="pdf-page-input"
          aria-label="Número de página PDF"
        />
        <span data-testid="pdf-page-indicator" style="font-family:var(--font-mono);font-size:12px;color:var(--text-secondary);white-space:nowrap;">
          Cargando…
        </span>
        <button type="button" class="doc-btn" data-testid="pdf-next-btn" aria-label="Página siguiente">›</button>
        <input
          type="search"
          value="${escapeHtml(initialPayload.query || '')}"
          placeholder="Buscar en el PDF (Enter)..."
          data-testid="pdf-search-input"
          aria-label="Buscar en el PDF"
        />
        <button type="button" class="doc-btn" data-testid="pdf-search-btn">Buscar</button>
      </div>
      <div style="padding:4px 14px;background:#0b1120;border-bottom:1px solid rgba(91,155,213,0.18);display:flex;justify-content:space-between;align-items:center;font-size:11.5px;color:var(--text-muted);gap:8px;">
        <span>Documento Final Unificado · Entregas I–IV (offline)</span>
        <span data-testid="pdf-search-status">Listo</span>
      </div>
      <div id="pdf-scroll-container">
        <div class="pdf-page-wrap">
          <canvas data-testid="pdf-canvas" width="0" height="0"></canvas>
          <div class="textLayer" data-testid="pdf-text-layer"></div>
        </div>
      </div>
    </div>
  `;

  const prevBtn = panelEl.querySelector('[data-testid="pdf-prev-btn"]');
  const nextBtn = panelEl.querySelector('[data-testid="pdf-next-btn"]');
  const pageInput = panelEl.querySelector('[data-testid="pdf-page-input"]');
  const pageIndicator = panelEl.querySelector('[data-testid="pdf-page-indicator"]');
  const searchInput = panelEl.querySelector('[data-testid="pdf-search-input"]');
  const searchBtn = panelEl.querySelector('[data-testid="pdf-search-btn"]');
  const searchStatus = panelEl.querySelector('[data-testid="pdf-search-status"]');
  const scrollContainer = panelEl.querySelector('#pdf-scroll-container');
  const pageWrap = panelEl.querySelector('.pdf-page-wrap');
  const visCanvas = panelEl.querySelector('[data-testid="pdf-canvas"]');
  const textLayerEl = panelEl.querySelector('[data-testid="pdf-text-layer"]');

  let pdfDocPromise = null;
  let totalPages = 352;
  let currentPage = Math.max(1, Math.min(352, Number(initialPayload.page) || 1));
  let currentQuery = String(initialPayload.query || '');
  let renderSeq = 0;
  let activeRenderTask = null;
  let activeTextLayer = null;
  const pageTextCache = new Map();

  function ensurePdfLoaded() {
    if (!pdfDocPromise) {
      const loadingTask = getDocument({
        url: PDF_DOC_URL,
        cMapUrl: './pdfjs/cmaps/',
        cMapPacked: true,
        standardFontDataUrl: './pdfjs/standard_fonts/',
        iccUrl: './pdfjs/iccs/',
        wasmUrl: './pdfjs/wasm/',
      });
      pdfDocPromise = loadingTask.promise.then((doc) => {
        totalPages = doc.numPages || 352;
        pageInput.max = String(totalPages);
        return doc;
      });
    }
    return pdfDocPromise;
  }

  function highlightTextLayer(query) {
    const normQ = normalizeSearch(query);
    if (!normQ) return 0;
    let hits = 0;
    textLayerEl.querySelectorAll('span').forEach((span) => {
      const normText = normalizeSearch(span.textContent);
      if (normText && (normText.includes(normQ) || (normQ.length >= 4 && normQ.split(' ').some((w) => w.length >= 4 && normText.includes(w))))) {
        span.classList.add('pdf-hit-highlight');
        hits += 1;
      }
    });
    return hits;
  }

  async function renderPage(targetPage, query = currentQuery) {
    renderSeq += 1;
    const mySeq = renderSeq;
    visCanvas.width = 0;
    visCanvas.height = 0;
    pageIndicator.textContent = 'Renderizando…';

    if (activeRenderTask) {
      try {
        activeRenderTask.cancel();
      } catch {
        // noop
      }
      activeRenderTask = null;
    }
    if (activeTextLayer) {
      try {
        activeTextLayer.cancel();
      } catch {
        // noop
      }
      activeTextLayer = null;
    }

    const doc = await ensurePdfLoaded();
    if (mySeq !== renderSeq) return;

    const numPages = doc.numPages || 352;
    totalPages = numPages;
    const numericTarget = Number(targetPage);
    const safePage = Number.isFinite(numericTarget)
      ? Math.max(1, Math.min(numPages, Math.trunc(numericTarget)))
      : currentPage;

    currentPage = safePage;
    currentQuery = String(query || '');

    const page = await doc.getPage(safePage);
    if (mySeq !== renderSeq) return;

    const availW = Math.max(420, (scrollContainer.clientWidth || 560) - 36);
    const baseVp = page.getViewport({ scale: 1 });
    const cssScale = Math.max(0.85, Math.min(1.65, availW / baseVp.width));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    const renderViewport = page.getViewport({ scale: cssScale * pixelRatio });
    const cssViewport = page.getViewport({ scale: cssScale });

    const offscreen = document.createElement('canvas');
    offscreen.width = Math.max(1, Math.floor(renderViewport.width));
    offscreen.height = Math.max(1, Math.floor(renderViewport.height));
    const offCtx = offscreen.getContext('2d');
    offCtx.fillStyle = '#ffffff';
    offCtx.fillRect(0, 0, offscreen.width, offscreen.height);

    const renderTask = page.render({
      canvasContext: offCtx,
      viewport: renderViewport,
    });
    activeRenderTask = renderTask;

    try {
      await renderTask.promise;
    } catch (err) {
      if (err?.name === 'RenderingCancelledException' || err?.name === 'AbortException') {
        return;
      }
      throw err;
    }

    if (mySeq !== renderSeq) return;
    activeRenderTask = null;

    // Blit offscreen canvas atomically onto visible canvas BEFORE updating page indicator
    visCanvas.width = offscreen.width;
    visCanvas.height = offscreen.height;
    visCanvas.style.width = `${Math.round(cssViewport.width)}px`;
    visCanvas.style.height = `${Math.round(cssViewport.height)}px`;
    const visCtx = visCanvas.getContext('2d');
    visCtx.drawImage(offscreen, 0, 0);

    pageWrap.style.width = `${Math.round(cssViewport.width)}px`;
    pageWrap.style.height = `${Math.round(cssViewport.height)}px`;

    pageIndicator.textContent = `Pág. ${safePage} / ${numPages}`;
    pageInput.value = String(safePage);
    pageInput.max = String(numPages);
    searchInput.value = currentQuery;

    // Render selectable TextLayer and local highlight matches
    textLayerEl.innerHTML = '';
    textLayerEl.style.width = `${Math.round(cssViewport.width)}px`;
    textLayerEl.style.height = `${Math.round(cssViewport.height)}px`;
    textLayerEl.style.setProperty('--total-scale-factor', String(cssViewport.scale));

    try {
      const textContent = await page.getTextContent();
      if (mySeq !== renderSeq) return;

      const joined = textContent.items.map((it) => it.str || '').join(' ');
      pageTextCache.set(safePage, normalizeSearch(joined));

      const tl = new TextLayer({
        textContentSource: textContent,
        container: textLayerEl,
        viewport: cssViewport,
      });
      activeTextLayer = tl;
      await tl.render();
      if (mySeq !== renderSeq) return;
      activeTextLayer = null;

      if (currentQuery) {
        const hits = highlightTextLayer(currentQuery);
        searchStatus.textContent = hits > 0 ? `${hits} coincidencia(s) en pág. ${safePage}` : `Página ${safePage} · término "${currentQuery}"`;
      } else {
        searchStatus.textContent = `Página ${safePage} / ${numPages}`;
      }
    } catch {
      // TextLayer cancellation / non-fatal extraction
    }
  }

  async function getNormalizedPageText(doc, pageNum) {
    if (pageTextCache.has(pageNum)) {
      return pageTextCache.get(pageNum);
    }
    const page = await doc.getPage(pageNum);
    const tc = await page.getTextContent();
    const norm = normalizeSearch(tc.items.map((it) => it.str || '').join(' '));
    pageTextCache.set(pageNum, norm);
    return norm;
  }

  async function runLocalSearch(rawQuery) {
    const q = String(rawQuery || '').trim();
    currentQuery = q;
    if (!q) {
      await renderPage(currentPage, '');
      return;
    }

    const normQ = normalizeSearch(q);
    searchStatus.textContent = `Buscando "${q}" localmente...`;
    const doc = await ensurePdfLoaded();
    const numPages = doc.numPages || 352;

    // Check current page first, then wrap forward
    for (let offset = 0; offset < numPages; offset += 1) {
      const p = ((currentPage - 1 + offset) % numPages) + 1;
      const txt = await getNormalizedPageText(doc, p);
      if (txt.includes(normQ)) {
        await renderPage(p, q);
        return;
      }
    }

    // 0 matches across all pages
    searchStatus.textContent = `0 coincidencias para "${q}"`;
  }

  function jumpToInputPage() {
    const raw = Number(pageInput.value);
    const clamped = Number.isFinite(raw) ? Math.max(1, Math.min(totalPages, Math.trunc(raw))) : 1;
    void renderPage(clamped, currentQuery);
  }

  prevBtn.addEventListener('click', () => {
    void renderPage(Math.max(1, currentPage - 1), currentQuery);
  });

  nextBtn.addEventListener('click', () => {
    void renderPage(Math.min(totalPages, currentPage + 1), currentQuery);
  });

  pageInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      jumpToInputPage();
    }
  });
  pageInput.addEventListener('change', jumpToInputPage);

  searchInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      void runLocalSearch(searchInput.value);
    }
  });
  searchBtn.addEventListener('click', () => {
    void runLocalSearch(searchInput.value);
  });

  void renderPage(currentPage, currentQuery);

  return {
    getCurrentPage: () => currentPage,
    sync(payload = {}) {
      const target = payload.page ?? currentPage;
      const q = payload.query !== undefined ? payload.query : '';
      void renderPage(target, q);
    },
    destroy() {
      renderSeq += 1;
      try {
        activeRenderTask?.cancel?.();
      } catch {
        // noop
      }
      try {
        activeTextLayer?.cancel?.();
      } catch {
        // noop
      }
      panelEl.innerHTML = '';
    },
  };
}
