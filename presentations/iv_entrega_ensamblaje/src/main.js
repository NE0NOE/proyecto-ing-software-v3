import './styles/tokens.css';
import './styles/layout.css';
import './styles/drawers.css';

import { appState } from './state/appState.js';
import { SLIDES, CHAPTERS } from './data/slides.js';

function ensureRootShell(rootEl) {
  rootEl.innerHTML = `
    <div class="app-shell" data-testid="app-shell" data-slide-id="S00">
      <div id="stage-viewport" data-testid="stage-viewport">
        <div id="stage-canvas-wrap">
          <div id="stage-fallback" data-testid="stage-fallback" hidden></div>
          <div id="stage-labels"></div>
        </div>
        <div id="act-transition-overlay" aria-hidden="true"></div>
        <header id="header-slot"></header>
        <main id="slide-slot"></main>
        <aside id="notes-slot"></aside>
        <footer id="footer-slot"></footer>
        <div id="overview-slot"></div>
      </div>
      <aside id="drawer-slot"></aside>
    </div>
  `;
  return {
    shell: rootEl.querySelector('[data-testid="app-shell"]'),
    canvasWrap: rootEl.querySelector('#stage-canvas-wrap'),
    labelWrap: rootEl.querySelector('#stage-labels'),
    fallbackWrap: rootEl.querySelector('#stage-fallback'),
    actOverlay: rootEl.querySelector('#act-transition-overlay'),
    headerSlot: rootEl.querySelector('#header-slot'),
    slideSlot: rootEl.querySelector('#slide-slot'),
    notesSlot: rootEl.querySelector('#notes-slot'),
    footerSlot: rootEl.querySelector('#footer-slot'),
    overviewSlot: rootEl.querySelector('#overview-slot'),
    drawerSlot: rootEl.querySelector('#drawer-slot'),
  };
}

/**
 * Clean module-boundary wiring hooks so M2, M3, M4 plug in with zero coupling to main.js internals.
 * During M1, defaults are no-op stubs; M5 (or incremental M2/M3/M4 wiring) passes real initializers.
 */
export function bootstrapApp(modules = {}) {
  const rootEl = document.getElementById('app');
  if (!rootEl) throw new Error('Missing #app root element');
  const slots = ensureRootShell(rootEl);

  const stageApi = modules.initStage
    ? modules.initStage(slots.canvasWrap, slots.labelWrap, appState)
    : {
        setSlide() {},
        triggerActTransition(_act, onMidpoint) {
          onMidpoint?.();
        },
        triggerSimulationEffect() {},
        setDrawerShift() {},
        inspectElement() {},
        getDiagnostics: () => ({
          webgl: false,
          fps: 0,
          assemblyStage: 'stub',
          bloomEnabled: false,
          currentSlideId: appState.getState().currentSlideId,
        }),
        destroy() {},
      };

  const uiHandles = [];
  if (modules.initChrome) uiHandles.push(modules.initChrome(slots.headerSlot, slots.footerSlot, appState));
  if (modules.initSlideRenderer) {
    uiHandles.push(modules.initSlideRenderer(slots.slideSlot, slots.notesSlot, slots.actOverlay, appState, stageApi));
  }
  if (modules.initOverview) uiHandles.push(modules.initOverview(slots.overviewSlot, appState));
  if (modules.initDrawers) uiHandles.push(modules.initDrawers(slots.drawerSlot, appState));

  const syncShell = (state, meta = {}) => {
    slots.shell.dataset.slideId = state.currentSlideId;
    slots.shell.classList.toggle('is-drawer-open', state.drawerOpen);
    slots.shell.classList.toggle('is-overview-open', state.overviewOpen);
    slots.shell.classList.toggle('reduced-motion', state.reducedMotion);
    slots.fallbackWrap.hidden = state.webglAvailable;
    if (meta.type === 'drawer:open' || meta.type === 'drawer:close') {
      stageApi.setDrawerShift?.(state.drawerOpen);
    }
  };
  const unsubscribe = appState.subscribe(syncShell);
  syncShell(appState.getState(), { type: 'init' });

  const onKeyDown = (event) => {
    const tag = event.target?.tagName;
    const isEditing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || event.target?.isContentEditable;
    const state = appState.getState();

    if (event.key === 'Escape') {
      if (state.overviewOpen) {
        appState.toggleOverview(false);
        return;
      }
      if (state.drawerOpen) {
        appState.closeDrawer();
        return;
      }
      if (state.presenterNotesOpen) {
        appState.togglePresenterNotes(false);
        return;
      }
      return;
    }
    if (isEditing || event.ctrlKey || event.metaKey || event.altKey) return;

    const slide = SLIDES[state.currentSlideIndex];
    const firstPdf = slide?.refs?.find((r) => r.type === 'pdf');
    const firstExcel = slide?.refs?.find((r) => r.type === 'excel');

    switch (event.key) {
      case 'ArrowRight':
      case ' ':
        if (!state.drawerOpen && !state.overviewOpen) {
          event.preventDefault();
          appState.nextSlide();
        }
        break;
      case 'ArrowLeft':
        if (!state.drawerOpen && !state.overviewOpen) {
          event.preventDefault();
          appState.prevSlide();
        }
        break;
      case 'Enter':
        if (state.currentSlideId === 'S00' && !state.drawerOpen && !state.overviewOpen) {
          event.preventDefault();
          appState.nextSlide();
        }
        break;
      case 'd':
      case 'D':
        event.preventDefault();
        if (state.drawerOpen && state.activeDrawerTab === 'documento') appState.closeDrawer();
        else appState.openDocumento(firstPdf?.page ?? 1, firstPdf?.query ?? '');
        break;
      case 'e':
      case 'E':
        event.preventDefault();
        if (state.drawerOpen && state.activeDrawerTab === 'excel') appState.closeDrawer();
        else appState.openExcel(firstExcel?.sheet ?? 'Resumen', firstExcel?.range ?? '');
        break;
      case 's':
      case 'S':
        event.preventDefault();
        if (state.drawerOpen && state.activeDrawerTab === 'sistema') appState.closeDrawer();
        else appState.openSistema();
        break;
      case 'o':
      case 'O':
        event.preventDefault();
        appState.toggleOverview();
        break;
      case 'p':
      case 'P':
        event.preventDefault();
        appState.togglePresenterNotes();
        break;
      case 'm':
      case 'M':
        event.preventDefault();
        appState.toggleMute();
        break;
      case 'f':
      case 'F':
        event.preventDefault();
        if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
        else document.exitFullscreen?.().catch(() => {});
        break;
    }
  };
  window.addEventListener('keydown', onKeyDown);

  return {
    appState,
    SLIDES,
    CHAPTERS,
    stageApi,
    destroy() {
      window.removeEventListener('keydown', onKeyDown);
      unsubscribe();
      stageApi.destroy?.();
      uiHandles.forEach((h) => h?.destroy?.());
      appState.destroy();
    },
  };
}

if (typeof document !== 'undefined' && document.getElementById('app')) {
  window.__MREC_APP__ = bootstrapApp();
}
