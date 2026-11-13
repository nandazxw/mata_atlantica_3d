import * as THREE from 'three';
import { BIOGEOCHEMICAL_CYCLES, type CycleType, type CycleStepData } from '../data/cyclesData';

interface StepNode3D {
  id: string;
  data: CycleStepData;
  group: THREE.Group;
  basePosition: THREE.Vector3;
}

interface FluxArrow {
  fromIndex: number;
  toIndex: number;
  line: THREE.Line;
  arrowHead: THREE.Mesh;
}

/**
 * BiogeochemicalScene
 * Renderizador 3D holográfico para os Ciclos Biogeoquímicos (Água, Carbono e Nitrogênio).
 * Projetado para baixo consumo de memória (4 GB de RAM) com diagramas de fluxo luminosos.
 */
export class BiogeochemicalScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animationFrameId: number | null = null;

  public currentCycle: CycleType = 'water';
  public isFireImpact = false;

  private nodes: StepNode3D[] = [];
  private arrows: FluxArrow[] = [];
  private clickableMeshes: THREE.Object3D[] = [];

  public selectedStepId: string | null = null;
  private onSelectCallback?: (step: CycleStepData | null) => void;

  // Destaque visual
  private highlightRing: THREE.Mesh | null = null;
  private currentSelectedNodeGroup: THREE.Group | null = null;

  // Controles de Câmera Orbitais
  private isPointerDown = false;
  private pointerStartX = 0;
  private pointerStartY = 0;
  private totalDragDistance = 0;
  private cameraAngleH = 0.0;
  private cameraAngleV = 0.32;
  private cameraDistance = 22;
  private targetPosition = new THREE.Vector3(0, 2.0, 0);

  // Raycaster
  private raycaster = new THREE.Raycaster();
  private mouseCoords = new THREE.Vector2();
  private listeners: { [key: string]: EventListener } = {};

  // Grupo mestre do ciclo para transição limpa
  private cycleMasterGroup: THREE.Group = new THREE.Group();

  constructor(
    container: HTMLElement,
    initialCycle: CycleType = 'water',
    onSelect?: (step: CycleStepData | null) => void
  ) {
    this.container = container;
    this.currentCycle = initialCycle;
    this.onSelectCallback = onSelect;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x06140e);
    this.scene.fog = new THREE.FogExp2(0x06140e, 0.022);

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    this.camera = new THREE.PerspectiveCamera(46, width / height, 0.2, 100);
    this.updateCameraPosition();

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    container.appendChild(this.renderer.domElement);

    this.setupLights();

    // Grade holográfica de sustentação
    const grid = new THREE.GridHelper(26, 20, 0x65e6a5, 0x1f704b);
    grid.position.y = -2.2;
    this.scene.add(grid);

    // Anel de destaque
    const ringGeo = new THREE.RingGeometry(1.3, 1.45, 24);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x65e6a5, side: THREE.DoubleSide });
    this.highlightRing = new THREE.Mesh(ringGeo, ringMat);
    this.highlightRing.visible = false;
    this.scene.add(this.highlightRing);

    this.scene.add(this.cycleMasterGroup);

    // Constrói o ciclo inicial
    this.loadCycle(this.currentCycle);

    this.setupControls();
    this.animate(0);
  }

  private setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xdcfce7, 1.8);
    dirLight.position.set(10, 20, 15);
    this.scene.add(dirLight);

    const blueLight = new THREE.DirectionalLight(0x42bfe8, 0.7);
    blueLight.position.set(-10, 8, -10);
    this.scene.add(blueLight);
  }

  /**
   * Constrói os nós e as setas de fluxo para o ciclo selecionado
   */
  public loadCycle(cycleType: CycleType) {
    this.currentCycle = cycleType;
    this.selectedStepId = null;
    if (this.highlightRing) this.highlightRing.visible = false;
    if (this.onSelectCallback) this.onSelectCallback(null);

    // Limpa objetos do ciclo anterior para evitar acúmulo de memória
    this.clearCurrentCycle();

    const cycleData = BIOGEOCHEMICAL_CYCLES[cycleType];
    const steps = cycleData.steps;

    // 1. Constrói os nós de cada etapa
    steps.forEach((step) => {
      const group = new THREE.Group();
      const pos = new THREE.Vector3(...step.position);
      group.position.copy(pos);

      // Orbe holográfico central
      const sphereGeo = new THREE.IcosahedronGeometry(0.7, 1);
      const sphereMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(step.color),
        metalness: 0.4,
        roughness: 0.3,
        flatShading: true,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      group.add(sphere);

      // Casca em wireframe geométrica externa
      const shellGeo = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(1.05, 1));
      const shellMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(step.color),
        transparent: true,
        opacity: 0.55,
      });
      const shell = new THREE.LineSegments(shellGeo, shellMat);
      group.add(shell);

      // Plaqueta inferior com o nome da etapa
      const labelPlate = this.createPlate(step.name, step.color);
      labelPlate.position.set(0, -1.15, 0);
      group.add(labelPlate);

      // Metadados do nó
      group.userData = {
        isInteractive: true,
        stepId: step.id,
        data: step,
        sphereMesh: sphere,
        shellMesh: shell,
      };

      group.traverse((child) => {
        child.userData = group.userData;
      });

      this.cycleMasterGroup.add(group);
      this.clickableMeshes.push(group);

      this.nodes.push({
        id: step.id,
        data: step,
        group: group,
        basePosition: pos,
      });
    });

    // 2. Constrói as setas de fluxo contínuo entre as etapas (ciclo fechado 1 -> 2 -> ... -> N -> 1)
    for (let i = 0; i < steps.length; i++) {
      const nextIndex = (i + 1) % steps.length;
      const p1 = new THREE.Vector3(...steps[i].position);
      const p2 = new THREE.Vector3(...steps[nextIndex].position);

      const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(cycleData.accentColor),
        transparent: true,
        opacity: 0.75,
      });
      const line = new THREE.Line(lineGeo, lineMat);
      this.cycleMasterGroup.add(line);

      const arrowGeo = new THREE.ConeGeometry(0.18, 0.48, 5);
      arrowGeo.rotateX(Math.PI / 2);
      const arrowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(cycleData.accentColor),
        transparent: true,
        opacity: 0.85,
      });
      const arrowHead = new THREE.Mesh(arrowGeo, arrowMat);
      this.cycleMasterGroup.add(arrowHead);

      const arrowPos = new THREE.Vector3().lerpVectors(p1, p2, 0.65);
      arrowHead.position.copy(arrowPos);
      arrowHead.lookAt(p2);

      this.arrows.push({
        fromIndex: i,
        toIndex: nextIndex,
        line: line,
        arrowHead: arrowHead,
      });
    }

    // Se a simulação de queimada estiver ligada, aplica os efeitos no novo ciclo
    if (this.isFireImpact) {
      this.applyFireImpactVisuals(true);
    }
  }

  private createPlate(_name: string, color: string): THREE.Group {
    const group = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(2.2, 0.4, 0.05);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x071a14, roughness: 0.3 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    group.add(box);

    const border = new THREE.LineSegments(
      new THREE.EdgesGeometry(boxGeo),
      new THREE.LineBasicMaterial({ color: new THREE.Color(color) })
    );
    group.add(border);
    return group;
  }

  private clearCurrentCycle() {
    this.clickableMeshes = [];
    this.nodes = [];
    this.arrows = [];

    // Limpa filhos do grupo mestre
    while (this.cycleMasterGroup.children.length > 0) {
      const child = this.cycleMasterGroup.children[0];
      this.cycleMasterGroup.remove(child);
      if (child instanceof THREE.Mesh || child instanceof THREE.Line || child instanceof THREE.LineSegments) {
        if (child.geometry) child.geometry.dispose();
      }
    }
  }

  /**
   * Ativa ou desativa a visualização qualitativa do impacto das queimadas no ciclo
   */
  public setFireImpact(active: boolean) {
    this.isFireImpact = active;
    this.applyFireImpactVisuals(active);
  }

  private applyFireImpactVisuals(active: boolean) {
    if (active) {
      this.scene.background = new THREE.Color(0x160e0a);
      this.scene.fog = new THREE.FogExp2(0x160e0a, 0.025);

      // Altera a cor das setas para indicar quebra ou desregulação do fluxo
      this.arrows.forEach((arr) => {
        (arr.line.material as THREE.LineBasicMaterial).color.setHex(0xff713d);
        (arr.line.material as THREE.LineBasicMaterial).opacity = 0.35;
        (arr.arrowHead.material as THREE.MeshBasicMaterial).color.setHex(0xff713d);
      });

      // Se for ciclo do carbono, o nó de combustão recebe grande destaque
      this.nodes.forEach((node) => {
        const sphere = node.group.userData.sphereMesh as THREE.Mesh;
        if (node.id === 'combustao-queimadas') {
          (sphere.material as THREE.MeshStandardMaterial).color.setHex(0xff3300);
          node.group.scale.set(1.3, 1.3, 1.3);
        } else if (node.id === 'transpiracao' || node.id === 'fixacao' || node.id === 'infiltracao') {
          // Etapas biológicas prejudicadas
          (sphere.material as THREE.MeshStandardMaterial).color.setHex(0x522718);
          node.group.scale.set(0.75, 0.75, 0.75);
        }
      });
    } else {
      this.scene.background = new THREE.Color(0x06140e);
      this.scene.fog = new THREE.FogExp2(0x06140e, 0.022);

      const cycleData = BIOGEOCHEMICAL_CYCLES[this.currentCycle];
      this.arrows.forEach((arr) => {
        (arr.line.material as THREE.LineBasicMaterial).color.set(new THREE.Color(cycleData.accentColor));
        (arr.line.material as THREE.LineBasicMaterial).opacity = 0.75;
        (arr.arrowHead.material as THREE.MeshBasicMaterial).color.set(new THREE.Color(cycleData.accentColor));
      });

      this.nodes.forEach((node) => {
        const sphere = node.group.userData.sphereMesh as THREE.Mesh;
        (sphere.material as THREE.MeshStandardMaterial).color.set(new THREE.Color(node.data.color));
        node.group.scale.set(1.0, 1.0, 1.0);
      });
    }
  }

  public selectStep(stepId: string | null) {
    this.selectedStepId = stepId;

    if (!stepId) {
      if (this.highlightRing) this.highlightRing.visible = false;
      this.currentSelectedNodeGroup = null;
      return;
    }

    const node = this.nodes.find((n) => n.id === stepId);
    if (!node || !this.highlightRing) return;

    this.currentSelectedNodeGroup = node.group;
    this.highlightRing.position.set(node.group.position.x, node.group.position.y - 0.7, node.group.position.z);
    (this.highlightRing.material as THREE.MeshBasicMaterial).color.set(new THREE.Color(node.data.color));
    this.highlightRing.visible = true;
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
      this.cameraDistance = Math.max(10, Math.min(36, this.cameraDistance + e.deltaY * 0.02));
      this.updateCameraPosition();
    }) as EventListener;
    dom.addEventListener('wheel', this.listeners.wheel, { passive: false });

    // Clique com Raycaster
    this.listeners.click = ((e: MouseEvent) => {
      if (this.totalDragDistance > 6) return;

      const rect = dom.getBoundingClientRect();
      this.mouseCoords.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouseCoords.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouseCoords, this.camera);
      const intersects = this.raycaster.intersectObjects(this.clickableMeshes, true);

      if (intersects.length > 0) {
        let hit: THREE.Object3D | null = intersects[0].object;
        while (hit && !hit.userData?.stepId) {
          hit = hit.parent;
        }

        if (hit && hit.userData?.data) {
          const stepData = hit.userData.data as CycleStepData;
          this.selectStep(stepData.id);
          if (this.onSelectCallback) {
            this.onSelectCallback(stepData);
          }
          return;
        }
      }

      this.selectStep(null);
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

    // Rotação sutil dos nós e pulsação das cascas holográficas
    this.nodes.forEach((n, idx) => {
      const shell = n.group.userData.shellMesh as THREE.LineSegments;
      if (shell) {
        shell.rotation.y += 0.008;
        shell.rotation.x += 0.004;
      }
      n.group.position.y = n.basePosition.y + Math.sin(seconds * 1.5 + idx) * 0.08;
    });

    // Pulsação das setas de fluxo
    this.arrows.forEach((arr, i) => {
      const pulse = 1.0 + Math.sin(seconds * 3.0 + i) * 0.14;
      arr.arrowHead.scale.set(pulse, pulse, pulse);
    });

    // Atualiza posição do anel de destaque
    if (this.highlightRing && this.highlightRing.visible && this.currentSelectedNodeGroup) {
      this.highlightRing.position.set(
        this.currentSelectedNodeGroup.position.x,
        this.currentSelectedNodeGroup.position.y - 0.7,
        this.currentSelectedNodeGroup.position.z
      );
      this.highlightRing.rotation.z += 0.01;
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

    this.clearCurrentCycle();

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
