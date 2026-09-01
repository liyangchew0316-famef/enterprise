import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';
import { ShoppingBag, ArrowRight, Check } from 'lucide-react';

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
  { id: 'cabai_red', name: 'Cabai Spicy Red', hex: 0xaf101a, roughness: 0.18, metalness: 0.15, clearcoat: 0.85, accent: '#AF101A' },
  { id: 'ghost_fire', name: 'Ghost Chili Flame', hex: 0xff3b14, roughness: 0.22, metalness: 0.1, clearcoat: 0.7, emissive: 0x220500, emissiveIntensity: 0.3, accent: '#FF3B14' },
  { id: 'imperial_gold', name: 'Silk Imperial Gold', hex: 0xd99b26, roughness: 0.18, metalness: 0.85, clearcoat: 0.9, accent: '#D99B26' },
  { id: 'stealth_carbon', name: 'Stealth Carbon Black', hex: 0x18181b, roughness: 0.38, metalness: 0.3, clearcoat: 0.4, accent: '#52525B' },
  { id: 'cyber_emerald', name: 'Cyber Neon Emerald', hex: 0x10b981, roughness: 0.2, metalness: 0.4, clearcoat: 0.7, accent: '#10B981' },
  { id: 'pearl_white', name: 'Pearl PLA+ White', hex: 0xf4f4f5, roughness: 0.25, metalness: 0.05, clearcoat: 0.6, accent: '#E4E4E7' }
];

export const Cabai3DHero: React.FC = () => {
  const { addToCart, products, openProductDetail } = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedFilament, setSelectedFilament] = useState<CabaiFilament>(CABAI_FILAMENTS[0]);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  // Three.js internal references
  const chiliGroupRef = useRef<THREE.Group | null>(null);
  const chiliBodyMeshRef = useRef<THREE.Mesh | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // -------------------------------------------------------------
  // THREE.JS SCENE INITIALIZATION
  // -------------------------------------------------------------
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight || 400;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 11);

    // 2. WebGL Renderer
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

    // 3. Studio Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    mainKeyLight.position.set(6, 10, 8);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 1024;
    mainKeyLight.shadow.mapSize.height = 1024;
    scene.add(mainKeyLight);

    const rimLight = new THREE.DirectionalLight(0xff6666, 1.8);
    rimLight.position.set(-8, 5, -6);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffffff, 1.2, 20);
    fillLight.position.set(0, -3, 5);
    scene.add(fillLight);

    // Soft warm under-glow
    const spicyUnderGlow = new THREE.PointLight(0xaf101a, 2.5, 10);
    spicyUnderGlow.position.set(0, -3, 0);
    scene.add(spicyUnderGlow);

    // Subtle 3D Grid Stage
    const gridHelper = new THREE.GridHelper(16, 16, 0xaf101a, 0x27272a);
    gridHelper.position.y = -3.8;
    scene.add(gridHelper);

    // Shadow Floor Catcher
    const shadowPlaneGeom = new THREE.PlaneGeometry(16, 16);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.4 });
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
      clearcoat: selectedFilament.clearcoat ?? 0.85,
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

    // Chain links
    for (let k = 0; k < 2; k++) {
      const linkGeom = new THREE.TorusGeometry(0.24, 0.045, 8, 16);
      const linkMesh = new THREE.Mesh(linkGeom, steelMat);
      linkMesh.position.set(0.55 - k * 0.05, 3.9 - k * 0.35, -0.35);
      linkMesh.rotation.y = (k * Math.PI) / 2;
      linkMesh.castShadow = true;
      chiliMasterGroup.add(linkMesh);
    }

    // ---------------------------------------------------------
    // RENDER LOOP (Smooth continuous 360° turn & gentle bob)
    // ---------------------------------------------------------
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Continuous 360° rotation when not dragging
      if (chiliGroupRef.current && !isDraggingRef.current) {
        chiliGroupRef.current.rotation.y += 0.012;
        chiliGroupRef.current.position.y = -0.2 + Math.sin(elapsedTime * 1.5) * 0.12;
        chiliGroupRef.current.rotation.z = Math.sin(elapsedTime * 0.75) * 0.04;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ---------------------------------------------------------
    // RESPONSIVE RESIZE OBSERVER
    // ---------------------------------------------------------
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight || 400;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(containerRef.current);

    // Cleanup
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
      chiliGeom.dispose();
      bodyMaterial.dispose();
      calyxMat.dispose();
      steelMat.dispose();
    };
  }, []);

  // Update Filament Material in real-time when swatch is clicked
  useEffect(() => {
    if (!chiliBodyMeshRef.current) return;
    const mesh = chiliBodyMeshRef.current;
    if (mesh.material instanceof THREE.MeshPhysicalMaterial) {
      mesh.material.color.setHex(selectedFilament.hex);
      mesh.material.roughness = selectedFilament.roughness;
      mesh.material.metalness = selectedFilament.metalness;
      mesh.material.clearcoat = selectedFilament.clearcoat ?? 0.85;
      mesh.material.emissive = selectedFilament.emissive 
        ? new THREE.Color(selectedFilament.emissive) 
        : new THREE.Color(0x000000);
      mesh.material.emissiveIntensity = selectedFilament.emissiveIntensity ?? 0;
      mesh.material.needsUpdate = true;
    }
  }, [selectedFilament]);

  // -------------------------------------------------------------
  // USER DRAG / TOUCH INTERACTION (ORBIT ROTATE)
  // -------------------------------------------------------------
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || !chiliGroupRef.current) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;

    chiliGroupRef.current.rotation.y += deltaX * 0.01;
    chiliGroupRef.current.rotation.x = Math.max(-0.6, Math.min(0.6, chiliGroupRef.current.rotation.x + deltaY * 0.005));

    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Quick action: Add Chili Keychain to Cart
  const handleQuickAdd = () => {
    const chiliProduct = products.find(p => p.id === 'cabai-chili-keychain-01') || products[0];
    if (chiliProduct) {
      addToCart(chiliProduct, {
        name: selectedFilament.name,
        hex: `#${selectedFilament.hex.toString(16).padStart(6, '0')}`,
        bgClass: ''
      }, 'PLA', 1);
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2400);
    }
  };

  const chiliProduct = products.find(p => p.id === 'cabai-chili-keychain-01') || products[0];

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#0B0B0E] shadow-2xl">
      
      {/* Top Header Label */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-mono-code font-bold shadow-md pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-[#FF4D5A] animate-ping" />
          <span className="text-[#FF4D5A]">CABAI 3D KEYCHAIN</span>
          <span className="text-white/40">|</span>
          <span className="text-white/70">360° View</span>
        </div>

        <div className="text-[11px] font-mono-code text-white/50 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10 hidden sm:block">
          Drag to rotate • Real-time WebGL
        </div>
      </div>

      {/* Main 3D Canvas */}
      <div 
        ref={containerRef}
        className="relative w-full h-[360px] sm:h-[420px] cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Bottom Filament Palette & Order Bar */}
      <div className="p-4 bg-[#111114] border-t border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-mono-code">
        
        {/* Filament Selection */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-white/60 uppercase mr-1">Filament:</span>
          {CABAI_FILAMENTS.map((fil) => {
            const isSelected = selectedFilament.id === fil.id;
            return (
              <button
                key={fil.id}
                onClick={() => setSelectedFilament(fil)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected 
                    ? 'bg-[#1F1F24] text-white border-white/40 shadow-sm ring-1 ring-white/30' 
                    : 'bg-[#16161A] text-white/70 border-white/10 hover:border-white/20 hover:text-white'
                }`}
              >
                <span 
                  className="w-3 h-3 rounded-full border border-black/30 shrink-0"
                  style={{ backgroundColor: fil.accent }}
                />
                <span className="text-[11px]">{fil.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {chiliProduct && (
            <button
              onClick={() => openProductDetail(chiliProduct)}
              className="px-3.5 py-2.5 rounded-xl bg-[#18181B] hover:bg-[#222226] text-white/80 hover:text-white text-xs font-bold font-mono-code uppercase tracking-wider border border-white/15 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Specs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleQuickAdd}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-[#AF101A] hover:bg-[#E11D48] active:scale-[0.98] text-white text-xs font-bold font-mono-code uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-red-500/30"
          >
            {addedNotice ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Order Keychain (RM 12.90)</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
