// Script clásico (sin módulos ES): funciona abriendo index.html con doble clic.
(function () {
'use strict';
const THREE = window.THREE;
const { OrbitControls } = window;
const { initSolidScene, enterSolidScene, nextSolidPedestal, exitSolidScene } = window.SolidScene;
const { initUXScene, enterUXScene, nextUXRole, exitUXScene } = window.UXScene;
const { initSecurityScene, enterSecurityScene, nextSecurityLevel, exitSecurityScene } = window.SecurityScene;
const { initTestingScene, enterTestingScene, nextTestingLevel, exitTestingScene } = window.TestingScene;
const { initDbScene, enterDbScene, nextDbLevel, exitDbScene } = window.DbScene;
const { initTechScene, enterTechScene, nextTechLevel, exitTechScene } = window.TechScene;
const { stageInfo, REPORT_VERSION } = window.Data;

// Insignia de etapa del informe (visible solo dentro de cada galería)
const stageBadge = document.getElementById('stage-badge');
function showStage(key) {
    const s = stageInfo[key];
    document.getElementById('stage-doc').innerText = s.doc.toUpperCase();
    document.getElementById('stage-doc').style.color = s.color;
    document.getElementById('stage-name').innerText = s.stage;
    document.getElementById('stage-note').innerText = s.note;
    document.getElementById('stage-version').innerText = REPORT_VERSION;
    stageBadge.style.borderColor = s.color;
    // La insignia se ubica justo debajo del panel de información de la derecha
    const panel = document.getElementById(STAGE_PANEL[key]);
    if (stageObserver) stageObserver.disconnect();
    stageObserver = new ResizeObserver(() => placeStageBadge(panel));
    stageObserver.observe(panel);
    placeStageBadge(panel);
    gsap.killTweensOf(stageBadge);
    gsap.to(stageBadge, { opacity: 1, duration: 0.5, delay: 0.7 });
}
function hideStage() {
    if (stageObserver) { stageObserver.disconnect(); stageObserver = null; }
    gsap.killTweensOf(stageBadge);
    gsap.to(stageBadge, { opacity: 0, duration: 0.3 });
}
const STAGE_PANEL = { solid: 'solid-info-panel', ux: 'ux-info-panel', security: 'security-info-panel', testing: 'testing-info-panel', db: 'db-info-panel', tech: 'tech-info-panel' };
let stageObserver = null;
function placeStageBadge(panel) {
    const r = panel.getBoundingClientRect();
    if (r.height > 0) stageBadge.style.top = (r.bottom + 12) + 'px';
}

const { solidCode } = window.CodeData;

// Panel de código real (por ahora solo SOLID; se amplía agregando más claves en data/code.js)
const codePanel = document.getElementById('code-panel');
const codeTabs = document.getElementById('code-tabs');
const codeFile = document.getElementById('code-file');
const codeBody = document.getElementById('code-body');
const codeNote = document.getElementById('code-note');
const codeToggle = document.getElementById('code-toggle');
let codeFrags = [];

function escHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
const PY_RE = /(#.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\b(?:def|class)\b)(\s+)(\w+)|(@[\w.]+)|\b(def|class|return|if|not|else|elif|raise|for|in|from|import|with|as|and|or|is|try|except|lambda|while|None|True|False)\b|\b(\d+(?:\.\d+)?)\b/g;
function highlightPy(line) {
    let out = '', last = 0, m;
    PY_RE.lastIndex = 0;
    while ((m = PY_RE.exec(line))) {
        out += escHtml(line.slice(last, m.index));
        if (m[1]) out += `<span class="tk-c">${escHtml(m[1])}</span>`;
        else if (m[2]) out += `<span class="tk-s">${escHtml(m[2])}</span>`;
        else if (m[3]) out += `<span class="tk-k">${m[3]}</span>${m[4]}<span class="tk-f">${m[5]}</span>`;
        else if (m[6]) out += `<span class="tk-d">${escHtml(m[6])}</span>`;
        else if (m[7]) out += `<span class="tk-k">${m[7]}</span>`;
        else if (m[8]) out += `<span class="tk-n">${m[8]}</span>`;
        last = PY_RE.lastIndex;
    }
    return out + escHtml(line.slice(last));
}
function renderFragment(i) {
    const f = codeFrags[i];
    if (!f) return;
    [...codeTabs.children].forEach((b, k) => b.classList.toggle('active', k === i));
    codeFile.textContent = `${f.file} · líneas ${f.from}–${f.to}`;
    const hl = new Set(f.hl);
    codeBody.innerHTML = f.code.split('\n').map((t, k) => {
        const n = f.from + k;
        return `<div class="code-line${hl.has(n) ? ' hl' : ''}"><span class="code-ln">${n}</span><span class="code-tx">${highlightPy(t) || ' '}</span></div>`;
    }).join('');
    codeBody.scrollTop = 0;
    codeNote.textContent = f.note;
}
function setCode(frags) {
    codeFrags = frags || [];
    codeTabs.innerHTML = '';
    codeFrags.forEach((f, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = f.tab;
        b.addEventListener('click', () => renderFragment(i));
        codeTabs.appendChild(b);
    });
    renderFragment(0);
}
function showCode() {
    gsap.killTweensOf(codePanel);
    codePanel.classList.remove('collapsed');
    codeToggle.innerText = 'Ocultar código';
    codePanel.style.display = 'flex';
    gsap.to(codePanel, { opacity: 1, duration: 0.5, delay: 0.5 });
}
function hideCode() {
    gsap.killTweensOf(codePanel);
    gsap.to(codePanel, { opacity: 0, duration: 0.3, onComplete: () => { codePanel.style.display = 'none'; } });
}
codeToggle.addEventListener('click', () => {
    const collapsed = codePanel.classList.toggle('collapsed');
    codeToggle.innerText = collapsed ? 'Ver código' : 'Ocultar código';
});


// ==========================================
// 1. Configuración Básica de la Escena
// ==========================================
const scene = new THREE.Scene();
scene.background = new THREE.Color('#161625');
scene.fog = new THREE.FogExp2('#161625', 0.005);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const initialCameraPos = new THREE.Vector3(0, 65, 90);
camera.position.copy(initialCameraPos);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// Mejora de iluminación/visual: SRGB Color Space
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('canvas-container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 150;
controls.minDistance = 10;
const initialTarget = new THREE.Vector3(0, 0, 0);
controls.target.copy(initialTarget);

// ==========================================
// 2. Iluminación (Mejorada)
// ==========================================
// Luz ambiental aumentada
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); 
scene.add(ambientLight);

// Luz hemisférica para rellenar sombras con color de cielo y suelo
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444466, 1.0);
hemiLight.position.set(0, 50, 0);
scene.add(hemiLight);

// Luz direccional más fuerte
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(30, 80, 40);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.left = -60;
dirLight.shadow.camera.right = 60;
dirLight.shadow.camera.top = 60;
dirLight.shadow.camera.bottom = -60;
scene.add(dirLight);

// Luz central cian
const pointLightCore = new THREE.PointLight(0x00ffff, 1.2, 80); 
pointLightCore.position.set(0, 15, 0);
scene.add(pointLightCore);

// ==========================================
// 3. Utilidades y Datos
// ==========================================
const clickableObjects = [];
const islandsData = [];
const connectionLinesData = [];

function createTextSprite(message, color = '#ffffff') {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = 'bold 64px "Segoe UI", sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(16, 4, 1);
    return sprite;
}

function createLetterSprite(char) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    ctx.font = 'bold 150px "Segoe UI", sans-serif';
    ctx.fillStyle = '#00ffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
    ctx.shadowBlur = 15;
    
    ctx.fillText(char, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
}

function createLabelSprite(text, color = '#00ffff') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    
    ctx.font = 'bold 36px "Segoe UI", sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
    sprite.scale.set(4, 1, 1);
    return sprite;
}

// ==========================================
// 4. Núcleo Central (Tienda / Arquitectura)
// ==========================================
const coreGroup = new THREE.Group();
scene.add(coreGroup);

// Zonas aclaradas y con bordes iluminados
function createZone(width, depth, x, z, color, name) {
    const geo = new THREE.PlaneGeometry(width - 0.5, depth - 0.5); 
    const mat = new THREE.MeshStandardMaterial({ 
        color: color, 
        roughness: 0.8,
        metalness: 0.0
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 0.05, z);
    mesh.receiveShadow = true;
    coreGroup.add(mesh);

    // Borde iluminado
    const edges = new THREE.EdgesGeometry(geo);
    const lineMat = new THREE.LineBasicMaterial({ color: '#00ffff', transparent: true, opacity: 0.5 });
    const line = new THREE.LineSegments(edges, lineMat);
    line.rotation.x = -Math.PI / 2;
    line.position.set(x, 0.06, z);
    coreGroup.add(line);

    // Letrero flotante
    const label = createTextSprite(name, '#ffffff');
    label.position.set(x, 3, z);
    label.scale.set(10, 2.5, 1); 
    coreGroup.add(label);
    
    return mesh;
}

const baseEdificioGeo = new THREE.BoxGeometry(32, 0.1, 22);
const baseEdificioMat = new THREE.MeshStandardMaterial({ color: '#1e293b' });
const baseEdificio = new THREE.Mesh(baseEdificioGeo, baseEdificioMat);
baseEdificio.position.set(0, -0.05, 0); // Ajustado para evitar z-fighting
baseEdificio.receiveShadow = true;
coreGroup.add(baseEdificio);

// Distribución de las 5 zonas según el plano
createZone(10, 10, -10, -5, '#e6f7e6', 'BODEGA');
createZone(10, 10, 0, -5, '#fdf0e6', 'CUARTO TÉCNICO');
createZone(10, 10, 10, -5, '#f5e6f7', 'GERENCIA');
createZone(20, 10, -5, 5, '#e6e6fa', 'MOSTRADOR / CAJA');
createZone(10, 10, 10, 5, '#e6e6fa', 'ADMINISTRACIÓN');

// Mobiliario aclarado
const woodMat = new THREE.MeshStandardMaterial({ color: '#c4a484', roughness: 0.9 });
const metalMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.7, roughness: 0.3 });
const darkMat = new THREE.MeshStandardMaterial({ color: '#222222', metalness: 0.5, roughness: 0.5 });
const posMat = new THREE.MeshStandardMaterial({ color: '#111111', roughness: 0.3 });

// 1. Mostrador (Mesa larga y 4 terminales POS)
const counterGroup = new THREE.Group();
counterGroup.position.set(-5, 0, 5);
const counterGeo = new THREE.BoxGeometry(16, 1.2, 2);
const counter = new THREE.Mesh(counterGeo, woodMat);
counter.position.set(0, 0.6, 1);
counter.castShadow = true;
counterGroup.add(counter);

const posGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
for(let i=0; i<4; i++) {
    const pos = new THREE.Mesh(posGeo, posMat);
    pos.position.set(-6 + i * 4, 1.5, 1);
    pos.castShadow = true;
    counterGroup.add(pos);
}
coreGroup.add(counterGroup);

// 2. Bodega (Estantes de rack huecos)
const rackGroup = new THREE.Group();
rackGroup.position.set(-10, 0, -5);
function createRack(xOffset) {
    const rack = new THREE.Group();
    const legGeo = new THREE.BoxGeometry(0.2, 4, 0.2);
    const shelfGeo = new THREE.BoxGeometry(2, 0.1, 6);
    const positions = [[-0.9, -2.9], [0.9, -2.9], [-0.9, 2.9], [0.9, 2.9]];
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, metalMat);
        leg.position.set(pos[0], 2, pos[1]);
        leg.castShadow = true;
        rack.add(leg);
    });
    for(let i=0; i<3; i++) {
        const shelf = new THREE.Mesh(shelfGeo, woodMat);
        shelf.position.set(0, 0.5 + i * 1.5, 0);
        shelf.castShadow = true;
        rack.add(shelf);
    }
    rack.position.set(xOffset, 0, 0);
    return rack;
}
rackGroup.add(createRack(-3));
rackGroup.add(createRack(3));
coreGroup.add(rackGroup);

// 3. Cuarto Técnico (Rack / Servidor esbelto)
const serverGeo = new THREE.BoxGeometry(1.2, 4.5, 1.2);
const serverMesh = new THREE.Mesh(serverGeo, darkMat);
serverMesh.position.set(0, 2.25, -5);
serverMesh.castShadow = true;
coreGroup.add(serverMesh);

// 4. Gerencia y Administración (Escritorios)
function createDesk(x, z) {
    const desk = new THREE.Group();
    const topGeo = new THREE.BoxGeometry(3, 0.1, 2);
    const top = new THREE.Mesh(topGeo, woodMat);
    top.position.set(0, 1.2, 0);
    top.castShadow = true;
    desk.add(top);
    
    const legGeo = new THREE.BoxGeometry(0.2, 1.2, 1.8);
    const leg1 = new THREE.Mesh(legGeo, metalMat);
    leg1.position.set(-1.3, 0.6, 0);
    leg1.castShadow = true;
    desk.add(leg1);
    const leg2 = new THREE.Mesh(legGeo, metalMat);
    leg2.position.set(1.3, 0.6, 0);
    leg2.castShadow = true;
    desk.add(leg2);
    
    const monitorGeo = new THREE.BoxGeometry(0.8, 0.6, 0.1);
    const monitor = new THREE.Mesh(monitorGeo, darkMat);
    monitor.position.set(0, 1.5, -0.4);
    monitor.castShadow = true;
    desk.add(monitor);
    
    desk.position.set(x, 0, z);
    return desk;
}
coreGroup.add(createDesk(10, -5)); // Gerencia
coreGroup.add(createDesk(10, 5));  // Administración

// Interactividad del Núcleo
const coreHitBoxGeo = new THREE.BoxGeometry(32, 6, 22);
const coreHitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
const coreHitBox = new THREE.Mesh(coreHitBoxGeo, coreHitBoxMat);
coreHitBox.position.set(0, 3, 0);
coreHitBox.userData = { isCore: true };
coreGroup.add(coreHitBox);
clickableObjects.push(coreHitBox);

// ==========================================
// 5. Las 6 Islas y Conexiones (Hub & Spoke)
// ==========================================
const numIslands = 6;
const radius = 35;
const islandsGroup = new THREE.Group();
scene.add(islandsGroup);

const baseGeo = new THREE.CylinderGeometry(4.5, 3.5, 1, 32);
const baseMat = new THREE.MeshStandardMaterial({ color: '#24243e', metalness: 0.5, roughness: 0.2 });

const islandDataInfo = [
    { name: 'SOLID', builder: createSolidIcon },
    { name: 'UX', builder: createUxIcon },
    { name: 'SEGURIDAD', builder: createSeguridadIcon },
    { name: 'PRUEBAS AL SOFTWARE', builder: createPruebasSoftIcon },
    { name: 'PRUEBAS DB', builder: createPruebasDbIcon },
    { name: 'ESCENARIO TÉCNICO', builder: createTecnicoIcon }
];

for (let i = 0; i < numIslands; i++) {
    const angle = (i * Math.PI * 2) / numIslands;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    const islandContainer = new THREE.Group();
    islandContainer.position.set(x, 0, z);
    
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.5;
    base.receiveShadow = true;
    islandContainer.add(base);

    // Bases sólidas translúcidas azul hielo
    const discGeo = new THREE.CylinderGeometry(5.2, 5.2, 0.1, 32);
    const discMat = new THREE.MeshStandardMaterial({ 
        color: '#00ffff', 
        transparent: true, 
        opacity: 0.2,
        roughness: 0.1,
        metalness: 0.8
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.position.y = 0.05;
    islandContainer.add(disc);

    // Conexiones: Líneas al centro
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0.1, 0),
        new THREE.Vector3(x, 0.1, z)
    ]);
    const lineMat = new THREE.LineBasicMaterial({ color: '#00ffff', transparent: true, opacity: 0 }); // starts invisible for intro
    const connectionLine = new THREE.Line(lineGeo, lineMat);
    scene.add(connectionLine);
    connectionLinesData.push(connectionLine);

    const model = islandDataInfo[i].builder();
    model.position.y = 2.5; 
    
    model.userData = { 
        initialY: model.position.y,
        randomOffset: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() * 0.01) + 0.005
    };
    islandContainer.add(model);

    const label = createTextSprite(islandDataInfo[i].name);
    label.position.set(0, 6.5, 0);
    islandContainer.add(label);

    islandsGroup.add(islandContainer);

    const hitBoxGeo = new THREE.CylinderGeometry(5.5, 5.5, 12, 16);
    const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
    hitBox.position.y = 4;
    hitBox.userData = { 
        isIsland: true, 
        index: i,
        name: islandDataInfo[i].name,
        targetPos: new THREE.Vector3(x, 0, z)
    };
    islandContainer.add(hitBox);
    clickableObjects.push(hitBox);

    islandsData.push({ container: islandContainer, model: model, label: label });
}

// Funciones creadoras de Iconos 3D...
function createSolidIcon() {
    const group = new THREE.Group();
    const gearMat = new THREE.MeshStandardMaterial({ color: '#f59e0b', metalness: 0.7, roughness: 0.2 });
    
    const centerGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.6, 32);
    const center = new THREE.Mesh(centerGeo, gearMat);
    center.rotation.x = Math.PI / 2;
    center.castShadow = true;
    group.add(center);

    const toothGeo = new THREE.BoxGeometry(0.8, 4.2, 0.6);
    for(let i=0; i<8; i++) {
        const tooth = new THREE.Mesh(toothGeo, gearMat);
        tooth.rotation.z = (i * Math.PI) / 4;
        tooth.castShadow = true;
        group.add(tooth);
    }

    const holeGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.7, 16);
    const holeMat = new THREE.MeshBasicMaterial({color: '#161625'});
    const hole = new THREE.Mesh(holeGeo, holeMat);
    hole.rotation.x = Math.PI / 2;
    group.add(hole);
    
    return group;
}

function createUxIcon() {
    const group = new THREE.Group();
    
    const frameGeo = new THREE.BoxGeometry(4.5, 3.2, 0.3);
    const frameMat = new THREE.MeshStandardMaterial({ color: '#cbd5e1' });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.castShadow = true;
    group.add(frame);

    const screenGeo = new THREE.PlaneGeometry(4.1, 2.8);
    const screenMat = new THREE.MeshBasicMaterial({ color: '#1e293b' });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.z = 0.16;
    group.add(screen);

    const navGeo = new THREE.PlaneGeometry(3.7, 0.5);
    const navMat = new THREE.MeshBasicMaterial({ color: '#e94560' });
    const nav = new THREE.Mesh(navGeo, navMat);
    nav.position.set(0, 1.05, 0.17);
    group.add(nav);

    const imgGeo = new THREE.PlaneGeometry(1.2, 1.2);
    const imgMat = new THREE.MeshBasicMaterial({ color: '#8b5cf6' });
    const img = new THREE.Mesh(imgGeo, imgMat);
    img.position.set(-1.1, 0, 0.17);
    group.add(img);

    const textMat = new THREE.MeshBasicMaterial({ color: '#94a3b8' });
    const textGeoLong = new THREE.PlaneGeometry(2, 0.2);
    const textGeoShort = new THREE.PlaneGeometry(1.4, 0.2);
    
    const t1 = new THREE.Mesh(textGeoLong, textMat);
    t1.position.set(0.6, 0.4, 0.17);
    group.add(t1);
    
    const t2 = new THREE.Mesh(textGeoLong, textMat);
    t2.position.set(0.6, 0.1, 0.17);
    group.add(t2);
    
    const t3 = new THREE.Mesh(textGeoShort, textMat);
    t3.position.set(0.3, -0.2, 0.17);
    group.add(t3);

    return group;
}

function createSeguridadIcon() {
    const group = new THREE.Group();
    
    const bodyGeo = new THREE.BoxGeometry(2.2, 1.8, 1.2);
    const bodyMat = new THREE.MeshStandardMaterial({ color: '#fbbf24', metalness: 0.8, roughness: 0.2 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = -0.4;
    body.castShadow = true;
    group.add(body);

    const archGeo = new THREE.TorusGeometry(0.8, 0.25, 16, 32, Math.PI);
    const archMat = new THREE.MeshStandardMaterial({ color: '#94a3b8', metalness: 0.9, roughness: 0.1 });
    const arch = new THREE.Mesh(archGeo, archMat);
    arch.position.y = 0.5;
    arch.castShadow = true;
    group.add(arch);

    const holeMat = new THREE.MeshBasicMaterial({ color: '#111' });
    const circle = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 1.21, 16), holeMat);
    circle.rotation.x = Math.PI / 2;
    circle.position.y = -0.2;
    group.add(circle);
    const rect = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 1.21), holeMat);
    rect.position.y = -0.6;
    group.add(rect);

    return group;
}

function createPruebasSoftIcon() {
    const group = new THREE.Group();
    const greenMat = new THREE.MeshStandardMaterial({ color: '#22c55e', metalness: 0.2, roughness: 0.4 });

    const longLeg = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.5, 0.6), greenMat);
    longLeg.rotation.z = -Math.PI / 4;
    longLeg.position.set(0.6, 0.2, 0);
    longLeg.castShadow = true;
    group.add(longLeg);

    const shortLeg = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.4, 0.6), greenMat);
    shortLeg.rotation.z = Math.PI / 4;
    shortLeg.position.set(-0.5, -0.5, 0);
    shortLeg.castShadow = true;
    group.add(shortLeg);

    return group;
}

function createPruebasDbIcon() {
    const group = new THREE.Group();
    
    const dbSideMat = new THREE.MeshStandardMaterial({ color: '#2563eb', metalness: 0.4, roughness: 0.3 });
    const dbTopMat = new THREE.MeshStandardMaterial({ color: '#60a5fa', metalness: 0.4, roughness: 0.3 });
    
    const cylGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.8, 32);

    for(let i = 0; i < 3; i++) {
        const disk = new THREE.Mesh(cylGeo, [dbSideMat, dbTopMat, dbSideMat]);
        disk.position.y = (i * 1.1) - 1.1; 
        disk.castShadow = true;
        group.add(disk);
    }
    
    return group;
}

function createTecnicoIcon() {
    const group = new THREE.Group();
    
    const serverGeo = new THREE.BoxGeometry(2.5, 3.8, 2);
    const serverMat = new THREE.MeshStandardMaterial({ color: '#0f172a', metalness: 0.6, roughness: 0.2 });
    const server = new THREE.Mesh(serverGeo, serverMat);
    server.castShadow = true;
    group.add(server);

    const slotGeo = new THREE.BoxGeometry(2.1, 0.3, 0.1);
    const slotMat = new THREE.MeshStandardMaterial({ color: '#1e293b' });
    
    const ledColors = ['#ef4444', '#10b981', '#3b82f6', '#f59e0b'];

    for(let i = 0; i < 4; i++) {
        const yPos = 1.2 - (i * 0.8);
        
        const slot = new THREE.Mesh(slotGeo, slotMat);
        slot.position.set(0, yPos, 1.01);
        group.add(slot);

        for(let j = 0; j < 3; j++) {
            const ledGeo = new THREE.BoxGeometry(0.15, 0.15, 0.1);
            const color = ledColors[(i + j) % ledColors.length];
            const ledMat = new THREE.MeshBasicMaterial({ color: color });
            const led = new THREE.Mesh(ledGeo, ledMat);
            led.position.set(0.6 + (j * 0.3), yPos, 1.05);
            group.add(led);
        }
    }

    return group;
}

// ==========================================
// 5.5 Galería SOLID (x: 300)
// ==========================================
const solidInfoPanel = document.getElementById('solid-info-panel');
const solidTitle = document.getElementById('solid-title');
const solidDesc = document.getElementById('solid-desc');
const nextSolidBtn = document.getElementById('next-solid-btn');

const solidStatus = document.getElementById('solid-status');
const solidEvidence = document.getElementById('solid-evidence');
const SOLID_STATUS_COLOR = { 'aplicado': '#2ecc71', 'parcial': '#f39c12', 'no forzado': '#3498db' };
function renderSolidPanel(data) {
    solidTitle.innerText = data.title;
    setCode(solidCode[data.letter]);
    solidDesc.innerText = data.desc;
    solidEvidence.innerText = data.evidence;
    const c = SOLID_STATUS_COLOR[data.status] || '#00ffff';
    solidStatus.innerText = data.status.toUpperCase();
    solidStatus.style.background = c;
    solidInfoPanel.style.borderColor = c;
    solidInfoPanel.style.boxShadow = `0 10px 30px ${c}33`;
    nextSolidBtn.style.background = c;
}

initSolidScene(scene, createLetterSprite, createLabelSprite);

function startSolidGalleryMode() {
    if (isAnimating) return;
    isAnimating = true;
    currentView = 'solid_gallery';
    showStage('solid');
    showCode();
    
    gsap.to([document.getElementById('ui-panel'), document.getElementById('team-credits')], {
        opacity: 0, duration: 0.5,
        onComplete: () => {
            solidInfoPanel.style.display = 'block';
            gsap.to(solidInfoPanel, { opacity: 1, duration: 0.5 });
        }
    });

    enterSolidScene(camera, controls, {
        onUpdateUI: (data, isLast) => {
            renderSolidPanel(data);
            nextSolidBtn.innerText = isLast ? 'Volver al Mapa General' : 'Siguiente Principio ➔';
        },
        onAnimationComplete: () => {
            isAnimating = false;
        }
    });
}

nextSolidBtn.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    nextSolidPedestal(camera, controls, {
        onUpdateUI: (data, isLast) => {
            renderSolidPanel(data);
            nextSolidBtn.innerText = isLast ? 'Volver al Mapa General' : 'Siguiente Principio ➔';
        },
        onAnimationComplete: () => {
            isAnimating = false;
        },
        onReturnToGeneral: () => {
            exitSolidScene();
            gsap.to(solidInfoPanel, { opacity: 0, duration: 0.5, onComplete: () => {
                solidInfoPanel.style.display = 'none';
            }});
            isAnimating = false;
            returnToGeneralView();
        }
    });
});

// ==========================================
// 5.6 Galería UX (Isla 2)
// ==========================================
const uxInfoPanel = document.getElementById('ux-info-panel');
const uxRole = document.getElementById('ux-role');
const uxTask = document.getElementById('ux-task');
const uxDesc = document.getElementById('ux-desc');
const nextUxBtn = document.getElementById('next-ux-btn');

initUXScene(scene);

function startUXGalleryMode() {
    if (isAnimating) return;
    isAnimating = true;
    currentView = 'ux_gallery';
    showStage('ux');
    
    gsap.to([document.getElementById('ui-panel'), document.getElementById('team-credits'), backButton], {
        opacity: 0, duration: 0.5,
        onComplete: () => {
            uxInfoPanel.style.display = 'block';
            gsap.to(uxInfoPanel, { opacity: 1, duration: 0.5 });
        }
    });

    enterUXScene(camera, controls, {
        onUpdateUI: (data, isLast) => {
            uxRole.innerText = data.role;
            uxRole.style.color = data.color;
            uxTask.innerText = data.task;
            uxDesc.innerText = data.desc;
            nextUxBtn.innerText = isLast ? 'Volver al Mapa General' : 'Siguiente Rol ➔';
        },
        onAnimationComplete: () => {
            isAnimating = false;
        }
    });
}

nextUxBtn.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    nextUXRole(camera, controls, {
        onUpdateUI: (data, isLast) => {
            uxRole.innerText = data.role;
            uxRole.style.color = data.color;
            uxTask.innerText = data.task;
            uxDesc.innerText = data.desc;
            nextUxBtn.innerText = isLast ? 'Volver al Mapa General' : 'Siguiente Rol ➔';
        },
        onAnimationComplete: () => {
            isAnimating = false;
        },
        onReturnToGeneral: () => {
            exitUXScene();
            gsap.to(uxInfoPanel, { opacity: 0, duration: 0.5, onComplete: () => {
                uxInfoPanel.style.display = 'none';
            }});
            isAnimating = false;
            returnToGeneralView();
        }
    });
});

// ==========================================
// 5.7 Galería Seguridad (Isla 3)
// ==========================================
const securityInfoPanel = document.getElementById('security-info-panel');
const securityLevel = document.getElementById('security-level');
const securityTitle = document.getElementById('security-title');
const securityEvidence = document.getElementById('security-evidence');
const securityDesc = document.getElementById('security-desc');
const nextSecurityBtn = document.getElementById('next-security-btn');

initSecurityScene(scene);

function startSecurityGalleryMode() {
    if (isAnimating) return;
    isAnimating = true;
    currentView = 'security_gallery';
    showStage('security');
    
    gsap.to([document.getElementById('ui-panel'), document.getElementById('team-credits'), backButton], {
        opacity: 0, duration: 0.5,
        onComplete: () => {
            securityInfoPanel.style.display = 'block';
            gsap.to(securityInfoPanel, { opacity: 1, duration: 0.5 });
        }
    });

    enterSecurityScene(camera, controls, {
        onUpdateUI: (data, isLast) => {
            securityLevel.innerText = data.level;
            securityLevel.style.color = data.color;
            securityTitle.innerText = data.title;
            securityEvidence.innerText = data.evidence;
            securityDesc.innerText = data.desc;
            
            // Update panel border color
            securityInfoPanel.style.borderColor = data.color;
            securityInfoPanel.style.boxShadow = `0 10px 30px ${data.color}33`; // 20% opacity hex

            nextSecurityBtn.style.background = data.color;
            nextSecurityBtn.innerText = isLast ? 'Volver al Mapa General' : 'Siguiente Capa ➔';
        },
        onAnimationComplete: () => {
            isAnimating = false;
        }
    });
}

nextSecurityBtn.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    nextSecurityLevel(camera, controls, {
        onUpdateUI: (data, isLast) => {
            securityLevel.innerText = data.level;
            securityLevel.style.color = data.color;
            securityTitle.innerText = data.title;
            securityEvidence.innerText = data.evidence;
            securityDesc.innerText = data.desc;
            
            securityInfoPanel.style.borderColor = data.color;
            securityInfoPanel.style.boxShadow = `0 10px 30px ${data.color}33`;
            
            nextSecurityBtn.style.background = data.color;
            nextSecurityBtn.innerText = isLast ? 'Volver al Mapa General' : 'Siguiente Capa ➔';
        },
        onAnimationComplete: () => {
            isAnimating = false;
        },
        onReturnToGeneral: () => {
            exitSecurityScene();
            gsap.to(securityInfoPanel, { opacity: 0, duration: 0.5, onComplete: () => {
                securityInfoPanel.style.display = 'none';
            }});
            isAnimating = false;
            returnToGeneralView();
        }
    });
});

// ==========================================
// 5.8 Galería Pruebas Software (Isla 4)
// ==========================================
const testingInfoPanel = document.getElementById('testing-info-panel');
const testingLevel = document.getElementById('testing-level');
const testingTitle = document.getElementById('testing-title');
const testingEvidence = document.getElementById('testing-evidence');
const testingDesc = document.getElementById('testing-desc');
const nextTestingBtn = document.getElementById('next-testing-btn');

initTestingScene(scene);

function startTestingGalleryMode() {
    if (isAnimating) return;
    isAnimating = true;
    currentView = 'testing_gallery';
    showStage('testing');
    
    gsap.to([document.getElementById('ui-panel'), document.getElementById('team-credits'), backButton], {
        opacity: 0, duration: 0.5,
        onComplete: () => {
            testingInfoPanel.style.display = 'block';
            gsap.to(testingInfoPanel, { opacity: 1, duration: 0.5 });
        }
    });

    enterTestingScene(camera, controls, {
        onUpdateUI: (data, isLast) => {
            testingLevel.innerText = data.level;
            testingLevel.style.color = data.color;
            testingTitle.innerText = data.title;
            testingEvidence.innerText = data.evidence;
            testingDesc.innerText = data.desc;
            
            testingInfoPanel.style.borderColor = data.color;
            testingInfoPanel.style.boxShadow = `0 10px 30px ${data.color}33`;

            nextTestingBtn.style.background = data.color;
            nextTestingBtn.innerText = isLast ? 'Volver al Mapa General' : 'Siguiente Fase ➔';
        },
        onAnimationComplete: () => {
            isAnimating = false;
        }
    });
}

nextTestingBtn.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    nextTestingLevel(camera, controls, {
        onUpdateUI: (data, isLast) => {
            testingLevel.innerText = data.level;
            testingLevel.style.color = data.color;
            testingTitle.innerText = data.title;
            testingEvidence.innerText = data.evidence;
            testingDesc.innerText = data.desc;
            
            testingInfoPanel.style.borderColor = data.color;
            testingInfoPanel.style.boxShadow = `0 10px 30px ${data.color}33`;
            
            nextTestingBtn.style.background = data.color;
            nextTestingBtn.innerText = isLast ? 'Volver al Mapa General' : 'Siguiente Fase ➔';
        },
        onAnimationComplete: () => {
            isAnimating = false;
        },
        onReturnToGeneral: () => {
            exitTestingScene();
            gsap.to(testingInfoPanel, { opacity: 0, duration: 0.5, onComplete: () => {
                testingInfoPanel.style.display = 'none';
            }});
            isAnimating = false;
            returnToGeneralView();
        }
    });
});

// ==========================================
// 5.9 Galería Pruebas DB (Isla 5)
// ==========================================
const dbInfoPanel = document.getElementById('db-info-panel');
const dbPhase = document.getElementById('db-phase');
const dbTitle = document.getElementById('db-title');
const dbEvidence = document.getElementById('db-evidence');
const dbDesc = document.getElementById('db-desc');
const nextDbBtn = document.getElementById('next-db-btn');

initDbScene(scene);

function startDbGalleryMode() {
    if (isAnimating) return;
    isAnimating = true;
    currentView = 'db_gallery';
    showStage('db');
    
    gsap.to([document.getElementById('ui-panel'), document.getElementById('team-credits'), backButton], {
        opacity: 0, duration: 0.5,
        onComplete: () => {
            dbInfoPanel.style.display = 'block';
            gsap.to(dbInfoPanel, { opacity: 1, duration: 0.5 });
        }
    });

    enterDbScene(camera, controls, {
        onUpdateUI: (data, isLast) => {
            dbPhase.innerText = data.phase;
            dbPhase.style.color = data.color;
            dbTitle.innerText = data.title;
            dbEvidence.innerText = data.evidence;
            dbDesc.innerText = data.desc;
            
            dbInfoPanel.style.borderColor = data.color;
            dbInfoPanel.style.boxShadow = `0 10px 30px ${data.color}33`;

            nextDbBtn.style.background = data.color;
            nextDbBtn.innerText = isLast ? 'Volver al Mapa General' : 'Siguiente ➔';
        },
        onAnimationComplete: () => {
            isAnimating = false;
        }
    });
}

nextDbBtn.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    nextDbLevel(camera, controls, {
        onUpdateUI: (data, isLast) => {
            dbPhase.innerText = data.phase;
            dbPhase.style.color = data.color;
            dbTitle.innerText = data.title;
            dbEvidence.innerText = data.evidence;
            dbDesc.innerText = data.desc;
            
            dbInfoPanel.style.borderColor = data.color;
            dbInfoPanel.style.boxShadow = `0 10px 30px ${data.color}33`;
            
            nextDbBtn.style.background = data.color;
            nextDbBtn.innerText = isLast ? 'Volver al Mapa General' : 'Siguiente ➔';
        },
        onAnimationComplete: () => {
            isAnimating = false;
        },
        onReturnToGeneral: () => {
            exitDbScene();
            gsap.to(dbInfoPanel, { opacity: 0, duration: 0.5, onComplete: () => {
                dbInfoPanel.style.display = 'none';
            }});
            isAnimating = false;
            returnToGeneralView();
        }
    });
});

// ==========================================
// 5.10 Galería Escenario Técnico (Isla 6)
// ==========================================
const techInfoPanel = document.getElementById('tech-info-panel');
const techView = document.getElementById('tech-view');
const techTitle = document.getElementById('tech-title');
const techEvidence = document.getElementById('tech-evidence');
const techDesc = document.getElementById('tech-desc');
const nextTechBtn = document.getElementById('next-tech-btn');

initTechScene(scene);

function startTechGalleryMode() {
    if (isAnimating) return;
    isAnimating = true;
    currentView = 'tech_gallery';
    showStage('tech');
    
    gsap.to([document.getElementById('ui-panel'), document.getElementById('team-credits'), backButton], {
        opacity: 0, duration: 0.5,
        onComplete: () => {
            techInfoPanel.style.display = 'block';
            gsap.to(techInfoPanel, { opacity: 1, duration: 0.5 });
        }
    });

    enterTechScene(camera, controls, {
        onUpdateUI: (data, isLast) => {
            techView.innerText = data.view;
            techView.style.color = data.color;
            techTitle.innerText = data.title;
            techEvidence.innerText = data.evidence;
            techDesc.innerText = data.desc;
            
            techInfoPanel.style.borderColor = data.color;
            techInfoPanel.style.boxShadow = `0 10px 30px ${data.color}33`;

            nextTechBtn.style.background = data.color;
            nextTechBtn.innerText = isLast ? 'Volver al Mapa General' : 'Siguiente Vista ➔';
        },
        onAnimationComplete: () => {
            isAnimating = false;
        }
    });
}

nextTechBtn.addEventListener('click', () => {
    if (isAnimating) return;
    isAnimating = true;

    nextTechLevel(camera, controls, {
        onUpdateUI: (data, isLast) => {
            techView.innerText = data.view;
            techView.style.color = data.color;
            techTitle.innerText = data.title;
            techEvidence.innerText = data.evidence;
            techDesc.innerText = data.desc;
            
            techInfoPanel.style.borderColor = data.color;
            techInfoPanel.style.boxShadow = `0 10px 30px ${data.color}33`;
            
            nextTechBtn.style.background = data.color;
            nextTechBtn.innerText = isLast ? 'Volver al Mapa General' : 'Siguiente Vista ➔';
        },
        onAnimationComplete: () => {
            isAnimating = false;
        },
        onReturnToGeneral: () => {
            exitTechScene();
            gsap.to(techInfoPanel, { opacity: 0, duration: 0.5, onComplete: () => {
                techInfoPanel.style.display = 'none';
            }});
            isAnimating = false;
            returnToGeneralView();
        }
    });
});

// ==========================================
// 6. Interacción: Raycaster y GSAP
// ==========================================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const backButton = document.getElementById('back-button');

let currentView = 'general'; // 'general' | 'island' | 'core' | 'solid_gallery' | 'ux_gallery'
let isAnimating = false;

window.addEventListener('pointerdown', onPointerDown);
backButton.addEventListener('click', returnToGeneralView);

function onPointerDown(event) {
    if (isAnimating) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableObjects);

    if (intersects.length > 0 && currentView === 'general') {
        const hit = intersects[0].object;
        if (hit.userData.isIsland) {
            if (hit.userData.name === 'SOLID') {
                startSolidGalleryMode();
            } else if (hit.userData.name === 'UX') {
                startUXGalleryMode();
            } else if (hit.userData.name === 'SEGURIDAD') {
                startSecurityGalleryMode();
            } else if (hit.userData.name === 'PRUEBAS AL SOFTWARE') {
                startTestingGalleryMode();
            } else if (hit.userData.name === 'PRUEBAS DB') {
                startDbGalleryMode();
            } else if (hit.userData.name === 'ESCENARIO TÉCNICO') {
                startTechGalleryMode();
            } else {
                zoomToIsland(hit.userData.targetPos);
            }
        } else if (hit.userData.isCore) {
            zoomToCore();
        }
    }
}

function zoomToIsland(targetPos) {
    isAnimating = true;
    currentView = 'island';
    
    const directionFromCenter = targetPos.clone().normalize();
    
    const newCamPos = new THREE.Vector3(
        targetPos.x + directionFromCenter.x * 15,
        targetPos.y + 12,
        targetPos.z + directionFromCenter.z * 15
    );

    gsap.to(camera.position, {
        x: newCamPos.x,
        y: newCamPos.y,
        z: newCamPos.z,
        duration: 1.5,
        ease: "power3.inOut"
    });

    gsap.to(controls.target, {
        x: targetPos.x,
        y: targetPos.y + 2, 
        z: targetPos.z,
        duration: 1.5,
        ease: "power3.inOut",
        onComplete: () => {
            isAnimating = false;
            backButton.classList.add('visible');
        }
    });
}

function zoomToCore() {
    isAnimating = true;
    currentView = 'core';
    
    const newCamPos = new THREE.Vector3(0, 22, 28);

    gsap.to(camera.position, {
        x: newCamPos.x,
        y: newCamPos.y,
        z: newCamPos.z,
        duration: 1.5,
        ease: "power3.inOut"
    });

    gsap.to(controls.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.5,
        ease: "power3.inOut",
        onComplete: () => {
            isAnimating = false;
            backButton.classList.add('visible');
        }
    });
}

function returnToGeneralView() {
    if (isAnimating) return;
    isAnimating = true;
    backButton.classList.remove('visible');
    hideStage();
    hideCode();
    
    gsap.to([document.getElementById('ui-panel'), document.getElementById('team-credits')], { opacity: 1, duration: 0.5 });

    gsap.to(camera.position, {
        x: initialCameraPos.x,
        y: initialCameraPos.y,
        z: initialCameraPos.z,
        duration: 1.5,
        ease: "power3.inOut"
    });

    gsap.to(controls.target, {
        x: initialTarget.x,
        y: initialTarget.y,
        z: initialTarget.z,
        duration: 1.5,
        ease: "power3.inOut",
        onComplete: () => {
            isAnimating = false;
            currentView = 'general';
        }
    });
}

window.addEventListener('pointermove', (event) => {
    if (currentView !== 'general') {
        document.body.style.cursor = 'default';
        return;
    }
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(clickableObjects);
    
    if (intersects.length > 0) {
        document.body.style.cursor = 'pointer';
    } else {
        document.body.style.cursor = 'default';
    }
});

// ==========================================
// 7. Intro Cinematográfica (GSAP)
// ==========================================

// Estado Inicial (Oculto)
document.getElementById('ui-panel').style.opacity = 0;
camera.position.set(0, 5, 10);
controls.enabled = false;

ambientLight.intensity = 0;
hemiLight.intensity = 0;
dirLight.intensity = 0;
pointLightCore.intensity = 0;

islandsData.forEach(island => {
    island.container.scale.set(0, 0, 0);
});

// Secuencia GSAP (timeline)
const introTl = gsap.timeline();

// Paso 1 (Encendido de luces)
introTl.to([ambientLight, hemiLight, dirLight, pointLightCore], {
    intensity: (index) => {
        if(index === 0) return 1.2; // ambientLight
        if(index === 1) return 1.0; // hemiLight
        if(index === 2) return 1.5; // dirLight
        if(index === 3) return 1.2; // pointLightCore
    },
    duration: 1.5,
    ease: "power1.inOut"
});

// Paso 2 (El Vuelo de Cámara)
introTl.to(camera.position, {
    x: initialCameraPos.x,
    y: initialCameraPos.y,
    z: initialCameraPos.z,
    duration: 2.5,
    ease: "power2.inOut"
});

// Paso 3 (Aparición de Islas y Conexiones)
const islandContainers = islandsData.map(i => i.container.scale);
const linesMaterials = connectionLinesData.map(l => l.material);

introTl.to(islandContainers, {
    x: 1, y: 1, z: 1,
    duration: 1.5,
    ease: "back.out(1.5)",
    stagger: 0.15
}, "<+0.5"); // Empieza poco después de iniciar el vuelo

introTl.to(linesMaterials, {
    opacity: 0.4,
    duration: 1.5,
    stagger: 0.15
}, "<"); // Al mismo tiempo que las escalas de las islas

// Paso 4 (Interfaz y Control)
introTl.to([document.getElementById('ui-panel'), document.getElementById('team-credits')], {
    opacity: 1,
    duration: 1,
    onComplete: () => {
        controls.enabled = true; // Devolver control al usuario
    }
});

// ==========================================
// 8. Bucle de Animación y Resize
// ==========================================
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    islandsData.forEach((island) => {
        const { model, label } = island;
        const data = model.userData;
        
        model.rotation.y += data.rotationSpeed;
        
        // Vida/Flotación continua de íconos y textos
        const floatOffset = Math.sin(time * 2 + data.randomOffset) * 0.4;
        model.position.y = data.initialY + floatOffset;
        label.position.y = 6.5 + floatOffset; 
    });

    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

})();
