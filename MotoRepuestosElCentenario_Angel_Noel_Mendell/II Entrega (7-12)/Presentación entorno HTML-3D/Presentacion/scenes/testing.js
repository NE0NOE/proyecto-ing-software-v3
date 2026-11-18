// Script clásico (sin módulos ES): funciona abriendo index.html con doble clic.
// Expone window.TestingScene.
window.TestingScene = (function () {
'use strict';
const THREE = window.THREE;
const { softwareTestingDataInfoList } = window.Data;
const { makeLabel, mat, createPedestal, createTracker } = window.Shared;

// ============================================================
// Pruebas de software (Informe 04)
// Paso 1: los 5 niveles de prueba · Paso 2: la ola de 120 pruebas
// y los 11 casos críticos · Paso 3: rendimiento (P95) y límites.
// ============================================================

const ROOT_X = -300;
const TOTAL_TESTS = 120;
const TOTAL_SECONDS = 289.28;
const COLS = 12;

let root, light;
let stepGroups = [];
let slabs = [];
let wall, wallColors = { off: new THREE.Color('#334155'), on: new THREE.Color('#22c55e') };
let counterLabel, timerLabel, zeroFailsLabel;
let gems = [];
let tiles = [];
let currentTestIndex = 0;
const tracker = createTracker();

const LEVELS = ['Reglas puras', 'Servicios', 'Base de datos y transacciones', 'Integración HTTP', 'Regresión completa'];

const PERF = [
    { title: 'Búsqueda HTTP',        sub: '50 solicitudes · 20,000 productos',        prefix: 'P95 ', value: 0.029, color: '#3498db' },
    { title: 'Ventas concurrentes',  sub: '500 ventas · 20 líneas · 4 operadores',    prefix: 'P95 ', value: 1.142, color: '#9b59b6' },
    { title: 'Informes simultáneos', sub: '10 sesiones a la vez',                     prefix: 'máx ', value: 0.648, color: '#1abc9c' }
];

const CAMS = [
    { p: [ROOT_X + 3, 7, 24], t: [ROOT_X + 3, 5.5, 0] },
    { p: [ROOT_X + 3, 8, 28], t: [ROOT_X + 3, 7, 0] },
    { p: [ROOT_X + 2, 7, 30], t: [ROOT_X + 2, 4, 0] }
];

function initTestingScene(scene) {
    root = new THREE.Group();
    root.position.set(ROOT_X, 0, 0);
    root.visible = false;
    scene.add(root);

    light = new THREE.PointLight(0xffffff, 1.6, 90);
    light.position.set(ROOT_X, 14, 18);
    light.visible = false;
    scene.add(light);

    root.add(createPedestal(17));

    // ----- Paso 1: pirámide de 5 niveles -----
    const g0 = new THREE.Group();
    const widths = [10.5, 8.8, 7.1, 5.4, 3.7];
    const colors = ['#8e44ad', '#9b59b6', '#3498db', '#2980b9', '#1abc9c'];
    LEVELS.forEach((name, i) => {
        const m = mat(colors[i], 0.12);
        const slab = new THREE.Mesh(new THREE.BoxGeometry(widths[i], 1.1, 4), m);
        slab.position.y = 0.55 + i * 1.5;
        g0.add(slab);
        const l = makeLabel(name, '#ffffff', Math.min(widths[i] + 1.5, 9));
        l.position.set(0, 0.55 + i * 1.5, 2.2);
        g0.add(l);
        slabs.push(m);
    });
    const pg = makeLabel('PostgreSQL 18.4 · base temporal que se crea y se elimina', '#00ffff', 11);
    pg.position.set(0, 9.4, 0);
    const iso = makeLabel('ISO/IEC/IEEE 29119 · sin certificación', '#94a3b8', 8);
    iso.position.set(0, 10.8, 0);
    g0.add(pg, iso);
    stepGroups[0] = g0;

    // ----- Paso 2: muro de 118 pruebas + 11 casos críticos -----
    const g1 = new THREE.Group();
    wall = new THREE.InstancedMesh(
        new THREE.BoxGeometry(0.8, 0.8, 0.3),
        new THREE.MeshStandardMaterial({ roughness: 0.5, metalness: 0.2 }),
        TOTAL_TESTS
    );
    const dummy = new THREE.Object3D();
    for (let i = 0; i < TOTAL_TESTS; i++) {
        const col = i % COLS, row = Math.floor(i / COLS);
        dummy.position.set(col - (COLS - 1) / 2, 11.5 - row, 0);
        dummy.updateMatrix();
        wall.setMatrixAt(i, dummy.matrix);
        wall.setColorAt(i, wallColors.off);
    }
    g1.add(wall);
    counterLabel = makeLabel('0 / 120', '#ffffff', 5);
    counterLabel.position.set(-3.2, 13.7, 0);
    timerLabel = makeLabel('0.0 s', '#cbd5e1', 4);
    timerLabel.position.set(3.2, 13.7, 0);
    zeroFailsLabel = makeLabel('0 FALLOS', '#22c55e', 5);
    zeroFailsLabel.position.set(0, 15.2, 0);
    g1.add(counterLabel, timerLabel, zeroFailsLabel);
    for (let i = 0; i < 11; i++) {
        const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.32), mat('#475569', 0.2));
        gem.position.set(-5 + i, 0.7, 0.5);
        g1.add(gem);
        gems.push(gem);
    }
    const casesLabel = makeLabel('P-SW-01 … P-SW-11 · 11 casos críticos', '#22c55e', 9);
    casesLabel.position.set(0, -1.2, 0.8);
    g1.add(casesLabel);
    stepGroups[1] = g1;

    // ----- Paso 3: rendimiento -----
    const g2 = new THREE.Group();
    PERF.forEach((p, i) => {
        const x = -8.5 + i * 8.5;
        const tile = new THREE.Mesh(new THREE.BoxGeometry(7.4, 3.6, 0.3), mat(p.color, 0.15));
        tile.position.set(x, 5, 0);
        g2.add(tile);
        const title = makeLabel(p.title, '#ffffff', 5.5);
        title.position.set(x, 7.5, 0.3);
        const value = makeLabel(p.prefix + '0.000 s', '#ffffff', 6);
        value.position.set(x, 5.3, 0.4);
        const sub = makeLabel(p.sub, '#e2e8f0', 7);
        sub.position.set(x, 3.9, 0.4);
        g2.add(title, value, sub);
        tiles.push({ tile, value, p });

        // flujo de solicitudes hacia la ficha
        for (let k = 0; k < 6; k++) {
            const dot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), new THREE.MeshBasicMaterial({ color: p.color }));
            dot.userData = { x, k };
            g2.add(dot);
        }
    });
    const lim1 = makeLabel('Cobertura de código: no medida', '#f1c40f', 8);
    lim1.position.set(-6, 0.3, 2.5);
    const lim2 = makeLabel('Cifras de equipo local, no extrapolables', '#f1c40f', 9);
    lim2.position.set(6, 0.3, 2.5);
    g2.add(lim1, lim2);
    stepGroups[2] = g2;

    stepGroups.forEach(g => { g.visible = false; root.add(g); });
}

// ---------- Animaciones ----------
function playPyramid() {
    slabs.forEach(m => { m.emissiveIntensity = 0.12; });
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 });
    slabs.forEach((m, i) => {
        tl.to(m, { emissiveIntensity: 1, duration: 0.35 }, i * 0.5)
          .to(m, { emissiveIntensity: 0.3, duration: 0.6 }, i * 0.5 + 0.35);
    });
    tracker.track(tl);
}

function playWave() {
    const prog = { n: 0 };
    let lastN = 0;
    const reset = () => {
        for (let i = 0; i < TOTAL_TESTS; i++) wall.setColorAt(i, wallColors.off);
        wall.instanceColor.needsUpdate = true;
        lastN = 0;
        prog.n = 0;
        counterLabel.userData.set('0 / 120', '#ffffff');
        timerLabel.userData.set('0.0 s', '#cbd5e1');
        zeroFailsLabel.material.opacity = 0;
        gems.forEach(g => {
            g.material.color.set('#475569');
            g.material.emissive.set('#475569');
            g.material.emissiveIntensity = 0.2;
        });
    };
    reset();

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });
    tl.eventCallback('onRepeat', reset);
    tl.to(prog, {
        n: TOTAL_TESTS, duration: 4.5, ease: 'power1.inOut',
        onUpdate: () => {
            const n = Math.floor(prog.n);
            if (n === lastN) return;
            for (let i = lastN; i < n; i++) wall.setColorAt(i, wallColors.on);
            wall.instanceColor.needsUpdate = true;
            lastN = n;
            counterLabel.userData.set(`${n} / 120`, n === TOTAL_TESTS ? '#22c55e' : '#ffffff');
            timerLabel.userData.set(`${(n / TOTAL_TESTS * TOTAL_SECONDS).toFixed(1)} s`, '#cbd5e1');
        }
    });
    gems.forEach((g, i) => {
        tl.to(g.material.color, { r: 0.13, g: 0.77, b: 0.37, duration: 0.2 }, 4.7 + i * 0.12);
        tl.to(g.material.emissive, { r: 0.13, g: 0.77, b: 0.37, duration: 0.2 }, 4.7 + i * 0.12);
        tl.to(g.material, { emissiveIntensity: 0.8, duration: 0.2 }, 4.7 + i * 0.12);
    });
    zeroFailsLabel.material.opacity = 0;
    tl.to(zeroFailsLabel.material, { opacity: 1, duration: 0.5 }, 6.2);
    tracker.track(tl);
}

function playPerf() {
    const g = stepGroups[2];
    tiles.forEach((t, i) => {
        t.value.userData.set(t.p.prefix + '0.000 s', '#ffffff');
        const prog = { v: 0 };
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 3.5, delay: i * 0.4 });
        tl.to(prog, {
            v: t.p.value, duration: 1.6, ease: 'power2.out',
            onUpdate: () => t.value.userData.set(t.p.prefix + prog.v.toFixed(3) + ' s', '#ffffff')
        });
        tracker.track(tl);
    });
    g.children.forEach(o => {
        if (!o.userData || o.userData.x === undefined) return;
        const { x, k } = o.userData;
        o.position.set(x - 6, 5 + (k % 3) * 0.7 - 0.7, 0.6);
        tracker.track(gsap.to(o.position, { x: x - 3.4, duration: 0.9, ease: 'none', repeat: -1, delay: k * 0.15 }));
    });
}

const PLAY = [playPyramid, playWave, playPerf];

function applyStep(i) {
    tracker.killAll();
    stepGroups.forEach((g, k) => { g.visible = (k === i); });
    PLAY[i]();
}

function moveCamera(camera, controls, i, duration, done) {
    const c = CAMS[i];
    gsap.to(camera.position, { x: c.p[0], y: c.p[1], z: c.p[2], duration, ease: 'power3.inOut' });
    gsap.to(controls.target, { x: c.t[0], y: c.t[1], z: c.t[2], duration, ease: 'power3.inOut', onComplete: done });
}

function enterTestingScene(camera, controls, callbacks) {
    root.visible = true;
    light.visible = true;
    currentTestIndex = 0;
    callbacks.onUpdateUI(softwareTestingDataInfoList[0], false);
    applyStep(0);
    moveCamera(camera, controls, 0, 2, callbacks.onAnimationComplete);
}

function nextTestingLevel(camera, controls, callbacks) {
    currentTestIndex++;
    if (currentTestIndex >= softwareTestingDataInfoList.length) {
        callbacks.onReturnToGeneral();
        return;
    }
    const isLast = currentTestIndex === softwareTestingDataInfoList.length - 1;
    callbacks.onUpdateUI(softwareTestingDataInfoList[currentTestIndex], isLast);
    applyStep(currentTestIndex);
    moveCamera(camera, controls, currentTestIndex, 1.5, callbacks.onAnimationComplete);
}

function exitTestingScene() {
    tracker.killAll();
    root.visible = false;
    light.visible = false;
}

return { initTestingScene, enterTestingScene, nextTestingLevel, exitTestingScene };
})();
