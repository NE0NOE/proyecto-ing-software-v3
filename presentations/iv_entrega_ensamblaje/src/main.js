import './styles/tokens.css';
import './styles/layout.css';
import './styles/drawers.css';
import './styles/slides.css';

import { appState, resolveSlideIndex } from './state/appState.js';
import { SLIDES, CHAPTERS } from './data/slides.js';
import { initStage } from './three/stageManager.js';
import { initChrome } from './ui/chrome.js';
import { initSlideRenderer } from './ui/slideRenderer.js';
import { initOverview } from './ui/overview.js';
import { initDrawers } from './drawers/drawerShell.js';

function ensureRootShell(rootEl) {
  rootEl.innerHTML = `
    <div class="app-shell" data-testid="app-shell" data-slide-id="S00">
      <div id="stage-viewport" data-testid="stage-viewport">
        <div id="stage-canvas-wrap">
          <div id="stage-fallback" data-testid="stage-fallback" hidden></div>
        </div>
        <div id="act-transition-overlay" aria-hidden="true"></div>
        <header id="header-slot"></header>
        <main id="slide-slot"></main>
        <aside id="notes-slot"></aside>
        <div id="stage-labels"></div>
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

export function bootstrapApp(modules = {}) {
  const rootEl = document.getElementById('app');
  if (!rootEl) throw new Error('Missing #app root element');
  const slots = ensureRootShell(rootEl);

  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search || '');
    const querySlide = searchParams.get('slide');
    const hashSlide = (window.location.hash || '').replace(/^#/, '');
    const initialIdx = resolveSlideIndex(querySlide) ?? resolveSlideIndex(hashSlide);
    if (initialIdx !== null) {
      appState.goToSlide(initialIdx, { source: 'url' });
    }
  }

  const stageInit = modules.initStage === undefined ? initStage : modules.initStage;
  const chromeInit = modules.initChrome === undefined ? initChrome : modules.initChrome;
  const slideInit = modules.initSlideRenderer === undefined ? initSlideRenderer : modules.initSlideRenderer;
  const overviewInit = modules.initOverview === undefined ? initOverview : modules.initOverview;
  const drawersInit = modules.initDrawers === undefined ? initDrawers : modules.initDrawers;

  const stageApi = stageInit
    ? stageInit(slots.canvasWrap, slots.labelWrap, appState)
    : {
        setSlide(_s, opts) {
          opts?.onTransitionComplete?.();
        },
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
  if (chromeInit) uiHandles.push(chromeInit(slots.headerSlot, slots.footerSlot, appState));
  if (slideInit) {
    uiHandles.push(slideInit(slots.slideSlot, slots.notesSlot, slots.actOverlay, appState, stageApi));
  }
  if (overviewInit) uiHandles.push(overviewInit(slots.overviewSlot, appState));
  if (drawersInit) uiHandles.push(drawersInit(slots.drawerSlot, appState));

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
    const inputType = tag === 'INPUT' ? String(event.target.type || 'text').toLowerCase() : '';
    const isNonTextInput = tag === 'INPUT' && ['range', 'checkbox', 'radio', 'button', 'submit', 'reset', 'color', 'file'].includes(inputType);
    const isEditing = tag === 'TEXTAREA' || tag === 'SELECT' || event.target?.isContentEditable || (tag === 'INPUT' && !isNonTextInput);
    const isInteractiveTarget = Boolean(event.target?.closest?.('button, a, [role="button"], summary'));
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
    if (inputType === 'range' && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) return;

    const slide = SLIDES[state.currentSlideIndex];
    const refs = slide?.refs || [];
    const firstPdf = refs.find((r) => r.type === 'pdf' && r.primary) || refs.find((r) => r.type === 'pdf');
    const firstExcel = refs.find((r) => r.type === 'excel' && r.primary) || refs.find((r) => r.type === 'excel');
    const firstSys = refs.find((r) => r.type === 'sistema' && r.primary) || refs.find((r) => r.type === 'sistema');

    switch (event.key) {
      case 'ArrowRight':
        if (!state.drawerOpen && !state.overviewOpen) {
          event.preventDefault();
          appState.nextSlide();
        }
        break;
      case ' ':
        if (isInteractiveTarget) return;
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
        if (isInteractiveTarget) return;
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
        else appState.openSistema(firstSys?.stepId ?? 'pos-sale');
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
