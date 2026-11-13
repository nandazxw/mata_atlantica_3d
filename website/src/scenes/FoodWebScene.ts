import * as THREE from 'three';
import { FOOD_WEB_ORGANISMS, type FoodWebOrganism } from '../data/foodWebData';

export type DisplayMode = 'chain' | 'web';

interface OrganismNode3D {
  id: string;
  data: FoodWebOrganism;
  meshGroup: THREE.Group;
  chainPosition: THREE.Vector3;
  webPosition: THREE.Vector3;
  currentPosition: THREE.Vector3;
}

interface ConnectionArrow {
  fromId: string;
  toId: string;
  line: THREE.Line;
  arrowHead: THREE.Mesh;
  isDecomposerLink: boolean;
}

/**
 * FoodWebScene
 * Modelo 3D Holográfico com pedestais tróficos coloridos, setas pulsantes e grid científico.
 */
export class FoodWebScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animationFrameId: number | null = null;

  public displayMode: DisplayMode = 'chain';
  public isFireSimulated = false;

  private nodes: Map<string, OrganismNode3D> = new Map();
  private connections: ConnectionArrow[] = [];
  private clickableMeshes: THREE.Object3D[] = [];

  public selectedOrganismId: string | null = null;
  private onSelectCallback?: (org: FoodWebOrganism | null) => void;

  // Controles de Câmera Orbitais
  private isPointerDown = false;
  private pointerStartX = 0;
  private pointerStartY = 0;
  private totalDragDistance = 0;
  private cameraAngleH = 0.0;
  private cameraAngleV = 0.35;
  private cameraDistance = 24;
  private targetPosition = new THREE.Vector3(0, 1.5, 0);

  // Raycaster
  private raycaster = new THREE.Raycaster();
  private mouseCoords = new THREE.Vector2();

  // Listeners
  private listeners: { [key: string]: EventListener } = {};

  constructor(
    container: HTMLElement,
    initialDisplayMode: DisplayMode = 'chain',
    onSelect?: (org: FoodWebOrganism | null) => void
  ) {
    this.container = container;
    this.displayMode = initialDisplayMode;
    this.onSelectCallback = onSelect;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x06140e);
    this.scene.fog = new THREE.FogExp2(0x06140e, 0.022);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.2, 100);
    this.updateCameraPosition();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    container.appendChild(this.renderer.domElement);

    this.setupLights();

    // Grid Científico Futurista
    const grid = new THREE.GridHelper(30, 20, 0x65e6a5, 0x173824);
    grid.position.y = -1.8;
    this.scene.add(grid);

    this.buildOrganismNodes();
    this.buildConnections();
    this.applyPositions(this.displayMode);

    this.setupControls();
    this.animate(0);
  }

  private setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xdcfce7, 1.8);
    dirLight.position.set(10, 20, 15);
    this.scene.add(dirLight);

    const blueLight = new THREE.DirectionalLight(0x42bfe8, 0.8);
    blueLight.position.set(-10, 10, -10);
    this.scene.add(blueLight);
  }

  private buildOrganismNodes() {
    const organismsList = Object.values(FOOD_WEB_ORGANISMS);

    const chainCoords: Record<string, THREE.Vector3> = {
      'embauba': new THREE.Vector3(-8.5, 0.8, 0),
      'palmeira-frutos': new THREE.Vector3(-8.5, 3.8, 0),
      'lagarta': new THREE.Vector3(-4.5, 0.8, 0),
      'mico-leao': new THREE.Vector3(-4.5, 3.8, 0),
      'ave-surucua': new THREE.Vector3(0.0, 1.8, 0),
      'jararaca': new THREE.Vector3(4.5, 0.8, 0),
      'gaviao': new THREE.Vector3(8.5, 2.2, 0),
      'fungos-decompositores': new THREE.Vector3(0.0, -1.2, 0),
    };

    const webCoords: Record<string, THREE.Vector3> = {
      'embauba': new THREE.Vector3(-7.5, -0.5, 2),
      'palmeira-frutos': new THREE.Vector3(-6.5, 3.2, -2),
      'lagarta': new THREE.Vector3(-2.8, -1.0, 3),
      'mico-leao': new THREE.Vector3(-2.0, 2.8, -1),
      'ave-surucua': new THREE.Vector3(1.5, 1.5, 2.5),
      'jararaca': new THREE.Vector3(3.5, -0.8, -2),
      'gaviao': new THREE.Vector3(7.0, 2.5, 0.5),
      'fungos-decompositores': new THREE.Vector3(0.0, -1.5, -3.5),
    };

    organismsList.forEach((data) => {
      const group = new THREE.Group();

      // Base / Pedestal com a cor do nível trófico
      const baseGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.15, 16);
      const baseMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(data.levelColor),
        roughness: 0.4,
        metalness: 0.3,
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = -0.5;
      group.add(base);

      // Anel holográfico sutil
      const ringGeo = new THREE.RingGeometry(1.05, 1.15, 16);
      ringGeo.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(data.levelColor),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.y = -0.48;
      group.add(ring);

      // Modelo 3D Low-Poly
      const model = this.createOrganismMesh(data.id);
      group.add(model);

      group.userData = {
        isInteractive: true,
        organismId: data.id,
        data: data,
        baseMesh: base,
        ringMesh: ring,
      };
      group.traverse((child) => {
        child.userData = group.userData;
      });

      this.scene.add(group);
      this.clickableMeshes.push(group);

      const chainPos = chainCoords[data.id] || new THREE.Vector3(0, 0, 0);
      const webPos = webCoords[data.id] || new THREE.Vector3(0, 0, 0);

      const node: OrganismNode3D = {
        id: data.id,
        data: data,
        meshGroup: group,
        chainPosition: chainPos,
        webPosition: webPos,
        currentPosition: chainPos.clone(),
      };

      group.position.copy(chainPos);
      this.nodes.set(data.id, node);
    });
  }

  private createOrganismMesh(id: string): THREE.Object3D {
    const group = new THREE.Group();

    if (id === 'embauba') {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.4, 5), new THREE.MeshStandardMaterial({ color: 0x4a5d4e }));
      trunk.position.y = 0.2;
      group.add(trunk);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x2e8b57, flatShading: true });
      for (let i = 0; i < 5; i++) {
        const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.0, 3), leafMat);
        leaf.position.set(0, 0.8, 0);
        leaf.rotation.set(0.6, (i / 5) * Math.PI * 2, 0);
        group.add(leaf);
      }
    } else if (id === 'palmeira-frutos') {
      const cluster = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 0), new THREE.MeshStandardMaterial({ color: 0x3d204d, roughness: 0.4 }));
      cluster.position.y = 0.3;
      group.add(cluster);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.8, 4), new THREE.MeshStandardMaterial({ color: 0x6e785a }));
      stem.position.y = 0.8;
      group.add(stem);
    } else if (id === 'lagarta') {
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0x84cc16, roughness: 0.5 });
      for (let i = 0; i < 4; i++) {
        const seg = new THREE.Mesh(new THREE.SphereGeometry(0.2 - i * 0.02, 6, 6), bodyMat);
        seg.position.set((i - 1.5) * 0.28, 0.15 + Math.sin(i) * 0.08, 0);
        group.add(seg);
      }
    } else if (id === 'mico-leao') {
      const mat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 });
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.45, 0.35), mat);
      body.position.y = 0.25;
      group.add(body);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 6, 6), mat);
      head.position.set(0.35, 0.45, 0);
      group.add(head);
      const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.8, 4), mat);
      tail.position.set(-0.4, 0.35, 0);
      tail.rotation.z = 1.0;
      group.add(tail);
    } else if (id === 'ave-surucua') {
      const body = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.8, 4), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
      body.rotation.x = 0.4;
      body.position.y = 0.3;
      group.add(body);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 6, 6), new THREE.MeshStandardMaterial({ color: 0x059669 }));
      head.position.set(0, 0.65, 0.2);
      group.add(head);
      const beak = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 4), new THREE.MeshStandardMaterial({ color: 0xfacc15 }));
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, 0.65, 0.42);
      group.add(beak);
    } else if (id === 'jararaca') {
      const snakeMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.7, flatShading: true });
      const coil1 = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.12, 5, 12), snakeMat);
      coil1.rotation.x = Math.PI / 2;
      coil1.position.y = 0.12;
      group.add(coil1);
      const head = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.35, 3), snakeMat);
      head.rotation.x = Math.PI / 2;
      head.position.set(0.35, 0.22, 0.2);
      group.add(head);
    } else if (id === 'gaviao') {
      const body = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.9, 4), new THREE.MeshStandardMaterial({ color: 0x3f3f46 }));
      body.position.y = 0.3;
      group.add(body);
      const wingMat = new THREE.MeshStandardMaterial({ color: 0x27272a, flatShading: true });
      const wingLeft = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.35), wingMat);
      wingLeft.position.set(-0.55, 0.5, 0);
      group.add(wingLeft);
      const wingRight = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.35), wingMat);
      wingRight.position.set(0.55, 0.5, 0);
      group.add(wingRight);
    } else if (id === 'fungos-decompositores') {
      const trunkPiece = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.35, 0.6, 5), new THREE.MeshStandardMaterial({ color: 0x3d271d }));
      trunkPiece.rotation.z = Math.PI / 2;
      trunkPiece.position.y = 0.2;
      group.add(trunkPiece);
      const capMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
      for (let i = 0; i < 3; i++) {
        const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.22 - i * 0.04, 0.05, 0.06, 8), capMat);
        cap.position.set((i - 1) * 0.25, 0.4 + i * 0.08, 0.15);
        cap.rotation.x = 0.4;
        group.add(cap);
      }
    }

    return group;
  }

  private buildConnections() {
    const organisms = Object.values(FOOD_WEB_ORGANISMS);

    organisms.forEach((consumer) => {
      consumer.preysOn.forEach((preyId) => {
        const fromNode = this.nodes.get(preyId);
        const toNode = this.nodes.get(consumer.id);

        if (!fromNode || !toNode) return;

        const isDecomp = consumer.level === 'decomposer';

        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          fromNode.currentPosition,
          toNode.currentPosition,
        ]);

        const lineMat = new THREE.LineBasicMaterial({
          color: isDecomp ? 0x42bfe8 : 0x65e6a5,
          transparent: true,
          opacity: isDecomp ? 0.35 : 0.75,
        });
        const line = new THREE.Line(lineGeo, lineMat);
        this.scene.add(line);

        const arrowGeo = new THREE.ConeGeometry(0.14, 0.4, 5);
        arrowGeo.rotateX(Math.PI / 2);
        const arrowMat = new THREE.MeshBasicMaterial({
          color: isDecomp ? 0x42bfe8 : 0x65e6a5,
          transparent: true,
          opacity: 0.8,
        });
        const arrowHead = new THREE.Mesh(arrowGeo, arrowMat);
        this.scene.add(arrowHead);

        this.connections.push({
          fromId: preyId,
          toId: consumer.id,
          line: line,
          arrowHead: arrowHead,
          isDecomposerLink: isDecomp,
        });
      });
    });

    this.updateConnectionPositions();
  }

  private updateConnectionPositions() {
    this.connections.forEach((conn) => {
      const fromNode = this.nodes.get(conn.fromId);
      const toNode = this.nodes.get(conn.toId);

      if (!fromNode || !toNode) return;

      const p1 = fromNode.meshGroup.position.clone().add(new THREE.Vector3(0, 0.4, 0));
      const p2 = toNode.meshGroup.position.clone().add(new THREE.Vector3(0, 0.4, 0));

      if (this.displayMode === 'chain' && conn.isDecomposerLink) {
        conn.line.visible = false;
        conn.arrowHead.visible = false;
        return;
      }

      conn.line.visible = true;
      conn.arrowHead.visible = true;

      const posAttr = conn.line.geometry.attributes.position as THREE.BufferAttribute;
      posAttr.setXYZ(0, p1.x, p1.y, p1.z);
      posAttr.setXYZ(1, p2.x, p2.y, p2.z);
      posAttr.needsUpdate = true;

      const arrowPos = new THREE.Vector3().lerpVectors(p1, p2, 0.72);
      conn.arrowHead.position.copy(arrowPos);
      conn.arrowHead.lookAt(p2);
    });
  }

  public setDisplayMode(mode: DisplayMode) {
    this.displayMode = mode;
    this.applyPositions(mode);
  }

  private applyPositions(mode: DisplayMode) {
    this.nodes.forEach((node) => {
      const target = mode === 'chain' ? node.chainPosition : node.webPosition;
      node.currentPosition.copy(target);
      node.meshGroup.position.copy(target);
    });

    this.updateConnectionPositions();
  }

  public setFireSimulation(active: boolean) {
    this.isFireSimulated = active;

    if (active) {
      this.scene.background = new THREE.Color(0x140d0a);
      this.scene.fog = new THREE.FogExp2(0x140d0a, 0.026);
    } else {
      this.scene.background = new THREE.Color(0x06140e);
      this.scene.fog = new THREE.FogExp2(0x06140e, 0.022);
    }

    this.nodes.forEach((node) => {
      const impact = node.data.fireImpact;
      const baseMesh = node.meshGroup.userData.baseMesh as THREE.Mesh;
      const ringMesh = node.meshGroup.userData.ringMesh as THREE.Mesh;

      if (active) {
        if (impact.isDirectlyKilled) {
          (baseMesh.material as THREE.MeshStandardMaterial).color.setHex(0x42281d);
          (ringMesh.material as THREE.MeshBasicMaterial).color.setHex(0xff713d);
          node.meshGroup.scale.set(0.75, 0.75, 0.75);
        } else {
          (baseMesh.material as THREE.MeshStandardMaterial).color.setHex(0x9a3412);
          (ringMesh.material as THREE.MeshBasicMaterial).color.setHex(0xf97316);
          node.meshGroup.scale.set(0.9, 0.9, 0.9);
        }
      } else {
        (baseMesh.material as THREE.MeshStandardMaterial).color.set(new THREE.Color(node.data.levelColor));
        (ringMesh.material as THREE.MeshBasicMaterial).color.set(new THREE.Color(node.data.levelColor));
        node.meshGroup.scale.set(1.0, 1.0, 1.0);
      }
    });

    this.connections.forEach((conn) => {
      const fromNode = this.nodes.get(conn.fromId);

      if (active && fromNode?.data.fireImpact.isDirectlyKilled) {
        (conn.line.material as THREE.LineBasicMaterial).color.setHex(0x522718);
        (conn.line.material as THREE.LineBasicMaterial).opacity = 0.25;
        (conn.arrowHead.material as THREE.MeshBasicMaterial).color.setHex(0x522718);
        (conn.arrowHead.material as THREE.MeshBasicMaterial).opacity = 0.25;
      } else {
        const isDecomp = conn.isDecomposerLink;
        const color = isDecomp ? 0x42bfe8 : 0x65e6a5;
        (conn.line.material as THREE.LineBasicMaterial).color.setHex(color);
        (conn.line.material as THREE.LineBasicMaterial).opacity = isDecomp ? 0.35 : 0.75;
        (conn.arrowHead.material as THREE.MeshBasicMaterial).color.setHex(color);
        (conn.arrowHead.material as THREE.MeshBasicMaterial).opacity = 0.8;
      }
    });
  }

  public selectOrganism(orgId: string | null) {
    this.selectedOrganismId = orgId;

    if (!orgId) {
      this.connections.forEach((conn) => {
        conn.line.visible = !(this.displayMode === 'chain' && conn.isDecomposerLink);
        conn.arrowHead.visible = conn.line.visible;
      });
      return;
    }

    this.connections.forEach((conn) => {
      const isPreyLink = conn.toId === orgId;
      const isPredatorLink = conn.fromId === orgId;

      if (isPreyLink || isPredatorLink) {
        conn.line.visible = true;
        conn.arrowHead.visible = true;
        (conn.line.material as THREE.LineBasicMaterial).opacity = 1.0;
      } else {
        (conn.line.material as THREE.LineBasicMaterial).opacity = 0.15;
      }
    });
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
      this.cameraAngleV = Math.max(0.1, Math.min(Math.PI / 2.2, this.cameraAngleV + deltaY * 0.006));

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

    this.listeners.click = ((e: MouseEvent) => {
      if (this.totalDragDistance > 6) return;

      const rect = dom.getBoundingClientRect();
      this.mouseCoords.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouseCoords.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouseCoords, this.camera);
      const intersects = this.raycaster.intersectObjects(this.clickableMeshes, true);

      if (intersects.length > 0) {
        let hit: THREE.Object3D | null = intersects[0].object;
        while (hit && !hit.userData?.organismId) {
          hit = hit.parent;
        }

        if (hit && hit.userData?.data) {
          const org = hit.userData.data as FoodWebOrganism;
          this.selectOrganism(org.id);
          if (this.onSelectCallback) {
            this.onSelectCallback(org);
          }
          return;
        }
      }

      this.selectOrganism(null);
      if (this.onSelectCallback) {
        this.onSelectCallback(null);
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

    this.nodes.forEach((node) => {
      node.meshGroup.rotation.y = Math.sin(seconds * 0.8 + node.chainPosition.x) * 0.15;
    });

    this.connections.forEach((conn, i) => {
      const pulse = 1.0 + Math.sin(seconds * 3.0 + i) * 0.12;
      conn.arrowHead.scale.set(pulse, pulse, pulse);
    });

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
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
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
