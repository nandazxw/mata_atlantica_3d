import * as THREE from 'three';
import { type SuccessionalStageId, STAGE_ELEMENTS, type StageElementData } from '../data/recoveryData';

/**
 * RecoveryScene
 * Cena 3D ultraleve que simula as 4 fases da sucessão ecológica na Mata Atlântica.
 * Otimizada para 4 GB de RAM:
 * - Reutiliza rigorosamente a MESMA malha do terreno
 * - Elementos 3D de cada fase são totalmente clicáveis com Raycaster
 * - Destaque visual (BoxHelper) no elemento clicado
 * - Descarte limpo de memória
 */
export class RecoveryScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animationFrameId: number | null = null;

  public currentStage: SuccessionalStageId = 'fase1';
  public showTechDrone = false;

  private terrainMesh: THREE.Mesh | null = null;
  private riverMesh: THREE.Mesh | null = null;

  private stageGroups: Map<SuccessionalStageId, THREE.Group> = new Map();
  private droneGroup: THREE.Group = new THREE.Group();

  private ambientLight: THREE.AmbientLight | null = null;
  private sunLight: THREE.DirectionalLight | null = null;

  // Destaque visual
  private highlightBox: THREE.BoxHelper | null = null;
  private currentSelectedObject: THREE.Object3D | null = null;

  // Callback de seleção
  private onSelectElementCallback?: (element: StageElementData | null) => void;

  // Controles Orbitais
  private isPointerDown = false;
  private pointerStartX = 0;
  private pointerStartY = 0;
  private totalDragDistance = 0;
  private cameraAngleH = 0.35;
  private cameraAngleV = 0.32;
  private cameraDistance = 22;
  private targetPosition = new THREE.Vector3(0, 1.8, 0);

  // Raycaster
  private raycaster = new THREE.Raycaster();
  private mouseCoords = new THREE.Vector2();
  private activeClickableObjects: THREE.Object3D[] = [];

  // Listeners
  private listeners: { [key: string]: EventListener } = {};

  constructor(
    container: HTMLElement,
    initialStage: SuccessionalStageId = 'fase1',
    onSelect?: (element: StageElementData | null) => void
  ) {
    this.container = container;
    this.currentStage = initialStage;
    this.onSelectElementCallback = onSelect;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a120e);
    this.scene.fog = new THREE.FogExp2(0x1a120e, 0.024);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.2, 100);
    this.updateCameraPosition();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    container.appendChild(this.renderer.domElement);

    // BoxHelper para feedback visual do clique
    const dummy = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1));
    this.highlightBox = new THREE.BoxHelper(dummy, 0x65e6a5);
    this.highlightBox.visible = false;
    this.scene.add(this.highlightBox);

    this.setupLights();
    this.buildBaseTerrainAndRiver();
    this.buildAllStages();
    this.buildTechDrone();

    this.setStage(this.currentStage);
    this.setupControls();
    this.animate(0);
  }

  private setupLights() {
    this.ambientLight = new THREE.AmbientLight(0x52362b, 1.6);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xffaa66, 1.8);
    this.sunLight.position.set(12, 22, 10);
    this.scene.add(this.sunLight);
  }

  private buildBaseTerrainAndRiver() {
    const width = 36;
    const height = 36;
    const segments = 28;
    const terrainGeo = new THREE.PlaneGeometry(width, height, segments, segments);

    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const riverCenter = Math.sin(y * 0.2) * 2.5;
      const distToRiver = Math.abs(x - riverCenter);

      let elevation = 0;
      if (distToRiver < 3.2) {
        elevation = -0.7 + (distToRiver / 3.2) * 0.4;
      } else {
        elevation = Math.sin(x * 0.25) * 0.6 + Math.cos(y * 0.25) * 0.6 + Math.sin(x * 0.5 + y * 0.5) * 0.2;
      }
      pos.setZ(i, elevation);
    }

    terrainGeo.computeVertexNormals();
    terrainGeo.rotateX(-Math.PI / 2);

    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x3d3028,
      roughness: 0.9,
      flatShading: true,
    });

    this.terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    this.scene.add(this.terrainMesh);

    // Rio compartilhado
    const riverGeo = new THREE.PlaneGeometry(5.0, 36, 12, 24);
    riverGeo.rotateX(-Math.PI / 2);
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x2e2920,
      transparent: true,
      opacity: 0.85,
      roughness: 0.3,
    });

    this.riverMesh = new THREE.Mesh(riverGeo, riverMat);
    this.riverMesh.position.set(0, -0.42, 0);
    this.scene.add(this.riverMesh);
  }

  private markClickable(root: THREE.Object3D, data: StageElementData) {
    root.userData = {
      isInteractive: true,
      data: data,
    };
    root.traverse((child) => {
      child.userData = {
        isInteractive: true,
        rootInteractive: root,
        data: data,
      };
    });
  }

  private buildAllStages() {
    const g1 = new THREE.Group();
    this.buildStage1Vegetation(g1);
    this.scene.add(g1);
    this.stageGroups.set('fase1', g1);

    const g2 = new THREE.Group();
    this.buildStage2Vegetation(g2);
    this.scene.add(g2);
    this.stageGroups.set('fase2', g2);

    const g3 = new THREE.Group();
    this.buildStage3Vegetation(g3);
    this.scene.add(g3);
    this.stageGroups.set('fase3', g3);

    const g4 = new THREE.Group();
    this.buildStage4Vegetation(g4);
    this.scene.add(g4);
    this.stageGroups.set('fase4', g4);
  }

  // FASE 1 — ÁREA QUEIMADA: Elementos clicáveis
  private buildStage1Vegetation(group: THREE.Group) {
    const burntMat = new THREE.MeshStandardMaterial({ color: 0x241d19, roughness: 0.95, flatShading: true });
    
    // 1. Tronco em pé
    const trunk1 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.55, 5.0, 5), burntMat);
    trunk1.position.set(-7, 2.2, 4);
    trunk1.rotation.z = 0.08;
    this.markClickable(trunk1, STAGE_ELEMENTS['tronco-calcinado-f1']);
    group.add(trunk1);

    const trunk2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 4.2, 5), burntMat);
    trunk2.position.set(8, 1.8, -4);
    this.markClickable(trunk2, STAGE_ELEMENTS['tronco-calcinado-f1']);
    group.add(trunk2);

    // 2. Tronco caído no chão
    const fallen = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, 4.2, 5), burntMat);
    fallen.position.set(-2.5, 0.2, -1.0);
    fallen.rotation.set(0.1, 0.6, Math.PI / 2);
    this.markClickable(fallen, STAGE_ELEMENTS['tronco-caido-f1']);
    group.add(fallen);

    // 3. Foco de cinzas
    const ash = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.0, 0.08, 6), new THREE.MeshStandardMaterial({ color: 0x2d241f }));
    ash.position.set(-0.5, 0.05, 1.2);
    this.markClickable(ash, STAGE_ELEMENTS['foco-cinzas-f1']);
    group.add(ash);
  }

  // FASE 2 — INÍCIO DA REGENERAÇÃO: Elementos clicáveis
  private buildStage2Vegetation(group: THREE.Group) {
    // 1. Toco em rebrota
    const oldTrunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2f26, roughness: 0.9 });
    const rebrotaGroup = new THREE.Group();
    rebrotaGroup.position.set(-7, 0.2, 4);

    const baseTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.45, 3.0, 5), oldTrunkMat);
    baseTrunk.position.y = 1.5;
    rebrotaGroup.add(baseTrunk);

    // Folhas novas brotando da base
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x65e6a5 });
    for (let i = 0; i < 4; i++) {
      const shoot = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.6, 4), greenMat);
      shoot.position.set(0.35 * Math.cos(i * 1.5), 0.4, 0.35 * Math.sin(i * 1.5));
      shoot.rotation.z = 0.5;
      rebrotaGroup.add(shoot);
    }
    this.markClickable(rebrotaGroup, STAGE_ELEMENTS['rebrota-tronco-f2']);
    group.add(rebrotaGroup);

    // 2. Brotos rasteiros
    const herbMat = new THREE.MeshStandardMaterial({ color: 0x65e6a5, roughness: 0.6, flatShading: true });
    for (let i = 0; i < 28; i++) {
      const x = (Math.random() - 0.5) * 22;
      const z = (Math.random() - 0.5) * 22;
      if (Math.abs(x) < 2.5) continue;

      const sprout = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.7, 4), herbMat);
      sprout.position.set(x, 0.3, z);
      sprout.rotation.y = Math.random() * Math.PI;
      this.markClickable(sprout, STAGE_ELEMENTS['broto-verde-f2']);
      group.add(sprout);
    }

    // 3. Fungos decompositores
    const mushMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });
    [-3, 4, -5].forEach((mx) => {
      const mush = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.05, 0.35, 6), mushMat);
      mush.position.set(mx, 0.2, -2);
      this.markClickable(mush, STAGE_ELEMENTS['fungos-pioneiros-f2']);
      group.add(mush);
    });
  }

  // FASE 3 — FLORESTA EM DESENVOLVIMENTO: Elementos clicáveis
  private buildStage3Vegetation(group: THREE.Group) {
    const pioneerTrunkMat = new THREE.MeshStandardMaterial({ color: 0x4a5d4e, roughness: 0.8 });
    const pioneerLeafMat = new THREE.MeshStandardMaterial({ color: 0x2e8b57, roughness: 0.7, flatShading: true });

    // Árvores pioneiras jovens
    const treeCoords = [
      { x: -6, z: 4, s: 1.0 },
      { x: 7, z: -5, s: 1.1 },
      { x: -4, z: -3, s: 0.9 },
      { x: 5, z: 3, s: 1.0 },
    ];

    treeCoords.forEach((tc) => {
      const t = new THREE.Group();
      t.position.set(tc.x, 0.2, tc.z);
      t.scale.set(tc.s, tc.s, tc.s);

      const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 4.2, 5), pioneerTrunkMat);
      tr.position.y = 2.1;
      t.add(tr);

      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(1.4, 1), pioneerLeafMat);
      crown.position.y = 4.2;
      t.add(crown);

      this.markClickable(t, STAGE_ELEMENTS['arvore-pioneira-f3']);
      group.add(t);
    });

    // Arbustos densos
    const bushMat = new THREE.MeshStandardMaterial({ color: 0x38a169, roughness: 0.85, flatShading: true });
    for (let i = 0; i < 14; i++) {
      const x = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      if (Math.abs(x) < 2.5) continue;

      const bush = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7, 0), bushMat);
      bush.position.set(x, 0.4, z);
      this.markClickable(bush, STAGE_ELEMENTS['arbusto-subbosque-f3']);
      group.add(bush);
    }
  }

  // FASE 4 — FLORESTA MADURA: Elementos clicáveis
  private buildStage4Vegetation(group: THREE.Group) {
    const matureTrunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2719, roughness: 0.9, flatShading: true });
    const matureLeafMat = new THREE.MeshStandardMaterial({ color: 0x1f704b, roughness: 0.8, flatShading: true });

    // Jequitibás e grandes árvores
    const bigTrees = [
      { x: -7, z: 5, s: 1.4 },
      { x: 8, z: -6, s: 1.3 },
      { x: -8, z: -7, s: 1.2 },
      { x: 6, z: 5, s: 1.1 },
    ];

    bigTrees.forEach((bt) => {
      const t = new THREE.Group();
      t.position.set(bt.x, 0.2, bt.z);
      t.scale.set(bt.s, bt.s, bt.s);

      const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.7, 7, 6), matureTrunkMat);
      tr.position.y = 3.5;
      t.add(tr);

      [{ x: 0, y: 7.2, z: 0, r: 2.2 }, { x: 1.1, y: 6.5, z: 0.7, r: 1.6 }, { x: -0.9, y: 6.8, z: -0.6, r: 1.7 }].forEach((c) => {
        const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(c.r, 1), matureLeafMat);
        crown.position.set(c.x, c.y, c.z);
        t.add(crown);
      });

      // Bromélia epífita clicável no tronco
      const bromGroup = new THREE.Group();
      bromGroup.position.set(0.4, 4.0, 0.2);
      const brom = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.85, 3), new THREE.MeshStandardMaterial({ color: 0x48bb78 }));
      brom.rotation.z = 0.8;
      bromGroup.add(brom);
      this.markClickable(bromGroup, STAGE_ELEMENTS['bromelia-epifita-f4']);
      t.add(bromGroup);

      this.markClickable(t, STAGE_ELEMENTS['jequitiba-maduro-f4']);
      group.add(t);
    });

    // Palmeiras-juçara clicáveis
    [-4, 4.5].forEach((px, idx) => {
      const palm = new THREE.Group();
      palm.position.set(px, 0, (idx === 0 ? 2 : -2));
      const pTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 5.5, 5), new THREE.MeshStandardMaterial({ color: 0x5a6358 }));
      pTrunk.position.y = 2.75;
      palm.add(pTrunk);

      const pLeafMat = new THREE.MeshStandardMaterial({ color: 0x22884a, flatShading: true });
      for (let i = 0; i < 6; i++) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.4, 2.2, 4), pLeafMat);
        leaf.position.set(0, 5.8, 0);
        leaf.rotation.set(0, (i / 6) * Math.PI * 2, 0.9);
        palm.add(leaf);
      }

      this.markClickable(palm, STAGE_ELEMENTS['palmeira-jucara-f4']);
      group.add(palm);
    });
  }

  private buildTechDrone() {
    this.droneGroup = new THREE.Group();
    this.droneGroup.position.set(0, 8.5, 0);
    this.droneGroup.visible = false;

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x071a14, metalness: 0.7, roughness: 0.3 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.2, 0.8), bodyMat);
    this.droneGroup.add(body);

    const armMat = new THREE.MeshStandardMaterial({ color: 0x42bfe8 });
    const rotorMat = new THREE.MeshBasicMaterial({ color: 0x65e6a5 });

    [
      { x: 0.6, z: 0.6 },
      { x: -0.6, z: 0.6 },
      { x: 0.6, z: -0.6 },
      { x: -0.6, z: -0.6 },
    ].forEach((p) => {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.8, 4), armMat);
      arm.position.set(p.x * 0.6, 0, p.z * 0.6);
      arm.rotation.y = Math.PI / 4;
      this.droneGroup.add(arm);

      const rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.02, 8), rotorMat);
      rotor.position.set(p.x, 0.12, p.z);
      this.droneGroup.add(rotor);
    });

    const scanCone = new THREE.Mesh(
      new THREE.ConeGeometry(3.5, 8.5, 8, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x42bfe8, transparent: true, opacity: 0.15, wireframe: true })
    );
    scanCone.position.set(0, -4.25, 0);
    this.droneGroup.add(scanCone);

    this.markClickable(this.droneGroup, STAGE_ELEMENTS['bio-drone']);
    this.scene.add(this.droneGroup);
  }

  public setStage(stageId: SuccessionalStageId) {
    this.currentStage = stageId;

    if (this.highlightBox) {
      this.highlightBox.visible = false;
      this.currentSelectedObject = null;
    }
    if (this.onSelectElementCallback) {
      this.onSelectElementCallback(null);
    }

    this.stageGroups.forEach((grp, id) => {
      grp.visible = (id === stageId);
    });

    // Atualiza a lista de objetos clicáveis da fase ativa
    const currentGroup = this.stageGroups.get(stageId);
    this.activeClickableObjects = [];
    if (currentGroup) {
      currentGroup.traverse((child) => {
        if (child.userData?.isInteractive) {
          this.activeClickableObjects.push(child);
        }
      });
    }
    if (this.showTechDrone) {
      this.droneGroup.traverse((child) => {
        if (child.userData?.isInteractive) {
          this.activeClickableObjects.push(child);
        }
      });
    }

    if (stageId === 'fase1') {
      this.scene.background = new THREE.Color(0x1a120e);
      this.scene.fog = new THREE.FogExp2(0x1a120e, 0.024);
      if (this.ambientLight) this.ambientLight.color.setHex(0x52362b);
      if (this.sunLight) this.sunLight.color.setHex(0xffaa66);
      if (this.terrainMesh) (this.terrainMesh.material as THREE.MeshStandardMaterial).color.setHex(0x3d3028);
      if (this.riverMesh) (this.riverMesh.material as THREE.MeshStandardMaterial).color.setHex(0x2e2920);
    } else if (stageId === 'fase2') {
      this.scene.background = new THREE.Color(0x121c15);
      this.scene.fog = new THREE.FogExp2(0x121c15, 0.024);
      if (this.ambientLight) this.ambientLight.color.setHex(0x284732);
      if (this.sunLight) this.sunLight.color.setHex(0xfef08a);
      if (this.terrainMesh) (this.terrainMesh.material as THREE.MeshStandardMaterial).color.setHex(0x34462e);
      if (this.riverMesh) (this.riverMesh.material as THREE.MeshStandardMaterial).color.setHex(0x265a6b);
    } else if (stageId === 'fase3') {
      this.scene.background = new THREE.Color(0x0a1a12);
      this.scene.fog = new THREE.FogExp2(0x0a1a12, 0.025);
      if (this.ambientLight) this.ambientLight.color.setHex(0x1f5c38);
      if (this.sunLight) this.sunLight.color.setHex(0xe6f4ea);
      if (this.terrainMesh) (this.terrainMesh.material as THREE.MeshStandardMaterial).color.setHex(0x234728);
      if (this.riverMesh) (this.riverMesh.material as THREE.MeshStandardMaterial).color.setHex(0x237e96);
    } else if (stageId === 'fase4') {
      this.scene.background = new THREE.Color(0x06140e);
      this.scene.fog = new THREE.FogExp2(0x06140e, 0.026);
      if (this.ambientLight) this.ambientLight.color.setHex(0x19452b);
      if (this.sunLight) this.sunLight.color.setHex(0xdcfce7);
      if (this.terrainMesh) (this.terrainMesh.material as THREE.MeshStandardMaterial).color.setHex(0x173824);
      if (this.riverMesh) (this.riverMesh.material as THREE.MeshStandardMaterial).color.setHex(0x2288aa);
    }
  }

  public setDroneVisible(visible: boolean) {
    this.showTechDrone = visible;
    this.droneGroup.visible = visible;

    if (visible) {
      this.droneGroup.traverse((child) => {
        if (child.userData?.isInteractive) {
          this.activeClickableObjects.push(child);
        }
      });
    } else {
      this.activeClickableObjects = this.activeClickableObjects.filter(
        (obj) => obj.userData?.data?.id !== 'bio-drone'
      );
    }
  }

  private setupControls() {
    const dom = this.renderer.domElement;

    this.listeners.pointerdown = ((e: MouseEvent) => {
      this.isPointerDown = true;
      this.pointerStartX = e.clientX;
      this.pointerStartY = e.clientY;
      this.totalDragDistance = 0;
    }) as EventListener;
    dom.addEventListener('mousedown', this.listeners.pointerdown);

    this.listeners.pointermove = ((e: MouseEvent) => {
      if (!this.isPointerDown) return;
      const deltaX = e.clientX - this.pointerStartX;
      const deltaY = e.clientY - this.pointerStartY;
      this.totalDragDistance += Math.abs(deltaX) + Math.abs(deltaY);

      this.pointerStartX = e.clientX;
      this.pointerStartY = e.clientY;

      this.cameraAngleH -= deltaX * 0.006;
      this.cameraAngleV = Math.max(0.12, Math.min(Math.PI / 2.3, this.cameraAngleV + deltaY * 0.006));

      this.updateCameraPosition();
    }) as EventListener;
    window.addEventListener('mousemove', this.listeners.pointermove);

    this.listeners.pointerup = (() => {
      this.isPointerDown = false;
    }) as EventListener;
    window.addEventListener('mouseup', this.listeners.pointerup);

    this.listeners.wheel = ((e: WheelEvent) => {
      e.preventDefault();
      this.cameraDistance = Math.max(10, Math.min(38, this.cameraDistance + e.deltaY * 0.02));
      this.updateCameraPosition();
    }) as EventListener;
    dom.addEventListener('wheel', this.listeners.wheel, { passive: false });

    // Clique em Elementos 3D das 4 fases
    this.listeners.click = ((e: MouseEvent) => {
      if (this.totalDragDistance > 6) return;

      const rect = dom.getBoundingClientRect();
      this.mouseCoords.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouseCoords.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouseCoords, this.camera);
      const intersects = this.raycaster.intersectObjects(this.activeClickableObjects, true);

      if (intersects.length > 0) {
        let hit: THREE.Object3D | null = intersects[0].object;
        while (hit && !hit.userData?.data) {
          hit = hit.parent;
        }

        if (hit && hit.userData?.data) {
          const elementData = hit.userData.data as StageElementData;
          const rootObj = hit.userData.rootInteractive || hit;

          if (this.highlightBox) {
            this.highlightBox.setFromObject(rootObj);
            this.highlightBox.visible = true;
            this.currentSelectedObject = rootObj;
          }

          if (this.onSelectElementCallback) {
            this.onSelectElementCallback(elementData);
          }
          return;
        }
      }

      if (this.highlightBox) {
        this.highlightBox.visible = false;
        this.currentSelectedObject = null;
      }
      if (this.onSelectElementCallback) {
        this.onSelectElementCallback(null);
      }
    }) as EventListener;
    dom.addEventListener('click', this.listeners.click);

    this.listeners.resize = (() => {
      if (!this.container) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    }) as EventListener;
    window.addEventListener('resize', this.listeners.resize);
  }

  private updateCameraPosition() {
    this.camera.position.x =
      this.targetPosition.x + this.cameraDistance * Math.cos(this.cameraAngleV) * Math.sin(this.cameraAngleH);
    this.camera.position.y =
      this.targetPosition.y + this.cameraDistance * Math.sin(this.cameraAngleV);
    this.camera.position.z =
      this.targetPosition.z + this.cameraDistance * Math.cos(this.cameraAngleV) * Math.cos(this.cameraAngleH);

    this.camera.lookAt(this.targetPosition);
  }

  private animate = (time: number) => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    const seconds = time * 0.001;

    if (this.showTechDrone && this.droneGroup.visible) {
      this.droneGroup.position.x = Math.sin(seconds * 0.8) * 6;
      this.droneGroup.position.z = Math.cos(seconds * 0.8) * 4;
      this.droneGroup.position.y = 8.5 + Math.sin(seconds * 2.0) * 0.2;
    }

    if (this.riverMesh) {
      this.riverMesh.position.y = -0.42 + Math.sin(seconds * 1.2) * 0.015;
    }

    if (this.highlightBox && this.highlightBox.visible && this.currentSelectedObject) {
      this.highlightBox.update();
    }

    this.renderer.render(this.scene, this.camera);
  };

  public destroy() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    const dom = this.renderer.domElement;
    dom.removeEventListener('mousedown', this.listeners.pointerdown);
    window.removeEventListener('mousemove', this.listeners.pointermove);
    window.removeEventListener('mouseup', this.listeners.pointerup);
    dom.removeEventListener('wheel', this.listeners.wheel);
    dom.removeEventListener('click', this.listeners.click);
    window.removeEventListener('resize', this.listeners.resize);

    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        if (obj.geometry) obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m.dispose());
        } else if (obj.material) {
          obj.material.dispose();
        }
      }
    });

    this.renderer.dispose();
    if (dom.parentElement) {
      dom.parentElement.removeChild(dom);
    }
  }
}
