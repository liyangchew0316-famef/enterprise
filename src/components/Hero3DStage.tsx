import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { 
  Layers, 
  RotateCw, 
  Eye, 
  Play, 
  Pause, 
  Maximize2, 
  Sparkles, 
  Box, 
  Palette, 
  Zap,
  Check
} from 'lucide-react';

export interface Hero3DStageProps {
  onSelectProduct?: (modelId: string) => void;
  className?: string;
}

export type ModelType = 'chili' | 'clicker' | 'honeycomb' | 'articulated';
export type RenderMode = 'shaded' | 'wireframe' | 'slicer' | 'xray';

export interface FilamentOption {
  id: string;
  name: string;
  color: string;
  hex: number;
  roughness: number;
  metalness: number;
  clearcoat?: number;
}

const FILAMENTS: FilamentOption[] = [
  { id: 'cabai_red', name: 'Cabai Spicy Red', color: '#af101a', hex: 0xaf101a, roughness: 0.25, metalness: 0.1, clearcoat: 0.6 },
  { id: 'studio_black', name: 'Studio Jet Black', color: '#1a1a1a', hex: 0x1a1a1a, roughness: 0.35, metalness: 0.2, clearcoat: 0.4 },
  { id: 'pearl_white', name: 'Pearl PLA+ White', color: '#f0ede6', hex: 0xf0ede6, roughness: 0.3, metalness: 0.05, clearcoat: 0.5 },
  { id: 'imperial_gold', name: 'Silk Imperial Gold', color: '#d99b26', hex: 0xd99b26, roughness: 0.2, metalness: 0.75, clearcoat: 0.8 },
  { id: 'cyber_cyan', name: 'Cyber Neon Cyan', color: '#0ea5e9', hex: 0x0ea5e9, roughness: 0.2, metalness: 0.3, clearcoat: 0.7 },
  { id: 'ultra_purple', name: 'Deep Purple Galaxy', color: '#7c3aed', hex: 0x7c3aed, roughness: 0.25, metalness: 0.4, clearcoat: 0.6 }
];

export const Hero3DStage: React.FC<Hero3DStageProps> = ({
  onSelectProduct,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States
  const [activeModel, setActiveModel] = useState<ModelType>('chili');
  const [activeFilament, setActiveFilament] = useState<FilamentOption>(FILAMENTS[0]);
  const [renderMode, setRenderMode] = useState<RenderMode>('shaded');
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [isPrintingSim, setIsPrintingSim] = useState<boolean>(false);
  const [printProgress, setPrintProgress] = useState<number>(100); // 0 - 100%
  const [layerHeight, setLayerHeight] = useState<number>(0.12);
  const [isExploded, setIsExploded] = useState<boolean>(false);

  // Three.js internal refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const gantryGroupRef = useRef<THREE.Group | null>(null);
  const nozzleLightRef = useRef<THREE.PointLight | null>(null);
  const laserMeshRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const prevPointerPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameIdRef = useRef<number | null>(null);
  const explodedPartsRef = useRef<{ mesh: THREE.Object3D; origPos: THREE.Vector3; explodeOffset: THREE.Vector3 }[]>([]);

  // -------------------------------------------------------------
  // BUILD PROCEDURAL 3D MODELS
  // -------------------------------------------------------------

  // 1. Cabai Chili Mascot Keyring
  const createChiliModel = (material: THREE.Material): THREE.Group => {
    const group = new THREE.Group();
    group.name = 'chili_model';

    // Chili Pepper curved body using CatmullRomCurve3
    const curvePoints = [
      new THREE.Vector3(0, 3.2, 0),
      new THREE.Vector3(0.2, 2.4, 0.1),
      new THREE.Vector3(0.5, 1.2, 0.3),
      new THREE.Vector3(0.4, 0.0, 0.4),
      new THREE.Vector3(0.1, -1.2, 0.3),
      new THREE.Vector3(-0.3, -2.2, 0.1),
      new THREE.Vector3(-0.6, -3.0, -0.2),
      new THREE.Vector3(-0.8, -3.5, -0.4)
    ];

    const chiliCurve = new THREE.CatmullRomCurve3(curvePoints);
    
    // Custom geometry with varying radius
    const segments = 40;
    const radialSegments = 24;
    const frames = chiliCurve.computeFrenetFrames(segments, false);
    const chiliGeom = new THREE.BufferGeometry();
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    // Profile thickness along curve: t from 0 (top) to 1 (tip)
    const getRadius = (t: number) => {
      if (t < 0.1) return 0.5 + t * 5.0; // Neck expansion
      if (t < 0.35) return 1.0 + (t - 0.1) * 1.2; // Plump belly
      if (t < 0.7) return 1.3 - (t - 0.35) * 1.5; // Tapering
      return Math.max(0.08, 0.775 - (t - 0.7) * 2.3); // Sharp tip
    };

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const point = chiliCurve.getPointAt(t);
      const normal = frames.normals[i];
      const binormal = frames.binormals[i];
      const r = getRadius(t);

      for (let j = 0; j <= radialSegments; j++) {
        const theta = (j / radialSegments) * Math.PI * 2;
        const sin = Math.sin(theta);
        const cos = Math.cos(theta);

        // Organic bumpy deformation
        const organicBump = 1.0 + Math.sin(theta * 3 + t * 6) * 0.06;
        const cx = point.x + (normal.x * cos + binormal.x * sin) * r * organicBump;
        const cy = point.y + (normal.y * cos + binormal.y * sin) * r * organicBump;
        const cz = point.z + (normal.z * cos + binormal.z * sin) * r * organicBump;

        positions.push(cx, cy, cz);
        uvs.push(j / radialSegments, t);
      }
    }

    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < radialSegments; j++) {
        const a = i * (radialSegments + 1) + j;
        const b = (i + 1) * (radialSegments + 1) + j;
        const c = (i + 1) * (radialSegments + 1) + (j + 1);
        const d = i * (radialSegments + 1) + (j + 1);

        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    chiliGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    chiliGeom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    chiliGeom.setIndex(indices);
    chiliGeom.computeVertexNormals();

    const bodyMesh = new THREE.Mesh(chiliGeom, material);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    group.add(bodyMesh);

    // Green Calyx / Crown
    const calyxMat = new THREE.MeshStandardMaterial({
      color: 0x228b22,
      roughness: 0.4,
      metalness: 0.1
    });

    const calyxGroup = new THREE.Group();
    calyxGroup.position.set(0, 3.2, 0);

    // Star leaves
    const leafCount = 5;
    for (let l = 0; l < leafCount; l++) {
      const angle = (l / leafCount) * Math.PI * 2;
      const leafGeom = new THREE.ConeGeometry(0.35, 1.2, 4);
      leafGeom.rotateZ(-Math.PI / 3);
      const leafMesh = new THREE.Mesh(leafGeom, calyxMat);
      leafMesh.position.set(Math.cos(angle) * 0.4, -0.2, Math.sin(angle) * 0.4);
      leafMesh.rotation.y = angle;
      leafMesh.rotation.x = 0.2;
      calyxGroup.add(leafMesh);
    }

    // Curved Stem
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.1, 0.8, -0.1),
      new THREE.Vector3(0.3, 1.5, -0.3),
      new THREE.Vector3(0.6, 1.9, -0.4)
    ]);
    const stemGeom = new THREE.TubeGeometry(stemCurve, 16, 0.18, 8, false);
    const stemMesh = new THREE.Mesh(stemGeom, calyxMat);
    calyxGroup.add(stemMesh);
    group.add(calyxGroup);

    // Steel Keyring & Chain
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0xd0d0d8,
      metalness: 0.9,
      roughness: 0.15
    });

    // Keyring ring
    const ringGeom = new THREE.TorusGeometry(0.8, 0.08, 12, 32);
    const ringMesh = new THREE.Mesh(ringGeom, steelMat);
    ringMesh.position.set(0.8, 5.5, -0.4);
    ringMesh.rotation.x = Math.PI / 4;
    group.add(ringMesh);

    // 2 Chain links
    for (let k = 0; k < 2; k++) {
      const linkGeom = new THREE.TorusGeometry(0.28, 0.05, 8, 16);
      const linkMesh = new THREE.Mesh(linkGeom, steelMat);
      linkMesh.position.set(0.65 - k * 0.05, 4.7 - k * 0.45, -0.4);
      linkMesh.rotation.y = (k * Math.PI) / 2;
      group.add(linkMesh);
    }

    // Register exploded part offsets
    explodedPartsRef.current = [
      { mesh: bodyMesh, origPos: bodyMesh.position.clone(), explodeOffset: new THREE.Vector3(0, -0.8, 0) },
      { mesh: calyxGroup, origPos: calyxGroup.position.clone(), explodeOffset: new THREE.Vector3(0, 1.2, 0) },
      { mesh: ringMesh, origPos: ringMesh.position.clone(), explodeOffset: new THREE.Vector3(0.4, 2.0, 0) }
    ];

    group.position.y = 0.5;
    return group;
  };

  // 2. Mechanical Switch Clicker
  const createClickerModel = (material: THREE.Material): THREE.Group => {
    const group = new THREE.Group();
    group.name = 'clicker_model';

    // Base Enclosure (Black bottom shell)
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.6,
      metalness: 0.1
    });
    const baseGeom = new THREE.BoxGeometry(3.6, 1.4, 3.6);
    const baseMesh = new THREE.Mesh(baseGeom, baseMat);
    baseMesh.position.y = -1.2;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    // Transparent Top Switch Housing
    const clearHousingMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      roughness: 0.1,
      metalness: 0.05,
      transmission: 0.85,
      ior: 1.45
    });
    const housingGeom = new THREE.BoxGeometry(3.2, 1.2, 3.2);
    const housingMesh = new THREE.Mesh(housingGeom, clearHousingMat);
    housingMesh.position.y = 0.1;
    group.add(housingMesh);

    // Switch Stem (Red tactile cross)
    const stemGroup = new THREE.Group();
    stemGroup.position.y = 0.8;
    const crossBar1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.9, 1.4), material);
    const crossBar2 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.9, 0.4), material);
    stemGroup.add(crossBar1, crossBar2);
    group.add(stemGroup);

    // Keycap on top
    const capGeom = new THREE.CylinderGeometry(1.4, 1.7, 1.2, 4);
    capGeom.rotateY(Math.PI / 4);
    const capMesh = new THREE.Mesh(capGeom, material);
    capMesh.position.y = 1.9;
    capMesh.castShadow = true;
    group.add(capMesh);

    // Keychain Hole loop
    const holeGeom = new THREE.TorusGeometry(0.45, 0.08, 12, 24);
    const holeMesh = new THREE.Mesh(holeGeom, baseMat);
    holeMesh.position.set(-1.9, -1.2, 0);
    holeMesh.rotation.y = Math.PI / 2;
    group.add(holeMesh);

    explodedPartsRef.current = [
      { mesh: baseMesh, origPos: baseMesh.position.clone(), explodeOffset: new THREE.Vector3(0, -1.5, 0) },
      { mesh: housingMesh, origPos: housingMesh.position.clone(), explodeOffset: new THREE.Vector3(0, 0, 0) },
      { mesh: stemGroup, origPos: stemGroup.position.clone(), explodeOffset: new THREE.Vector3(0, 1.2, 0) },
      { mesh: capMesh, origPos: capMesh.position.clone(), explodeOffset: new THREE.Vector3(0, 2.6, 0) }
    ];

    group.position.y = 0.6;
    return group;
  };

  // 3. Honeycomb Desk Organizer
  const createHoneycombModel = (material: THREE.Material): THREE.Group => {
    const group = new THREE.Group();
    group.name = 'honeycomb_model';

    const hexRadius = 0.95;
    const hexHeight = 3.6;

    const hexPositions = [
      { x: 0, z: 0, h: 4.2 },
      { x: hexRadius * 1.6, z: 0, h: 3.5 },
      { x: -hexRadius * 1.6, z: 0, h: 3.5 },
      { x: hexRadius * 0.8, z: hexRadius * 1.4, h: 2.8 },
      { x: -hexRadius * 0.8, z: hexRadius * 1.4, h: 2.8 },
      { x: hexRadius * 0.8, z: -hexRadius * 1.4, h: 3.8 },
      { x: -hexRadius * 0.8, z: -hexRadius * 1.4, h: 3.8 }
    ];

    hexPositions.forEach((pos, idx) => {
      const hexOuter = new THREE.CylinderGeometry(hexRadius, hexRadius, pos.h, 6);
      const mesh = new THREE.Mesh(hexOuter, material);
      mesh.position.set(pos.x, pos.h / 2 - 1.5, pos.z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
    });

    // Solid Chamfered Base Tray
    const baseGeom = new THREE.CylinderGeometry(3.4, 3.7, 0.4, 6);
    const baseMesh = new THREE.Mesh(baseGeom, material);
    baseMesh.position.y = -1.7;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    group.position.y = 0.8;
    return group;
  };

  // 4. Articulated Toy Mascot (Segmented Flexi)
  const createArticulatedModel = (material: THREE.Material): THREE.Group => {
    const group = new THREE.Group();
    group.name = 'articulated_model';

    // Head
    const headGeom = new THREE.SphereGeometry(1.2, 24, 24);
    headGeom.scale(1.1, 0.9, 1.2);
    const headMesh = new THREE.Mesh(headGeom, material);
    headMesh.position.set(0, 1.8, 0);
    headMesh.castShadow = true;
    group.add(headMesh);

    // Eyes
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1 });
    const eyeLeft = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), eyeMat);
    eyeLeft.position.set(0.45, 2.0, 1.05);
    const eyeRight = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), eyeMat);
    eyeRight.position.set(-0.45, 2.0, 1.05);
    group.add(eyeLeft, eyeRight);

    // Segmented links
    const linkCount = 5;
    for (let i = 0; i < linkCount; i++) {
      const segSize = 1.0 - i * 0.12;
      const segGeom = new THREE.CylinderGeometry(segSize, segSize * 0.9, 0.65, 16);
      segGeom.rotateX(Math.PI / 2);
      const segMesh = new THREE.Mesh(segGeom, material);
      segMesh.position.set(
        Math.sin(i * 0.6) * 0.35,
        0.9 - i * 0.7,
        -i * 0.35
      );
      segMesh.castShadow = true;
      group.add(segMesh);

      // Ball hinge
      const hingeGeom = new THREE.SphereGeometry(0.25, 12, 12);
      const hingeMesh = new THREE.Mesh(hingeGeom, material);
      hingeMesh.position.set(
        Math.sin(i * 0.6) * 0.35,
        0.55 - i * 0.7,
        -i * 0.35
      );
      group.add(hingeMesh);
    }

    group.position.y = 0.5;
    return group;
  };

  // -------------------------------------------------------------
  // THREE.JS INITIALIZATION & RENDER PIPELINE
  // -------------------------------------------------------------

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(8.5, 6.5, 10.5);
    camera.lookAt(0, 0.4, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // -------------------------------------------------------------
    // STUDIO LIGHTING SETUP
    // -------------------------------------------------------------
    
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Key Light (Warm Studio Key)
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(7, 12, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Fill Light (Cool Rim)
    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.2);
    fillLight.position.set(-8, 5, -6);
    scene.add(fillLight);

    // Underside accent light (Cabai Glow)
    const underLight = new THREE.PointLight(0xaf101a, 1.5, 12);
    underLight.position.set(0, -1.8, 0);
    scene.add(underLight);

    // -------------------------------------------------------------
    // 3D PRINT BED & COREXY GANTRY
    // -------------------------------------------------------------

    // Heated Print Bed Platform
    const bedGroup = new THREE.Group();
    bedGroup.position.y = -2.5;

    // Aluminum plate
    const plateGeom = new THREE.BoxGeometry(10, 0.25, 10);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x242426,
      roughness: 0.7,
      metalness: 0.6
    });
    const plateMesh = new THREE.Mesh(plateGeom, plateMat);
    plateMesh.receiveShadow = true;
    bedGroup.add(plateMesh);

    // Textured PEI Sheet Top
    const peiGeom = new THREE.PlaneGeometry(9.4, 9.4);
    const peiMat = new THREE.MeshStandardMaterial({
      color: 0x1f1f21,
      roughness: 0.4,
      metalness: 0.2
    });
    const peiMesh = new THREE.Mesh(peiGeom, peiMat);
    peiMesh.rotation.x = -Math.PI / 2;
    peiMesh.position.y = 0.13;
    peiMesh.receiveShadow = true;
    bedGroup.add(peiMesh);

    // Grid Mesh on Bed
    const gridHelper = new THREE.GridHelper(9.4, 20, 0xaf101a, 0x3f3f46);
    gridHelper.position.y = 0.14;
    bedGroup.add(gridHelper);

    // Axis Arrows & Corner Brackets
    const axisLabels = [
      { pos: [4.4, 0.15, 4.4], col: 0xaf101a },
      { pos: [-4.4, 0.15, 4.4], col: 0x52525b },
      { pos: [4.4, 0.15, -4.4], col: 0x52525b },
      { pos: [-4.4, 0.15, -4.4], col: 0x52525b }
    ];
    axisLabels.forEach((c) => {
      const cornerGeom = new THREE.BoxGeometry(0.6, 0.05, 0.6);
      const cornerMat = new THREE.MeshBasicMaterial({ color: c.col });
      const cornerMesh = new THREE.Mesh(cornerGeom, cornerMat);
      cornerMesh.position.set(c.pos[0], c.pos[1], c.pos[2]);
      bedGroup.add(cornerMesh);
    });

    scene.add(bedGroup);

    // -------------------------------------------------------------
    // GANTRY & NOZZLE ASSEMBLY (Animated simulation)
    // -------------------------------------------------------------
    const gantryGroup = new THREE.Group();
    gantryGroup.position.set(0, 2.5, 0);

    // Linear rod X
    const rodGeom = new THREE.CylinderGeometry(0.08, 0.08, 10.5, 12);
    rodGeom.rotateZ(Math.PI / 2);
    const rodMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.1 });
    const rodMesh1 = new THREE.Mesh(rodGeom, rodMat);
    const rodMesh2 = new THREE.Mesh(rodGeom, rodMat);
    rodMesh2.position.z = 0.6;
    gantryGroup.add(rodMesh1, rodMesh2);

    // Toolhead Carriage
    const toolheadMat = new THREE.MeshStandardMaterial({ color: 0x111113, roughness: 0.5 });
    const carriageGeom = new THREE.BoxGeometry(1.6, 1.4, 1.6);
    const carriageMesh = new THREE.Mesh(carriageGeom, toolheadMat);
    carriageMesh.position.set(0, 0.2, 0.3);
    gantryGroup.add(carriageMesh);

    // Brass Nozzle
    const nozzleGeom = new THREE.ConeGeometry(0.2, 0.5, 8);
    nozzleGeom.rotateX(Math.PI);
    const nozzleMat = new THREE.MeshStandardMaterial({ color: 0xeab308, metalness: 0.85, roughness: 0.2 });
    const nozzleMesh = new THREE.Mesh(nozzleGeom, nozzleMat);
    nozzleMesh.position.set(0, -0.6, 0.3);
    gantryGroup.add(nozzleMesh);

    // Glowing Nozzle Light
    const nozzleLight = new THREE.PointLight(0xff5533, 2, 4);
    nozzleLight.position.set(0, -0.8, 0.3);
    gantryGroup.add(nozzleLight);
    nozzleLightRef.current = nozzleLight;

    // Laser crosshair cone
    const laserGeom = new THREE.ConeGeometry(0.8, 3.5, 16, 1, true);
    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xaf101a,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const laserMesh = new THREE.Mesh(laserGeom, laserMat);
    laserMesh.position.set(0, -2.4, 0.3);
    gantryGroup.add(laserMesh);
    laserMeshRef.current = laserMesh;

    scene.add(gantryGroup);
    gantryGroupRef.current = gantryGroup;

    // -------------------------------------------------------------
    // PARTICLES / FILAMENT TRAIL
    // -------------------------------------------------------------
    const particleCount = 60;
    const particleGeom = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount; p++) {
      particlePos[p * 3] = (Math.random() - 0.5) * 6;
      particlePos[p * 3 + 1] = Math.random() * 5 - 2;
      particlePos[p * 3 + 2] = (Math.random() - 0.5) * 6;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xaf101a,
      size: 0.08,
      transparent: true,
      opacity: 0.6
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    scene.add(particleSystem);
    particlesRef.current = particleSystem;

    // -------------------------------------------------------------
    // MODEL GROUP
    // -------------------------------------------------------------
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // -------------------------------------------------------------
    // ANIMATION LOOP
    // -------------------------------------------------------------
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Auto-rotation of model
      if (modelGroupRef.current && isAutoRotating) {
        modelGroupRef.current.rotation.y += delta * 0.5;
      }

      // Gantry & Nozzle Animation
      if (gantryGroupRef.current) {
        if (isPrintingSim) {
          // Sweeping print head movement in 3D CoreXY pattern
          gantryGroupRef.current.position.x = Math.sin(elapsed * 4) * 2.2;
          gantryGroupRef.current.position.z = Math.cos(elapsed * 2.5) * 2.2;
          gantryGroupRef.current.position.y = -1.5 + (Math.sin(elapsed * 0.8) + 1) * 2.0;

          if (laserMeshRef.current) laserMeshRef.current.visible = true;
          if (nozzleLightRef.current) nozzleLightRef.current.intensity = 3.5 + Math.sin(elapsed * 20) * 1.5;
        } else {
          // Idle floating gentle hover
          gantryGroupRef.current.position.y = 3.2 + Math.sin(elapsed * 1.5) * 0.2;
          gantryGroupRef.current.position.x = Math.sin(elapsed * 0.7) * 0.5;
          if (laserMeshRef.current) laserMeshRef.current.visible = false;
          if (nozzleLightRef.current) nozzleLightRef.current.intensity = 1.5;
        }
      }

      // Spark particles floating upwards
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] += delta * 0.8;
          if (positions[i * 3 + 1] > 3.5) {
            positions[i * 3 + 1] = -2.2;
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // -------------------------------------------------------------
  // REBUILD MODEL ON TYPE / FILAMENT / RENDERMODE CHANGE
  // -------------------------------------------------------------

  const updateModel = useCallback(() => {
    if (!modelGroupRef.current || !sceneRef.current) return;

    // Clear old children
    while (modelGroupRef.current.children.length > 0) {
      const obj = modelGroupRef.current.children[0];
      modelGroupRef.current.remove(obj);
    }
    explodedPartsRef.current = [];

    // Create material based on render mode & filament
    let primaryMaterial: THREE.Material;

    if (renderMode === 'wireframe') {
      primaryMaterial = new THREE.MeshBasicMaterial({
        color: activeFilament.hex,
        wireframe: true
      });
    } else if (renderMode === 'slicer') {
      primaryMaterial = new THREE.MeshStandardMaterial({
        color: activeFilament.hex,
        roughness: 0.8,
        wireframe: false
      });
    } else if (renderMode === 'xray') {
      primaryMaterial = new THREE.MeshPhysicalMaterial({
        color: activeFilament.hex,
        transparent: true,
        opacity: 0.45,
        transmission: 0.6,
        roughness: 0.1,
        metalness: 0.1
      });
    } else {
      // Standard Realistic Shaded
      primaryMaterial = new THREE.MeshPhysicalMaterial({
        color: activeFilament.hex,
        roughness: activeFilament.roughness,
        metalness: activeFilament.metalness,
        clearcoat: activeFilament.clearcoat || 0.5,
        clearcoatRoughness: 0.1
      });
    }

    let newModel: THREE.Group;
    switch (activeModel) {
      case 'chili':
        newModel = createChiliModel(primaryMaterial);
        break;
      case 'clicker':
        newModel = createClickerModel(primaryMaterial);
        break;
      case 'honeycomb':
        newModel = createHoneycombModel(primaryMaterial);
        break;
      case 'articulated':
        newModel = createArticulatedModel(primaryMaterial);
        break;
      default:
        newModel = createChiliModel(primaryMaterial);
    }

    modelGroupRef.current.add(newModel);

    // If slicer mode is selected, add simulated layer lines rings
    if (renderMode === 'slicer') {
      const layerLinesGroup = new THREE.Group();
      for (let y = -2; y < 4; y += 0.25) {
        const ring = new THREE.GridHelper(3.8, 12, 0xffffff, 0x444444);
        ring.position.y = y;
        layerLinesGroup.add(ring);
      }
      modelGroupRef.current.add(layerLinesGroup);
    }
  }, [activeModel, activeFilament, renderMode]);

  useEffect(() => {
    updateModel();
  }, [updateModel]);

  // Handle Explode Animation
  useEffect(() => {
    if (!explodedPartsRef.current.length) return;
    explodedPartsRef.current.forEach(({ mesh, origPos, explodeOffset }) => {
      if (isExploded) {
        mesh.position.set(
          origPos.x + explodeOffset.x,
          origPos.y + explodeOffset.y,
          origPos.z + explodeOffset.z
        );
      } else {
        mesh.position.copy(origPos);
      }
    });
  }, [isExploded]);

  // -------------------------------------------------------------
  // MOUSE & TOUCH ORBIT DRAG CONTROLS
  // -------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    prevPointerPosRef.current = { x: e.clientX, y: e.clientY };
    setIsAutoRotating(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !modelGroupRef.current || !cameraRef.current) return;
    const deltaX = e.clientX - prevPointerPosRef.current.x;
    const deltaY = e.clientY - prevPointerPosRef.current.y;

    modelGroupRef.current.rotation.y += deltaX * 0.008;
    modelGroupRef.current.rotation.x = Math.max(-0.6, Math.min(0.6, modelGroupRef.current.rotation.x + deltaY * 0.005));

    prevPointerPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const resetCamera = () => {
    if (!cameraRef.current || !modelGroupRef.current) return;
    cameraRef.current.position.set(8.5, 6.5, 10.5);
    cameraRef.current.lookAt(0, 0.4, 0);
    modelGroupRef.current.rotation.set(0, 0, 0);
    setIsAutoRotating(true);
  };

  return (
    <div className={`relative w-full rounded-2xl bg-[#141416] border border-white/10 shadow-2xl overflow-hidden select-none ${className}`}>
      
      {/* 3D WebGL Canvas */}
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-[460px] sm:h-[540px] lg:h-[600px] cursor-grab active:cursor-grabbing relative"
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Top HUD: Studio Status & Coordinates */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-white text-[11px] font-mono-code">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>COREXY 3D STAGE</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md text-white/80 text-[10px] font-mono-code border border-white/5">
              <span>RES: 0.12mm</span>
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={resetCamera}
              className="p-1.5 rounded-md bg-black/60 hover:bg-white/20 text-white/80 transition-colors border border-white/10 cursor-pointer"
              title="Reset 3D Camera View"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAutoRotating(!isAutoRotating)}
              className={`p-1.5 rounded-md text-white/80 transition-colors border border-white/10 cursor-pointer ${
                isAutoRotating ? 'bg-[#af101a] text-white' : 'bg-black/60 hover:bg-white/20'
              }`}
              title="Toggle Auto Spin"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Floating 3D Interaction Hint */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none z-10 text-center">
          <span className="text-[10px] font-mono-code uppercase tracking-widest text-white/40 bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs border border-white/5">
            ⇄ Drag to Rotate 360° • Scroll to Zoom
          </span>
        </div>

        {/* Bottom Left: Live Simulation Toolpath Button */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2">
          <button
            onClick={() => setIsPrintingSim(!isPrintingSim)}
            className={`px-3 py-1.5 rounded-md font-mono-code text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg ${
              isPrintingSim 
                ? 'bg-amber-500 text-black animate-pulse' 
                : 'bg-black/70 hover:bg-[#af101a] text-white border border-white/15'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isPrintingSim ? 'Simulating Extrusion...' : 'Live Print Sim'}</span>
          </button>

          <button
            onClick={() => setIsExploded(!isExploded)}
            className={`px-3 py-1.5 rounded-md font-mono-code text-xs font-semibold transition-all border border-white/15 cursor-pointer ${
              isExploded ? 'bg-purple-600 text-white' : 'bg-black/70 text-white hover:bg-white/10'
            }`}
          >
            <span>{isExploded ? 'Assemble' : 'Explode 3D'}</span>
          </button>
        </div>

        {/* Bottom Right: Render Mode Switcher */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1 bg-black/80 backdrop-blur-md p-1 rounded-lg border border-white/15">
          {(['shaded', 'wireframe', 'slicer', 'xray'] as RenderMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setRenderMode(mode)}
              className={`px-2 py-1 rounded-sm text-[10px] font-mono-code uppercase transition-all cursor-pointer ${
                renderMode === mode 
                  ? 'bg-[#af101a] text-white font-bold' 
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3D STUDIO INTERACTIVE CONTROLS STRIP */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 bg-[#1a1a1c] border-t border-white/10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Model Switcher Tabs (Col 1-7) */}
        <div className="md:col-span-7 space-y-2">
          <div className="flex items-center justify-between">
            <span className="studio-label text-[10px] text-white/50">
              SELECT 3D PROTOTYPE:
            </span>
            <span className="text-[10px] font-mono-code text-[#af101a] font-bold">
              0.12mm Precision PLA+
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'chili', name: 'Cabai Mascot', icon: '🌶️', label: 'Keyring' },
              { id: 'clicker', name: 'Switch Clicker', icon: '⌨️', label: 'Fidget' },
              { id: 'honeycomb', name: 'Desk Organizer', icon: '🍯', label: 'Modular' },
              { id: 'articulated', name: 'Flexi Mascot', icon: '🦎', label: 'Toy' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  setActiveModel(m.id as ModelType);
                  if (onSelectProduct) onSelectProduct(m.id);
                }}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  activeModel === m.id
                    ? 'bg-[#af101a] border-[#af101a] text-white shadow-md'
                    : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-base">{m.icon}</span>
                  <span className="text-[9px] font-mono-code opacity-60 uppercase">{m.label}</span>
                </div>
                <div className="font-heading font-bold text-xs mt-1 truncate">
                  {m.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filament Color Swatches (Col 8-12) */}
        <div className="md:col-span-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="studio-label text-[10px] text-white/50">
              FILAMENT SHADE:
            </span>
            <span className="text-[10px] font-mono-code text-white/80">
              {activeFilament.name}
            </span>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-lg bg-black/40 border border-white/10 justify-between">
            {FILAMENTS.map((fil) => (
              <button
                key={fil.id}
                onClick={() => setActiveFilament(fil)}
                className={`w-7 h-7 rounded-full transition-transform cursor-pointer relative flex items-center justify-center ${
                  activeFilament.id === fil.id
                    ? 'ring-2 ring-white scale-110 shadow-lg'
                    : 'hover:scale-105 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: fil.color }}
                title={fil.name}
              >
                {activeFilament.id === fil.id && (
                  <Check className="w-3.5 h-3.5 text-white drop-shadow-md" />
                )}
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
