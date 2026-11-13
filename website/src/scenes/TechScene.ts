import * as THREE from 'three';
import { type TechSectionId } from '../data/techData';

/**
 * TechScene
 * Centro de Comando 3D Futurista com 5 representações visuais tecnológicas:
 * 1. Satélite Orbital com feixe multiespectral escaneando a floresta
 * 2. Bio-Drone ambiental Low-Poly com rotores móveis e semeadura
 * 3. Rede Neural de IA com nós holográficos interligados
 * 4. Mapa de Telemetria com camadas ativáveis
 * 5. Viveiro & Área de Restauração inteligente com sensores IoT
 * 
 * Otimizada para 4 GB de RAM (geometrias leves, sem simulações de partículas pesadas)
 */
export class TechScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animationFrameId: number | null = null;

  public currentSection: TechSectionId = 'satelites';

  // Grupos visuais por tecnologia
  private groups: Map<TechSectionId, THREE.Group> = new Map();

  // Elementos animados móveis
  private satelliteMesh: THREE.Group = new THREE.Group();
  private droneMesh: THREE.Group = new THREE.Group();
  private scanBeam: THREE.Mesh | null = null;
  private aiNetworkGroup: THREE.Group = new THREE.Group();
  private layerMeshes: { id: string; mesh: THREE.Mesh }[] = [];

  // Luzes
  private ambientLight: THREE.AmbientLight | null = null;
  private dirLight: THREE.DirectionalLight | null = null;

  // Controles Orbitais
  private isPointerDown = false;
  private pointerStartX = 0;
  private pointerStartY = 0;
  private totalDragDistance = 0;
  private cameraAngleH = 0.2;
  private cameraAngleV = 0.35;
  private cameraDistance = 24;
  private targetPosition = new THREE.Vector3(0, 1.5, 0);

  // Listeners
  private listeners: { [key: string]: EventListener } = {};

  constructor(container: HTMLElement, initialSection: TechSectionId = 'satelites') {
    this.container = container;
    this.currentSection = initialSection;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050e09);
    this.scene.fog = new THREE.FogExp2(0x050e09, 0.022);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.2, 100);
    this.updateCameraPosition();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    container.appendChild(this.renderer.domElement);

    this.setupLights();

    // Grade holográfica de laboratório
    const grid = new THREE.GridHelper(30, 24, 0x00ff88, 0x0d381e);
    grid.position.y = -2.0;
    this.scene.add(grid);

    // Constrói os 5 modelos tridimensionais
    this.buildSatelliteVisual();
    this.buildDroneVisual();
    this.buildAIVisual();
    this.buildAlertsMapVisual();
    this.buildRestorationVisual();

    this.setSection(this.currentSection);
    this.setupControls();
    this.animate(0);
  }

  private setupLights() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xdcfce7, 1.8);
    this.dirLight.position.set(12, 22, 15);
    this.scene.add(this.dirLight);

    const cyanLight = new THREE.DirectionalLight(0x42bfe8, 0.8);
    cyanLight.position.set(-10, 8, -10);
    this.scene.add(cyanLight);
  }

  // 1. VISUAL DO SATÉLITE ORBITAL & FEIXE MULTIESPECTRAL
  private buildSatelliteVisual() {
    const group = new THREE.Group();

    // Corpo cúbico metálico do satélite
    this.satelliteMesh = new THREE.Group();
    this.satelliteMesh.position.set(0, 7.5, 0);

    const satBodyMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 });
    const satBody = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 1.2), satBodyMat);
    this.satelliteMesh.add(satBody);

    // Antena parabólica voltada para a Terra
    const dish = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.3, 12, 1, true), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.6 }));
    dish.position.set(0, -0.75, 0);
    this.satelliteMesh.add(dish);

    // Painéis solares fotovoltaicos com células azuis
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.2, metalness: 0.5 });
    const armMat = new THREE.MeshStandardMaterial({ color: 0x334155 });

    // Painel esquerdo
    const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 6), armMat);
    armL.rotation.z = Math.PI / 2;
    armL.position.set(-1.4, 0, 0);
    this.satelliteMesh.add(armL);
    const panelL = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 0.06), panelMat);
    panelL.position.set(-2.6, 0, 0);
    this.satelliteMesh.add(panelL);

    // Painel direito
    const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.4, 6), armMat);
    armR.rotation.z = Math.PI / 2;
    armR.position.set(1.4, 0, 0);
    this.satelliteMesh.add(armR);
    const panelR = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 0.06), panelMat);
    panelR.position.set(2.6, 0, 0);
    this.satelliteMesh.add(panelR);

    group.add(this.satelliteMesh);

    // Feixe cônico de varredura multiespectral holográfico
    this.scanBeam = new THREE.Mesh(
      new THREE.ConeGeometry(5.5, 9.5, 12, 1, true),
      new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.16, wireframe: true })
    );
    this.scanBeam.position.set(0, 2.75, 0);
    group.add(this.scanBeam);

    // Relevo da floresta sendo escaneado abaixo
    const terrainGeo = new THREE.PlaneGeometry(16, 16, 16, 16);
    terrainGeo.rotateX(-Math.PI / 2);
    const pos = terrainGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.4) * 0.5 + Math.cos(y * 0.4) * 0.5);
    }
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({ color: 0x1f704b, roughness: 0.8, flatShading: true });
    const terrain = new THREE.Mesh(terrainGeo, terrainMat);
    terrain.position.set(0, -1.9, 0);
    group.add(terrain);

    this.scene.add(group);
    this.groups.set('satelites', group);
  }

  // 2. VISUAL DO BIO-DRONE DE RESTAURAÇÃO
  private buildDroneVisual() {
    const group = new THREE.Group();

    this.droneMesh = new THREE.Group();
    this.droneMesh.position.set(0, 2.5, 0);

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0f2d1e, roughness: 0.4, metalness: 0.6 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.35, 1.4), bodyMat);
    this.droneMesh.add(body);

    // Lâmpada de navegação esmeralda
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), new THREE.MeshBasicMaterial({ color: 0x00ff88 }));
    lamp.position.set(0, 0.2, 0.6);
    this.droneMesh.add(lamp);

    // 4 braços e rotores
    const rotorMat = new THREE.MeshBasicMaterial({ color: 0x42bfe8 });
    [
      { x: 1.2, z: 1.0 },
      { x: -1.2, z: 1.0 },
      { x: 1.2, z: -1.0 },
      { x: -1.2, z: -1.0 },
    ].forEach((p) => {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 4), bodyMat);
      arm.position.set(p.x * 0.5, 0, p.z * 0.5);
      arm.rotation.y = Math.PI / 4;
      this.droneMesh.add(arm);

      const r = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 0.03, 10), rotorMat);
      r.position.set(p.x, 0.18, p.z);
      this.droneMesh.add(r);
    });

    // Compartimento inferior de cápsulas de sementes (muvuca)
    const dispenser = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.6, 6), new THREE.MeshStandardMaterial({ color: 0x334155 }));
    dispenser.rotation.x = Math.PI;
    dispenser.position.set(0, -0.4, 0);
    this.droneMesh.add(dispenser);

    group.add(this.droneMesh);

    // Encosta íngreme abaixo recebendo as sementes
    const slopeGeo = new THREE.PlaneGeometry(16, 12, 10, 10);
    slopeGeo.rotateX(-Math.PI / 2.5);
    const slopeMat = new THREE.MeshStandardMaterial({ color: 0x2d5a27, roughness: 0.9, flatShading: true });
    const slope = new THREE.Mesh(slopeGeo, slopeMat);
    slope.position.set(0, -1.8, -1);
    group.add(slope);

    this.scene.add(group);
    this.groups.set('drones', group);
  }

  // 3. VISUAL DA INTELIGÊNCIA ARTIFICIAL (REDE NEURAL DE CONSERVAÇÃO)
  private buildAIVisual() {
    const group = new THREE.Group();
    this.aiNetworkGroup = new THREE.Group();

    const nodeCoords: THREE.Vector3[] = [
      new THREE.Vector3(-4.5, 3.5, 0),
      new THREE.Vector3(-4.5, 0.5, 1),
      new THREE.Vector3(-4.5, -2.5, 0),
      new THREE.Vector3(0.0, 4.0, -1),
      new THREE.Vector3(0.0, 1.5, 1.5),
      new THREE.Vector3(0.0, -1.0, -1),
      new THREE.Vector3(4.5, 3.0, 0),
      new THREE.Vector3(4.5, 0.0, 1),
      new THREE.Vector3(4.5, -3.0, 0),
    ];

    const nodeMat = new THREE.MeshStandardMaterial({ color: 0x00ff88, metalness: 0.5, roughness: 0.2 });
    nodeCoords.forEach((nc) => {
      const node = new THREE.Mesh(new THREE.IcosahedronGeometry(0.5, 1), nodeMat);
      node.position.copy(nc);
      this.aiNetworkGroup.add(node);
    });

    // Conexões sinápticas entre camadas da rede neural
    const lineMat = new THREE.LineBasicMaterial({ color: 0x42bfe8, transparent: true, opacity: 0.45 });
    for (let i = 0; i < 3; i++) {
      for (let j = 3; j < 6; j++) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([nodeCoords[i], nodeCoords[j]]);
        this.aiNetworkGroup.add(new THREE.Line(lineGeo, lineMat));
      }
    }
    for (let i = 3; i < 6; i++) {
      for (let j = 6; j < 9; j++) {
        const lineGeo = new THREE.BufferGeometry().setFromPoints([nodeCoords[i], nodeCoords[j]]);
        this.aiNetworkGroup.add(new THREE.Line(lineGeo, lineMat));
      }
    }

    group.add(this.aiNetworkGroup);
    this.scene.add(group);
    this.groups.set('ia', group);
  }

  // 4. VISUAL DO MAPA DE ALERTAS & CAMADAS
  private buildAlertsMapVisual() {
    const group = new THREE.Group();

    // Base cartográfica holográfica
    const basePlate = new THREE.Mesh(
      new THREE.BoxGeometry(14, 0.4, 14),
      new THREE.MeshStandardMaterial({ color: 0x071a14, roughness: 0.3 })
    );
    basePlate.position.set(0, -1.5, 0);
    group.add(basePlate);

    // Camada 1: Vegetação Nativa (Polígonos verdes)
    const vegMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(4.5, 4.8, 0.15, 8),
      new THREE.MeshStandardMaterial({ color: 0x65e6a5, roughness: 0.5 })
    );
    vegMesh.position.set(-1.5, -1.2, -1.0);
    group.add(vegMesh);
    this.layerMeshes.push({ id: 'vegetacao', mesh: vegMesh });

    // Camada 2: Cicatrizes de Queimadas (Polígonos laranja)
    const fireMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(1.6, 1.8, 0.18, 6),
      new THREE.MeshStandardMaterial({ color: 0xff713d, roughness: 0.7 })
    );
    fireMesh.position.set(2.2, -1.18, 1.8);
    group.add(fireMesh);
    this.layerMeshes.push({ id: 'queimadas', mesh: fireMesh });

    // Camada 3: Rios e Matas ciliares (Faixa azul)
    const riverMesh = new THREE.Mesh(
      new THREE.BoxGeometry(13, 0.2, 1.2),
      new THREE.MeshStandardMaterial({ color: 0x42bfe8, roughness: 0.2 })
    );
    riverMesh.position.set(0, -1.15, 0.2);
    riverMesh.rotation.y = 0.4;
    group.add(riverMesh);
    this.layerMeshes.push({ id: 'hidrografia', mesh: riverMesh });

    // Camada 4: Corredores Ecológicos (Linha dourada tracejada)
    const corridorMesh = new THREE.Mesh(
      new THREE.BoxGeometry(9, 0.22, 0.5),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.4 })
    );
    corridorMesh.position.set(0.5, -1.13, -2.5);
    corridorMesh.rotation.y = -0.3;
    corridorMesh.visible = false;
    group.add(corridorMesh);
    this.layerMeshes.push({ id: 'corredores', mesh: corridorMesh });

    // Marcador de Alerta de Fogo flutuante
    const alertPin = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.0, 4), new THREE.MeshBasicMaterial({ color: 0xff3300 }));
    alertPin.rotation.x = Math.PI;
    alertPin.position.set(2.2, 0.8, 1.8);
    group.add(alertPin);

    this.scene.add(group);
    this.groups.set('alertas', group);
  }

  // 5. VISUAL DA RESTAURAÇÃO INTELIGENTE & SENSORES IoT
  private buildRestorationVisual() {
    const group = new THREE.Group();

    // Solo restaurado
    const ground = new THREE.Mesh(
      new THREE.CylinderGeometry(8, 8.5, 0.5, 16),
      new THREE.MeshStandardMaterial({ color: 0x22442a, roughness: 0.9 })
    );
    ground.position.set(0, -1.8, 0);
    group.add(ground);

    // Mudas jovens de árvores nativas com anéis de telemetria
    const seedlingCoords = [
      { x: -3.5, z: 2.0 },
      { x: 3.5, z: -2.0 },
      { x: 0.0, z: -3.5 },
      { x: -2.5, z: -2.0 },
      { x: 2.5, z: 2.5 },
    ];

    const stemMat = new THREE.MeshStandardMaterial({ color: 0x4a5d4e });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x65e6a5, flatShading: true });
    const iotRingMat = new THREE.MeshBasicMaterial({ color: 0x42bfe8, side: THREE.DoubleSide });

    seedlingCoords.forEach((sc) => {
      const plant = new THREE.Group();
      plant.position.set(sc.x, -1.5, sc.z);

      // Caule
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.6, 5), stemMat);
      stem.position.y = 0.8;
      plant.add(stem);

      // Folhas
      for (let i = 0; i < 4; i++) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.8, 3), leafMat);
        leaf.position.set(0, 1.4, 0);
        leaf.rotation.set(0.5, (i / 4) * Math.PI * 2, 0);
        plant.add(leaf);
      }

      // Anel sensor IoT no solo na base da muda
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.5, 12), iotRingMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.02;
      plant.add(ring);

      group.add(plant);
    });

    this.scene.add(group);
    this.groups.set('restauracao', group);
  }

  public setSection(sectionId: TechSectionId) {
    this.currentSection = sectionId;

    this.groups.forEach((grp, id) => {
      grp.visible = (id === sectionId);
    });
  }

  public toggleLayer(layerId: string, active: boolean) {
    const item = this.layerMeshes.find((l) => l.id === layerId);
    if (item) {
      item.mesh.visible = active;
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
      this.cameraAngleV = Math.max(0.08, Math.min(Math.PI / 2.2, this.cameraAngleV + deltaY * 0.006));

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

    // Rotação orbital do satélite
    if (this.currentSection === 'satelites') {
      this.satelliteMesh.rotation.y = seconds * 0.2;
      if (this.scanBeam) {
        this.scanBeam.rotation.y = -seconds * 0.4;
      }
    }

    // Voo e ondulação suave do drone
    if (this.currentSection === 'drones') {
      this.droneMesh.position.x = Math.sin(seconds * 1.0) * 3.5;
      this.droneMesh.position.z = Math.cos(seconds * 1.0) * 2.0;
      this.droneMesh.position.y = 2.5 + Math.sin(seconds * 2.5) * 0.15;
      this.droneMesh.rotation.z = Math.cos(seconds * 1.0) * 0.08;
    }

    // Pulso e rotação dos nós da rede neural
    if (this.currentSection === 'ia') {
      this.aiNetworkGroup.rotation.y = Math.sin(seconds * 0.6) * 0.25;
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
    window.removeEventListener('resize', this.listeners.resize);

    this.scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.LineSegments) {
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
