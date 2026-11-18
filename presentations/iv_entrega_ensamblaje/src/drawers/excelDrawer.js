import { WORKBOOK_DATA, WORKBOOK_META, colIndexToLetters, getSheetIndex, parseRange } from '../data/workbookData.js';
import { escapeHtml } from '../ui/charts.js';

function cellDisplayText(cell) {
  if (!cell) return '';
  if (cell.d !== undefined && cell.d !== null && cell.d !== '') return String(cell.d);
  if (cell.v !== undefined && cell.v !== null && cell.v !== '') return String(cell.v);
  return '';
}

function currencyClassForCell(cell) {
  const fmt = String(cell?.fmt || '');
  const disp = cellDisplayText(cell);
  if (fmt.includes('C$') || fmt.includes('NIO') || disp.includes('C$')) return 'excel-cell-currency-nio';
  if (fmt.includes('$') || disp.includes('$')) return 'excel-cell-currency-usd';
  if (fmt.includes('%') || disp.endsWith('%')) return 'excel-cell-pct';
  return '';
}

export function initExcelDrawer(panelEl, initialPayload = {}) {
  let activeSheetName = WORKBOOK_DATA[0]?.name || 'Resumen';
  let activeRangeStr = '';
  let selectedRef = 'A1';

  panelEl.innerHTML = `
    <div class="excel-viewer">
      <div class="excel-toolbar">
        <div>
          <strong style="font-size:13px;color:var(--text-primary);">${escapeHtml(WORKBOOK_META.filename)}</strong>
          <span style="display:block;font-size:11px;color:var(--text-muted);">
            ${WORKBOOK_META.sheetCount} hojas · ${WORKBOOK_META.totalCells} celdas · ${WORKBOOK_META.totalFormulas} fórmulas dinámicas
          </span>
        </div>
        <a
          data-testid="excel-download-link"
          href="${escapeHtml(WORKBOOK_META.downloadHref)}"
          download="${escapeHtml(WORKBOOK_META.filename)}"
        >⬇ Descargar .xlsx</a>
      </div>
      <div data-testid="excel-formula-bar">
        <span class="excel-fx-badge">fx</span>
        <strong data-testid="excel-cell-ref" style="color:var(--blueprint-cyan);min-width:34px;">A1</strong>
        <span data-testid="excel-cell-formula" style="color:var(--text-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;"></span>
      </div>
      <div class="excel-grid-wrap">
        <table data-testid="excel-grid"></table>
      </div>
      <div class="excel-sheet-tabs" role="tablist" aria-label="Hojas del modelo financiero">
        ${WORKBOOK_DATA.map(
          (sheet) => `
            <button
              type="button"
              role="tab"
              class="excel-sheet-tab"
              data-testid="excel-sheet-tab-${escapeHtml(sheet.name)}"
              data-sheet="${escapeHtml(sheet.name)}"
            >${escapeHtml(sheet.name)}</button>
          `
        ).join('')}
      </div>
    </div>
  `;

  const cellRefEl = panelEl.querySelector('[data-testid="excel-cell-ref"]');
  const cellFormulaEl = panelEl.querySelector('[data-testid="excel-cell-formula"]');
  const gridWrapEl = panelEl.querySelector('.excel-grid-wrap');
  const gridTableEl = panelEl.querySelector('[data-testid="excel-grid"]');

  function updateFormulaBar(ref, cell) {
    selectedRef = ref;
    cellRefEl.textContent = ref;
    if (cell?.f) {
      const valText = cellDisplayText(cell);
      cellFormulaEl.textContent = valText ? `=${cell.f}   (${valText})` : `=${cell.f}`;
    } else {
      const valText = cellDisplayText(cell);
      cellFormulaEl.textContent = valText !== '' ? valText : 'Sin fórmula (celda sin expresión)';
    }
  }

  function renderSheet(sheetName, rangeStr = '') {
    const idx = getSheetIndex(sheetName);
    const sheet = WORKBOOK_DATA[idx >= 0 ? idx : 0];
    if (!sheet) return;

    activeSheetName = sheet.name;
    activeRangeStr = String(rangeStr || '');

    const targetBox = parseRange(activeRangeStr);
    const maxRow = Math.max(1, Number(sheet.max_row) || 1);
    const maxCol = Math.max(0, Number(sheet.max_col) || 0);

    // Precompute merge spans and skip positions
    const mergeMaster = new Map();
    const skipCells = new Set();
    for (const mStr of sheet.merges || []) {
      const parsed = parseRange(mStr);
      if (!parsed) continue;
      const rowSpan = parsed.endRow - parsed.startRow + 1;
      const colSpan = parsed.endCol - parsed.startCol + 1;
      mergeMaster.set(`${parsed.startRow}_${parsed.startCol}`, { rowSpan, colSpan });
      for (let r = parsed.startRow; r <= parsed.endRow; r += 1) {
        for (let c = parsed.startCol; c <= parsed.endCol; c += 1) {
          if (r === parsed.startRow && c === parsed.startCol) continue;
          skipCells.add(`${r}_${c}`);
        }
      }
    }

    const colHeaders = [];
    for (let c = 0; c <= maxCol; c += 1) {
      colHeaders.push(`<th>${escapeHtml(colIndexToLetters(c))}</th>`);
    }

    const rowsHtml = [];
    let firstHighlightedCell = null;
    let firstFormulaCell = null;
    let firstAnyCell = null;

    for (let r = 1; r <= maxRow; r += 1) {
      const tds = [`<th class="excel-row-header">${r}</th>`];
      for (let c = 0; c <= maxCol; c += 1) {
        const key = `${r}_${c}`;
        if (skipCells.has(key)) continue;

        const cell = sheet.grid[key] || null;
        const ref = cell?.r || `${colIndexToLetters(c)}${r}`;
        const display = cellDisplayText(cell);
        const hasFormula = Boolean(cell?.f);
        const span = mergeMaster.get(key);
        const inTarget =
          targetBox &&
          r >= targetBox.startRow &&
          r <= targetBox.endRow &&
          c >= targetBox.startCol &&
          c <= targetBox.endCol;

        const classes = ['excel-cell-btn'];
        const curCls = currencyClassForCell(cell);
        if (curCls) classes.push(curCls);
        if (hasFormula) classes.push('has-formula');
        if (inTarget) classes.push('excel-cell-target');

        const attrs = [
          `class="${classes.join(' ')}"`,
          `data-ref="${escapeHtml(ref)}"`,
          `data-key="${key}"`,
        ];
        if (hasFormula) attrs.push(`data-formula="=${escapeHtml(cell.f)}"`);
        if (span && span.rowSpan > 1) attrs.push(`rowspan="${span.rowSpan}"`);
        if (span && span.colSpan > 1) attrs.push(`colspan="${span.colSpan}"`);
        if (r === 1 || String(cell?.fmt || '').includes('Bold')) {
          attrs.push('style="font-weight:700;"');
        }

        if (!firstAnyCell && cell && display !== '') firstAnyCell = { ref, cell };
        if (!firstFormulaCell && hasFormula) firstFormulaCell = { ref, cell };
        if (inTarget && !firstHighlightedCell) firstHighlightedCell = { ref, cell };

        tds.push(`<td ${attrs.join(' ')}>${escapeHtml(display)}</td>`);
      }
      rowsHtml.push(`<tr>${tds.join('')}</tr>`);
    }

    gridTableEl.innerHTML = `
      <thead><tr><th></th>${colHeaders.join('')}</tr></thead>
      <tbody>${rowsHtml.join('')}</tbody>
    `;

    panelEl.querySelectorAll('.excel-sheet-tab').forEach((tabBtn) => {
      const active = tabBtn.dataset.sheet === sheet.name;
      tabBtn.classList.toggle('is-active', active);
      tabBtn.setAttribute('aria-selected', String(active));
    });

    const initialFocus = firstHighlightedCell || firstFormulaCell || firstAnyCell || { ref: 'A1', cell: sheet.grid['1_0'] || null };
    updateFormulaBar(initialFocus.ref, initialFocus.cell);

    const firstTargetEl = gridTableEl.querySelector('.excel-cell-target');
    if (firstTargetEl && typeof firstTargetEl.scrollIntoView === 'function') {
      try {
        firstTargetEl.scrollIntoView({ block: 'center', inline: 'nearest' });
      } catch {
        gridWrapEl.scrollTop = 0;
      }
    } else {
      gridWrapEl.scrollTop = 0;
    }
  }

  gridTableEl.addEventListener('click', (ev) => {
    const td = ev.target?.closest?.('td[data-key]');
    if (!td) return;
    const sheet = WORKBOOK_DATA[getSheetIndex(activeSheetName)] || WORKBOOK_DATA[0];
    const cell = sheet?.grid?.[td.dataset.key] || null;
    const ref = td.dataset.ref || 'A1';

    gridTableEl.querySelectorAll('td.is-selected').forEach((el) => el.classList.remove('is-selected'));
    td.classList.add('is-selected');
    updateFormulaBar(ref, cell);
  });

  panelEl.querySelectorAll('.excel-sheet-tab').forEach((tabBtn) => {
    tabBtn.addEventListener('click', () => {
      renderSheet(tabBtn.dataset.sheet, '');
    });
  });

  renderSheet(initialPayload.sheet || 'Resumen', initialPayload.range || '');

  return {
    getCurrentSheet: () => activeSheetName,
    getSelectedRef: () => selectedRef,
    sync(payload = {}) {
      renderSheet(payload.sheet || activeSheetName || 'Resumen', payload.range || '');
    },
    destroy() {
      panelEl.innerHTML = '';
    },
  };
}
