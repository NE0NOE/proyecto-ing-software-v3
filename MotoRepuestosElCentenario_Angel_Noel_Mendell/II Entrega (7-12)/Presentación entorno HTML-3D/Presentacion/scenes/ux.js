// Script clásico (sin módulos ES): funciona abriendo index.html con doble clic.
// Expone window.UXScene.
window.UXScene = (function () {
'use strict';
const THREE = window.THREE;
const { uxDataInfoList } = window.Data;

let uxPawns = [];
let uxGroup;
let currentUXIndex = 0;

function initUXScene(scene) {
    uxGroup = new THREE.Group();
    // Centered at 0,0,0 (same as core)
    uxGroup.position.set(0, 0, 0);
    uxGroup.visible = false;
    scene.add(uxGroup);

    uxPawns = uxDataInfoList.map((data, index) => {
        const pawn = new THREE.Group();
        
        const mat = new THREE.MeshStandardMaterial({ color: data.color, roughness: 0.3, metalness: 0.1 });
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 1.2, 16), mat);
        body.position.y = 0.6;
        body.castShadow = true;
        
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.35, 16, 16), mat);
        head.position.y = 1.4;
        head.castShadow = true;
        
        pawn.add(body, head);
        // Start position (Entrance)
        pawn.position.set(0, 0, 8); 
        
        uxGroup.add(pawn);
        return pawn;
    });
}

function enterUXScene(camera, controls, callbacks) {
    uxGroup.visible = true;
    currentUXIndex = 0;
    
    // Animate pawns walking to their zones simultaneously
    uxPawns.forEach((pawn, idx) => {
        const target = uxDataInfoList[idx].targetPos;
        // Reset to entrance first
        pawn.position.set(0, 0, 8);
        pawn.scale.set(1, 1, 1);
        
        // Walk animation
        gsap.to(pawn.position, {
            x: target.x,
            z: target.z,
            duration: 2.5,
            ease: "power2.out",
            delay: 0.5 // small delay after entering
        });
    });

    // Camera zooms into an isometric view showing the whole core floor well
    const targetCamX = 0;
    const targetCamY = 18;
    const targetCamZ = 25;

    callbacks.onUpdateUI(uxDataInfoList[currentUXIndex], false);

    gsap.to(camera.position, { x: targetCamX, y: targetCamY, z: targetCamZ, duration: 2, ease: "power3.inOut" });
    gsap.to(controls.target, { 
        x: 0, y: 0, z: 0, 
        duration: 2, ease: "power3.inOut", 
        onComplete: () => {
            highlightCurrentPawn();
            callbacks.onAnimationComplete();
        }
    });
}

function nextUXRole(camera, controls, callbacks) {
    // Un-highlight previous
    gsap.to(uxPawns[currentUXIndex].position, { y: 0, duration: 0.3 });
    gsap.to(uxPawns[currentUXIndex].scale, { x: 1, y: 1, z: 1, duration: 0.3 });

    currentUXIndex++;
    
    if (currentUXIndex >= uxDataInfoList.length) {
        callbacks.onReturnToGeneral();
        return;
    }
    
    const isLast = (currentUXIndex === uxDataInfoList.length - 1);
    callbacks.onUpdateUI(uxDataInfoList[currentUXIndex], isLast);
    
    highlightCurrentPawn();

    // Optionally slightly adjust camera to focus on the active area
    const targetPos = uxDataInfoList[currentUXIndex].targetPos;
    gsap.to(controls.target, { 
        x: targetPos.x * 0.4, 
        y: 0, 
        z: targetPos.z * 0.4, 
        duration: 1.5, ease: "power3.inOut", 
        onComplete: callbacks.onAnimationComplete 
    });
}

function exitUXScene() {
    uxGroup.visible = false;
    // reset highlights
    uxPawns.forEach(p => {
        p.position.y = 0;
        p.scale.set(1, 1, 1);
    });
}

function highlightCurrentPawn() {
    const pawn = uxPawns[currentUXIndex];
    // Jump effect
    gsap.to(pawn.position, { y: 1, duration: 0.3, yoyo: true, repeat: 1 });
    // Scale up
    gsap.to(pawn.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.5, ease: "back.out(1.5)" });
}

return { initUXScene, enterUXScene, nextUXRole, exitUXScene };
})();
