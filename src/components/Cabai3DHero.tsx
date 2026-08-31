import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';
import { soundFx } from '../utils/audio';
import { 
  RotateCw, 
  Flame, 
  Layers, 
  ShoppingBag, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Eye, 
  Check, 
  Maximize2,
  Gauge
} from 'lucide-react';

export interface CabaiFilament {
  id: string;
  name: string;
  hex: number;
  roughness: number;
  metalness: number;
  clearcoat?: number;
  emissive?: number;
  emissiveIntensity?: number;
  accent: string;
}

const CABAI_FILAMENTS: CabaiFilament[] = [
  { id: 'cabai_red', name: 'Cabai Spicy Red', hex: 0xaf101a, roughness: 0.18, metalness: 0.15, clearcoat: 0.8, accent: '#AF101A' },
  { id: 'ghost_fire', name: 'Ghost Chili Flame', hex: 0xff3b14, roughness: 0.22, metalness: 0.1, clearcoat: 0.6, emissive: 0x3a0800, emissiveIntensity: 0.4, accent: '#FF3B14' },
  { id: 'imperial_gold', name: 'Silk Imperial Gold', hex: 0xd99b26, roughness: 0.18, metalness: 0.85, clearcoat: 0.9, accent: '#D99B26' },
  { id: 'stealth_carbon', name: 'Stealth Carbon Black', hex: 0x18181b, roughness: 0.4, metalness: 0.3, clearcoat: 0.3, accent: '#52525B' },
  { id: 'cyber_emerald', name: 'Cyber Neon Emerald', hex: 0x10b981, roughness: 0.2, metalness: 0.4, clearcoat: 0.7, accent: '#10B981' },
  { id: 'pearl_white', name: 'Pearl PLA+ White', hex: 0xf4f4f5, roughness: 0.25, metalness: 0.05, clearcoat: 0.6, accent: '#E4E4E7' }
];

export const Cabai3DHero: React.FC = () => {
  const { addToCart, products, openProductDetail } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States
  const [selectedFilament, setSelectedFilament] = useState<CabaiFilament>(CABAI_FILAMENTS[0]);
  const [spinSpeed, setSpinSpeed] = useState<'normal' | 'fast' | 'paused'>('normal');
  const [renderMode, setRenderMode] = useState<'solid' | 'wireframe' | 'slicer'>('solid');
  const [heatLevel, setHeatLevel] = useState<number>(350000); // Scoville SHU
  const [clickCount, setClickCount] = useState<number>(0);
  const [soundActive, setSoundActive] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const chiliGroupRef = useRef<THREE.Group | null>(null);
  const chiliBodyMeshRef = useRef<THREE.Mesh | null>(null);
  const particleSystemRef = useRef<THREE.Points | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const autoSpinRef = useRef<number>(0.012);

  // Sync spin speed to ref for render loop
  useEffect(() => {
    if (spinSpeed === 'paused') {
      autoSpinRef.current = 0;
    } else if (spinSpeed === 'fast') {
      autoSpinRef.current = 0.038;
    } else {
      autoSpinRef.current = 0.014;
    }
  }, [spinSpeed]);

  // -------------------------------------------------------------
  // THREE.JS SCENE INITIALIZATION & CHILI MESH GENERATION
  // -------------------------------------------------------------
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 420;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 11);
    cameraRef.current = camera;

    // WebGL Renderer
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
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;

    // Lighting setup for glossy 3D plastic reflections
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    mainKeyLight.position.set(6, 10, 8);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 1024;
    mainKeyLight.shadow.mapSize.height = 1024;
    mainKeyLight.shadow.bias = -0.0005;
    scene.add(mainKeyLight);

    const rimLight = new THREE.DirectionalLight(0xff5555, 2.0);
    rimLight.position.set(-8, 5, -6);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffffff, 1.4, 20);
    fillLight.position.set(0, -4, 5);
    scene.add(fillLight);

    // Warm underside spicy glow
    const spicyUnderGlow = new THREE.PointLight(0xaf101a, 3.5, 12);
    spicyUnderGlow.position.set(0, -3, 0);
    scene.add(spicyUnderGlow);

    // Subtle 3D Grid Stage
    const gridHelper = new THREE.GridHelper(16, 16, 0xaf101a, 0x27272a);
    gridHelper.position.y = -3.8;
    scene.add(gridHelper);

    // Shadow Floor Catcher
    const shadowPlaneGeom = new THREE.PlaneGeometry(16, 16);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeom, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -3.81;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    // ---------------------------------------------------------
    // BUILD ORGANIC 3D CABAI CHILI KEYCHAIN
    // ---------------------------------------------------------
    const chiliMasterGroup = new THREE.Group();
    chiliMasterGroup.position.set(0, -0.2, 0);
    chiliGroupRef.current = chiliMasterGroup;
    scene.add(chiliMasterGroup);

    // 1. Chili Pepper Body Spline Geometry
    const curvePoints = [
      new THREE.Vector3(0, 2.6, 0),
      new THREE.Vector3(0.2, 1.9, 0.1),
      new THREE.Vector3(0.45, 0.9, 0.25),
      new THREE.Vector3(0.4, -0.2, 0.35),
      new THREE.Vector3(0.1, -1.3, 0.25),
      new THREE.Vector3(-0.35, -2.2, 0.1),
      new THREE.Vector3(-0.7, -3.0, -0.2),
      new THREE.Vector3(-0.9, -3.5, -0.35)
    ];
    const chiliCurve = new THREE.CatmullRomCurve3(curvePoints);

    const segments = 48;
    const radialSegments = 28;
    const frames = chiliCurve.computeFrenetFrames(segments, false);
    const chiliGeom = new THREE.BufferGeometry();
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const getRadius = (t: number) => {
      if (t < 0.1) return 0.45 + t * 4.5;
      if (t < 0.35) return 0.9 + (t - 0.1) * 1.1;
      if (t < 0.7) return 1.18 - (t - 0.35) * 1.4;
      return Math.max(0.06, 0.69 - (t - 0.7) * 2.1);
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

        // Organic wavy ridges along the skin of chili
        const organicBump = 1.0 + Math.sin(theta * 4 + t * 8) * 0.05 + Math.cos(theta * 2) * 0.03;
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

    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: selectedFilament.hex,
      roughness: selectedFilament.roughness,
      metalness: selectedFilament.metalness,
      clearcoat: selectedFilament.clearcoat ?? 0.8,
      clearcoatRoughness: 0.1,
      emissive: selectedFilament.emissive ? new THREE.Color(selectedFilament.emissive) : new THREE.Color(0x000000),
      emissiveIntensity: selectedFilament.emissiveIntensity ?? 0
    });

    const chiliBodyMesh = new THREE.Mesh(chiliGeom, bodyMaterial);
    chiliBodyMesh.castShadow = true;
    chiliBodyMesh.receiveShadow = true;
    chiliMasterGroup.add(chiliBodyMesh);
    chiliBodyMeshRef.current = chiliBodyMesh;

    // 2. Green Calyx & Star Leaves
    const calyxMat = new THREE.MeshStandardMaterial({
      color: 0x228b22,
      roughness: 0.35,
      metalness: 0.1
    });

    const calyxGroup = new THREE.Group();
    calyxGroup.position.set(0, 2.6, 0);

    const leafCount = 5;
    for (let l = 0; l < leafCount; l++) {
      const angle = (l / leafCount) * Math.PI * 2;
      const leafGeom = new THREE.ConeGeometry(0.32, 1.1, 4);
      leafGeom.rotateZ(-Math.PI / 3.2);
      const leafMesh = new THREE.Mesh(leafGeom, calyxMat);
      leafMesh.position.set(Math.cos(angle) * 0.35, -0.15, Math.sin(angle) * 0.35);
      leafMesh.rotation.y = angle;
      leafMesh.rotation.x = 0.25;
      leafMesh.castShadow = true;
      calyxGroup.add(leafMesh);
    }

    // Curved Chili Stem
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.1, 0.7, -0.1),
      new THREE.Vector3(0.25, 1.3, -0.25),
      new THREE.Vector3(0.5, 1.7, -0.35)
    ]);
    const stemGeom = new THREE.TubeGeometry(stemCurve, 16, 0.16, 8, false);
    const stemMesh = new THREE.Mesh(stemGeom, calyxMat);
    stemMesh.castShadow = true;
    calyxGroup.add(stemMesh);
    chiliMasterGroup.add(calyxGroup);

    // 3. Stainless Steel Keyring & Chains
    const steelMat = new THREE.MeshStandardMaterial({
      color: 0xe4e4e7,
      metalness: 0.92,
      roughness: 0.12
    });

    // Keyring ring
    const ringGeom = new THREE.TorusGeometry(0.7, 0.07, 16, 32);
    const ringMesh = new THREE.Mesh(ringGeom, steelMat);
    ringMesh.position.set(0.65, 4.6, -0.35);
    ringMesh.rotation.x = Math.PI / 4;
    ringMesh.castShadow = true;
    chiliMasterGroup.add(ringMesh);

    // 2 Chain links connecting stem to ring
    for (let k = 0; k < 2; k++) {
      const linkGeom = new THREE.TorusGeometry(0.24, 0.045, 8, 16);
      const linkMesh = new THREE.Mesh(linkGeom, steelMat);
      linkMesh.position.set(0.55 - k * 0.05, 3.9 - k * 0.35, -0.35);
      linkMesh.rotation.y = (k * Math.PI) / 2;
      linkMesh.castShadow = true;
      chiliMasterGroup.add(linkMesh);
    }

    // 4. Floating Spicy Ember Sparks Particle System
    const particleCount = 75;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount; p++) {
      particlePositions[p * 3] = (Math.random() - 0.5) * 5;
      particlePositions[p * 3 + 1] = (Math.random() - 0.5) * 6;
      particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 5;

      particleVelocities[p * 3] = (Math.random() - 0.5) * 0.01;
      particleVelocities[p * 3 + 1] = 0.01 + Math.random() * 0.02; // Float up
      particleVelocities[p * 3 + 2] = (Math.random() - 0.5) * 0.01;
    }

    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xff4d5a,
      size: 0.12,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);
    particleSystemRef.current = particles;

    // ---------------------------------------------------------
    // RENDER LOOP (Always turns smoothly + floating bob)
    // ---------------------------------------------------------
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Continuous rotation
      if (chiliGroupRef.current && !isDraggingRef.current) {
        chiliGroupRef.current.rotation.y += autoSpinRef.current;
        
        // Gentle organic floating oscillation
        chiliGroupRef.current.position.y = -0.2 + Math.sin(elapsedTime * 1.6) * 0.15;
        chiliGroupRef.current.rotation.z = Math.sin(elapsedTime * 0.8) * 0.05;
      }

      // Animate floating ember sparks
      if (particleSystemRef.current) {
        const positions = particleSystemRef.current.geometry.attributes.position.array as Float32Array;
        for (let p = 0; p < particleCount; p++) {
          positions[p * 3 + 1] += particleVelocities[p * 3 + 1];
          if (positions[p * 3 + 1] > 4.5) {
            positions[p * 3 + 1] = -3.5;
            positions[p * 3] = (Math.random() - 0.5) * 4;
            positions[p * 3 + 2] = (Math.random() - 0.5) * 4;
          }
        }
        particleSystemRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 420;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      renderer.dispose();
    };
  }, []);

  // -------------------------------------------------------------
  // DYNAMIC MATERIAL & RENDER MODE UPDATER
  // -------------------------------------------------------------
  useEffect(() => {
    if (!chiliBodyMeshRef.current) return;

    if (renderMode === 'wireframe') {
      chiliBodyMeshRef.current.material = new THREE.MeshBasicMaterial({
        color: selectedFilament.hex,
        wireframe: true
      });
    } else if (renderMode === 'slicer') {
      // Slicer preview simulation: high contrast striped material
      chiliBodyMeshRef.current.material = new THREE.MeshStandardMaterial({
        color: selectedFilament.hex,
        roughness: 0.7,
        metalness: 0.1,
        wireframeLinewidth: 2
      });
    } else {
      // Solid Shaded Glossy PLA+
      chiliBodyMeshRef.current.material = new THREE.MeshPhysicalMaterial({
        color: selectedFilament.hex,
        roughness: selectedFilament.roughness,
        metalness: selectedFilament.metalness,
        clearcoat: selectedFilament.clearcoat ?? 0.8,
        clearcoatRoughness: 0.1,
        emissive: selectedFilament.emissive ? new THREE.Color(selectedFilament.emissive) : new THREE.Color(0x000000),
        emissiveIntensity: selectedFilament.emissiveIntensity ?? 0
      });
    }
  }, [selectedFilament, renderMode]);

  // -------------------------------------------------------------
  // INTERACTIVE MOUSE & TOUCH ORBIT DRAG
  // -------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    if (soundActive) {
      soundFx.playSwitchClick('red');
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !chiliGroupRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;

    chiliGroupRef.current.rotation.y += deltaX * 0.01;
    chiliGroupRef.current.rotation.x = Math.max(-0.6, Math.min(0.6, chiliGroupRef.current.rotation.x + deltaY * 0.008));

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // -------------------------------------------------------------
  // SPICY INTERACTIVE TAP ACTION
  // -------------------------------------------------------------
  const handleSpicyTap = (e: React.MouseEvent) => {
    setClickCount(prev => prev + 1);
    setHeatLevel(prev => Math.min(2500000, prev + 85000));

    if (soundActive) {
      soundFx.playSpicySizzle();
    }

    // Give a brief energetic spin acceleration on click
    if (chiliGroupRef.current) {
      chiliGroupRef.current.rotation.y += 0.45;
    }
  };

  // Quick Direct Add to Cart Action
  const handleQuickAdd = () => {
    const chiliProd = products.find(p => p.id === 'prod-cabai-keychain') || products[0];
    if (chiliProd) {
      addToCart(chiliProd, 1, {
        id: selectedFilament.id,
        name: selectedFilament.name,
        hex: selectedFilament.accent
      }, '100% Rigid Eco PLA+');

      if (soundActive) {
        soundFx.playSpicySizzle();
      }

      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2200);
    }
  };

  return (
    <div 
      className="relative w-full rounded-3xl bg-[#0E0E11] border border-white/15 overflow-hidden shadow-2xl group transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${selectedFilament.accent}33 0%, rgba(0,0,0,0) 70%)`
        }}
      />

      {/* Top Floating Interactive HUD */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Left Badge: 3D Chili Status & Live Turn Indicator */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#18181B]/90 backdrop-blur-md border border-white/15 text-white text-xs font-mono-code font-bold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#FF4D5A] animate-ping" />
            <span className="text-[#FF4D5A]">3D CABAI CORE</span>
            <span className="text-white/40">|</span>
            <span className="text-white/80 flex items-center gap-1">
              <RotateCw className={`w-3 h-3 text-[#FF4D5A] ${spinSpeed !== 'paused' ? 'animate-spin' : ''}`} />
              <span>{spinSpeed === 'paused' ? 'Paused' : spinSpeed === 'fast' ? 'Fast Spin' : 'Continuous 360°'}</span>
            </span>
          </div>
        </div>

        {/* Right HUD Controls: Sound & View Modes */}
        <div className="flex items-center gap-2 pointer-events-auto">
          
          {/* Sound Synthesizer Toggle */}
          <button
            onClick={() => {
              const next = soundFx.toggleSound();
              setSoundActive(next);
              if (next) soundFx.playStudioBeep(720);
            }}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer shadow-md ${
              soundActive 
                ? 'bg-[#18181B]/90 text-white border-white/20 hover:bg-[#27272A]' 
                : 'bg-[#18181B]/50 text-white/40 border-white/10'
            }`}
            title={soundActive ? 'Tactile Sound: Enabled' : 'Tactile Sound: Muted'}
            aria-label="Toggle Sound"
          >
            {soundActive ? <Volume2 className="w-3.5 h-3.5 text-[#FF4D5A]" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Render Mode Selector */}
          <div className="flex items-center bg-[#18181B]/90 backdrop-blur-md border border-white/15 rounded-xl p-1 shadow-lg text-[11px] font-mono-code">
            {(['solid', 'wireframe', 'slicer'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => {
                  setRenderMode(mode);
                  if (soundActive) soundFx.playStudioBeep(840);
                }}
                className={`px-2.5 py-1 rounded-lg uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  renderMode === mode 
                    ? 'bg-[#AF101A] text-white shadow-xs' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main 3D WebGL Canvas Area */}
      <div 
        ref={containerRef}
        className="relative w-full h-[380px] sm:h-[430px] lg:h-[470px] cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onClick={handleSpicyTap}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />

        {/* Drag / Orbit Interactive Helper Tooltip (Visible on Initial Load / Hover) */}
        <div className="absolute bottom-20 sm:bottom-24 inset-x-0 flex justify-center pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] font-mono-code text-white/80 shadow-xl">
            <Sparkles className="w-3.5 h-3.5 text-[#FF4D5A] animate-pulse" />
            <span>Click to add heat sparks • Drag to orbit in 3D</span>
          </div>
        </div>

        {/* Floating Spiciness / Heat Scoville Meter Box (Left Side) */}
        <div className="absolute bottom-4 left-4 z-20 pointer-events-auto">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-[#111113]/90 backdrop-blur-xl border border-white/15 shadow-2xl space-y-1.5 max-w-[210px]">
            <div className="flex items-center justify-between text-xs font-mono-code font-bold">
              <span className="flex items-center gap-1.5 text-[#FF4D5A]">
                <Flame className="w-3.5 h-3.5 fill-[#FF4D5A] animate-bounce" />
                <span>SPICE LEVEL</span>
              </span>
              <span className="text-[10px] text-amber-400">+{clickCount} taps</span>
            </div>

            <div className="font-heading font-black text-sm sm:text-base text-white tracking-tight flex items-baseline gap-1">
              <span>{heatLevel.toLocaleString()}</span>
              <span className="text-[10px] font-mono-code text-white/50">SHU</span>
            </div>

            {/* Heat Progress Bar */}
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-amber-500 via-[#AF101A] to-[#FF4D5A] h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (heatLevel / 2500000) * 100)}%` }}
              />
            </div>

            <div className="text-[9px] font-mono-code text-white/50 flex justify-between">
              <span>Mild Bird's Eye</span>
              <span>Carolina Reaper 🔥</span>
            </div>
          </div>
        </div>

        {/* Floating Quick Action & Spin Controls (Right Side) */}
        <div className="absolute bottom-4 right-4 z-20 pointer-events-auto flex flex-col items-end gap-2">
          
          {/* Spin Speed Controls */}
          <div className="flex items-center gap-1 bg-[#18181B]/90 backdrop-blur-md border border-white/15 rounded-xl p-1 shadow-lg text-[10px] font-mono-code">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSpinSpeed('normal');
                if (soundActive) soundFx.playStudioBeep(600);
              }}
              className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                spinSpeed === 'normal' ? 'bg-[#AF101A] text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              1x Turn
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSpinSpeed('fast');
                if (soundActive) soundFx.playStudioBeep(750);
              }}
              className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                spinSpeed === 'fast' ? 'bg-[#AF101A] text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              3x Turbo
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSpinSpeed(spinSpeed === 'paused' ? 'normal' : 'paused');
                if (soundActive) soundFx.playStudioBeep(500);
              }}
              className={`px-2 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                spinSpeed === 'paused' ? 'bg-amber-600 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {spinSpeed === 'paused' ? 'Resume' : 'Hold'}
            </button>
          </div>

          {/* Quick Add To Cart Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleQuickAdd();
            }}
            className="px-4 py-2.5 rounded-xl bg-[#AF101A] hover:bg-[#E11D48] active:scale-[0.97] text-white text-xs font-bold font-mono-code uppercase tracking-wider transition-all shadow-xl shadow-red-950/50 flex items-center gap-2 border border-red-500/30 cursor-pointer"
          >
            {addedNotice ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Added to Studio Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Grab Keychain (RM 12.90)</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Bottom Filament Color Swatches Bar */}
      <div className="p-3 sm:p-4 bg-[#141418] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono-code">
        
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white/80 uppercase">FILAMENT:</span>
          <span className="text-xs text-[#FF4D5A] font-bold">{selectedFilament.name}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {CABAI_FILAMENTS.map((fil) => {
            const isSelected = selectedFilament.id === fil.id;
            return (
              <button
                key={fil.id}
                onClick={() => {
                  setSelectedFilament(fil);
                  if (soundActive) soundFx.playSwitchClick('blue');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected 
                    ? 'bg-[#1F1F24] text-white border-white/40 shadow-sm ring-1 ring-white/30' 
                    : 'bg-[#18181B] text-white/70 border-white/10 hover:border-white/20 hover:text-white'
                }`}
                title={fil.name}
              >
                <span 
                  className="w-3 h-3 rounded-full border border-black/30 shrink-0 shadow-2xs"
                  style={{ backgroundColor: fil.accent }}
                />
                <span className="text-[11px]">{fil.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

      </div>

    </div>
  );
};
