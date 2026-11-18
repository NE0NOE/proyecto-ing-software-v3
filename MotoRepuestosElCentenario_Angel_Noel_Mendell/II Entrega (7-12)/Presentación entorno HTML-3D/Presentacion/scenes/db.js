// Script clásico (sin módulos ES): funciona abriendo index.html con doble clic.
// Expone window.DbScene.
window.DbScene = (function () {
'use strict';
const THREE = window.THREE;
const { dbTestingDataInfoList } = window.Data;
const { makeLabel, mat, colorTo, createPedestal, createTracker } = window.Shared;

// ============================================================
// Pruebas de base de datos (Informe 05)
// Paso 1: carrera por la última unidad · Paso 2: transacción atómica
// (commit vs rollback) · Paso 3: importación, copias y restauración
// en una base temporal separada (la base principal no se toca).
// ============================================================

const ROOT_Z = -300;
let root, light;
let stepGroups = [];
let currentDbIndex = 0;
const tracker = createTracker();

// Referencias por paso
const race = {};
const tx = { blocks: [] };
const rec = { discs: [], particles: [] };

const CAMS = [
    { p: [3, 7, ROOT_Z + 21],  t: [3, 2.5, ROOT_Z] },
    { p: [3, 7, ROOT_Z + 27],  t: [3, 3, ROOT_Z] },
    { p: [3, 9, ROOT_Z + 33],  t: [2, 3, ROOT_Z] }
];

function pawn(color) {
    const g = new THREE.Group();
    const m = mat(color, 0.2);
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.7, 1.8, 16), m);
    body.position.y = 0.9;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), m);
    head.position.y = 2.3;
    g.add(body, head);
    return g;
}

function dbStack(x, color, discs = 3, radius = 1.8) {
    const g = new THREE.Group();
    g.position.set(x, 0, 0);
    const meshes = [];
    for (let i = 0; i < discs; i++) {
        const d = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 0.8, 32), mat(color, 0.25));
        d.position.y = 0.45 + i * 0.95;
        g.add(d);
        meshes.push(d);
    }
    g.userData.meshes = meshes;
    return g;
}

function initDbScene(scene) {
    root = new THREE.Group();
    root.position.set(0, 0, ROOT_Z);
    root.visible = false;
    scene.add(root);

    light = new THREE.PointLight(0xffffff, 1.6, 90);
    light.position.set(0, 14, ROOT_Z + 18);
    light.visible = false;
    scene.add(light);

    root.add(createPedestal(20));

    // ===== Paso 1: carrera por la última unidad =====
    {
        const g = new THREE.Group();
        const shelf = new THREE.Mesh(new THREE.BoxGeometry(5, 0.3, 2.4), new THREE.MeshStandardMaterial({ color: '#c4a484', roughness: 0.9 }));
        shelf.position.set(0, 1.5, 0);
        race.unit = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat('#f59e0b', 0.4));
        const shelfLabel = makeLabel('Última unidad en existencia', '#f59e0b', 7);
        shelfLabel.position.set(0, 0.5, 1.5);
        const c1 = pawn('#3498db'); c1.position.set(-7, 0, 0);
        const c2 = pawn('#9b59b6'); c2.position.set(7, 0, 0);
        const l1 = makeLabel('Cajero 1', '#3498db', 3.4); l1.position.set(-7, 3.7, 0);
        const l2 = makeLabel('Cajero 2', '#9b59b6', 3.4); l2.position.set(7, 3.7, 0);
        race.hand1 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), mat('#3498db', 0.6));
        race.hand2 = new THREE.Mesh(new THREE.SphereGeometry(0.32, 12, 12), mat('#9b59b6', 0.6));
        race.stock = makeLabel('Saldo: 1', '#f59e0b', 7);
        race.stock.position.set(0, 4.8, 0);
        race.win = makeLabel('Venta confirmada ✔', '#22c55e', 5.5);
        race.win.position.set(-7, 5.2, 0);
        race.lose = makeLabel('Rechazada · sin stock', '#e74c3c', 5.5);
        race.lose.position.set(7, 5.2, 0);
        race.kardex = makeLabel('1 salida en Kardex · saldo 0, nunca −1', '#22c55e', 10);
        race.kardex.position.set(0, -1.3, 1.2);
        g.add(shelf, race.unit, shelfLabel, c1, c2, l1, l2, race.hand1, race.hand2, race.stock, race.win, race.lose, race.kardex);
        stepGroups[0] = g;
    }

    // ===== Paso 2: transacción atómica =====
    {
        const g = new THREE.Group();
        const names = ['Factura', 'Líneas', 'Pagos', 'Kardex', 'Auditoría'];
        names.forEach((n, i) => {
            const b = new THREE.Mesh(new THREE.BoxGeometry(3, 1.8, 1.2), mat('#3498db', 0.3));
            b.position.set(-8 + i * 4, 2.5, 0);
            const l = makeLabel(n, '#ffffff', 2.8);
            l.position.z = 0.9;
            b.add(l);
            g.add(b);
            tx.blocks.push(b);
        });
        const head = makeLabel('Una sola transacción atómica: todo o nada', '#00ffff', 11);
        head.position.set(0, 5.6, 0);
        tx.status = makeLabel('', '#ffffff', 11);
        tx.status.position.set(0, 0.2, 1.2);
        const cap = makeLabel('Anulación sin turno o sin saldo para el reintegro: también se revierte todo', '#f1c40f', 13);
        cap.position.set(0, -1.6, 1.2);
        g.add(head, tx.status, cap);
        stepGroups[1] = g;
    }

    // ===== Paso 3: importación, copias y restauración =====
    {
        const g = new THREE.Group();
        // CSV
        for (let i = 0; i < 3; i++) {
            const s = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.3, 1.8), mat('#e2e8f0', 0.1));
            s.position.set(-11, 0.2 + i * 0.4, 0);
            g.add(s);
        }
        const csvL = makeLabel('CSV · 10,000 filas', '#e2e8f0', 5); csvL.position.set(-11, 2.6, 0);
        // Base principal
        rec.main = dbStack(-3, '#3498db');
        const mainL = makeLabel('Base principal', '#3498db', 5); mainL.position.set(-3, 4.2, 0);
        rec.counter = makeLabel('Importadas: 0 / 10,000', '#ffffff', 7);
        rec.counter.position.set(-7, 5.8, 0);
        const atom = makeLabel('Atómica: todo o nada · 52 a 56 s según la corrida', '#94a3b8', 11);
        atom.position.set(-7, 7.0, 0);
        rec.intact = makeLabel('Base principal intacta', '#22c55e', 6);
        rec.intact.position.set(-3, 5.2, 0);
        for (let i = 0; i < 14; i++) {
            const p = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.28, 0.28), new THREE.MeshBasicMaterial({ color: '#00ffff' }));
            p.userData.i = i;
            g.add(p);
            rec.particles.push(p);
        }
        // Copias
        for (let i = 0; i < 6; i++) {
            const d = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.4, 28), mat('#64748b', 0.15));
            d.position.set(5, 0.25 + i * 0.55, 0);
            g.add(d);
            rec.discs.push(d);
        }
        const bkL = makeLabel('pg_dump + SHA-256 · 6 copias', '#2ecc71', 8); bkL.position.set(5, 4.4, 0);
        rec.verified = makeLabel('verify_backups ✔ · USB BitLocker', '#22c55e', 8); rec.verified.position.set(5, 5.6, 0);
        // Base temporal
        rec.temp = dbStack(12, '#00ffff');
        rec.temp.userData.meshes.forEach(m => { m.material.transparent = true; m.material.opacity = 0.65; });
        const tempL = makeLabel('Base temporal (restauración)', '#00ffff', 7); tempL.position.set(12, 4.2, 0);
        rec.timer = makeLabel('0.00 s', '#00ffff', 3.4); rec.timer.position.set(12, 5.3, 0);
        rec.checks = ['✔ 46 migraciones', '✔ 6 cuentas', '✔ 1 venta'].map((t, i) => {
            const l = makeLabel(t, '#22c55e', 4.6);
            l.position.set(12, 6.5 + i * 1.0, 0);
            return l;
        });
        g.add(csvL, rec.main, mainL, rec.counter, atom, rec.intact, bkL, rec.verified, rec.temp, tempL, rec.timer, ...rec.checks);
        stepGroups[2] = g;
    }

    stepGroups.forEach(g => { g.visible = false; root.add(g); });
}

// ---------- Paso 1 ----------
function playRace() {
    const resetRace = () => {
        race.unit.position.set(0, 2.15, 0);
        race.unit.scale.set(1, 1, 1);
        race.hand1.position.set(-6, 2.2, 0);
        race.hand2.position.set(6, 2.2, 0);
        [race.win, race.lose, race.kardex].forEach(l => { l.material.opacity = 0; });
        race.stock.userData.set('Saldo: 1', '#f59e0b');
    };
    resetRace();

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
    tl.eventCallback('onRepeat', resetRace);
    tl.to(race.hand1.position, { x: -1.0, y: 2.15, duration: 1.1, ease: 'power2.inOut' }, 0.5)
      .to(race.hand2.position, { x: 1.0, y: 2.15, duration: 1.1, ease: 'power2.inOut' }, 0.5)
      .call(() => race.stock.userData.set('Dos pedidos · 1 unidad', '#f39c12'))
      .to(race.unit.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.15, yoyo: true, repeat: 3 })
      .call(() => race.stock.userData.set('Saldo: 0', '#22c55e'))
      .to(race.unit.position, { x: -5.8, y: 2.3, duration: 0.8, ease: 'power2.inOut' })
      .to(race.hand1.position, { x: -5.8, y: 2.3, duration: 0.8, ease: 'power2.inOut' }, '<')
      .to(race.hand2.position, { x: 6, y: 2.2, duration: 0.8, ease: 'power2.inOut' }, '<')
      .to([race.win.material, race.lose.material], { opacity: 1, duration: 0.3 })
      .to(race.kardex.material, { opacity: 1, duration: 0.3 }, '+=0.2')
      .to({}, { duration: 2.4 });
    tracker.track(tl);
}

// ---------- Paso 2 ----------
function playTransaction() {
    const B = tx.blocks;
    const setStatus = (t, c) => tx.status.userData.set(t, c);
    const resetBlocks = () => {
        B.forEach((b, i) => {
            b.scale.set(0.001, 0.001, 0.001);
            b.position.x = -8 + i * 4;
            colorTo(b.material, '#3498db', 0.01);
        });
        setStatus('Pago enviado', '#cbd5e1');
    };
    resetBlocks();

    const appear = (tl, at) => B.forEach((b, i) =>
        tl.to(b.scale, { x: 1, y: 1, z: 1, duration: 0.3, ease: 'back.out(2)' }, at + i * 0.35));

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.5 });
    tl.eventCallback('onRepeat', resetBlocks);

    // Fase A: el pago coincide -> COMMIT
    tl.call(() => setStatus('Pago = total que recalcula el servidor ✔', '#22c55e'), null, 0);
    appear(tl, 0.2);
    tl.call(() => { B.forEach(b => colorTo(b.material, '#22c55e')); setStatus('COMMIT · todo se confirma junto', '#22c55e'); }, null, 2.3);
    tl.to(B.map(b => b.scale), { x: 0.001, y: 0.001, z: 0.001, duration: 0.35 }, 4.6);

    // Fase B: el pago NO coincide -> ROLLBACK
    tl.call(() => { B.forEach(b => colorTo(b.material, '#3498db', 0.01)); setStatus('Pago manipulado', '#cbd5e1'); }, null, 5.2);
    appear(tl, 5.3);
    tl.call(() => { B.forEach(b => colorTo(b.material, '#e74c3c')); setStatus('Pago ≠ total del servidor ✖', '#e74c3c'); }, null, 7.4);
    tl.to(B.map(b => b.position), { x: '+=0.14', duration: 0.06, yoyo: true, repeat: 7 }, 7.5);
    tl.to(B.map(b => b.scale), { x: 0.001, y: 0.001, z: 0.001, duration: 0.4, ease: 'power2.in' }, 8.3);
    tl.call(() => setStatus('ROLLBACK · no queda nada: ni factura, ni Kardex, ni auditoría', '#e74c3c'), null, 8.5);
    tl.to({}, { duration: 2.6 }, 8.6);
    tracker.track(tl);
}

// ---------- Paso 3 ----------
function playRecovery() {
    const prog = { n: 0, t: 0 };
    const reset = () => {
        prog.n = 0; prog.t = 0;
        rec.counter.userData.set('Importadas: 0 / 10,000', '#ffffff');
        rec.timer.userData.set('0.00 s', '#00ffff');
        rec.discs.forEach(d => colorTo(d.material, '#64748b', 0.01));
        rec.verified.material.opacity = 0;
        rec.intact.material.opacity = 0;
        rec.checks.forEach(c => { c.material.opacity = 0; });
        rec.temp.scale.set(0.001, 0.001, 0.001);
    };
    reset();

    // Flujo continuo CSV -> base principal
    rec.particles.forEach(p => {
        p.position.set(-11, 1.2, 0);
        tracker.track(gsap.to(p.position, {
            x: -3, y: 1.8, duration: 1.1, ease: 'none', repeat: -1, delay: p.userData.i * 0.08,
            onRepeat: () => { p.position.y = 0.8 + Math.random() * 1.8; }
        }));
    });

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    tl.eventCallback('onRepeat', reset);
    tl.to(prog, {
        n: 10000, duration: 3, ease: 'none',
        onUpdate: () => rec.counter.userData.set(`Importadas: ${Math.round(prog.n).toLocaleString('en-US')} / 10,000`, prog.n >= 10000 ? '#22c55e' : '#ffffff')
    }, 0);
    rec.discs.forEach((d, i) => tl.call(() => colorTo(d.material, '#2ecc71'), null, 3.3 + i * 0.25));
    tl.to(rec.verified.material, { opacity: 1, duration: 0.3 }, 4.9);
    tl.to(rec.temp.scale, { x: 1, y: 1, z: 1, duration: 0.8, ease: 'elastic.out(1, 0.6)' }, 5.6);
    tl.to(prog, {
        t: 3.29, duration: 1.4, ease: 'power1.out',
        onUpdate: () => rec.timer.userData.set(prog.t.toFixed(2) + ' s', '#00ffff')
    }, 5.8);
    rec.checks.forEach((c, i) => tl.to(c.material, { opacity: 1, duration: 0.3 }, 6.6 + i * 0.4));
    tl.to(rec.intact.material, { opacity: 1, duration: 0.3 }, 8.0);
    tl.to({}, { duration: 2.2 }, 8.3);
    tl.to(rec.temp.scale, { x: 0.001, y: 0.001, z: 0.001, duration: 0.4 }, 10.5);
    tracker.track(tl);
}

const PLAY = [playRace, playTransaction, playRecovery];

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

function enterDbScene(camera, controls, callbacks) {
    root.visible = true;
    light.visible = true;
    currentDbIndex = 0;
    callbacks.onUpdateUI(dbTestingDataInfoList[0], false);
    applyStep(0);
    moveCamera(camera, controls, 0, 2, callbacks.onAnimationComplete);
}

function nextDbLevel(camera, controls, callbacks) {
    currentDbIndex++;
    if (currentDbIndex >= dbTestingDataInfoList.length) {
        callbacks.onReturnToGeneral();
        return;
    }
    const isLast = currentDbIndex === dbTestingDataInfoList.length - 1;
    callbacks.onUpdateUI(dbTestingDataInfoList[currentDbIndex], isLast);
    applyStep(currentDbIndex);
    moveCamera(camera, controls, currentDbIndex, 1.5, callbacks.onAnimationComplete);
}

function exitDbScene() {
    tracker.killAll();
    root.visible = false;
    light.visible = false;
}

return { initDbScene, enterDbScene, nextDbLevel, exitDbScene };
})();
