// Script clásico (sin módulos ES): funciona abriendo index.html con doble clic.
// Expone window.SolidScene.
window.SolidScene = (function () {
'use strict';
const THREE = window.THREE;
const { solidDataInfoList } = window.Data;

// ============================================================
// SOLID (Informe 01): UNA torre de capas, cinco "lentes".
// Cada principio se demuestra con una animación sobre la misma
// arquitectura. Contrato con app.js sin cambios:
// initSolidScene / enterSolidScene / nextSolidPedestal / exitSolidScene
// ============================================================

const ROOT_X = 300;
let root, solidLight;
let slabs = {};
let props = [];            // props[i] = grupo de la demostración del principio i
let letters = [];
let statusSprites = {};
let captions = [];
let currentSolidIndex = 0;
let active = [];

const STATUS_COLOR = { 'aplicado': '#2ecc71', 'parcial': '#f39c12', 'no forzado': '#3498db' };

// ---------- Utilidades ----------
function makeLabel(text, color = '#ffffff', width = 6) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    let size = 56;
    ctx.font = `bold ${size}px "Segoe UI", sans-serif`;
    while (ctx.measureText(text).width > 930 && size > 24) {
        size -= 2;
        ctx.font = `bold ${size}px "Segoe UI", sans-serif`;
    }
    const w = Math.min(ctx.measureText(text).width + 70, 1010);
    const x = (1024 - w) / 2;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, 14, w, 100, 30); else ctx.rect(x, 14, w, 100);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 512, 66);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
    sprite.scale.set(width, width * 128 / 1024, 1);
    sprite.renderOrder = 10;
    return sprite;
}

function mat(color, intensity = 0.25) {
    return new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: intensity, metalness: 0.3, roughness: 0.4 });
}

function track(t) { active.push(t); return t; }
function killActive() { active.forEach(t => t.kill()); active = []; }

function fadeIn(sprite, delay = 0) {
    sprite.material.opacity = 0;
    track(gsap.to(sprite.material, { opacity: 1, duration: 0.5, delay }));
}

function arrow(color, down = true) {
    const g = new THREE.Group();
    const m = mat(color, 0.6);
    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.6, 8), m);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.4, 12), m);
    shaft.position.y = down ? 0.15 : -0.15;
    cone.position.y = down ? -0.35 : 0.35;
    if (down) cone.rotation.x = Math.PI;
    g.add(shaft, cone);
    g.userData.mat = m;
    return g;
}

// ---------- Construcción ----------
function initSolidScene(scene /*, createLetterSprite, createLabelSprite (ya no se usan) */) {
    root = new THREE.Group();
    root.position.set(ROOT_X, 0, 0);
    root.visible = false;
    scene.add(root);

    solidLight = new THREE.PointLight(0xffffff, 1.6, 90);
    solidLight.position.set(ROOT_X, 12, 18);
    solidLight.visible = false;
    scene.add(solidLight);

    // Pedestal
    const ped = new THREE.Mesh(
        new THREE.CylinderGeometry(15, 15.5, 0.4, 48),
        new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.3, metalness: 0.7 })
    );
    ped.position.y = -0.3;
    ped.receiveShadow = true;
    root.add(ped);

    // Torre de 4 capas (de arriba hacia abajo)
    const defs = [
        { key: 'vistas',    y: 8.2, color: '#3498db', text: 'VISTAS HTTP · views.py' },
        { key: 'servicios', y: 5.6, color: '#f39c12', text: 'SERVICIOS · checkout · cancellation_services.py' },
        { key: 'reglas',    y: 3.0, color: '#2ecc71', text: 'REGLAS PURAS · pricing.py (sin Django)' },
        { key: 'modelos',   y: 0.4, color: '#7f8c8d', text: 'MODELOS · PostgreSQL' }
    ];
    defs.forEach(d => {
        const m = mat(d.color, 0.15);
        const slab = new THREE.Mesh(new THREE.BoxGeometry(11, 1.3, 4), m);
        slab.position.y = d.y;
        slab.castShadow = true;
        root.add(slab);
        const l = makeLabel(d.text, '#ffffff', 10);
        l.position.set(0, d.y, 2.2);
        root.add(l);
        slabs[d.key] = { mesh: slab, mat: m };
    });

    // Letras y sellos de estado (se muestra uno por paso)
    solidDataInfoList.forEach(item => {
        const canvas = document.createElement('canvas');
        canvas.width = 256; canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.font = 'bold 190px "Segoe UI", sans-serif';
        ctx.fillStyle = item.color;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.shadowColor = item.color; ctx.shadowBlur = 25;
        ctx.fillText(item.letter, 128, 135);
        const tex = new THREE.CanvasTexture(canvas);
        tex.colorSpace = THREE.SRGBColorSpace;
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
        s.scale.set(3.2, 3.2, 1);
        s.position.set(-3.5, 13, 0);
        s.visible = false;
        root.add(s);
        letters.push(s);

        // Pie con la evidencia principal de cada principio
        const cap = makeLabel(item.evidence, '#cbd5e1', 13);
        cap.position.set(0, -1.9, 2.6);
        cap.visible = false;
        root.add(cap);
        captions.push(cap);
    });
    Object.keys(STATUS_COLOR).forEach(k => {
        const s = makeLabel(k.toUpperCase(), STATUS_COLOR[k], 5);
        s.position.set(2.2, 13, 0);
        s.visible = false;
        root.add(s);
        statusSprites[k] = s;
    });

    // ----- Props por principio -----
    // S: sacar pricing.py de la torre
    {
        const g = new THREE.Group();
        const nav = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, 0.15), mat('#3498db', 0.3));
        nav.position.set(-9, 8.2, 0);
        const navL = makeLabel('✖ Navegador desconectado', '#e74c3c', 6);
        navL.position.set(-9, 9.9, 0);
        const cube = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.6, 1.6), mat('#f59e0b', 0.4));
        cube.name = 'pricing';
        const pl = makeLabel('pricing.py · Decimal · sin Django', '#f59e0b', 8);
        pl.name = 'pl'; pl.position.set(9.5, 5.6, 0);
        const ok = makeLabel('sigue calculando por sí solo', '#2ecc71', 6.5);
        ok.name = 'ok'; ok.position.set(9.5, 1.3, 0);
        g.add(nav, navL, cube, pl, ok);
        props[0] = g;
    }
    // O: política nueva sin tocar el historial
    {
        const g = new THREE.Group();
        const gray = mat('#64748b', 0.1);
        for (let i = 0; i < 3; i++) {
            const b = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 2), gray);
            b.position.set(-10.5, 0.35 + i * 0.75, 0);
            g.add(b);
        }
        const hl = makeLabel('🔒 Facturas históricas (no se reescriben)', '#94a3b8', 7.5);
        hl.position.set(-10.5, 3.6, 0);
        const nb = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 2), mat('#3498db', 0.5));
        nb.name = 'newTax';
        const nl = makeLabel('Nueva política de tasa', '#00ffff', 5.5);
        nl.name = 'nl'; nl.position.set(-7.4, 2.2, 0);
        const pay = new THREE.Mesh(new THREE.BoxGeometry(2, 0.9, 2), mat('#f39c12', 0.3));
        pay.position.set(9.5, 0.45, 0);
        const payL = makeLabel('Medios de pago: cerrado a propósito', '#f39c12', 8);
        payL.position.set(9.5, 2.3, 0);
        g.add(hl, nb, nl, pay, payL);
        props[1] = g;
    }
    // L: tres vías, un solo contrato
    {
        const g = new THREE.Group();
        const names = ['Venta directa', 'Borrador', 'Cotización'];
        const starts = [[-9, 8.2, 2.6], [0, 10.4, 2.6], [9, 8.2, 2.6]];
        starts.forEach((p, i) => {
            const l = makeLabel(names[i], '#ffffff', 4);
            l.position.set(p[0], p[1] + 1.1, p[2]);
            g.add(l);
            const ball = new THREE.Mesh(new THREE.SphereGeometry(0.45, 20, 20), mat('#9b59b6', 0.5));
            ball.name = 'ball' + i;
            ball.userData.start = p;
            g.add(ball);
        });
        const gate = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.16, 12, 40), mat('#2ecc71', 0.8));
        gate.position.set(0, 5.6, 2.6);
        gate.name = 'gate';
        const gl = makeLabel('checkout', '#2ecc71', 3.6);
        gl.position.set(0, 7.1, 2.8);
        g.add(gate, gl);
        props[2] = g;
    }
    // I: llaves por rol
    {
        const g = new THREE.Group();
        const labels = ['Vender', 'Configurar tasas', 'Ver costos'];
        [5, 8.5, 12].forEach((x, k) => {
            const d = new THREE.Mesh(new THREE.BoxGeometry(2, 2.8, 0.3), new THREE.MeshStandardMaterial({ color: '#334155', emissive: '#334155', emissiveIntensity: 0.3 }));
            d.position.set(x, 1.4, 0);
            d.name = 'door' + k;
            const l = makeLabel(labels[k], '#ffffff', 3.4);
            l.position.set(x, 3.5, 0);
            g.add(d, l);
        });
        const card = new THREE.Group();
        card.name = 'card';
        card.add(new THREE.Mesh(new THREE.BoxGeometry(1.6, 1, 0.1), mat('#27ae60', 0.5)));
        const cl = makeLabel('Vendedor', '#27ae60', 3);
        cl.position.y = 1.1;
        card.add(cl);
        g.add(card);
        props[3] = g;
    }
    // D: las dependencias apuntan hacia adentro
    {
        const g = new THREE.Group();
        [6.9, 4.3, 1.7].forEach((y, i) => {
            const a = arrow('#00ffff', true);
            a.position.set(-4, y, 0);
            a.name = 'down' + i;
            g.add(a);
        });
        const up = arrow('#e74c3c', false);
        up.position.set(4, 4.3, 0);
        up.name = 'up';
        const ul = makeLabel('✖ Las reglas puras no importan hacia arriba', '#e74c3c', 8.5);
        ul.position.set(9, 4.3, 0);
        g.add(up, ul);
        props[4] = g;
    }
    props.forEach(g => { g.visible = false; root.add(g); });
}

// ---------- Resaltado de capas ----------
function highlight(keys, amount = 0.9) {
    Object.entries(slabs).forEach(([k, s]) => {
        gsap.to(s.mat, { emissiveIntensity: keys.includes(k) ? amount : 0.12, duration: 0.6 });
    });
}

// ---------- Demostraciones ----------
function playS() {
    const g = props[0];
    const cube = g.getObjectByName('pricing');
    cube.position.set(0, 3, 0);
    cube.rotation.set(0, 0, 0);
    ['pl', 'ok'].forEach((n, i) => fadeIn(g.getObjectByName(n), 1.5 + i * 0.4));
    track(gsap.to(cube.position, { x: 9.5, y: 3.6, duration: 1.4, ease: 'power2.inOut' }));
    track(gsap.to(cube.rotation, { y: Math.PI * 2, duration: 4, ease: 'none', repeat: -1 }));
    track(gsap.to(cube.material, { emissiveIntensity: 1, duration: 0.6, delay: 1.4, yoyo: true, repeat: -1 }));
    highlight(['reglas']);
}

function playO() {
    const g = props[1];
    const nb = g.getObjectByName('newTax');
    nb.position.set(-7.4, 10, 0);
    fadeIn(g.getObjectByName('nl'), 1.4);
    track(gsap.to(nb.position, { y: 0.35, duration: 1.2, ease: 'bounce.out' }));
    highlight(['modelos']);
}

function playL() {
    const g = props[2];
    for (let i = 0; i < 3; i++) {
        const ball = g.getObjectByName('ball' + i);
        const s = ball.userData.start;
        ball.position.set(...s);
        ball.scale.set(1, 1, 1);
        const tl = gsap.timeline({ repeat: -1, delay: i * 0.5 });
        tl.to(ball.position, { x: 0, y: 5.6, z: 2.6, duration: 1.4, ease: 'power2.in' })
          .to(ball.scale, { x: 0, y: 0, z: 0, duration: 0.2 })
          .set(ball.position, { x: s[0], y: s[1], z: s[2] })
          .to(ball.scale, { x: 1, y: 1, z: 1, duration: 0.3 }, '+=0.4');
        track(tl);
    }
    const gate = g.getObjectByName('gate');
    track(gsap.to(gate.material, { emissiveIntensity: 0.2, duration: 0.5, yoyo: true, repeat: -1 }));
    highlight(['servicios']);
}

function playI() {
    const g = props[3];
    const card = g.getObjectByName('card');
    const doors = [0, 1, 2].map(k => g.getObjectByName('door' + k));
    const base = new THREE.Color('#334155');
    const green = new THREE.Color('#2ecc71');
    const red = new THREE.Color('#e74c3c');
    doors.forEach(d => { d.material.color.copy(base); d.material.emissive.copy(base); });
    card.position.set(1.2, 3.2, 1.6);
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    [[0, green], [1, red], [2, red]].forEach(([k, col]) => {
        const d = doors[k];
        tl.to(card.position, { x: d.position.x - 1.5, duration: 1, ease: 'power2.inOut' })
          .to([d.material.color, d.material.emissive], { r: col.r, g: col.g, b: col.b, duration: 0.3 });
        if (col === red) tl.to(card.position, { x: '-=0.5', duration: 0.12, yoyo: true, repeat: 3 });
        tl.to([d.material.color, d.material.emissive], { r: base.r, g: base.g, b: base.b, duration: 0.3 }, '+=0.5');
    });
    tl.to(card.position, { x: 1.2, duration: 1 });
    track(tl);
    highlight(['vistas', 'servicios'], 0.5);
}

function playD() {
    const g = props[4];
    [0, 1, 2].forEach(i => {
        const a = g.getObjectByName('down' + i);
        track(gsap.to(a.userData.mat, { emissiveIntensity: 0.1, duration: 0.5, delay: i * 0.3, yoyo: true, repeat: -1 }));
    });
    const up = g.getObjectByName('up');
    up.position.y = 4.3;
    track(gsap.to(up.position, { y: 5.0, duration: 0.5, ease: 'power2.out', yoyo: true, repeat: -1, repeatDelay: 0.8 }));
    highlight(['vistas', 'servicios', 'reglas', 'modelos'], 0.4);
}

const PLAY = [playS, playO, playL, playI, playD];
const CAM_X = [306, 303, 304, 306, 304];

function applyStep(i) {
    killActive();
    props.forEach((g, k) => { g.visible = (k === i); });
    letters.forEach((s, k) => { s.visible = (k === i); });
    captions.forEach((s, k) => { s.visible = (k === i); });
    Object.entries(statusSprites).forEach(([k, s]) => { s.visible = (k === solidDataInfoList[i].status); });
    PLAY[i]();
}

function moveCamera(camera, controls, i, duration, done) {
    const x = ROOT_X + (CAM_X[i] - 300);
    gsap.to(camera.position, { x, y: 7, z: 25, duration, ease: 'power3.inOut' });
    gsap.to(controls.target, { x, y: 5.5, z: 0, duration, ease: 'power3.inOut', onComplete: done });
}

// ---------- API pública (contrato con app.js) ----------
function enterSolidScene(camera, controls, callbacks) {
    root.visible = true;
    solidLight.visible = true;
    currentSolidIndex = 0;
    callbacks.onUpdateUI(solidDataInfoList[0], false);
    applyStep(0);
    moveCamera(camera, controls, 0, 2, callbacks.onAnimationComplete);
}

function nextSolidPedestal(camera, controls, callbacks) {
    currentSolidIndex++;
    if (currentSolidIndex >= solidDataInfoList.length) {
        callbacks.onReturnToGeneral();
        return;
    }
    const isLast = currentSolidIndex === solidDataInfoList.length - 1;
    callbacks.onUpdateUI(solidDataInfoList[currentSolidIndex], isLast);
    applyStep(currentSolidIndex);
    moveCamera(camera, controls, currentSolidIndex, 1.5, callbacks.onAnimationComplete);
}

function exitSolidScene() {
    killActive();
    root.visible = false;
    solidLight.visible = false;
}

return { initSolidScene, enterSolidScene, nextSolidPedestal, exitSolidScene };
})();
