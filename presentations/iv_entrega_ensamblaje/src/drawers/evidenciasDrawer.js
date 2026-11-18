import { EVIDENCIAS, EVIDENCIA_CATEGORIES, REGRESSION_SERIES } from '../data/evidenciasData.js';
import { escapeHtml, renderRegressionDynoSvg } from '../ui/charts.js';

const EVIDENCE_THUMBS = {
  'regresion-completa': [
    { src: './assets/evidencias/cloc.png', caption: 'Medición real cloc v1.98 (8.757 KLOC)' },
    { src: './assets/evidencias/sp_pgadmin.png', caption: 'Verificación PostgreSQL / SP en pgAdmin' },
  ],
  'catalogo-20000': [
    { src: './assets/evidencias/inventario_pgadmin.png', caption: 'Saldos e índices de catálogo en PostgreSQL' },
    { src: './assets/evidencias/inventario_workbench.png', caption: 'Verificación de consulta de inventario' },
  ],
  'ventas-500-concurrencia': [
    { src: './assets/evidencias/pago_pgadmin.png', caption: 'Conciliación transaccional de pagos en BD' },
    { src: './assets/evidencias/pago_workbench.jpg', caption: 'Registro atómico de líneas y movimientos' },
  ],
  'escenario-academico': [
    { src: './assets/evidencias/recibo_pgadmin.png', caption: 'Comprobante F-00000001 persistido en PostgreSQL' },
    { src: './assets/evidencias/recibo_workbench.jpg', caption: 'Detalle de factura y totales auditados' },
    { src: './assets/evidencias/sp_workbench.png', caption: 'Procedimiento almacenado verificado' },
  ],
};

export function initEvidenciasDrawer(panelEl, initialPayload = {}) {
  let activeCategory = 'Todas';
  let selectedId = EVIDENCIAS.some((e) => e.id === initialPayload.evidenceId)
    ? initialPayload.evidenceId
    : EVIDENCIAS[0].id;

  panelEl.innerHTML = `
    <div class="evidencias-viewer">
      <div class="evidencias-filters" role="group" aria-label="Filtrar evidencias por categoría">
        ${EVIDENCIA_CATEGORIES.map(
          (cat) => `
            <button
              type="button"
              class="doc-btn ${cat === activeCategory ? 'is-active' : ''}"
              data-ev-cat="${escapeHtml(cat)}"
            >${escapeHtml(cat)}</button>
          `
        ).join('')}
      </div>
      <div data-testid="evidencias-list"></div>
      <div data-testid="evidencias-detail"></div>
    </div>
  `;

  const listEl = panelEl.querySelector('[data-testid="evidencias-list"]');
  const detailEl = panelEl.querySelector('[data-testid="evidencias-detail"]');

  function getFiltered() {
    if (activeCategory === 'Todas') return EVIDENCIAS;
    return EVIDENCIAS.filter((e) => e.category === activeCategory);
  }

  function renderDetail(item) {
    if (!item) {
      detailEl.innerHTML = `<p style="color:var(--text-muted);font-size:13px;">Seleccione una evidencia para inspeccionar bitácora y métricas.</p>`;
      return;
    }
    const isReg = item.id.startsWith('regresion');
    const thumbs = EVIDENCE_THUMBS[item.id] || [];

    detailEl.innerHTML = `
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;">
        <span class="slide-pill slide-pill--blue">${escapeHtml(item.category)}</span>
        <span class="slide-pill" style="font-family:var(--font-mono);">${escapeHtml(item.date)}</span>
      </div>
      <h3 style="margin:0 0 8px;font-family:var(--font-display);font-size:1rem;color:var(--text-primary);">${escapeHtml(item.title)}</h3>
      <div style="font-size:12px;color:var(--text-secondary);margin-bottom:8px;">
        <div><strong>Comando:</strong> <code>${escapeHtml(item.command)}</code></div>
        <div><strong>Entorno:</strong> ${escapeHtml(item.environment)}</div>
      </div>
      <div class="slide-metrics-strip" style="margin-bottom:10px;">
        ${item.metrics
          .map(
            (m) => `
            <div class="metric-chip metric-chip--${escapeHtml(m.highlight || 'blue')}">
              <span class="metric-chip-label">${escapeHtml(m.label)}</span>
              <span class="metric-chip-value" style="font-size:0.86rem;">${escapeHtml(m.value)}</span>
            </div>`
          )
          .join('')}
      </div>
      ${
        isReg
          ? `<div style="margin-bottom:10px;">
               <div style="font-size:12px;font-weight:700;color:#86efac;margin-bottom:4px;">Progresión verificada: 104 → 111 → 113 → 120 pruebas (289.28 s en regresión completa)</div>
               <div class="svg-chart-wrap">${renderRegressionDynoSvg(REGRESSION_SERIES)}</div>
             </div>`
          : ''
      }
      <div style="margin-bottom:8px;">
        <div style="font-size:11.5px;font-weight:700;color:var(--text-muted);margin-bottom:4px;">Salida verificada de consola / bitácora:</div>
        <pre class="evidencia-log-pre">${escapeHtml(item.excerpt)}</pre>
      </div>
      <div style="font-size:12px;color:var(--text-secondary);margin-bottom:4px;">
        <strong>Alcance y límites declarados:</strong> ${escapeHtml(item.scopeLimit)}
      </div>
      <div style="font-size:11.5px;font-family:var(--font-mono);color:var(--text-muted);">
        Fuente auditada: ${escapeHtml(item.sourceFile)}
      </div>
      ${
        thumbs.length
          ? `<div class="evidencia-thumbs">
               ${thumbs
                 .map(
                   (t) => `
                   <div class="evidencia-thumb-card">
                     <img src="${escapeHtml(t.src)}" alt="${escapeHtml(t.caption)}" loading="lazy" />
                     <div class="evidencia-thumb-caption">${escapeHtml(t.caption)}</div>
                   </div>`
                 )
                 .join('')}
             </div>`
          : ''
      }
    `;
  }

  function renderList() {
    const items = getFiltered();
    if (!items.some((e) => e.id === selectedId) && items.length > 0) {
      selectedId = items[0].id;
    }

    listEl.innerHTML = items
      .map(
        (ev) => `
        <button
          type="button"
          class="evidencia-item ${ev.id === selectedId ? 'is-selected' : ''}"
          data-ev-id="${escapeHtml(ev.id)}"
        >
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--blueprint-cyan);font-family:var(--font-mono);margin-bottom:3px;">
            <span>${escapeHtml(ev.category)}</span>
            <span>${escapeHtml(ev.date)}</span>
          </div>
          <strong style="display:block;font-size:12.5px;color:var(--text-primary);margin-bottom:3px;">${escapeHtml(ev.title)}</strong>
          <span style="display:block;font-size:11.5px;color:var(--text-muted);">
            ${escapeHtml(ev.metrics.slice(0, 2).map((m) => `${m.label}: ${m.value}`).join(' · '))}
          </span>
        </button>
      `
      )
      .join('');

    listEl.querySelectorAll('.evidencia-item').forEach((btn) => {
      btn.addEventListener('click', () => {
        selectedId = btn.dataset.evId;
        renderList();
      });
    });

    panelEl.querySelectorAll('[data-ev-cat]').forEach((btn) => {
      const active = btn.dataset.evCat === activeCategory;
      btn.classList.toggle('is-active', active);
      btn.style.borderColor = active ? 'var(--ignition-orange)' : 'var(--glass-border)';
      btn.style.background = active ? 'rgba(255,107,26,0.18)' : 'rgba(15,23,42,0.9)';
    });

    const selectedItem = items.find((e) => e.id === selectedId) || items[0] || null;
    renderDetail(selectedItem);
  }

  panelEl.querySelectorAll('[data-ev-cat]').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeCategory = btn.dataset.evCat;
      renderList();
    });
  });

  renderList();

  return {
    sync(payload = {}) {
      if (payload.evidenceId && EVIDENCIAS.some((e) => e.id === payload.evidenceId)) {
        activeCategory = 'Todas';
        selectedId = payload.evidenceId;
        renderList();
      }
    },
    destroy() {
      panelEl.innerHTML = '';
    },
  };
}
