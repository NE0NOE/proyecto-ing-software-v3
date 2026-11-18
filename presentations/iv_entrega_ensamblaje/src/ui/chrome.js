import { PRESENTERS, REFS_BY_SLIDE, SLIDES } from '../data/slides.js';
import { resolveSlideIndex } from '../state/appState.js';
import { escapeHtml } from './charts.js';

const MINI_MOTO_CHECKPOINTS = [
  { slideId: 'S06', label: 'Chasis BD (Cap. 01 · S06)', icon: 'chasis' },
  { slideId: 'S11', label: 'Motor 4 Capas (Cap. 04 · S11)', icon: 'motor' },
  { slideId: 'S16', label: 'Transmisión SOLID (Cap. 08 · S16)', icon: 'transmision' },
  { slideId: 'S17', label: 'Manubrio UX (Cap. 09 · S17)', icon: 'manubrio' },
  { slideId: 'S18', label: 'Frenos y Llave (Cap. 10 · S18)', icon: 'frenos' },
  { slideId: 'S20', label: 'Ignición y Concurrencia (Cap. 12 · S20)', icon: 'ignicion' },
  { slideId: 'S27', label: 'Tanque Financiero (Cap. 15 · S27)', icon: 'tanque' },
  { slideId: 'S31', label: 'Arnés 100% RTM (Cap. 18 · S31)', icon: 'arnes' },
];

function renderSegmentSvg(kind, lit) {
  const cls = lit ? 'moto-seg is-lit' : 'moto-seg';
  switch (kind) {
    case 'chasis':
      return `<svg width="22" height="14" viewBox="0 0 24 14" aria-hidden="true"><path class="${cls}" d="M3 10 L9 4 L17 4 L21 10 Z" stroke-width="1.5"/></svg>`;
    case 'motor':
      return `<svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true"><rect class="${cls}" x="3" y="3" width="14" height="8" rx="2" stroke-width="1.5"/></svg>`;
    case 'transmision':
      return `<svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true"><circle class="${cls}" cx="6" cy="7" r="4" stroke-width="1.5"/><circle class="${cls}" cx="13" cy="7" r="3" stroke-width="1.5"/></svg>`;
    case 'manubrio':
      return `<svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true"><path class="${cls}" d="M3 4 L8 4 L12 10 L17 10" stroke-width="1.6" fill="none"/></svg>`;
    case 'frenos':
      return `<svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true"><circle class="${cls}" cx="9" cy="7" r="5" stroke-width="1.5"/></svg>`;
    case 'ignicion':
      return `<svg width="18" height="14" viewBox="0 0 18 14" aria-hidden="true"><polygon class="${cls}" points="10,1 5,8 9,8 8,13 14,6 10,6" stroke-width="1.3"/></svg>`;
    case 'tanque':
      return `<svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true"><path class="${cls}" d="M3 9 C3 4, 8 3, 15 5 L17 9 Z" stroke-width="1.5"/></svg>`;
    default:
      return `<svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true"><path class="${cls}" d="M2 7 L7 4 L13 10 L18 7" stroke-width="1.6"/></svg>`;
  }
}

function formatTimer(totalSec) {
  const s = Math.max(0, Math.trunc(Number(totalSec) || 0));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function initChrome(headerSlot, footerSlot, appState) {
  function getPrimaryRef(slide, type) {
    const refs = REFS_BY_SLIDE[slide.id] || slide.refs || [];
    return refs.find((r) => r.type === type && r.primary) || refs.find((r) => r.type === type) || null;
  }

  function renderHeader(state) {
    const slide = SLIDES[state.currentSlideIndex] || SLIDES[0];
    const presenterInfo = PRESENTERS[slide.presenter];
    const presenterText = presenterInfo ? presenterInfo.name : slide.presenter;
    const odoCurrent = String(state.currentSlideIndex + 1).padStart(3, '0');
    const odoTotal = String(SLIDES.length).padStart(3, '0');

    const segmentsHtml = MINI_MOTO_CHECKPOINTS.map((cp) => {
      const targetIdx = resolveSlideIndex(cp.slideId) ?? 0;
      const isLit = state.currentSlideIndex >= targetIdx;
      const isCurrent = state.currentSlideId === cp.slideId;
      return `
        <button
          type="button"
          class="mini-moto-btn ${isCurrent ? 'is-current' : ''}"
          data-slide="${cp.slideId}"
          title="${escapeHtml(cp.label)}"
          aria-label="${escapeHtml(cp.label)}"
        >
          ${renderSegmentSvg(cp.icon, isLit)}
        </button>
      `;
    }).join('');

    headerSlot.innerHTML = `
      <div data-testid="header-bar">
        <div class="header-left">
          <div class="mrec-monogram" aria-hidden="true">M</div>
          <div data-testid="act-chapter-label">${escapeHtml(slide.act)} · ${escapeHtml(slide.chapter)}</div>
        </div>
        <div class="header-center">
          <nav data-testid="mini-moto-progress" aria-label="Progreso de ensamblaje">
            ${segmentsHtml}
          </nav>
        </div>
        <div class="header-right">
          <div data-testid="presenter-badge" title="${escapeHtml(presenterInfo?.role || 'Equipo MREC')}">
            <span class="slide-pill slide-pill--blue">${escapeHtml(presenterInfo?.initials || 'MR')}</span>
            <span>${escapeHtml(presenterText)}</span>
          </div>
          <div data-testid="odometer" title="Diapositiva actual">km ${odoCurrent} / ${odoTotal}</div>
          <div data-testid="timer-display" class="slide-pill" title="Cronómetro de defensa">${formatTimer(state.elapsedSeconds)}</div>
          <button
            type="button"
            class="chrome-btn ${state.muted ? '' : 'is-active'}"
            data-testid="btn-mute"
            title="${state.muted ? 'Activar audio (M)' : 'Silenciar audio (M)'}"
            aria-pressed="${String(!state.muted)}"
          >${state.muted ? '🔇' : '🔊'}</button>
        </div>
      </div>
    `;

    headerSlot.querySelectorAll('.mini-moto-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        appState.goToSlide(btn.dataset.slide, { source: 'mini-moto' });
      });
    });

    headerSlot.querySelector('[data-testid="btn-mute"]').addEventListener('click', () => {
      appState.toggleMute();
    });
  }

  function renderFooter(state) {
    const slide = SLIDES[state.currentSlideIndex] || SLIDES[0];
    const refs = REFS_BY_SLIDE[slide.id] || slide.refs || [];

    const refsHtml = refs
      .map(
        (ref) => `
          <button
            type="button"
            data-testid="ref-chip"
            data-ref-type="${escapeHtml(ref.type)}"
            data-ref-id="${escapeHtml(ref.id)}"
            title="${escapeHtml(ref.seccion || ref.label)}"
          >${escapeHtml(ref.label)}</button>
        `
      )
      .join('');

    const isAtStart = state.currentSlideIndex <= 0;
    const isAtEnd = state.currentSlideIndex >= SLIDES.length - 1;

    footerSlot.innerHTML = `
      <div data-testid="footer-bar">
        <div class="footer-refs">${refsHtml}</div>
        <div class="footer-drawers">
          <button
            type="button"
            class="chrome-btn ${state.drawerOpen && state.activeDrawerTab === 'documento' ? 'is-active' : ''}"
            data-testid="btn-drawer-documento"
            title="Abrir Documento PDF (D)"
          ><span>📄</span><span class="btn-label-opt"> Documento</span></button>
          <button
            type="button"
            class="chrome-btn ${state.drawerOpen && state.activeDrawerTab === 'excel' ? 'is-active' : ''}"
            data-testid="btn-drawer-excel"
            title="Abrir Modelo Excel (E)"
          ><span>📊</span><span class="btn-label-opt"> Excel</span></button>
          <button
            type="button"
            class="chrome-btn ${state.drawerOpen && state.activeDrawerTab === 'sistema' ? 'is-active' : ''}"
            data-testid="btn-drawer-sistema"
            title="Abrir Sistema POS (S)"
          ><span>🖥️</span><span class="btn-label-opt"> Sistema</span></button>
          <button
            type="button"
            class="chrome-btn ${state.drawerOpen && state.activeDrawerTab === 'evidencias' ? 'is-active' : ''}"
            data-testid="btn-drawer-evidencias"
            title="Abrir Evidencias"
          ><span>🧪</span><span class="btn-label-opt"> Evidencias</span></button>
        </div>
        <div class="footer-nav">
          <button
            type="button"
            class="chrome-btn ${state.presenterNotesOpen ? 'is-active' : ''}"
            data-testid="btn-notes"
            title="Notas del expositor (P)"
          ><span>📝</span><span class="btn-label-opt"> Notas</span></button>
          <button
            type="button"
            class="chrome-btn ${state.overviewOpen ? 'is-active' : ''}"
            data-testid="btn-overview"
            title="Mapa general de ruta (O)"
          ><span>🗺️</span><span class="btn-label-opt"> Mapa</span></button>
          <button
            type="button"
            class="chrome-btn"
            data-testid="btn-prev"
            title="Anterior (Flecha izquierda)"
            ${isAtStart ? 'aria-disabled="true"' : ''}
          >◀</button>
          <button
            type="button"
            class="chrome-btn"
            data-testid="btn-next"
            title="Siguiente (Flecha derecha / Espacio)"
            ${isAtEnd ? 'aria-disabled="true"' : ''}
          >▶</button>
        </div>
      </div>
    `;

    footerSlot.querySelectorAll('[data-testid="ref-chip"]').forEach((chip) => {
      chip.addEventListener('click', () => {
        const ref = refs.find((r) => r.id === chip.dataset.refId);
        if (!ref) return;
        if (ref.type === 'pdf') appState.openDocumento(ref.page ?? 1, ref.query ?? '');
        else if (ref.type === 'excel') appState.openExcel(ref.sheet ?? 'Resumen', ref.range ?? '');
        else if (ref.type === 'sistema') appState.openSistema(ref.stepId ?? 'pos-sale');
        else if (ref.type === 'evidencias') appState.openEvidencias(ref.evidenceId ?? 'regresion-completa');
      });
    });

    footerSlot.querySelector('[data-testid="btn-drawer-documento"]').addEventListener('click', () => {
      const pdfRef = getPrimaryRef(slide, 'pdf');
      appState.openDocumento(pdfRef?.page ?? 1, pdfRef?.query ?? '');
    });
    footerSlot.querySelector('[data-testid="btn-drawer-excel"]').addEventListener('click', () => {
      const xlsRef = getPrimaryRef(slide, 'excel');
      appState.openExcel(xlsRef?.sheet ?? 'Resumen', xlsRef?.range ?? '');
    });
    footerSlot.querySelector('[data-testid="btn-drawer-sistema"]').addEventListener('click', () => {
      const sysRef = getPrimaryRef(slide, 'sistema');
      appState.openSistema(sysRef?.stepId ?? 'pos-sale');
    });
    footerSlot.querySelector('[data-testid="btn-drawer-evidencias"]').addEventListener('click', () => {
      const evRef = getPrimaryRef(slide, 'evidencias');
      appState.openEvidencias(evRef?.evidenceId ?? '');
    });

    footerSlot.querySelector('[data-testid="btn-notes"]').addEventListener('click', () => {
      appState.togglePresenterNotes();
    });
    footerSlot.querySelector('[data-testid="btn-overview"]').addEventListener('click', () => {
      appState.toggleOverview();
    });
    footerSlot.querySelector('[data-testid="btn-prev"]').addEventListener('click', () => {
      appState.prevSlide();
    });
    footerSlot.querySelector('[data-testid="btn-next"]').addEventListener('click', () => {
      appState.nextSlide();
    });
  }

  function renderAll(state) {
    renderHeader(state);
    renderFooter(state);
  }

  const unsubscribe = appState.subscribe((state, meta = {}) => {
    if (meta.type === 'timer:tick') {
      const timerEl = headerSlot.querySelector('[data-testid="timer-display"]');
      if (timerEl) timerEl.textContent = formatTimer(state.elapsedSeconds);
      return;
    }
    if (meta.type === 'webgl') return;
    renderAll(state);
  });

  renderAll(appState.getState());

  return {
    destroy() {
      unsubscribe();
      headerSlot.innerHTML = '';
      footerSlot.innerHTML = '';
    },
  };
}
