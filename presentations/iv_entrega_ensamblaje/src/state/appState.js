export const DRAWER_TABS = Object.freeze(['documento', 'excel', 'sistema', 'evidencias']);
export const TOTAL_SLIDES = 36;

export function slideIndexToId(index) {
  const clamped = Math.max(0, Math.min(TOTAL_SLIDES - 1, Number(index) || 0));
  return `S${String(clamped).padStart(2, '0')}`;
}

export function resolveSlideIndex(indexOrId) {
  if (typeof indexOrId === 'number' && Number.isFinite(indexOrId)) {
    return Math.max(0, Math.min(TOTAL_SLIDES - 1, Math.trunc(indexOrId)));
  }
  if (typeof indexOrId === 'string') {
    const match = indexOrId.trim().toUpperCase().match(/^S?(\d{1,2})$/);
    if (match) {
      return Math.max(0, Math.min(TOTAL_SLIDES - 1, Number(match[1])));
    }
  }
  return null;
}

export function createAppState(overrides = {}) {
  const motionMq =
    typeof window !== 'undefined' && typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : null;

  let state = {
    currentSlideIndex: 0,
    currentSlideId: 'S00',
    prevSlideIndex: null,
    prevSlideId: null,
    drawerOpen: false,
    activeDrawerTab: 'documento',
    drawerPayload: {},
    overviewOpen: false,
    presenterNotesOpen: false,
    muted: true,
    reducedMotion: Boolean(motionMq?.matches),
    webglAvailable: true,
    elapsedSeconds: 0,
    timerRunning: false,
    ...overrides,
  };

  if (typeof overrides.currentSlideIndex === 'number' && !overrides.currentSlideId) {
    state.currentSlideIndex = resolveSlideIndex(overrides.currentSlideIndex) ?? 0;
    state.currentSlideId = slideIndexToId(state.currentSlideIndex);
  } else if (typeof overrides.currentSlideId === 'string' && overrides.currentSlideIndex === undefined) {
    const idx = resolveSlideIndex(overrides.currentSlideId);
    if (idx !== null) {
      state.currentSlideIndex = idx;
      state.currentSlideId = slideIndexToId(idx);
    }
  }

  const listeners = new Set();
  let timerHandle = null;

  function snapshotOf() {
    return Object.freeze({
      ...state,
      drawerPayload: Object.freeze({ ...state.drawerPayload }),
    });
  }

  function emit(meta = {}) {
    const snapshot = snapshotOf();
    for (const listener of listeners) {
      listener(snapshot, meta);
    }
  }

  function setState(patch, meta = {}) {
    state = { ...state, ...patch };
    emit(meta);
  }

  function startTimer() {
    if (timerHandle !== null) return;
    setState({ timerRunning: true }, { type: 'timer:start' });
    timerHandle = setInterval(() => {
      state = { ...state, elapsedSeconds: state.elapsedSeconds + 1 };
      emit({ type: 'timer:tick' });
    }, 1000);
  }

  function pauseTimer() {
    if (timerHandle !== null) {
      clearInterval(timerHandle);
      timerHandle = null;
    }
    if (state.timerRunning) {
      setState({ timerRunning: false }, { type: 'timer:pause' });
    }
  }

  function resetTimer() {
    pauseTimer();
    setState({ elapsedSeconds: 0 }, { type: 'timer:reset' });
  }

  const onMotionChange = (event) => {
    setState({ reducedMotion: Boolean(event.matches) }, { type: 'reducedMotion' });
  };
  motionMq?.addEventListener?.('change', onMotionChange);

  return {
    getState: snapshotOf,
    subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('appState.subscribe requiere una función listener');
      }
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    goToSlide(indexOrId, options = {}) {
      const nextIndex = resolveSlideIndex(indexOrId);
      if (nextIndex === null) return false;
      const { closeOverview = true, closeDrawer = false, source = 'nav' } = options;
      const changed = nextIndex !== state.currentSlideIndex;
      const prevSlideIndex = state.currentSlideIndex;
      const prevSlideId = state.currentSlideId;

      if (nextIndex > 0 && !state.timerRunning && state.elapsedSeconds === 0 && typeof setInterval === 'function') {
        startTimer();
      }

      setState(
        {
          currentSlideIndex: nextIndex,
          currentSlideId: slideIndexToId(nextIndex),
          prevSlideIndex: changed ? prevSlideIndex : state.prevSlideIndex,
          prevSlideId: changed ? prevSlideId : state.prevSlideId,
          overviewOpen: closeOverview ? false : state.overviewOpen,
          drawerOpen: closeDrawer ? false : state.drawerOpen,
        },
        { type: 'slide', changed, source }
      );
      return true;
    },
    nextSlide() {
      return this.goToSlide(Math.min(TOTAL_SLIDES - 1, state.currentSlideIndex + 1), { source: 'next' });
    },
    prevSlide() {
      return this.goToSlide(Math.max(0, state.currentSlideIndex - 1), { source: 'prev' });
    },
    openDocumento(page = 1, query = '') {
      setState(
        {
          drawerOpen: true,
          activeDrawerTab: 'documento',
          drawerPayload: {
            page: Math.max(1, Number(page) || 1),
            query: String(query || ''),
          },
          overviewOpen: false,
        },
        { type: 'drawer:open', tab: 'documento' }
      );
    },
    openExcel(sheet = 'Resumen', range = '') {
      setState(
        {
          drawerOpen: true,
          activeDrawerTab: 'excel',
          drawerPayload: {
            sheet: String(sheet || 'Resumen'),
            range: String(range || ''),
          },
          overviewOpen: false,
        },
        { type: 'drawer:open', tab: 'excel' }
      );
    },
    openSistema(stepId = '') {
      setState(
        {
          drawerOpen: true,
          activeDrawerTab: 'sistema',
          drawerPayload: { stepId: String(stepId || '') },
          overviewOpen: false,
        },
        { type: 'drawer:open', tab: 'sistema' }
      );
    },
    openEvidencias(evidenceId = '') {
      setState(
        {
          drawerOpen: true,
          activeDrawerTab: 'evidencias',
          drawerPayload: { evidenceId: String(evidenceId || '') },
          overviewOpen: false,
        },
        { type: 'drawer:open', tab: 'evidencias' }
      );
    },
    closeDrawer() {
      if (!state.drawerOpen) return;
      setState({ drawerOpen: false }, { type: 'drawer:close' });
    },
    toggleOverview(force) {
      const next = typeof force === 'boolean' ? force : !state.overviewOpen;
      setState({ overviewOpen: next }, { type: 'overview' });
    },
    togglePresenterNotes(force) {
      const next = typeof force === 'boolean' ? force : !state.presenterNotesOpen;
      setState({ presenterNotesOpen: next }, { type: 'notes' });
    },
    toggleMute() {
      setState({ muted: !state.muted }, { type: 'mute' });
    },
    setWebglAvailable(available) {
      setState({ webglAvailable: Boolean(available) }, { type: 'webgl' });
    },
    startTimer,
    pauseTimer,
    resetTimer,
    destroy() {
      pauseTimer();
      motionMq?.removeEventListener?.('change', onMotionChange);
      listeners.clear();
    },
  };
}

export const appState = createAppState();
export default appState;
