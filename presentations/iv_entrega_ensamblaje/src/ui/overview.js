import { CHAPTERS, PRESENTERS, SLIDES } from '../data/slides.js';
import { escapeHtml } from './charts.js';

export function initOverview(overviewSlot, appState) {
  overviewSlot.innerHTML = `
    <div data-testid="overview-modal" role="dialog" aria-modal="true" aria-label="Mapa general" hidden>
      <div class="overview-header">
        <div>
          <h2 style="margin:0;font-family:var(--font-display);font-size:1.35rem;">Mapa General de la Defensa · El Ensamblaje</h2>
          <p style="margin:4px 0 0;font-size:0.85rem;color:var(--text-secondary);">4 Entregas · 20 Capítulos del Documento Unificado · 36 Diapositivas (S00–S35)</p>
        </div>
        <button type="button" class="chrome-btn" data-testid="overview-close">✕ Cerrar (Esc / O)</button>
      </div>

      <section class="overview-chapters-section">
        <h3 style="margin:0 0 6px;font-size:0.9rem;color:var(--blueprint-cyan);">Acceso directo por Capítulo (20 capítulos · 352 págs.)</h3>
        <div class="overview-chapters-grid">
          ${CHAPTERS.map(
            (ch) => `
              <button
                type="button"
                class="overview-chapter-btn"
                data-testid="overview-chapter-${escapeHtml(ch.num)}"
                data-slide="${escapeHtml(ch.slideId)}"
              >
                <span style="display:flex;justify-content:space-between;width:100%;font-family:var(--font-mono);font-size:11px;color:var(--blueprint-cyan);">
                  <strong>Cap. ${escapeHtml(ch.num)} · ${escapeHtml(ch.entrega)}</strong>
                  <span>${escapeHtml(ch.slideId)} · p.${ch.pdfPage}</span>
                </span>
                <span style="color:var(--text-primary);font-weight:600;">${escapeHtml(ch.title)}</span>
              </button>
            `
          ).join('')}
        </div>
      </section>

      <section style="margin-top:18px;">
        <h3 style="margin:0 0 6px;font-size:0.9rem;color:var(--ignition-orange);">Todas las Diapositivas (S00–S35)</h3>
        <div class="overview-grid">
          ${SLIDES.map((s) => {
            const p = PRESENTERS[s.presenter];
            return `
              <button
                type="button"
                class="overview-tile"
                data-testid="overview-slide-${escapeHtml(s.id)}"
                data-slide="${escapeHtml(s.id)}"
              >
                <div style="display:flex;justify-content:space-between;align-items:center;font-family:var(--font-mono);font-size:11px;color:var(--blueprint-cyan);margin-bottom:4px;">
                  <strong>${escapeHtml(s.id)} · ${escapeHtml(s.chapter)}</strong>
                  <span>${escapeHtml(p?.short || s.presenter)}</span>
                </div>
                <div style="font-weight:700;font-size:13px;color:var(--text-primary);margin-bottom:3px;">${escapeHtml(s.title)}</div>
                <div style="font-size:11.5px;color:var(--text-muted);">${escapeHtml(s.act)}</div>
              </button>
            `;
          }).join('')}
        </div>
      </section>
    </div>
  `;

  const modal = overviewSlot.querySelector('[data-testid="overview-modal"]');
  const closeBtn = overviewSlot.querySelector('[data-testid="overview-close"]');

  closeBtn.addEventListener('click', () => {
    appState.toggleOverview(false);
  });

  overviewSlot.querySelectorAll('[data-slide]').forEach((btn) => {
    btn.addEventListener('click', () => {
      appState.goToSlide(btn.dataset.slide, { closeOverview: true, closeDrawer: false, source: 'overview' });
    });
  });

  function sync(state) {
    modal.hidden = !state.overviewOpen;
    overviewSlot.querySelectorAll('.overview-tile').forEach((tile) => {
      tile.classList.toggle('is-current', tile.dataset.slide === state.currentSlideId);
    });
  }

  const unsubscribe = appState.subscribe((state, meta = {}) => {
    if (meta.type === 'overview' || meta.type === 'slide') {
      sync(state);
    }
  });

  sync(appState.getState());

  return {
    destroy() {
      unsubscribe();
      overviewSlot.innerHTML = '';
    },
  };
}
