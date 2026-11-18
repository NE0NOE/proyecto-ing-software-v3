// Script clásico (sin módulos ES): funciona abriendo index.html con doble clic.
// Expone window.SecurityScene.
window.SecurityScene = (function () {
'use strict';
const THREE = window.THREE;
const { securityDataInfoList } = window.Data;
const { makeLabel, mat, colorTo, createTracker } = window.Shared;

// ============================================================
// Seguridad (Informe 03): las 9 amenazas como proyectiles.
// 3 anillos de defensa alrededor de la bóveda de datos; cada paso
// lanza las 3 amenazas de su capa y muestra el control que la detiene.
// ============================================================

const VAULT = new THREE.Vector3(4, 0, 0);   // sobre Administración / Gerencia
const RADII = [7, 5, 3.2];                  // capa 1 (externa) -> capa 3 (interna)
const LAYER_COLORS = ['#e74c3c', '#f39c12', '#2ecc71'];

const THREATS = [
    { layer: 0, name: 'Acceso sin permiso',      control: '403 · el servidor valida el permiso' },
    { layer: 0, name: 'Fuerza bruta',            control: 'Bloqueo temporal tras 5 fallos' },
    { layer: 0, name: 'POST falsificado',        control: 'CSRF: token rechazado' },
    { layer: 1, name: 'Precio manipulado',       control: 'El servidor recalcula el total' },
    { layer: 1, name: 'Autoaprobación',          control: 'Solicitante ≠ aprobador' },
    { layer: 1, name: 'Dos ventas, 1 unidad',    control: 'Transacción: solo una confirma' },
    { layer: 2, name: 'Borrar el historial',     control: 'Anulación compensatoria' },
    { layer: 2, name: 'Exposición de datos',     control: 'Datos mínimos · secretos en entorno' },
    { layer: 2, name: 'Pérdida del respaldo',    control: 'pg_dump + SHA-256 verificado' }
];

const RESIDUAL = [
    'Riesgo residual: HTTP local · HTTPS depende del proxy',
    'Riesgo residual: matriz RBAC sin revisión formal',
    'Riesgo residual: auditoría sin sellado externo (sin WORM)'
];

const CAMS = [
    { p: [-6, 20, 22], t: [4, 0, 0] },
    { p: [-2, 19, 23], t: [4, 0, 0] },
    { p: [2, 18, 24],  t: [4, 0, 0] }
];

let group;
let rings = [];
let residualLabels = [];
let currentSecIndex = 0;
const tracker = createTracker();

function initSecurityScene(scene) {
    group = new THREE.Group();
    group.visible = false;
    scene.add(group);

    // Bóveda con candado
    const vault = new THREE.Mesh(new THREE.BoxGeometry(2.6, 2.6, 2.6), new THREE.MeshStandardMaterial({ color: '#1e293b', metalness: 0.8, roughness: 0.3 }));
    vault.position.set(VAULT.x, 1.3, 0);
    group.add(vault);
    const lockBody = new THREE.Mesh(new THREE.BoxGeometry(1, 0.8, 0.5), new THREE.MeshStandardMaterial({ color: '#f1c40f', metalness: 0.8 }));
    const shackle = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.1, 16, 32, Math.PI), new THREE.MeshStandardMaterial({ color: '#bdc3c7', metalness: 0.9 }));
    shackle.position.y = 0.4;
    const lock = new THREE.Group();
    lock.add(lockBody, shackle);
    lock.position.set(VAULT.x, 1.3, 1.4);
    group.add(lock);
    const vaultLabel = makeLabel('Inventario · ventas · pagos · auditoría', '#f1c40f', 8);
    vaultLabel.position.set(VAULT.x, 4.4, 0);
    group.add(vaultLabel);

    // Anillos de defensa
    RADII.forEach((R, i) => {
        const wallMat = new THREE.MeshBasicMaterial({ color: LAYER_COLORS[i], transparent: true, opacity: 0.1, side: THREE.DoubleSide, depthWrite: false });
        const wall = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 2.2, 56, 1, true), wallMat);
        wall.position.set(VAULT.x, 1.1, 0);
        const torusMat = mat(LAYER_COLORS[i], 0.3);
        const torus = new THREE.Mesh(new THREE.TorusGeometry(R, 0.08, 8, 72), torusMat);
        torus.rotation.x = Math.PI / 2;
        torus.position.set(VAULT.x, 0.15, 0);
        group.add(wall, torus);
        rings.push({ wallMat, torusMat });

        const rl = makeLabel(RESIDUAL[i], '#f1c40f', 8);
        rl.position.set(VAULT.x, 5.4, -R * 0.4);
        rl.visible = false;
        group.add(rl);
        residualLabels.push(rl);
    });

    // Amenazas: proyectil + etiqueta con su nombre + etiqueta del control
    THREATS.forEach(t => {
        const ball = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4, 0), mat('#e74c3c', 0.6));
        const name = makeLabel(t.name, '#ff8a80', 4.2);
        name.position.y = 1.0;
        ball.add(name);
        ball.visible = false;
        const ctrl = makeLabel('✔ ' + t.control, '#2ecc71', 7);
        ctrl.material.opacity = 0;
        ctrl.visible = false;
        group.add(ball, ctrl);
        t.ball = ball;
        t.ctrl = ctrl;
    });
}

function playStep(i) {
    tracker.killAll();
    rings.forEach((r, k) => {
        gsap.to(r.torusMat, { emissiveIntensity: k === i ? 1.2 : 0.3, duration: 0.6 });
        gsap.to(r.wallMat, { opacity: k === i ? 0.28 : 0.08, duration: 0.6 });
    });
    residualLabels.forEach((l, k) => { l.visible = (k === i); });

    THREATS.forEach(t => { t.ball.visible = false; t.ctrl.visible = false; });

    const R = RADII[i];
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
    THREATS.filter(t => t.layer === i).forEach((t, k) => {
        const a = Math.PI + (k - 1) * 0.65;
        const sx = VAULT.x + (R + 10) * Math.cos(a), sz = (R + 10) * Math.sin(a);
        const hx = VAULT.x + R * Math.cos(a),        hz = R * Math.sin(a);
        t.ball.visible = true;
        t.ctrl.visible = true;
        t.ctrl.position.set(hx, 3.1, hz);
        t.ball.position.set(sx, 1.2, sz);

        tl.set(t.ball.scale, { x: 1, y: 1, z: 1 })
          .set(t.ball.position, { x: sx, z: sz })
          .to(t.ball.position, { x: hx, z: hz, duration: 1.5, ease: 'power2.in' })
          .to(rings[i].wallMat, { opacity: 0.75, duration: 0.12, yoyo: true, repeat: 1 })
          .to(t.ball.scale, { x: 0, y: 0, z: 0, duration: 0.25 })
          .to(t.ctrl.material, { opacity: 1, duration: 0.25 }, '<')
          .to(t.ctrl.material, { opacity: 0, duration: 0.3 }, '+=1.0');
    });
    tracker.track(tl);
}

function moveCamera(camera, controls, i, duration, done) {
    const c = CAMS[i];
    gsap.to(camera.position, { x: c.p[0], y: c.p[1], z: c.p[2], duration, ease: 'power3.inOut' });
    gsap.to(controls.target, { x: c.t[0], y: c.t[1], z: c.t[2], duration, ease: 'power3.inOut', onComplete: done });
}

function enterSecurityScene(camera, controls, callbacks) {
    group.visible = true;
    currentSecIndex = 0;
    callbacks.onUpdateUI(securityDataInfoList[0], false);
    playStep(0);
    moveCamera(camera, controls, 0, 2, callbacks.onAnimationComplete);
}

function nextSecurityLevel(camera, controls, callbacks) {
    currentSecIndex++;
    if (currentSecIndex >= securityDataInfoList.length) {
        callbacks.onReturnToGeneral();
        return;
    }
    const isLast = currentSecIndex === securityDataInfoList.length - 1;
    callbacks.onUpdateUI(securityDataInfoList[currentSecIndex], isLast);
    playStep(currentSecIndex);
    moveCamera(camera, controls, currentSecIndex, 1.5, callbacks.onAnimationComplete);
}

function exitSecurityScene() {
    tracker.killAll();
    group.visible = false;
    THREATS.forEach(t => { t.ball.visible = false; t.ctrl.visible = false; });
}

return { initSecurityScene, enterSecurityScene, nextSecurityLevel, exitSecurityScene };
})();
