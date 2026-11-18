import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { disposeObject3D } from './motorcycleParts.js';

function makeLabelPill(text, onClick) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'stage-label-pill scene-label';
  btn.textContent = text;
  if (onClick) {
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      onClick();
    });
  }
  const obj = new CSS2DObject(btn);
  return obj;
}

/**
 * Crea utilería 3D y etiquetas interactivas CSS2D específicas por escena.
 * Al cambiar de diapositiva se destruyen/limpian los props y nodos DOM previos.
 */
export function buildChapterPropGroup(slide, appState, stageApi) {
  const group = new THREE.Group();
  group.name = `prop_${slide.id}`;

  const key = slide.sceneKey || slide.id;
  const labels = [];
  let updater = null;

  const addLabel = (text, pos, onClick) => {
    const obj = makeLabelPill(text, onClick);
    obj.position.set(pos[0], pos[1], pos[2]);
    group.add(obj);
    labels.push(obj);
    return obj;
  };

  if (key.includes('S00')) {
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x3ba0ff,
      emissive: 0x3ba0ff,
      emissiveIntensity: 0.55,
      metalness: 0.7,
      roughness: 0.25,
    });
    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(2.1, 0.03, 12, 64), ringMat);
    outerRing.rotation.x = Math.PI / 2;
    outerRing.position.y = 0.04;
    group.add(outerRing);

    const keyGroup = new THREE.Group();
    keyGroup.position.set(1.55, 1.55, 0.4);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, emissive: 0xff6b1a, emissiveIntensity: 0.35, metalness: 0.9, roughness: 0.2 });
    const head = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.04, 10, 24), goldMat);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.07, 0.03), goldMat);
    blade.position.x = 0.35;
    keyGroup.add(head, blade);
    group.add(keyGroup);

    updater = (elapsed) => {
      keyGroup.rotation.y = elapsed * 0.9;
      keyGroup.position.y = 1.55 + Math.sin(elapsed * 2) * 0.08;
      outerRing.rotation.z = elapsed * 0.25;
    };
  } else if (key.includes('S01')) {
    const actColors = [0x3ba0ff, 0x5b9bd5, 0xff6b1a, 0x2ee59d];
    for (let i = 0; i < 4; i += 1) {
      const seg = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 0.06, 0.55),
        new THREE.MeshStandardMaterial({ color: actColors[i], emissive: actColors[i], emissiveIntensity: 0.3, roughness: 0.35 })
      );
      seg.position.set(-2.1 + i * 1.4, 0.04, 1.15);
      group.add(seg);
    }
    for (let m = 0; m < 20; m += 1) {
      const c = actColors[Math.min(3, Math.floor(m / 5))];
      const post = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.28, 8),
        new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.5 })
      );
      post.position.set(-2.65 + m * 0.28, 0.2, 1.15);
      group.add(post);
    }
  } else if (key.includes('S06') || key.includes('S07')) {
    const tables = ['Categorías', 'Proveedores', 'Clientes', 'Empleados', 'Productos', 'Facturas', 'Detalle_Facturas', 'Compras_Proveedores'];
    const blocks = [];
    for (let i = 0; i < tables.length; i += 1) {
      const angle = (i / tables.length) * Math.PI * 2;
      const r = 1.95;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const mat = new THREE.MeshStandardMaterial({
        color: i === 4 || i === 5 ? 0xff6b1a : 0x3ba0ff,
        emissive: i === 4 || i === 5 ? 0xff6b1a : 0x1d4ed8,
        emissiveIntensity: 0.38,
        metalness: 0.55,
        roughness: 0.3,
      });
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.34, 16), mat);
      cyl.position.set(x, 0.19, z);
      group.add(cyl);
      blocks.push(cyl);

      if (key.includes('S06') && (i === 4 || i === 5 || i === 0 || i === 6)) {
        addLabel(tables[i], [x, 0.56, z], () => {
          stageApi?.inspectElement?.('db-table', tables[i]);
        });
      }
    }
    if (key.includes('S07')) {
      const boltMat = new THREE.MeshBasicMaterial({ color: 0xff6b1a, transparent: true, opacity: 0.85 });
      const bolt = new THREE.Mesh(new THREE.OctahedronGeometry(0.24, 0), boltMat);
      bolt.position.set(0, 1.8, 0);
      bolt.name = 'trigger_status_orb';
      group.add(bolt);
      updater = (elapsed) => {
        bolt.rotation.y = elapsed * 2.1;
        bolt.position.y = 1.78 + Math.sin(elapsed * 3.2) * 0.08;
      };
    } else {
      updater = (elapsed) => {
        for (let i = 0; i < blocks.length; i += 1) {
          blocks[i].position.y = 0.2 + Math.sin(elapsed * 1.8 + i) * 0.05;
        }
      };
    }
  } else if (key.includes('S15')) {
    const models = [
      { id: 'M-UC-01', page: 186, pos: [-1.8, 1.55, 0.9] },
      { id: 'M-SEQ-01', page: 191, pos: [1.75, 1.6, 0.8] },
      { id: 'M-DEP-01', page: 193, pos: [0.1, 1.95, -0.7] },
    ];
    for (const m of models) {
      const pane = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.42, 0.03),
        new THREE.MeshStandardMaterial({ color: 0x3ba0ff, emissive: 0x3ba0ff, emissiveIntensity: 0.35, transparent: true, opacity: 0.72 })
      );
      pane.position.set(...m.pos);
      group.add(pane);
      addLabel(m.id, [m.pos[0], m.pos[1] + 0.35, m.pos[2]], () => {
        appState.openDocumento(m.page, m.id);
      });
    }
  } else if (key.includes('S18')) {
    const shieldMat = new THREE.MeshStandardMaterial({
      color: 0x3ba0ff,
      emissive: 0x2ee59d,
      emissiveIntensity: 0.25,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
    });
    const dome = new THREE.Mesh(new THREE.IcosahedronGeometry(1.75, 1), shieldMat);
    dome.position.set(0, 0.8, 0);
    group.add(dome);
    addLabel('RBAC HTTP 403 · 30 min', [1.45, 1.35, 0.6], () => {
      appState.openDocumento(226, 'Análisis de amenazas y controles');
    });
    updater = (elapsed) => {
      dome.rotation.y = elapsed * 0.25;
    };
  } else if (key.includes('S19') || key.includes('S20')) {
    const rollers = [];
    for (const rx of [-1.04, 1.06]) {
      const roller = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 0.85, 18),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.85, roughness: 0.2, emissive: 0xff6b1a, emissiveIntensity: 0.18 })
      );
      roller.rotation.x = Math.PI / 2;
      roller.position.set(rx, 0.04, 0);
      group.add(roller);
      rollers.push(roller);
    }
    const dynoGlow = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.04, 12, 60),
      new THREE.MeshBasicMaterial({ color: key.includes('S20') ? 0xff6b1a : 0x00ffff, transparent: true, opacity: 0.65 })
    );
    dynoGlow.rotation.x = Math.PI / 2;
    dynoGlow.position.y = 0.03;
    group.add(dynoGlow);

    updater = (elapsed) => {
      for (const r of rollers) {
        r.rotation.y = elapsed * 5.0;
      }
      dynoGlow.rotation.z = elapsed * 0.4;
    };
  } else if (key.includes('S21')) {
    const vlans = [
      { id: 'VLAN 10 Servidores · 10.20.10.0/24', short: 'SRV1 · VLAN 10', color: 0x2ee59d, r: 0.85, labelPos: [0.7, 0.55, 0.7] },
      { id: 'VLAN 20 POS · 10.20.20.0/24', short: 'POS01–04 · VLAN 20', color: 0x3ba0ff, r: 1.5, labelPos: [-1.3, 0.55, 1.0] },
      { id: 'VLAN 99 Gestión', short: 'SW1 · VLAN 99', color: 0xf59e0b, r: 2.15, labelPos: [1.5, 0.55, -0.9] },
    ];
    for (const v of vlans) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(v.r, 0.032, 10, 48),
        new THREE.MeshBasicMaterial({ color: v.color, transparent: true, opacity: 0.75 })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.03;
      group.add(ring);
      addLabel(v.short, v.labelPos, () => {
        stageApi?.inspectElement?.('vlan', v.id);
      });
    }
  } else if (key.includes('S23') || key.includes('S24')) {
    const rack = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 1.2, 0.55),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.75, roughness: 0.3, emissive: 0xf59e0b, emissiveIntensity: 0.16 })
    );
    rack.position.set(-1.75, 0.62, -0.8);
    group.add(rack);
    const copyColors = [0x3ba0ff, 0x2ee59d, 0xff6b1a];
    for (let c = 0; c < 3; c += 1) {
      const cube = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.28, 0.28),
        new THREE.MeshStandardMaterial({ color: copyColors[c], emissive: copyColors[c], emissiveIntensity: 0.35 })
      );
      cube.position.set(1.55 + c * 0.42, 0.22 + c * 0.12, 0.85);
      group.add(cube);
    }
  } else if (key.includes('S25')) {
    const queueSpheres = [];
    for (let s = 0; s < 8; s += 1) {
      const sp = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 14, 14),
        new THREE.MeshStandardMaterial({ color: s < 4 ? 0xf59e0b : 0x2ee59d, emissive: 0xff6b1a, emissiveIntensity: 0.35 })
      );
      sp.position.set(1.5 + (s % 4) * 0.28, 0.25, s < 4 ? 0.6 : -0.6);
      sp.userData.baseX = sp.position.x;
      group.add(sp);
      queueSpheres.push(sp);
    }
    updater = (elapsed) => {
      for (let i = 0; i < queueSpheres.length; i += 1) {
        queueSpheres[i].position.x = queueSpheres[i].userData.baseX + Math.sin(elapsed * 2.2 + i * 0.7) * 0.12;
      }
    };
  } else if (key.includes('S27') || key.includes('S28')) {
    const pillars = [
      { x: 1.5, h: 0.55, color: 0xf59e0b },
      { x: 1.85, h: 1.05, color: 0x3ba0ff },
      { x: 2.2, h: 1.48, color: 0x2ee59d },
    ];
    for (const p of pillars) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, p.h, 0.24),
        new THREE.MeshStandardMaterial({ color: p.color, emissive: p.color, emissiveIntensity: 0.35 })
      );
      bar.position.set(p.x, p.h / 2 + 0.04, 0.65);
      group.add(bar);
    }
  } else if (key.includes('S30') || key.includes('S31')) {
    const fanCards = [];
    for (let i = 0; i < 9; i += 1) {
      const card = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.36, 0.02),
        new THREE.MeshStandardMaterial({ color: 0x2ee59d, emissive: 0x2ee59d, emissiveIntensity: 0.32, transparent: true, opacity: 0.78 })
      );
      const ang = -0.7 + i * 0.18;
      card.position.set(Math.sin(ang) * 1.45, 1.55 + Math.cos(ang) * 0.25, -0.7);
      card.rotation.y = ang * 0.4;
      group.add(card);
      fanCards.push(card);
    }
    updater = (elapsed) => {
      for (let i = 0; i < fanCards.length; i += 1) {
        fanCards[i].position.y = 1.55 + Math.sin(elapsed * 1.6 + i * 0.4) * 0.06;
      }
    };
  } else if (key.includes('S33')) {
    const seal = new THREE.Mesh(
      new THREE.CylinderGeometry(0.58, 0.58, 0.08, 32),
      new THREE.MeshStandardMaterial({ color: 0xf1c40f, emissive: 0xff6b1a, emissiveIntensity: 0.4, metalness: 0.85, roughness: 0.2 })
    );
    seal.rotation.z = Math.PI / 2;
    seal.position.set(1.65, 1.35, 0.3);
    group.add(seal);
    updater = (elapsed) => {
      seal.rotation.x = elapsed * 0.7;
    };
  } else if (key.includes('S34')) {
    const road = new THREE.Mesh(
      new THREE.PlaneGeometry(16, 2.4),
      new THREE.MeshStandardMaterial({ color: 0x1b2234, roughness: 0.85, metalness: 0.15 })
    );
    road.rotation.x = -Math.PI / 2;
    road.position.y = 0.01;
    group.add(road);

    const dashes = [];
    for (let d = -6; d <= 6; d += 1.5) {
      const dash = new THREE.Mesh(
        new THREE.PlaneGeometry(0.7, 0.1),
        new THREE.MeshBasicMaterial({ color: 0xf1c40f })
      );
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(d, 0.02, 0);
      group.add(dash);
      dashes.push(dash);
    }

    const horizon = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 5),
      new THREE.MeshBasicMaterial({ color: 0xff6b1a, transparent: true, opacity: 0.28, side: THREE.DoubleSide })
    );
    horizon.position.set(5, 2.6, -7.5);
    group.add(horizon);

    updater = (_elapsed, dt) => {
      for (const dash of dashes) {
        dash.position.x -= dt * 4.5;
        if (dash.position.x < -7.5) dash.position.x += 15;
      }
    };
  }

  return {
    group,
    labels,
    update(elapsed, dt) {
      if (updater) updater(elapsed, dt);
    },
    destroy() {
      for (const l of labels) {
        l.element?.remove?.();
      }
      disposeObject3D(group);
    },
  };
}
