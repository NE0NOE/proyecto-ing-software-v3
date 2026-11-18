// Script clásico (sin módulos ES): funciona abriendo index.html con doble clic.
// Expone window.Shared.
window.Shared = (function () {
'use strict';
const THREE = window.THREE;

// Utilidades compartidas por las escenas de Seguridad, Pruebas SW y Pruebas DB.

// Etiqueta (sprite) con texto que se puede cambiar: sprite.userData.set('nuevo texto', '#color')
function makeLabel(text, color = '#ffffff', width = 6) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    function draw(t, c) {
        ctx.clearRect(0, 0, 1024, 128);
        let size = 56;
        ctx.font = `bold ${size}px "Segoe UI", sans-serif`;
        while (ctx.measureText(t).width > 930 && size > 24) {
            size -= 2;
            ctx.font = `bold ${size}px "Segoe UI", sans-serif`;
        }
        const w = Math.min(ctx.measureText(t).width + 70, 1010);
        const x = (1024 - w) / 2;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(x, 14, w, 100, 30); else ctx.rect(x, 14, w, 100);
        ctx.fill();
        ctx.strokeStyle = c;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = c;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(t, 512, 66);
        texture.needsUpdate = true;
    }

    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
    sprite.scale.set(width, width * 128 / 1024, 1);
    sprite.renderOrder = 10;
    sprite.userData.set = (t, c = color) => draw(t, c);
    draw(text, color);
    return sprite;
}

function mat(color, intensity = 0.25) {
    return new THREE.MeshStandardMaterial({
        color, emissive: color, emissiveIntensity: intensity, metalness: 0.3, roughness: 0.4
    });
}

// Cambia color y emisivo de un material con una animación suave
function colorTo(material, hex, duration = 0.3) {
    const c = new THREE.Color(hex);
    gsap.to(material.color, { r: c.r, g: c.g, b: c.b, duration });
    if (material.emissive) gsap.to(material.emissive, { r: c.r, g: c.g, b: c.b, duration });
}

function createPedestal(radius = 16) {
    const ped = new THREE.Mesh(
        new THREE.CylinderGeometry(radius, radius + 0.5, 0.4, 48),
        new THREE.MeshStandardMaterial({ color: '#1e293b', roughness: 0.3, metalness: 0.7 })
    );
    ped.position.y = -0.3;
    ped.receiveShadow = true;
    return ped;
}

// Registro de tweens/timelines para poder cancelarlos al cambiar de paso o salir
function createTracker() {
    let list = [];
    return {
        track(t) { list.push(t); return t; },
        killAll() { list.forEach(t => t.kill()); list = []; }
    };
}

return { makeLabel, mat, colorTo, createPedestal, createTracker };
})();
