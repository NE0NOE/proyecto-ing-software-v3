import * as THREE from 'three';

const STAGE_ORDER = [
  'blueprint',
  'chassis',
  'engine',
  'exploded',
  'transmission',
  'handlebar',
  'brakes-key',
  'dyno',
  'ignition',
  'tank',
  'dashboard',
  'harness',
  'complete',
  'road',
];

function stageRank(stage) {
  const idx = STAGE_ORDER.indexOf(stage);
  return idx === -1 ? 0 : idx;
}

export function disposeObject3D(root) {
  if (!root) return;
  root.traverse((obj) => {
    if (obj.geometry) {
      obj.geometry.dispose();
    }
    if (obj.material) {
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const mat of mats) {
        mat?.map?.dispose?.();
        mat?.dispose?.();
      }
    }
  });
}

function tagDualMaterial(mesh, solidColor, metalness = 0.65, roughness = 0.3, emissive = 0x000000, emissiveIntensity = 0) {
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x3ba0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.52,
  });
  const solidMat = new THREE.MeshStandardMaterial({
    color: solidColor,
    metalness,
    roughness,
    emissive,
    emissiveIntensity,
  });
  mesh.userData.wireMat = wireMat;
  mesh.userData.solidMat = solidMat;
  mesh.userData.baseEmissive = emissiveIntensity;
  mesh.material = wireMat;
  return mesh;
}

function registerPartGroup(group, unlockStage, explodeVec) {
  group.userData.unlockStage = unlockStage;
  group.userData.basePos = group.position.clone();
  group.userData.targetPos = group.position.clone();
  group.userData.explodeOffset = explodeVec.clone();
  group.userData.wasSolid = false;
  return group;
}

/**
 * Construye la motocicleta procedural 3D por subsistemas para ensamblaje progresivo de S00 a S35.
 */
export function createMotorcycleRig() {
  const root = new THREE.Group();
  root.name = 'mrec_motorcycle';

  // Materiales reutilizables auxiliares para ruedas y luces
  const wheelsSpinGroups = [];

  // 1. CHASIS (S06+)
  const chassisGroup = registerPartGroup(new THREE.Group(), 'chassis', new THREE.Vector3(0, 0.25, 0));
  const tubeGeoMain = new THREE.CylinderGeometry(0.042, 0.042, 1.45, 12);
  const topTube = tagDualMaterial(new THREE.Mesh(tubeGeoMain), 0x3b6ea5, 0.78, 0.26);
  topTube.rotation.z = Math.PI / 2 - 0.14;
  topTube.position.set(0.05, 0.92, 0);
  chassisGroup.add(topTube);

  const subTubeGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.98, 10);
  for (const side of [-0.14, 0.14]) {
    const sideRail = tagDualMaterial(new THREE.Mesh(subTubeGeo), 0x2f5378, 0.72, 0.32);
    sideRail.rotation.z = Math.PI / 2 + 0.12;
    sideRail.position.set(-0.42, 0.76, side);
    chassisGroup.add(sideRail);

    const cradle = tagDualMaterial(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.92, 10)), 0x3b6ea5, 0.75, 0.28);
    cradle.rotation.z = 0.62;
    cradle.position.set(0.32, 0.56, side * 0.85);
    chassisGroup.add(cradle);

    const forkTube = tagDualMaterial(new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.03, 1.15, 12)), 0xd6e0ea, 0.88, 0.18);
    forkTube.rotation.z = 0.44;
    forkTube.position.set(0.84, 0.74, side * 0.95);
    chassisGroup.add(forkTube);

    const swingarm = tagDualMaterial(new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.065, 0.055)), 0x293548, 0.7, 0.35);
    swingarm.rotation.z = 0.08;
    swingarm.position.set(-0.62, 0.41, side * 1.15);
    chassisGroup.add(swingarm);
  }
  const neck = tagDualMaterial(new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.28, 14)), 0x1e293b, 0.8, 0.25);
  neck.rotation.z = 0.42;
  neck.position.set(0.64, 1.08, 0);
  chassisGroup.add(neck);
  root.add(chassisGroup);

  // 2. MOTOR 4 CAPAS (S11+)
  const engineGroup = registerPartGroup(new THREE.Group(), 'engine', new THREE.Vector3(0, -0.55, 0));
  const crankcase = tagDualMaterial(new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.32, 0.34)), 0x475569, 0.78, 0.34);
  crankcase.position.set(0.02, 0.45, 0);
  engineGroup.add(crankcase);

  const layerColors = [0x3ba0ff, 0x5b9bd5, 0xff6b1a, 0x2ee59d];
  for (let i = 0; i < 4; i += 1) {
    const fin = tagDualMaterial(
      new THREE.Mesh(new THREE.BoxGeometry(0.32 - i * 0.02, 0.055, 0.28 - i * 0.015)),
      layerColors[i],
      0.68,
      0.28,
      layerColors[i],
      0.22
    );
    fin.rotation.z = -0.22;
    fin.position.set(0.12 + i * 0.025, 0.66 + i * 0.068, 0);
    engineGroup.add(fin);
  }
  const exhaustPipe = tagDualMaterial(new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.048, 1.18, 12)), 0x94a3b8, 0.9, 0.16);
  exhaustPipe.rotation.z = Math.PI / 2 + 0.05;
  exhaustPipe.position.set(-0.56, 0.3, 0.22);
  engineGroup.add(exhaustPipe);
  root.add(engineGroup);

  // 3. TRANSMISIÓN 5 ENGRANES SOLID (S16+)
  const transGroup = registerPartGroup(new THREE.Group(), 'transmission', new THREE.Vector3(-0.6, -0.25, 0.42));
  const gearSpecs = [
    { r: 0.14, x: -0.22, y: 0.44, z: 0.19, color: 0x3ba0ff },
    { r: 0.11, x: -0.44, y: 0.42, z: 0.19, color: 0x5b9bd5 },
    { r: 0.1, x: -0.66, y: 0.41, z: 0.19, color: 0x2ee59d },
    { r: 0.09, x: -0.85, y: 0.39, z: 0.19, color: 0xf59e0b },
    { r: 0.17, x: -1.04, y: 0.37, z: 0.19, color: 0xff6b1a },
  ];
  const gears = [];
  for (const g of gearSpecs) {
    const gear = tagDualMaterial(new THREE.Mesh(new THREE.CylinderGeometry(g.r, g.r, 0.04, 14)), g.color, 0.85, 0.22, g.color, 0.2);
    gear.rotation.x = Math.PI / 2;
    gear.position.set(g.x, g.y, g.z);
    transGroup.add(gear);
    gears.push(gear);
  }
  const chainMesh = tagDualMaterial(new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.05, 0.03)), 0x64748b, 0.8, 0.35);
  chainMesh.position.set(-0.63, 0.41, 0.19);
  transGroup.add(chainMesh);
  root.add(transGroup);

  // 4. MANUBRIO Y MANDOS UX (S17+)
  const handlebarGroup = registerPartGroup(new THREE.Group(), 'handlebar', new THREE.Vector3(0.45, 0.65, 0));
  const bar = tagDualMaterial(new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.78, 12)), 0xe2e8f0, 0.9, 0.18);
  bar.rotation.x = Math.PI / 2;
  bar.position.set(0.56, 1.24, 0);
  handlebarGroup.add(bar);
  for (const side of [-0.36, 0.36]) {
    const grip = tagDualMaterial(new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.16, 10)), 0x1e293b, 0.25, 0.8);
    grip.rotation.x = Math.PI / 2;
    grip.position.set(0.54, 1.24, side);
    handlebarGroup.add(grip);

    const mirrorArm = tagDualMaterial(new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.18, 8)), 0x94a3b8, 0.8, 0.25);
    mirrorArm.position.set(0.57, 1.34, side * 0.72);
    handlebarGroup.add(mirrorArm);

    const mirrorHead = tagDualMaterial(new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.08, 0.12)), 0x38bdf8, 0.85, 0.15, 0x3ba0ff, 0.25);
    mirrorHead.position.set(0.56, 1.43, side * 0.85);
    handlebarGroup.add(mirrorHead);
  }
  root.add(handlebarGroup);

  // 5. FRENOS Y LLAVE (S18+)
  const brakesGroup = registerPartGroup(new THREE.Group(), 'brakes-key', new THREE.Vector3(0.75, -0.35, 0.35));
  for (const wx of [1.06, -1.04]) {
    const disc = tagDualMaterial(new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.022, 24)), 0xcbd5e1, 0.9, 0.18);
    disc.rotation.x = Math.PI / 2;
    disc.position.set(wx, 0.37, -0.11);
    brakesGroup.add(disc);

    const caliper = tagDualMaterial(new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.14, 0.08)), 0xe94560, 0.45, 0.35, 0xe94560, 0.35);
    caliper.position.set(wx - 0.11, 0.49, -0.11);
    brakesGroup.add(caliper);
  }
  const keyCylinder = tagDualMaterial(new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.09, 12)), 0xf1c40f, 0.9, 0.2, 0xf59e0b, 0.45);
  keyCylinder.position.set(0.62, 1.18, 0);
  brakesGroup.add(keyCylinder);
  root.add(brakesGroup);

  // 6. RUEDAS + FARO (se ven wireframe desde S00 y cromo desde dyno/ignition)
  const wheelsGroup = registerPartGroup(new THREE.Group(), 'dyno', new THREE.Vector3(0, -0.5, 0));
  for (const wx of [1.06, -1.04]) {
    const wheel = new THREE.Group();
    wheel.position.set(wx, 0.37, 0);
    const tire = tagDualMaterial(new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.09, 14, 32)), 0x111827, 0.2, 0.85);
    wheel.add(tire);
    const rim = tagDualMaterial(new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.028, 10, 28)), 0x94a3b8, 0.88, 0.2);
    wheel.add(rim);
    for (let sp = 0; sp < 5; sp += 1) {
      const spoke = tagDualMaterial(new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.44, 0.025)), 0x5b9bd5, 0.82, 0.25);
      spoke.rotation.z = (sp * Math.PI) / 5;
      wheel.add(spoke);
    }
    wheelsGroup.add(wheel);
    wheelsSpinGroups.push(wheel);
  }
  const headlightPod = tagDualMaterial(new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.08, 0.18, 16)), 0x1e293b, 0.75, 0.25);
  headlightPod.rotation.z = Math.PI / 2;
  headlightPod.position.set(0.84, 1.07, 0);
  wheelsGroup.add(headlightPod);

  const headlightLens = tagDualMaterial(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.04, 16)), 0xffffff, 0.2, 0.1, 0xffd180, 1.3);
  headlightLens.rotation.z = Math.PI / 2;
  headlightLens.position.set(0.93, 1.07, 0);
  wheelsGroup.add(headlightLens);

  const seat = tagDualMaterial(new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.14, 0.3)), 0x181c28, 0.25, 0.75);
  seat.rotation.z = 0.09;
  seat.position.set(-0.46, 0.94, 0);
  wheelsGroup.add(seat);
  root.add(wheelsGroup);

  // 7. TANQUE DE COMBUSTIBLE (S27+)
  const tankGroup = registerPartGroup(new THREE.Group(), 'tank', new THREE.Vector3(0.08, 0.6, 0));
  const tankBody = tagDualMaterial(new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.28, 0.38)), 0x5b9bd5, 0.72, 0.22, 0x3ba0ff, 0.18);
  tankBody.rotation.z = -0.16;
  tankBody.position.set(0.18, 1.07, 0);
  tankGroup.add(tankBody);

  const tankStripe = tagDualMaterial(new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.06, 0.4)), 0xff6b1a, 0.55, 0.3, 0xff6b1a, 0.35);
  tankStripe.rotation.z = -0.16;
  tankStripe.position.set(0.18, 1.08, 0);
  tankGroup.add(tankStripe);
  root.add(tankGroup);

  // 8. TABLERO DIGITAL (S30+)
  const dashGroup = registerPartGroup(new THREE.Group(), 'dashboard', new THREE.Vector3(0.4, 0.75, 0));
  const dashHousing = tagDualMaterial(new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.14, 0.24)), 0x0f172a, 0.65, 0.3);
  dashHousing.rotation.z = 0.45;
  dashHousing.position.set(0.68, 1.29, 0);
  dashGroup.add(dashHousing);

  const dashScreen = tagDualMaterial(new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.11, 0.2)), 0x2ee59d, 0.2, 0.2, 0x2ee59d, 0.95);
  dashScreen.rotation.z = 0.45;
  dashScreen.position.set(0.66, 1.3, 0);
  dashGroup.add(dashScreen);
  root.add(dashGroup);

  // 9. ARNÉS ELÉCTRICO (S31+)
  const harnessGroup = registerPartGroup(new THREE.Group(), 'harness', new THREE.Vector3(-0.35, 0.45, -0.35));
  const spineCable = tagDualMaterial(new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.65, 10)), 0x00ffff, 0.3, 0.2, 0x2ee59d, 0.85);
  spineCable.rotation.z = Math.PI / 2 - 0.12;
  spineCable.position.set(0.04, 0.96, 0.16);
  harnessGroup.add(spineCable);

  const tailCable = tagDualMaterial(new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.85, 10)), 0xff6b1a, 0.3, 0.2, 0xff6b1a, 0.8);
  tailCable.rotation.z = Math.PI / 2 + 0.15;
  tailCable.position.set(-0.54, 0.82, -0.15);
  harnessGroup.add(tailCable);
  root.add(harnessGroup);

  // Cono de faro para secuencias dramáticas
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xffc178,
    transparent: true,
    opacity: 0.0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
  const headlightBeam = new THREE.Mesh(new THREE.ConeGeometry(0.95, 3.4, 24, 1, true), beamMat);
  headlightBeam.rotation.z = Math.PI / 2;
  headlightBeam.position.set(2.6, 1.07, 0);
  root.add(headlightBeam);

  const partGroups = [
    chassisGroup,
    engineGroup,
    transGroup,
    handlebarGroup,
    brakesGroup,
    wheelsGroup,
    tankGroup,
    dashGroup,
    harnessGroup,
  ];

  let activeWheelSpeed = 0.0;
  let activeEmissivePulse = 0.0;
  let targetBeamOpacity = 0.03;
  let transitionYaw = 0.0;

  function applyAssemblyState(stage, progress = 0, { immediate = false } = {}) {
    const rank = stageRank(stage);
    const isExploded = stage === 'exploded';
    const isMoving = stage === 'dyno' || stage === 'road';
    activeWheelSpeed = stage === 'road' ? 4.2 : stage === 'dyno' ? 3.2 : 0.0;
    activeEmissivePulse = rank >= stageRank('ignition') ? 1.0 : 0.25;

    for (const pg of partGroups) {
      const reqRank = stageRank(pg.userData.unlockStage);
      const isSolid = rank >= reqRank && !isExploded;
      const wasSolid = Boolean(pg.userData.wasSolid);

      if (isExploded) {
        pg.userData.targetPos.copy(pg.userData.basePos).add(pg.userData.explodeOffset);
      } else {
        pg.userData.targetPos.copy(pg.userData.basePos);
      }

      if (immediate) {
        pg.position.copy(pg.userData.targetPos);
      } else if (!wasSolid && isSolid) {
        // Desliza suavemente el nuevo subsistema hacia su posición final de ensamblaje
        pg.position.copy(pg.userData.basePos).addScaledVector(pg.userData.explodeOffset, 0.55);
      }
      pg.userData.wasSolid = isSolid;

      pg.traverse((node) => {
        if (!node.isMesh || !node.userData.wireMat || !node.userData.solidMat) return;
        if (isSolid) {
          node.material = node.userData.solidMat;
          if (typeof node.userData.baseEmissive === 'number') {
            node.material.emissiveIntensity = node.userData.baseEmissive * (0.65 + progress * 0.65);
          }
        } else {
          node.material = node.userData.wireMat;
          node.material.opacity = isExploded ? 0.82 : 0.42 + progress * 0.25;
        }
      });
    }

    targetBeamOpacity = rank >= stageRank('ignition') || isMoving ? 0.16 : 0.03;
    if (immediate) {
      beamMat.opacity = targetBeamOpacity;
      transitionYaw = 0.0;
    }
  }

  function tick(dt, elapsed) {
    const posBlend = 1 - Math.exp(-5.5 * dt);
    for (const pg of partGroups) {
      if (pg.userData.targetPos) {
        pg.position.lerp(pg.userData.targetPos, posBlend);
      }
    }
    transitionYaw *= Math.exp(-4.5 * dt);

    if (activeWheelSpeed > 0) {
      for (const w of wheelsSpinGroups) {
        w.rotation.z -= dt * activeWheelSpeed;
      }
    }
    for (let i = 0; i < gears.length; i += 1) {
      gears[i].rotation.y += dt * (i % 2 === 0 ? 1.4 : -1.4) * (activeWheelSpeed > 0 ? 1.8 : 0.5);
    }
    keyCylinder.rotation.y = Math.sin(elapsed * 1.3) * 0.35;
    const beamTarget = targetBeamOpacity + Math.max(0, Math.sin(elapsed * 2.4)) * 0.015 * activeEmissivePulse;
    beamMat.opacity += (beamTarget - beamMat.opacity) * (1 - Math.exp(-1.8 * dt));
  }

  return {
    root,
    applyAssemblyState,
    tick,
    pulseTransition(direction = 1) {
      transitionYaw = Math.max(-0.32, Math.min(0.32, direction * 0.22));
    },
    getTransitionYaw() {
      return transitionYaw;
    },
    pulseHeadlight() {
      beamMat.opacity = 0.42;
    },
    destroy() {
      disposeObject3D(root);
    },
  };
}
