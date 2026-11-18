import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import gsap from 'gsap';
import { SLIDES } from '../data/slides.js';
import { createMotorcycleRig, disposeObject3D } from './motorcycleParts.js';
import { buildChapterPropGroup } from './chapterProps.js';
import { createSoundEngine } from './soundEngine.js';

const ACT_THEMES = {
  0: { bg: 0x10182d, fog: 0x10182d, gridA: 0x3ba0ff, gridB: 0x1e2e4f, rim: 0x3ba0ff, key: 0xdbeafe, ambient: 0.72 },
  1: { bg: 0x0f1f3a, fog: 0x0f1f3a, gridA: 0x5b9bd5, gridB: 0x1a345c, rim: 0x00ffff, key: 0xe0f2fe, ambient: 0.78 },
  2: { bg: 0x13242b, fog: 0x13242b, gridA: 0x22d3ee, gridB: 0x1b3742, rim: 0xff6b1a, key: 0xfff7ed, ambient: 0.85 },
  3: { bg: 0x231722, fog: 0x231722, gridA: 0xf59e0b, gridB: 0x3d2434, rim: 0xff6b1a, key: 0xfef3c7, ambient: 0.86 },
  4: { bg: 0x102724, fog: 0x102724, gridA: 0x2ee59d, gridB: 0x193f39, rim: 0xf1c40f, key: 0xecfdf5, ambient: 0.92 },
  5: { bg: 0x141b30, fog: 0x141b30, gridA: 0x5b9bd5, gridB: 0x21304f, rim: 0xf1c40f, key: 0xf8fafc, ambient: 0.88 },
};

function checkWebGLSupport() {
  if (typeof document === 'undefined') return false;
  try {
    const probe = document.createElement('canvas');
    const ctx =
      probe.getContext('webgl2', { antialias: true, powerPreference: 'high-performance' }) ||
      probe.getContext('webgl', { antialias: true }) ||
      probe.getContext('experimental-webgl');
    if (!ctx) return false;
    ctx.getExtension?.('WEBGL_lose_context')?.loseContext?.();
    return true;
  } catch {
    return false;
  }
}

function renderBlueprintFallback(fallbackEl, appState) {
  if (!fallbackEl) return;
  const state = appState.getState();
  const slide = SLIDES[state.currentSlideIndex] || SLIDES[0];
  fallbackEl.innerHTML = `
    <div style="width:100%;max-width:860px;padding:24px;text-align:center;color:#94a3b8;">
      <svg viewBox="0 0 800 300" style="width:100%;height:auto;max-height:260px;opacity:0.75;" aria-label="Plano esquemático motocicleta MREC">
        <defs>
          <pattern id="bpGrid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(59,160,255,0.18)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="800" height="300" rx="14" fill="#0d1b32" stroke="rgba(59,160,255,0.35)" />
        <rect width="800" height="300" rx="14" fill="url(#bpGrid)" />
        <g stroke="#3BA0FF" stroke-width="2.5" fill="none">
          <circle cx="215" cy="215" r="54" />
          <circle cx="215" cy="215" r="36" stroke-dasharray="6 4" />
          <circle cx="585" cy="215" r="54" />
          <circle cx="585" cy="215" r="36" stroke-dasharray="6 4" />
          <path d="M215 215 L335 215 L445 140 L540 135 L585 215" />
          <path d="M335 215 L360 130 L455 120 L515 112" />
          <path d="M510 92 L545 110 L585 215" />
          <rect x="368" y="138" width="90" height="58" rx="6" fill="rgba(59,160,255,0.16)" />
          <path d="M270 138 L378 138 L398 118 L315 118 Z" fill="rgba(255,107,26,0.18)" stroke="#FF6B1A" />
        </g>
        <text x="24" y="34" fill="#5B9BD5" font-family="monospace" font-size="14">MODO PLANO SVG 2D · ${slide.id} · ${slide.assemblyStage.toUpperCase()} (${Math.round((slide.assemblyProgress || 0) * 100)}%)</text>
      </svg>
    </div>
  `;
}

/**
 * Orquestador persistente WebGL2 + CSS2D + cámara GSAP + Audio para todo el ciclo de 36 diapositivas.
 */
export function initStage(canvasWrap, labelWrap, appState) {
  const sound = createSoundEngine(appState);
  const fallbackWrap = canvasWrap.querySelector('#stage-fallback') || document.getElementById('stage-fallback');
  const webglSupported = checkWebGLSupport();

  if (!webglSupported) {
    appState.setWebglAvailable(false);
    renderBlueprintFallback(fallbackWrap, appState);
    const unsubFallback = appState.subscribe((state, meta) => {
      if (meta.type === 'slide' || meta.type === 'webgl') {
        renderBlueprintFallback(fallbackWrap, appState);
      }
    });
    return {
      setSlide() {},
      triggerActTransition(_act, onMidpoint) {
        onMidpoint?.();
      },
      triggerSimulationEffect() {},
      setDrawerShift() {},
      inspectElement(type, id) {
        if (type === 'db-table') appState.openDocumento(15, id);
        if (type === 'vlan') appState.openDocumento(272, 'VLAN');
      },
      getDiagnostics: () => ({
        webgl: false,
        fps: 0,
        assemblyStage: (SLIDES[appState.getState().currentSlideIndex] || SLIDES[0]).assemblyStage,
        bloomEnabled: false,
        currentSlideId: appState.getState().currentSlideId,
      }),
      destroy() {
        unsubFallback();
        sound.destroy();
      },
    };
  }

  appState.setWebglAvailable(true);

  // Canvas persistente único (jamás destruido al cambiar de slide)
  let canvas = canvasWrap.querySelector('canvas[data-testid="stage-webgl"]');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.dataset.testid = 'stage-webgl';
    canvasWrap.insertBefore(canvas, canvasWrap.firstChild);
  }

  const initW = Math.max(320, canvasWrap.clientWidth || window.innerWidth || 1280);
  const initH = Math.max(240, canvasWrap.clientHeight || window.innerHeight || 720);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(initW, initH, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;

  const css2d = new CSS2DRenderer();
  css2d.setSize(initW, initH);
  css2d.domElement.style.position = 'absolute';
  css2d.domElement.style.inset = '0';
  css2d.domElement.style.pointerEvents = 'none';
  labelWrap.innerHTML = '';
  labelWrap.appendChild(css2d.domElement);

  const scene = new THREE.Scene();
  const initialTheme = ACT_THEMES[0];
  scene.background = new THREE.Color(initialTheme.bg);
  scene.fog = new THREE.FogExp2(initialTheme.fog, 0.042);

  const camera = new THREE.PerspectiveCamera(44, initW / initH, 0.1, 100);
  camera.position.set(4.2, 2.0, 5.4);
  const lookTarget = new THREE.Vector3(0, 0.7, 0);
  camera.lookAt(lookTarget);

  // Iluminación adaptativa por Acto
  const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x0b1020, 0.8);
  scene.add(hemiLight);

  const keyLight = new THREE.DirectionalLight(initialTheme.key, 1.85);
  keyLight.position.set(4.5, 6.5, 4.8);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(initialTheme.rim, 1.35);
  rimLight.position.set(-4.5, 2.6, -4.0);
  scene.add(rimLight);

  const underLight = new THREE.PointLight(0x3ba0ff, 1.1, 12);
  underLight.position.set(0, 0.35, 1.8);
  scene.add(underLight);

  // Grilla blueprint dinámica
  let gridHelper = new THREE.GridHelper(22, 32, initialTheme.gridA, initialTheme.gridB);
  gridHelper.position.y = 0;
  scene.add(gridHelper);

  // Partículas ambientales sutiles
  const particleCount = 90;
  const pPositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i += 1) {
    pPositions[i * 3] = (Math.random() - 0.5) * 10;
    pPositions[i * 3 + 1] = Math.random() * 3.4 + 0.15;
    pPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const pMat = new THREE.PointsMaterial({ color: 0x3ba0ff, size: 0.045, transparent: true, opacity: 0.55 });
  const particles = new THREE.Points(pGeo, pMat);
  scene.add(particles);

  // Rig motocicleta + utilería por capítulo
  const moto = createMotorcycleRig();
  scene.add(moto.root);

  let activePropHandle = null;
  let currentCamTween = null;
  let drawerOffsetX = 0;
  let inspectBannerReset = null;
  let currentActTheme = 0;
  let needsRender = true;

  function applyThemeForAct(actNumber) {
    if (actNumber === currentActTheme) return;
    currentActTheme = actNumber;
    const t = ACT_THEMES[actNumber] || ACT_THEMES[0];
    scene.background.setHex(t.bg);
    scene.fog.color.setHex(t.fog);
    keyLight.color.setHex(t.key);
    rimLight.color.setHex(t.rim);
    hemiLight.intensity = t.ambient;
    pMat.color.setHex(t.gridA);

    scene.remove(gridHelper);
    disposeObject3D(gridHelper);
    gridHelper = new THREE.GridHelper(22, 32, t.gridA, t.gridB);
    gridHelper.position.y = 0;
    scene.add(gridHelper);
  }

  function swapChapterProps(slide) {
    if (activePropHandle) {
      scene.remove(activePropHandle.group);
      activePropHandle.destroy();
      activePropHandle = null;
    }
    activePropHandle = buildChapterPropGroup(slide, appState, api);
    scene.add(activePropHandle.group);
  }

  function animateCameraTo(slide) {
    const preset = slide.cameraPreset || { pos: [3.8, 1.8, 5.2], target: [0, 0.7, 0], fov: 44 };
    const tx = (preset.target?.[0] ?? 0) + drawerOffsetX;
    const ty = preset.target?.[1] ?? 0.7;
    const tz = preset.target?.[2] ?? 0;

    currentCamTween?.kill?.();
    const reduced = appState.getState().reducedMotion;

    if (reduced) {
      camera.position.set(preset.pos[0], preset.pos[1], preset.pos[2]);
      lookTarget.set(tx, ty, tz);
      camera.fov = preset.fov || 44;
      camera.updateProjectionMatrix();
      camera.lookAt(lookTarget);
      needsRender = true;
      return;
    }

    currentCamTween = gsap.timeline();
    currentCamTween.to(
      camera.position,
      {
        x: preset.pos[0],
        y: preset.pos[1],
        z: preset.pos[2],
        duration: 0.9,
        ease: 'power3.out',
      },
      0
    );
    currentCamTween.to(
      lookTarget,
      {
        x: tx,
        y: ty,
        z: tz,
        duration: 0.9,
        ease: 'power3.out',
      },
      0
    );
    currentCamTween.to(
      camera,
      {
        fov: preset.fov || 44,
        duration: 0.85,
        ease: 'power2.out',
        onUpdate: () => camera.updateProjectionMatrix(),
      },
      0
    );
  }

  function setSlide(slideIndexOrObj) {
    const slide =
      typeof slideIndexOrObj === 'object' && slideIndexOrObj
        ? slideIndexOrObj
        : SLIDES[Number(slideIndexOrObj) || 0] || SLIDES[0];

    applyThemeForAct(slide.actNumber);
    moto.applyAssemblyState(slide.assemblyStage, slide.assemblyProgress);
    swapChapterProps(slide);
    animateCameraTo(slide);

    if (slide.id === 'S00' || slide.id === 'S20') {
      moto.pulseHeadlight();
    }
    renderer.render(scene, camera);
    css2d.render(scene, camera);
    needsRender = false;
  }

  function setDrawerShift(isOpen) {
    drawerOffsetX = isOpen ? 0.55 : 0;
    const slide = SLIDES[appState.getState().currentSlideIndex] || SLIDES[0];
    animateCameraTo(slide);
    needsRender = true;
  }

  function triggerActTransition(_actNumber, onMidpoint) {
    moto.pulseHeadlight();
    sound.playIgnition();
    needsRender = true;
    onMidpoint?.();
  }

  function triggerSimulationEffect(type) {
    if (type === 'trigger-error') {
      sound.playWarning();
      underLight.color.setHex(0xe94560);
      underLight.intensity = 2.4;
    } else if (type === 'trigger-ok' || type === 'ignition') {
      sound.playIgnition();
      moto.pulseHeadlight();
      underLight.color.setHex(0x2ee59d);
      underLight.intensity = 2.2;
    } else if (type === 'stamp') {
      sound.playStamp();
      underLight.color.setHex(0xf1c40f);
      underLight.intensity = 2.0;
    } else {
      sound.playClick();
      underLight.color.setHex(0x3ba0ff);
      underLight.intensity = 1.6;
    }
    needsRender = true;
  }

  function inspectElement(kind, value) {
    sound.playClick();
    clearTimeout(inspectBannerReset);
    if (kind === 'db-table') {
      appState.openDocumento(15, String(value || 'Productos'));
    } else if (kind === 'vlan') {
      appState.openDocumento(272, 'Diagrama de red y direccionamiento');
    } else if (kind === 'uml') {
      appState.openDocumento(185, String(value || 'M-UC-01'));
    }
  }

  // Loop continuo con medición FPS (en reducedMotion renderiza bajo demanda)
  let rafId = null;
  let lastTime = performance.now();
  let elapsed = 0;
  let fps = 60;
  let disposed = false;

  const renderFrame = (now) => {
    if (disposed) return;
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;
    fps = Math.round(1 / dt);
    elapsed += dt;

    const slide = SLIDES[appState.getState().currentSlideIndex] || SLIDES[0];
    const isReduced = appState.getState().reducedMotion;

    if (!isReduced) {
      moto.tick(dt, elapsed);
      activePropHandle?.update?.(elapsed, dt);
      particles.rotation.y = elapsed * 0.04;
      moto.root.rotation.y = Math.sin(elapsed * 0.35) * 0.035;
      underLight.intensity += (1.1 - underLight.intensity) * 0.06;
      camera.lookAt(lookTarget);
      renderer.render(scene, camera);
      css2d.render(scene, camera);
    } else if (needsRender || Math.abs(1.1 - underLight.intensity) > 0.05) {
      underLight.intensity = 1.1;
      camera.lookAt(lookTarget);
      renderer.render(scene, camera);
      css2d.render(scene, camera);
      needsRender = false;
    }
    rafId = requestAnimationFrame(renderFrame);
    void slide;
  };

  const handleResize = () => {
    if (disposed) return;
    const w = Math.max(240, canvasWrap.clientWidth || window.innerWidth || 1280);
    const h = Math.max(180, canvasWrap.clientHeight || window.innerHeight || 720);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    css2d.setSize(w, h);
    renderer.render(scene, camera);
    css2d.render(scene, camera);
    needsRender = false;
  };

  let resizeObserver = null;
  if (typeof ResizeObserver === 'function') {
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvasWrap);
  }
  window.addEventListener('resize', handleResize);

  const api = {
    setSlide,
    triggerActTransition,
    triggerSimulationEffect,
    setDrawerShift,
    inspectElement,
    getDiagnostics: () => ({
      webgl: true,
      fps,
      assemblyStage: (SLIDES[appState.getState().currentSlideIndex] || SLIDES[0]).assemblyStage,
      bloomEnabled: false,
      currentSlideId: appState.getState().currentSlideId,
    }),
    destroy() {
      disposed = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      clearTimeout(inspectBannerReset);
      currentCamTween?.kill?.();
      resizeObserver?.disconnect?.();
      window.removeEventListener('resize', handleResize);
      activePropHandle?.destroy?.();
      moto.destroy();
      disposeObject3D(scene);
      renderer.dispose();
      sound.destroy();
    },
  };

  // Inicializar escena S00 síncronamente en el primer frame
  setSlide(SLIDES[appState.getState().currentSlideIndex] || SLIDES[0]);
  rafId = requestAnimationFrame(renderFrame);

  return api;
}
