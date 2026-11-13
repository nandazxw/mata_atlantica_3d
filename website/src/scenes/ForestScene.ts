import * as THREE from 'three';
import { SPECIES_DATA } from '../data/organisms';
import { FIRE_IMPACTS } from '../data/impacts';
import { markAsClickable, type InteractiveData } from '../components/InteractiveObject';

export type ForestMode = 'preserved' | 'burned';

/**
 * ForestScene
 * Gerenciador da Floresta da Mata Atlântica 3D:
 * - Suporta alternância fluida entre "Floresta Preservada" e "Floresta Queimada" (Antes e Depois)
 * - Mantém a MESMA posição de câmera e os mesmos controles orbitais
 * - Reutiliza geometrias básicas e descarta grupos com eficiência para preservar os 4 GB de RAM
 * - Iluminação e névoa atmosférica adaptativa
 */
export class ForestScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private animationFrameId: number | null = null;

  // Estado atual: 'preserved' (Antes) ou 'burned' (Depois)
  private currentMode: ForestMode = 'preserved';

  // Grupos de cena para troca ultra-rápida sem vazamento de memória
  private preservedGroup: THREE.Group = new THREE.Group();
  private burnedGroup: THREE.Group = new THREE.Group();

  // Iluminação adaptável
  private ambientLight: THREE.AmbientLight | null = null;
  private dirSunLight: THREE.DirectionalLight | null = null;
  private fillLight: THREE.DirectionalLight | null = null;

  // Controles orbitais da câmera (mantidos estáveis em ambos os modos)
  private isPointerDown = false;
  private pointerStartX = 0;
  private pointerStartY = 0;
  private totalDragDistance = 0;
  private cameraAngleH = 0.45;
  private cameraAngleV = 0.38;
  private cameraDistance = 21;
  private targetPosition = new THREE.Vector3(0, 1.8, 0);

  // Raycaster e seleção
  private raycaster = new THREE.Raycaster();
  private mouseCoords = new THREE.Vector2();
  private onSelectCallback?: (data: InteractiveData | null) => void;

  // Feedback de seleção
  private highlightBox: THREE.BoxHelper | null = null;
  private currentSelectedObject: THREE.Object3D | null = null;

  // Objetos animados
  private preservedRiver: THREE.Mesh | null = null;
  private burnedRiver: THREE.Mesh | null = null;
  private preservedLeaves: THREE.Group = new THREE.Group();
  private preservedParticles: THREE.Points | null = null;
  private burnedAshes: THREE.Points | null = null;

  // Lista de malhas interativas ativas no modo atual
  private activeClickableMeshes: THREE.Object3D[] = [];

  // Listeners para descarte limpo
  private listeners: { [key: string]: EventListener } = {};

  constructor(
    container: HTMLElement,
    initialMode: ForestMode = 'preserved',
    onSelect?: (data: InteractiveData | null) => void
  ) {
    this.container = container;
    this.currentMode = initialMode;
    this.onSelectCallback = onSelect;

    // 1. Cena
    this.scene = new THREE.Scene();

    // 2. Câmera
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.2, 100);
    this.updateCameraPosition();

    // 3. Renderer econômico para Intel UHD
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    container.appendChild(this.renderer.domElement);

    // 4. BoxHelper para destaque
    const dummy = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1));
    this.highlightBox = new THREE.BoxHelper(dummy, 0x65e6a5);
    this.highlightBox.visible = false;
    this.scene.add(this.highlightBox);

    // 5. Configurar Iluminação
    this.setupLighting();

    // 6. Construir os dois ecossistemas (Preservado e Queimado)
    this.scene.add(this.preservedGroup);
    this.scene.add(this.burnedGroup);

    this.buildPreservedBiome();
    this.buildBurnedBiome();

    // 7. Aplicar o modo inicial (ativa um e esconde o outro)
    this.setMode(this.currentMode);

    // 8. Controles do usuário
    this.setupControls();

    // 9. Loop de animação
    this.animate(0);
  }

  /**
   * Configuração inicial da luz
   */
  private setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0x19452b, 1.8);
    this.scene.add(this.ambientLight);

    this.dirSunLight = new THREE.DirectionalLight(0xdcfce7, 1.6);
    this.dirSunLight.position.set(12, 24, 10);
    this.scene.add(this.dirSunLight);

    this.fillLight = new THREE.DirectionalLight(0x42bfe8, 0.6);
    this.fillLight.position.set(-10, 10, -10);
    this.scene.add(this.fillLight);
  }

  /**
   * Alterna dinamicamente entre 'preserved' e 'burned'
   * Mantém rigorosamente a posição de câmera para a comparação direta
   */
  public setMode(mode: ForestMode) {
    this.currentMode = mode;

    // Reseta destaque ao alternar
    if (this.highlightBox) {
      this.highlightBox.visible = false;
      this.currentSelectedObject = null;
    }
    if (this.onSelectCallback) {
      this.onSelectCallback(null);
    }

    if (mode === 'preserved') {
      // 1. Atmosfera Preservada (Verde escura e límpida)
      this.scene.background = new THREE.Color(0x06140e);
      this.scene.fog = new THREE.FogExp2(0x06140e, 0.028);

      if (this.ambientLight) this.ambientLight.color.setHex(0x19452b);
      if (this.dirSunLight) this.dirSunLight.color.setHex(0xdcfce7);
      if (this.fillLight) this.fillLight.color.setHex(0x42bfe8);

      if (this.highlightBox) (this.highlightBox.material as THREE.LineBasicMaterial).color.setHex(0x65e6a5);

      this.preservedGroup.visible = true;
      this.burnedGroup.visible = false;
      this.activeClickableMeshes = this.getClickableChildren(this.preservedGroup);
    } else {
      // 2. Atmosfera Queimada (Contraste equilibrado com iluminação adequada)
      this.scene.background = new THREE.Color(0x1a120e);
      this.scene.fog = new THREE.FogExp2(0x1a120e, 0.024);

      if (this.ambientLight) this.ambientLight.color.setHex(0x52362b);
      if (this.dirSunLight) this.dirSunLight.color.setHex(0xffaa66);
      if (this.fillLight) this.fillLight.color.setHex(0x996644);

      if (this.highlightBox) (this.highlightBox.material as THREE.LineBasicMaterial).color.setHex(0xff713d);

      this.preservedGroup.visible = false;
      this.burnedGroup.visible = true;
      this.activeClickableMeshes = this.getClickableChildren(this.burnedGroup);
    }
  }

  private getClickableChildren(group: THREE.Group): THREE.Object3D[] {
    const list: THREE.Object3D[] = [];
    group.traverse((child) => {
      if (child.userData?.isInteractive) {
        list.push(child);
      }
    });
    return list;
  }

  // ==========================================
  // 1. CONSTRUÇÃO DO BIOMA PRESERVADO (ANTERIOR)
  // ==========================================
  private buildPreservedBiome() {
    this.buildPreservedTerrain();
    this.buildPreservedRiver();
    this.buildPreservedVegetation();
    this.buildPreservedFauna();
    this.buildPreservedParticles();
  }

  private buildPreservedTerrain() {
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
      color: 0x173824,
      roughness: 0.9,
      metalness: 0.1,
      flatShading: true,
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    this.preservedGroup.add(terrainMesh);
  }

  private buildPreservedRiver() {
    const riverGeo = new THREE.PlaneGeometry(5.5, 36, 12, 24);
    riverGeo.rotateX(-Math.PI / 2);

    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x2288aa,
      transparent: true,
      opacity: 0.85,
      roughness: 0.2,
      metalness: 0.4,
    });

    this.preservedRiver = new THREE.Mesh(riverGeo, riverMat);
    this.preservedRiver.position.set(0, -0.4, 0);
    this.preservedGroup.add(this.preservedRiver);

    markAsClickable(this.preservedRiver, {
      id: 'rio-fluvial',
      data: SPECIES_DATA['rio-fluvial'],
    });

    // Rochas
    const rockGeo = new THREE.DodecahedronGeometry(0.65, 0);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x485848, roughness: 0.85, flatShading: true });
    const rockPositions = [
      { x: -2.4, z: 4, s: 1.1 },
      { x: 2.2, z: -3, s: 0.8 },
      { x: -2.1, z: -8, s: 1.3 },
      { x: 2.6, z: 9, s: 1.0 },
    ];
    rockPositions.forEach((p, idx) => {
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.position.set(p.x, -0.2, p.z);
      rock.scale.set(p.s, p.s * 0.7, p.s);
      rock.rotation.set(idx, idx * 2, idx * 0.5);
      this.preservedGroup.add(rock);
      markAsClickable(rock, { id: 'rocha-musgosa', data: SPECIES_DATA['rocha-musgosa'] });
    });
  }

  private buildPreservedVegetation() {
    this.preservedGroup.add(this.preservedLeaves);

    // Jequitibás Preservados
    this.createPreservedJequitiba(-7, 5, 1.4);
    this.createPreservedJequitiba(8, -6, 1.2);
    this.createPreservedJequitiba(-9, -9, 1.1);

    // Palmeiras-juçara
    this.createPreservedPalmeira(-4, 2, 1.1);
    this.createPreservedPalmeira(-4.8, -3, 0.9);
    this.createPreservedPalmeira(4.5, 4, 1.0);
    this.createPreservedPalmeira(6, -2, 1.2);

    // Samambaias
    this.createPreservedFern(-3.2, 0.8);
    this.createPreservedFern(3.4, -1.2);
    this.createPreservedFern(-5, -6);
    this.createPreservedFern(4.2, 8);

    // Arbustos
    const bushGeo = new THREE.IcosahedronGeometry(0.7, 0);
    const bushMat = new THREE.MeshStandardMaterial({ color: 0x1f5c38, roughness: 0.85, flatShading: true });
    [{ x: -5, z: 6 }, { x: -6, z: -1 }, { x: 5, z: -7 }, { x: 7, z: 2 }].forEach((c, i) => {
      const bush = new THREE.Mesh(bushGeo, bushMat);
      bush.position.set(c.x, 0.35, c.z);
      bush.scale.set(1 + (i % 2) * 0.3, 0.8, 1);
      this.preservedGroup.add(bush);
    });
  }

  private createPreservedJequitiba(x: number, z: number, scale: number) {
    const tree = new THREE.Group();
    tree.position.set(x, 0.2, z);
    tree.scale.set(scale, scale, scale);

    const trunkGeo = new THREE.CylinderGeometry(0.4, 0.7, 7, 6);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x422a1d, roughness: 0.9, flatShading: true });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 3.5;
    tree.add(trunk);

    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x1f704b, roughness: 0.8, flatShading: true });
    [{ x: 0, y: 7.2, z: 0, r: 2.2 }, { x: 1.2, y: 6.5, z: 0.8, r: 1.6 }, { x: -1.0, y: 6.8, z: -0.6, r: 1.7 }].forEach((c) => {
      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(c.r, 1), foliageMat);
      crown.position.set(c.x, c.y, c.z);
      tree.add(crown);
    });

    // Bromélia
    const brom = new THREE.Group();
    brom.position.set(0.35, 4.0, 0.2);
    brom.scale.set(0.65, 0.65, 0.65);
    const leafGeo = new THREE.ConeGeometry(0.18, 0.9, 3);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x48bb78, flatShading: true });
    for (let i = 0; i < 6; i++) {
      const l = new THREE.Mesh(leafGeo, leafMat);
      l.rotation.set(0, (i / 6) * Math.PI * 2, 0.8);
      brom.add(l);
    }
    const fl = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.4, 4), new THREE.MeshStandardMaterial({ color: 0xed64a6 }));
    fl.position.y = 0.25;
    brom.add(fl);
    tree.add(brom);

    markAsClickable(brom, { id: 'bromelia', data: SPECIES_DATA['bromelia'] });
    this.preservedLeaves.add(tree);

    markAsClickable(tree, { id: 'jequitiba-rosa', data: SPECIES_DATA['jequitiba-rosa'] });
  }

  private createPreservedPalmeira(x: number, z: number, scale: number) {
    const palm = new THREE.Group();
    palm.position.set(x, 0, z);
    palm.scale.set(scale, scale, scale);

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 5.5, 5), new THREE.MeshStandardMaterial({ color: 0x5a6358, flatShading: true }));
    trunk.position.y = 2.75;
    palm.add(trunk);

    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.13, 0.8, 5), new THREE.MeshStandardMaterial({ color: 0x2e8540 }));
    crown.position.y = 5.7;
    palm.add(crown);

    const leafMat = new THREE.MeshStandardMaterial({ color: 0x22884a, flatShading: true });
    for (let i = 0; i < 7; i++) {
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.5, 2.5, 4), leafMat);
      leaf.position.set(0, 6.0, 0);
      leaf.rotation.set(0, (i / 7) * Math.PI * 2, 0.9);
      palm.add(leaf);
    }

    this.preservedLeaves.add(palm);
    markAsClickable(palm, { id: 'palmeira-jucara', data: SPECIES_DATA['palmeira-jucara'] });
  }

  private createPreservedFern(x: number, z: number) {
    const fern = new THREE.Group();
    fern.position.set(x, 0.1, z);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 0.9, 4), new THREE.MeshStandardMaterial({ color: 0x3d2719 }));
    stem.position.y = 0.45;
    fern.add(stem);

    const frondMat = new THREE.MeshStandardMaterial({ color: 0x38a169, flatShading: true });
    for (let i = 0; i < 6; i++) {
      const frond = new THREE.Mesh(new THREE.ConeGeometry(0.35, 1.6, 3), frondMat);
      frond.position.set(0, 0.85, 0);
      frond.rotation.set(0, (i / 6) * Math.PI * 2, 1.1);
      fern.add(frond);
    }
    this.preservedGroup.add(fern);
    markAsClickable(fern, { id: 'samambaia', data: SPECIES_DATA['samambaia'] });
  }

  private buildPreservedFauna() {
    // Capivara
    const cap = new THREE.Group();
    cap.position.set(-1.8, -0.1, 2.5);
    cap.rotation.y = 0.8;
    cap.scale.set(0.65, 0.65, 0.65);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0x7b4a2e, flatShading: true });

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.0, 0.9), bodyMat);
    body.position.y = 0.7;
    cap.add(body);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.7, 0.6), bodyMat);
    head.position.set(1.0, 1.0, 0);
    cap.add(head);

    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.4, 0.45), new THREE.MeshStandardMaterial({ color: 0x3d2315 }));
    snout.position.set(1.4, 0.9, 0);
    cap.add(snout);

    const legGeo = new THREE.BoxGeometry(0.25, 0.45, 0.25);
    [{ x: 0.5, z: 0.35 }, { x: 0.5, z: -0.35 }, { x: -0.5, z: 0.35 }, { x: -0.5, z: -0.35 }].forEach((lp) => {
      const leg = new THREE.Mesh(legGeo, bodyMat);
      leg.position.set(lp.x, 0.22, lp.z);
      cap.add(leg);
    });
    this.preservedGroup.add(cap);
    markAsClickable(cap, { id: 'capivara', data: SPECIES_DATA['capivara'] });

    // Tucano
    const tuc = new THREE.Group();
    tuc.position.set(-6.2, 5.2, 5.3);
    tuc.scale.set(0.45, 0.45, 0.45);
    tuc.rotation.y = -1.2;

    const tucBody = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.1, 4), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    tucBody.rotation.x = 0.5;
    tuc.add(tucBody);

    const throat = new THREE.Mesh(new THREE.SphereGeometry(0.32, 4, 4), new THREE.MeshStandardMaterial({ color: 0xf6ad55 }));
    throat.position.set(0, 0.4, 0.25);
    tuc.add(throat);

    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.24, 1.0, 4), new THREE.MeshStandardMaterial({ color: 0x48bb78 }));
    beak.position.set(0, 0.45, 0.85);
    beak.rotation.x = Math.PI / 2;
    tuc.add(beak);

    this.preservedGroup.add(tuc);
    markAsClickable(tuc, { id: 'tucano-de-bico-verde', data: SPECIES_DATA['tucano-de-bico-verde'] });
  }

  private buildPreservedParticles() {
    const particleCount = 45;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 28;
      positions[i + 1] = 0.5 + Math.random() * 8;
      positions[i + 2] = (Math.random() - 0.5) * 28;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.preservedParticles = new THREE.Points(
      geo,
      new THREE.PointsMaterial({ color: 0x65e6a5, size: 0.12, transparent: true, opacity: 0.65 })
    );
    this.preservedGroup.add(this.preservedParticles);
  }

  // ==========================================
  // 2. CONSTRUÇÃO DO BIOMA DEVASTADO (QUEIMADO)
  // ==========================================
  private buildBurnedBiome() {
    this.buildBurnedTerrain();
    this.buildBurnedRiver();
    this.buildBurnedTrees();
    this.buildBurnedGroundDebris();
    this.buildBurnedAshes();
  }

  private buildBurnedTerrain() {
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

    // Solo cinza com contraste de terra calcinada
    const terrainMat = new THREE.MeshStandardMaterial({
      color: 0x3d3028, // Solo cinzento terroso visível
      roughness: 0.9,
      metalness: 0.05,
      flatShading: true,
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    this.burnedGroup.add(terrainMesh);

    markAsClickable(terrainMesh, {
      id: 'solo-queimado',
      data: FIRE_IMPACTS['solo-queimado'],
      isBurnedMode: true,
    });
  }

  private buildBurnedRiver() {
    const riverGeo = new THREE.PlaneGeometry(4.6, 36, 12, 24); // Leito mais estreito (perda de água)
    riverGeo.rotateX(-Math.PI / 2);

    // Água turva, amarronzada por cinzas e lama
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x2e2920,
      transparent: true,
      opacity: 0.88,
      roughness: 0.4,
      metalness: 0.1,
    });

    this.burnedRiver = new THREE.Mesh(riverGeo, riverMat);
    this.burnedRiver.position.set(0, -0.45, 0); // Nível da água mais baixo
    this.burnedGroup.add(this.burnedRiver);

    markAsClickable(this.burnedRiver, {
      id: 'rio-assoreado',
      data: FIRE_IMPACTS['rio-assoreado'],
      isBurnedMode: true,
    });

    // Rochas cobertas por fuligem
    const rockGeo = new THREE.DodecahedronGeometry(0.65, 0);
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x221f1d, roughness: 0.95, flatShading: true });
    [{ x: -2.4, z: 4, s: 1.1 }, { x: 2.2, z: -3, s: 0.8 }, { x: 2.6, z: 9, s: 1.0 }].forEach((p, idx) => {
      const rock = new THREE.Mesh(rockGeo, rockMat);
      rock.position.set(p.x, -0.25, p.z);
      rock.scale.set(p.s, p.s * 0.7, p.s);
      rock.rotation.set(idx, idx * 2, idx * 0.5);
      this.burnedGroup.add(rock);
    });
  }

  private buildBurnedTrees() {
    // Árvores carbonizadas mantendo as MESMAS posições das originais para comparação direta!
    this.createBurnedTree(-7, 5, 1.4, 'Jequitibá Carbonizado');
    this.createBurnedTree(8, -6, 1.2, 'Árvore Calcinada');
    this.createBurnedTree(-9, -9, 1.1, 'Matriz Florestal Destruída');

    // Palmeiras queimadas (estipes descascados e sem folhas)
    this.createBurnedPalm(-4, 2, 1.1);
    this.createBurnedPalm(-4.8, -3, 0.9);
    this.createBurnedPalm(4.5, 4, 1.0);
    this.createBurnedPalm(6, -2, 1.2);

    // Onde ficava o Tucano (-6.2, 5.2, 5.3) agora é um galho vazio que simboliza a perda de fauna
    this.createFaunaAbsentSign(-6.2, 4.8, 5.3);
  }

  private createBurnedTree(x: number, z: number, scale: number, _name: string) {
    const tree = new THREE.Group();
    tree.position.set(x, 0.2, z);
    tree.scale.set(scale, scale, scale);

    // Tronco carbonizado com relevo visível
    const trunkMat = new THREE.MeshStandardMaterial({
      color: 0x2b221e,
      roughness: 0.9,
      flatShading: true,
    });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.7, 6.5, 6), trunkMat);
    trunk.position.y = 3.25;
    tree.add(trunk);

    // Galhos secos e retorcidos (sem folhas verdes)
    const branchGeo = new THREE.CylinderGeometry(0.08, 0.16, 2.2, 4);
    for (let i = 0; i < 4; i++) {
      const branch = new THREE.Mesh(branchGeo, trunkMat);
      branch.position.set((Math.random() - 0.5) * 0.6, 5.2 + i * 0.4, (Math.random() - 0.5) * 0.6);
      branch.rotation.set((Math.random() - 0.5) * 1.2, (i / 4) * Math.PI * 2, 0.8 + (Math.random() - 0.5) * 0.4);
      tree.add(branch);
    }

    this.burnedGroup.add(tree);

    markAsClickable(tree, {
      id: 'arvore-carbonizada',
      data: FIRE_IMPACTS['arvore-carbonizada'],
      isBurnedMode: true,
    });
  }

  private createBurnedPalm(x: number, z: number, scale: number) {
    const palm = new THREE.Group();
    palm.position.set(x, 0, z);
    palm.scale.set(scale, scale, scale);

    // Estipe quebrado e escurecido
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x201a17, roughness: 0.9 });
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.16, 4.2, 5), trunkMat);
    trunk.position.y = 2.1;
    trunk.rotation.z = 0.08; // Leve inclinação de colapso
    palm.add(trunk);

    this.burnedGroup.add(palm);

    markAsClickable(palm, {
      id: 'arvore-carbonizada',
      data: FIRE_IMPACTS['arvore-carbonizada'],
      isBurnedMode: true,
    });
  }

  private createFaunaAbsentSign(x: number, y: number, z: number) {
    const marker = new THREE.Group();
    marker.position.set(x, y, z);

    // Galho seco estéril
    const branch = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.1, 1.6, 4),
      new THREE.MeshStandardMaterial({ color: 0x1a1512 })
    );
    branch.rotation.z = 0.8;
    marker.add(branch);

    this.burnedGroup.add(marker);

    markAsClickable(marker, {
      id: 'fauna-ausente',
      data: FIRE_IMPACTS['fauna-ausente'],
      isBurnedMode: true,
    });
  }

  private buildBurnedGroundDebris() {
    // 1. Troncos caídos no solo
    const logGeo = new THREE.CylinderGeometry(0.28, 0.35, 4.5, 5);
    const logMat = new THREE.MeshStandardMaterial({ color: 0x14100e, roughness: 0.95 });

    const fallenLog1 = new THREE.Mesh(logGeo, logMat);
    fallenLog1.position.set(-2.8, 0.2, -1.5);
    fallenLog1.rotation.set(0.1, 0.6, Math.PI / 2 - 0.05);
    this.burnedGroup.add(fallenLog1);

    markAsClickable(fallenLog1, {
      id: 'tronco-caido',
      data: FIRE_IMPACTS['tronco-caido'],
      isBurnedMode: true,
    });

    const fallenLog2 = new THREE.Mesh(logGeo, logMat);
    fallenLog2.position.set(3.2, 0.2, 3.0);
    fallenLog2.scale.set(0.8, 0.8, 0.8);
    fallenLog2.rotation.set(-0.1, -0.8, Math.PI / 2);
    this.burnedGroup.add(fallenLog2);

    markAsClickable(fallenLog2, {
      id: 'tronco-caido',
      data: FIRE_IMPACTS['tronco-caido'],
      isBurnedMode: true,
    });

    // 2. Focos de cinzas / solo calcinado
    const ashGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.08, 6);
    const ashMat = new THREE.MeshStandardMaterial({ color: 0x332822, roughness: 1.0 });

    const ashSpot = new THREE.Mesh(ashGeo, ashMat);
    ashSpot.position.set(-0.8, 0.05, 1.5);
    this.burnedGroup.add(ashSpot);

    markAsClickable(ashSpot, {
      id: 'foco-cinzas',
      data: FIRE_IMPACTS['foco-cinzas'],
      isBurnedMode: true,
    });
  }

  private buildBurnedAshes() {
    // Apenas 35 partículas tênues cor de brasa/fuligem flutuando (custo de GPU nulo)
    const particleCount = 35;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 28;
      positions[i + 1] = 0.4 + Math.random() * 6;
      positions[i + 2] = (Math.random() - 0.5) * 28;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    this.burnedAshes = new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color: 0xff713d,
        size: 0.1,
        transparent: true,
        opacity: 0.5,
      })
    );
    this.burnedGroup.add(this.burnedAshes);
  }

  // ==========================================
  // 3. CONTROLES DE CÂMERA E RAYCASTER
  // ==========================================
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
      this.cameraDistance = Math.max(8, Math.min(36, this.cameraDistance + e.deltaY * 0.02));
      this.updateCameraPosition();
    }) as EventListener;
    dom.addEventListener('wheel', this.listeners.wheel, { passive: false });

    // Clique em Elementos 3D
    this.listeners.click = ((e: MouseEvent) => {
      if (this.totalDragDistance > 6) return;

      const rect = dom.getBoundingClientRect();
      this.mouseCoords.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouseCoords.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouseCoords, this.camera);
      const intersects = this.raycaster.intersectObjects(this.activeClickableMeshes, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const targetMeta = hit.userData;

        if (targetMeta && targetMeta.data) {
          const interactiveData = targetMeta.data as InteractiveData;
          const rootObj = targetMeta.rootInteractive || hit;

          if (this.highlightBox) {
            this.highlightBox.setFromObject(rootObj);
            this.highlightBox.visible = true;
            this.currentSelectedObject = rootObj;
          }

          if (this.onSelectCallback) {
            this.onSelectCallback(interactiveData);
          }
          return;
        }
      }

      if (this.highlightBox) {
        this.highlightBox.visible = false;
        this.currentSelectedObject = null;
      }
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

    if (this.currentMode === 'preserved') {
      if (this.preservedLeaves) {
        this.preservedLeaves.rotation.y = Math.sin(seconds * 0.6) * 0.015;
      }
      if (this.preservedRiver) {
        this.preservedRiver.position.y = -0.4 + Math.sin(seconds * 1.5) * 0.02;
      }
      if (this.preservedParticles) {
        this.preservedParticles.rotation.y = seconds * 0.02;
      }
    } else {
      if (this.burnedRiver) {
        this.burnedRiver.position.y = -0.45 + Math.sin(seconds * 0.8) * 0.01;
      }
      if (this.burnedAshes) {
        this.burnedAshes.rotation.y = seconds * 0.015;
      }
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
      if (obj instanceof THREE.Mesh || obj instanceof THREE.LineSegments || obj instanceof THREE.Points) {
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
