import { DRAWER_TABS } from '../state/appState.js';
import { REFS_BY_SLIDE, SLIDES } from '../data/slides.js';
import { initDocumentoDrawer } from './documentoDrawer.js';
import { initExcelDrawer } from './excelDrawer.js';
import { initSistemaDrawer } from './sistemaDrawer.js';
import { initEvidenciasDrawer } from './evidenciasDrawer.js';

const TAB_META = {
  documento: { label: '📄 Documento' },
  excel: { label: '📊 Excel' },
  sistema: { label: '🖥️ Sistema' },
  evidencias: { label: '🧪 Evidencias' },
};

export function initDrawers(drawerSlot, appState) {
  drawerSlot.innerHTML = `
    <aside
      data-testid="evidence-drawer"
      data-open="false"
      data-active-tab="documento"
      role="complementary"
      aria-label="Cajón de evidencias y anexos"
    >
      <div class="drawer-header">
        <div class="drawer-tabs" role="tablist" aria-label="Secciones de evidencia">
          ${DRAWER_TABS.map(
            (tab) => `
              <button
                type="button"
                role="tab"
                class="drawer-tab-btn"
                data-testid="drawer-tab-${tab}"
                data-tab="${tab}"
                aria-selected="${tab === 'documento' ? 'true' : 'false'}"
              >${TAB_META[tab].label}</button>
            `
          ).join('')}
        </div>
        <button type="button" data-testid="drawer-close" aria-label="Cerrar cajón (Esc)">✕ Cerrar</button>
      </div>
      <div class="drawer-body">
        <section class="drawer-panel" data-drawer-panel="documento" hidden></section>
        <section class="drawer-panel" data-drawer-panel="excel" hidden></section>
        <section class="drawer-panel" data-drawer-panel="sistema" hidden></section>
        <section class="drawer-panel" data-drawer-panel="evidencias" hidden></section>
      </div>
    </aside>
  `;

  const drawerEl = drawerSlot.querySelector('[data-testid="evidence-drawer"]');
  const closeBtn = drawerSlot.querySelector('[data-testid="drawer-close"]');
  const panels = {
    documento: drawerSlot.querySelector('[data-drawer-panel="documento"]'),
    excel: drawerSlot.querySelector('[data-drawer-panel="excel"]'),
    sistema: drawerSlot.querySelector('[data-drawer-panel="sistema"]'),
    evidencias: drawerSlot.querySelector('[data-drawer-panel="evidencias"]'),
  };

  const mounted = {
    documento: null,
    excel: null,
    sistema: null,
    evidencias: null,
  };

  let preserveNextSync = false;

  function ensureMounted(tab, payload) {
    if (mounted[tab]) return false;
    const panel = panels[tab];
    if (!panel) return false;
    if (tab === 'documento') mounted.documento = initDocumentoDrawer(panel, payload);
    else if (tab === 'excel') mounted.excel = initExcelDrawer(panel, payload);
    else if (tab === 'sistema') mounted.sistema = initSistemaDrawer(panel, payload);
    else if (tab === 'evidencias') mounted.evidencias = initEvidenciasDrawer(panel, payload);
    return true;
  }

  function renderDrawerState(state, shouldSync = false) {
    const activeTab = DRAWER_TABS.includes(state.activeDrawerTab) ? state.activeDrawerTab : 'documento';
    drawerEl.dataset.open = String(Boolean(state.drawerOpen));
    drawerEl.dataset.activeTab = activeTab;

    drawerSlot.querySelectorAll('.drawer-tab-btn').forEach((btn) => {
      const active = btn.dataset.tab === activeTab;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-selected', String(active));
    });

    for (const tab of DRAWER_TABS) {
      panels[tab].hidden = !state.drawerOpen || tab !== activeTab;
    }

    if (state.drawerOpen) {
      const freshlyMounted = ensureMounted(activeTab, state.drawerPayload);
      if (!freshlyMounted && shouldSync) {
        mounted[activeTab]?.sync?.(state.drawerPayload);
      }
    }
  }

  drawerSlot.querySelectorAll('.drawer-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      const state = appState.getState();
      const slide = SLIDES[state.currentSlideIndex] || SLIDES[0];
      const refs = REFS_BY_SLIDE[slide.id] || slide.refs || [];
      const refFor = (type) => refs.find((r) => r.type === type && r.primary) || refs.find((r) => r.type === type);

      if (mounted[tab]) {
        preserveNextSync = true;
        if (tab === 'documento') appState.openDocumento(mounted.documento.getCurrentPage(), '');
        else if (tab === 'excel') appState.openExcel(mounted.excel.getCurrentSheet(), '');
        else if (tab === 'sistema') appState.openSistema();
        else if (tab === 'evidencias') appState.openEvidencias();
      } else {
        if (tab === 'documento') {
          const r = refFor('pdf');
          appState.openDocumento(r?.page ?? 1, r?.query ?? '');
        } else if (tab === 'excel') {
          const r = refFor('excel');
          appState.openExcel(r?.sheet ?? 'Resumen', r?.range ?? '');
        } else if (tab === 'sistema') {
          const r = refFor('sistema');
          appState.openSistema(r?.stepId ?? 'pos-sale');
        } else if (tab === 'evidencias') {
          const r = refFor('evidencias');
          appState.openEvidencias(r?.evidenceId ?? '');
        }
      }
    });
  });

  closeBtn.addEventListener('click', () => {
    appState.closeDrawer();
  });

  const unsubscribe = appState.subscribe((state, meta = {}) => {
    if (meta.type === 'drawer:open') {
      const skipSync = preserveNextSync;
      preserveNextSync = false;
      renderDrawerState(state, !skipSync);
    } else if (meta.type === 'drawer:close') {
      preserveNextSync = false;
      renderDrawerState(state, false);
    }
  });

  renderDrawerState(appState.getState(), false);

  return {
    destroy() {
      unsubscribe();
      for (const tab of DRAWER_TABS) {
        mounted[tab]?.destroy?.();
        mounted[tab] = null;
      }
      drawerSlot.innerHTML = '';
    },
  };
}
