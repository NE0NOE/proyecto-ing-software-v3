// Script clásico (sin módulos ES): funciona abriendo index.html con doble clic.
// Expone window.TechScene.
window.TechScene = (function () {
'use strict';
const THREE = window.THREE;
const { techDataInfoList } = window.Data;

// ============================================================
// Escenario técnico (Informe 06): 5 capas sobre el plano del local
// 0 Puestos · 1 Red/VLAN · 2 Energía · 3 Copias · 4-6 Equipos y especificaciones
// Contrato con app.js: enterTechScene / nextTechLevel / exitTechScene
// ============================================================

let techGroup;
let stationsGroup;
let stations = [];
const layers = [];        // layers[i] = grupo extra de la capa i (la 0 no tiene)
let currentTechIndex = 0;
let activeTweens = [];

const VLAN_COLOR = { 10: '#00ffff', 20: '#3498db', 30: '#b366ff', 40: '#2ecc71', 50: '#e67e22', 99: '#ecf0f1' };
const ROLE_COLOR = { rack: '#00ffff', client: '#5B9BD5', printer: '#2ecc71' };

// Coordenadas alineadas con el plano del núcleo central (app.js)
const STATION_DEFS = [
    { id: 'RACK1', x: 0,    z: -5,   y: 5.8, vlan: 10, type: 'rack', label: 'RACK1 · SRV1 · R1 · SW1 · NAS1 · UPS1' },
    { id: 'POS01', x: -11,  z: 6,    y: 2.6, vlan: 20, type: 'client' },
    { id: 'POS02', x: -7,   z: 6,    y: 2.6, vlan: 20, type: 'client' },
    { id: 'POS03', x: -3,   z: 6,    y: 2.6, vlan: 20, type: 'client' },
    { id: 'POS04', x: 1,    z: 6,    y: 2.6, vlan: 20, type: 'client' },
    { id: 'BOD01', x: -7,   z: -3.5, y: 2.6, vlan: 40, type: 'client' },
    { id: 'ADM01', x: 10,   z: 5,    y: 3.0, vlan: 30, type: 'client' },
    { id: 'GER01', x: 10,   z: -5,   y: 3.0, vlan: 30, type: 'client' },
    { id: 'PROP01', x: 12.5, z: -2.5, y: 2.6, vlan: 30, type: 'client' },
    { id: 'PRN1',  x: 13.5, z: 8.5,  y: 2.6, vlan: 50, type: 'printer' }
];

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

function makeCard(title, lines, color = '#ffffff', width = 9) {
    const W = 1024, lineH = 76;
    const H = 130 + lines.length * lineH + 20;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    const fit = (text, size, weight) => {
        ctx.font = `${weight} ${size}px "Segoe UI", sans-serif`;
        while (ctx.measureText(text).width > 940 && size > 22) {
            size -= 2;
            ctx.font = `${weight} ${size}px "Segoe UI", sans-serif`;
        }
    };
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(6, 6, W - 12, H - 12, 36); else ctx.rect(6, 6, W - 12, H - 12);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    fit(title, 56, 'bold');
    ctx.fillText(title, W / 2, 62);
    ctx.fillStyle = '#e2e8f0';
    lines.forEach((ln, i) => {
        fit(ln, 46, '');
        ctx.fillText(ln, W / 2, 140 + i * lineH);
    });
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
    sprite.scale.set(width, width * H / W, 1);
    sprite.renderOrder = 10;
    return sprite;
}

function track(tween) {
    activeTweens.push(tween);
    return tween;
}

function killActive() {
    activeTweens.forEach(t => t.kill());
    activeTweens = [];
}

function createStation(def) {
    const group = new THREE.Group();
    group.position.set(def.x, 0, def.z);

    const size = def.type === 'rack' ? 0.75 : 0.45;
    const gemMat = new THREE.MeshStandardMaterial({
        color: ROLE_COLOR[def.type], emissive: ROLE_COLOR[def.type], emissiveIntensity: 0.6,
        transparent: true, metalness: 0.3, roughness: 0.3
    });
    const gem = new THREE.Mesh(new THREE.OctahedronGeometry(size), gemMat);
    gem.position.y = def.y;
    group.add(gem);

    const stemMat = new THREE.MeshBasicMaterial({ color: '#94a3b8', transparent: true, opacity: 0.5 });
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, def.y, 6), stemMat);
    stem.position.y = def.y / 2;
    group.add(stem);

    const label = makeLabel(def.label || def.id, '#ffffff', def.type === 'rack' ? 8 : 3.4);
    label.position.y = def.y + (def.type === 'rack' ? 1.2 : 1.0);
    group.add(label);

    stationsGroup.add(group);
    return { def, group, gem, gemMat, stemMat, label };
}

const FOCUS = {
    rack: [],
    clients: ['POS01', 'POS02', 'POS03', 'POS04', 'BOD01', 'ADM01', 'GER01', 'PROP01'],
    printer: ['PRN1']
};

function styleStations(mode) {
    stations.forEach(s => {
        let c;
        let op = 1;
        if (mode === 'role') c = ROLE_COLOR[s.def.type];
        else if (mode === 'vlan') c = VLAN_COLOR[s.def.vlan];
        else if (mode === 'power') c = s.def.type === 'rack' ? '#f1c40f' : s.def.type === 'printer' ? '#e74c3c' : '#4b5d73';
        else if (mode === 'copies') c = s.def.type === 'rack' ? '#2ecc71' : '#4b5d73';
        else {
            // modos 'focus-...': se resalta el grupo; el resto queda tenue
            const on = FOCUS[mode.replace('focus-', '')].includes(s.def.id);
            c = on ? ROLE_COLOR[s.def.type] : '#64748b';
            op = on ? 1 : 0.22;
            if (mode === 'focus-rack' && s.def.id === 'RACK1') op = 0; // lo reemplaza el rack explotado
        }
        const col = new THREE.Color(c);
        gsap.to(s.gemMat.color, { r: col.r, g: col.g, b: col.b, duration: 0.6 });
        gsap.to(s.gemMat.emissive, { r: col.r, g: col.g, b: col.b, duration: 0.6 });
        gsap.to([s.gemMat, s.stemMat, s.label.material], { opacity: op, duration: 0.6 });
    });
}

// ---------- Construcción ----------
function initTechScene(scene) {
    techGroup = new THREE.Group();
    techGroup.visible = false;
    scene.add(techGroup);

    stationsGroup = new THREE.Group();
    techGroup.add(stationsGroup);
    stations = STATION_DEFS.map(createStation);

    // ----- Capa 1: Red / VLAN -----
    const net = new THREE.Group();
    const rackPt = new THREE.Vector3(0, 3.2, -5);
    stations.filter(s => s.def.type !== 'rack').forEach(s => {
        const end = new THREE.Vector3(s.def.x, 1.8, s.def.z);
        const ctrl = new THREE.Vector3((rackPt.x + end.x) / 2, 8, (rackPt.z + end.z) / 2);
        const curve = new THREE.QuadraticBezierCurve3(rackPt, ctrl, end);
        const color = VLAN_COLOR[s.def.vlan];
        net.add(new THREE.Mesh(
            new THREE.TubeGeometry(curve, 40, 0.07, 6, false),
            new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6 })
        ));
        const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), new THREE.MeshBasicMaterial({ color }));
        pulse.userData = { curve, color };
        net.add(pulse);
    });
    const chips = [
        { t: 'VLAN 20 · POS',      c: VLAN_COLOR[20], p: [-5, 5.2, 8.5] },
        { t: 'VLAN 30 · Oficinas', c: VLAN_COLOR[30], p: [10, 5.2, 0] },
        { t: 'VLAN 40 · Bodega',   c: VLAN_COLOR[40], p: [-7, 5.2, -5.5] },
        { t: 'VLAN 50 · Impresión', c: VLAN_COLOR[50], p: [13.5, 5.2, 8.5] },
        { t: 'VLAN 10 servidores · 99 gestión', c: VLAN_COLOR[10], p: [0, 9.6, -5] }
    ];
    chips.forEach(ch => {
        const l = makeLabel(ch.t, ch.c, ch.t.length > 22 ? 8 : 5);
        l.position.set(...ch.p);
        net.add(l);
    });
    net.visible = false;
    techGroup.add(net);
    layers[1] = net;

    // ----- Capa 2: Energía -----
    const power = new THREE.Group();
    const dome = new THREE.Mesh(
        new THREE.SphereGeometry(6.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: '#f1c40f', transparent: true, opacity: 0.1, side: THREE.DoubleSide })
    );
    dome.position.set(0, 0, -5);
    const domeWire = new THREE.Mesh(
        new THREE.SphereGeometry(6.2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: '#f1c40f', wireframe: true, transparent: true, opacity: 0.18 })
    );
    domeWire.position.copy(dome.position);
    const upsLabel = makeLabel('UPS1 · 1500 VA / 900 W', '#f1c40f', 6.5);
    upsLabel.position.set(0, 8.4, -5);
    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(1.3, 0.09, 8, 40),
        new THREE.MeshBasicMaterial({ color: '#e74c3c' })
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.set(13.5, 0.3, 8.5);
    ring.name = 'printerRing';
    const prnLabel = makeLabel('PRN1 ≈ 1330 W · fuera del UPS', '#e74c3c', 7);
    prnLabel.position.set(13.5, 5.4, 8.5);

    const barMat1 = new THREE.MeshStandardMaterial({ color: '#f1c40f', emissive: '#f1c40f', emissiveIntensity: 0.4 });
    const barMat2 = new THREE.MeshStandardMaterial({ color: '#e74c3c', emissive: '#e74c3c', emissiveIntensity: 0.4 });
    const bar1 = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), barMat1);
    const bar2 = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 2), barMat2);
    bar1.position.x = 19; bar2.position.x = 22;
    bar1.name = 'bar1'; bar2.name = 'bar2';
    const limit = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.08, 2.6), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
    limit.position.set(20.5, 6, 0);
    const lbl1 = makeLabel('UPS1 900 W', '#f1c40f', 4.2);
    lbl1.position.set(19, 7.3, 0);
    const lbl2 = makeLabel('PRN1 ≈ 1330 W  >  900 W', '#e74c3c', 6);
    lbl2.position.set(22, 10.3, 0);
    power.add(dome, domeWire, upsLabel, ring, prnLabel, bar1, bar2, limit, lbl1, lbl2);
    power.visible = false;
    techGroup.add(power);
    layers[2] = power;

    // ----- Capa 3: Copias -----
    const copies = new THREE.Group();
    const discMat = new THREE.MeshStandardMaterial({ color: '#2ecc71', emissive: '#2ecc71', emissiveIntensity: 0.5, metalness: 0.6, roughness: 0.3 });
    const d1 = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.3, 24), discMat);
    const d2 = d1.clone();
    d1.position.set(2.4, 0.4, -3.2); d2.position.set(3.9, 0.4, -3.2);
    const nasLabel = makeLabel('NAS1 · 2 discos en espejo', '#2ecc71', 6);
    nasLabel.position.set(3.2, 2.4, -3.2);
    const mirror = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 10), new THREE.MeshBasicMaterial({ color: '#ffffff' }));
    mirror.name = 'mirror';
    mirror.position.set(2.4, 0.9, -3.2);
    const usb = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.3, 0.4), new THREE.MeshStandardMaterial({ color: '#f1c40f', emissive: '#f1c40f', emissiveIntensity: 0.5 }));
    usb.name = 'usb';
    usb.position.set(3.2, 1.2, -2.2);
    const pad = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.1, 32), new THREE.MeshBasicMaterial({ color: '#f1c40f', transparent: true, opacity: 0.25 }));
    pad.position.set(-22, 0.05, -8);
    const padLabel = makeLabel('Medio separado, fuera del rack', '#f1c40f', 7);
    padLabel.position.set(-22, 2.6, -8);
    const rpo = makeLabel('RPO 24 h · RTO < 15 min (objetivos, por medir)', '#f39c12', 9);
    rpo.position.set(0, 10.2, -9);
    const ok = makeLabel('✔ Restauración temporal: 3.29–7.27 s (ejecutado)', '#2ecc71', 9.5);
    ok.position.set(0, 8.8, -9);
    copies.add(d1, d2, nasLabel, mirror, usb, pad, padLabel, rpo, ok);
    copies.visible = false;
    techGroup.add(copies);
    layers[3] = copies;

    // ----- Equipos 1: rack explotado con especificaciones -----
    const rack = new THREE.Group();
    const UNITS = [
        { id: 'UPS1', y: 6.4,  color: '#f1c40f', spec: 'UPS line-interactive · mín. 1500 VA / 900 W' },
        { id: 'NAS1', y: 8.0,  color: '#2ecc71', spec: '2 bahías · 2 discos de 2 TB en espejo' },
        { id: 'SW1',  y: 9.6,  color: '#00ffff', spec: '24 puertos Gigabit · VLAN 802.1Q · PoE para AP1' },
        { id: 'R1',   y: 11.2, color: '#b366ff', spec: 'Router/cortafuegos · VLAN · DHCP por segmento' },
        { id: 'SRV1', y: 12.8, color: '#5B9BD5', spec: '8 núcleos · 32 GB RAM · 2 SSD de 1 TB en espejo' }
    ];
    UNITS.forEach(u => {
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(3.4, 1, 2),
            new THREE.MeshStandardMaterial({ color: u.color, emissive: u.color, emissiveIntensity: 0.35, metalness: 0.5, roughness: 0.3 })
        );
        box.position.set(0, u.y, -5);
        box.name = 'unit_' + u.id;
        const idl = makeLabel(u.id, '#ffffff', 2.4);
        idl.position.set(0, u.y, -3.9);
        idl.name = 'id_' + u.id;
        const spec = makeLabel(u.spec, u.color, 11);
        spec.position.set(7.7, u.y, -5);
        spec.name = 'spec_' + u.id;
        rack.add(box, idl, spec);
    });
    const side = [
        { t: 'AP1 · acceso del personal · SSID separado · WPA2/WPA3', c: '#b366ff', y: 11.2 },
        { t: 'RACK1 · gabinete ventilado · patch panel de 24 puertos', c: '#00ffff', y: 9.6 },
        { t: 'PDU1 · regleta de rack compatible con UPS1', c: '#f1c40f', y: 8.0 },
        { t: 'Cableado: 8 tendidos Cat 6 permanentes', c: '#94a3b8', y: 6.4 }
    ];
    side.forEach(sd => {
        const l = makeLabel(sd.t, sd.c, 11);
        l.position.set(-7.7, sd.y, -5);
        l.name = 'side';
        rack.add(l);
    });
    rack.visible = false;
    techGroup.add(rack);
    layers[4] = rack;

    // ----- Equipos 2: fichas de los puestos de trabajo -----
    const desks = new THREE.Group();
    const cardA = makeCard('POS01–04 · BOD01 · ADM01 (escritorio)', [
        'PC de 4 núcleos · 8 GB RAM · SSD de 256 GB',
        'Monitor 1920×1080 · Ethernet 1 Gb/s',
        'Lector USB-HID en cada POS y en bodega',
        'Cajón de dinero en cada POS'
    ], '#5B9BD5', 10);
    cardA.position.set(-4, 9.5, 7);
    const cardB = makeCard('GER01 · PROP01 (portátiles)', [
        'Portátil de 4 núcleos · 8 GB RAM · SSD de 256 GB',
        'Pantalla y teclado integrados',
        'Ethernet o Wi-Fi del personal'
    ], '#b366ff', 10);
    cardB.position.set(10, 9.5, -1);
    desks.add(cardA, cardB);
    desks.visible = false;
    techGroup.add(desks);
    layers[5] = desks;

    // ----- Equipos 3: ficha de la impresora -----
    const printer = new THREE.Group();
    const cardP = makeCard('PRN1 · Canon imageCLASS MF445dw', [
        'Láser monocromática multifunción',
        'Dúplex automático · hasta 40 ppm en carta',
        'Ethernet 10/100/1000 · Wi-Fi 802.11b/g/n',
        'Compartida por red · VLAN 50'
    ], '#2ecc71', 10.5);
    cardP.position.set(10.5, 9.8, 5.5);
    printer.add(cardP);
    printer.visible = false;
    techGroup.add(printer);
    layers[6] = printer;
}

// ---------- Animaciones por capa ----------
function startNet() {
    layers[1].children.forEach(o => {
        if (!o.userData.curve) return;
        const prog = { t: Math.random() };
        track(gsap.to(prog, {
            t: prog.t + 1, duration: 2 + Math.random(), ease: 'none', repeat: -1,
            onUpdate: () => o.position.copy(o.userData.curve.getPoint(prog.t % 1))
        }));
    });
}

function startPower() {
    const g = layers[2];
    const bar1 = g.getObjectByName('bar1');
    const bar2 = g.getObjectByName('bar2');
    const ring = g.getObjectByName('printerRing');
    [[bar1, 6], [bar2, 8.87]].forEach(([bar, h], k) => {
        bar.scale.y = 0.001;
        track(gsap.to(bar.scale, {
            y: h, duration: 1.4, delay: 0.5 + k * 0.5, ease: 'power2.out',
            onUpdate: () => { bar.position.y = bar.scale.y / 2; }
        }));
    });
    ring.scale.set(1, 1, 1);
    track(gsap.to(ring.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.7, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
}

function startCopies() {
    const g = layers[3];
    const mirror = g.getObjectByName('mirror');
    const usb = g.getObjectByName('usb');
    mirror.position.x = 2.4;
    track(gsap.to(mirror.position, { x: 3.9, duration: 0.8, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
    usb.position.set(3.2, 1.2, -2.2);
    track(gsap.to(usb.position, { x: -22, y: 1, z: -8, duration: 3.5, ease: 'power2.inOut', yoyo: true, repeat: -1, repeatDelay: 1.2 }));
}

function startRack() {
    const g = layers[4];
    UNIT_IDS.forEach((id, i) => {
        const box = g.getObjectByName('unit_' + id);
        const idl = g.getObjectByName('id_' + id);
        const spec = g.getObjectByName('spec_' + id);
        const y = box.position.y;
        box.position.y = y + 5;
        idl.position.y = y + 5;
        track(gsap.to([box.position, idl.position], { y, duration: 0.8, delay: 0.3 + i * 0.25, ease: 'back.out(1.4)' }));
        fadeIn(spec, 0.7 + i * 0.25);
    });
    g.children.filter(o => o.name === 'side').forEach((l, i) => fadeIn(l, 1.8 + i * 0.2));
}

function startCards(i) {
    layers[i].children.forEach((card, k) => fadeIn(card, 0.5 + k * 0.4));
}

function fadeIn(sprite, delay = 0) {
    sprite.material.opacity = 0;
    track(gsap.to(sprite.material, { opacity: 1, duration: 0.5, delay }));
}

const UNIT_IDS = ['UPS1', 'NAS1', 'SW1', 'R1', 'SRV1'];

const CAMS = [
    { p: [4, 24, 26],   t: [2, 0, 0] },
    { p: [2, 28, 24],   t: [1, 1, 0] },
    { p: [10, 22, 26],  t: [9, 2, 0] },
    { p: [-3, 30, 26],  t: [-4, 0, -3] },
    { p: [5, 14, 24],   t: [5, 9.5, -5] },
    { p: [3, 26, 26],   t: [3, 3, 2] },
    { p: [9, 20, 24],   t: [9, 4, 4] }
];
const MODES = ['role', 'vlan', 'power', 'copies', 'focus-rack', 'focus-clients', 'focus-printer'];

function showLayer(i, camera, controls, duration, done) {
    killActive();
    layers.forEach((g, idx) => { if (g) g.visible = (idx === i); });
    styleStations(MODES[i]);
    [null, startNet, startPower, startCopies, startRack, () => startCards(5), () => startCards(6)][i]?.();

    const c = CAMS[i];
    gsap.to(camera.position, { x: c.p[0], y: c.p[1], z: c.p[2], duration, ease: 'power3.inOut' });
    gsap.to(controls.target, { x: c.t[0], y: c.t[1], z: c.t[2], duration, ease: 'power3.inOut', onComplete: done });
}

// ---------- API pública (contrato con app.js) ----------
function enterTechScene(camera, controls, callbacks) {
    techGroup.visible = true;
    currentTechIndex = 0;

    stations.forEach((s, k) => {
        gsap.killTweensOf(s.group.scale);
        gsap.fromTo(s.group.scale, { x: 0, y: 0, z: 0 },
            { x: 1, y: 1, z: 1, duration: 0.6, delay: 0.6 + k * 0.08, ease: 'back.out(2)' });
    });

    callbacks.onUpdateUI(techDataInfoList[0], false);
    showLayer(0, camera, controls, 2, callbacks.onAnimationComplete);
}

function nextTechLevel(camera, controls, callbacks) {
    currentTechIndex++;
    if (currentTechIndex >= techDataInfoList.length) {
        callbacks.onReturnToGeneral();
        return;
    }
    const isLast = currentTechIndex === techDataInfoList.length - 1;
    callbacks.onUpdateUI(techDataInfoList[currentTechIndex], isLast);
    showLayer(currentTechIndex, camera, controls, 1.5, callbacks.onAnimationComplete);
}

function exitTechScene() {
    killActive();
    techGroup.visible = false;
    stations.forEach(s => {
        gsap.killTweensOf([s.group.scale, s.gemMat, s.gemMat.color, s.gemMat.emissive, s.stemMat, s.label.material]);
    });
}

return { initTechScene, enterTechScene, nextTechLevel, exitTechScene };
})();
