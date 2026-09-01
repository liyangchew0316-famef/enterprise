import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles, Layers, Box, RotateCcw } from 'lucide-react';

export interface CabaiLanding3DChiliProps {
  className?: string;
  onExplore?: () => void;
}

export const CabaiLanding3DChili: React.FC<CabaiLanding3DChiliProps> = ({
  className = '',
  onExplore
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorHex, setSelectedColorHex] = useState('#af101a');

  // Three.js internal refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const chiliGroupRef = useRef<THREE.Group | null>(null);
  const chiliMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.1, y: 0 });

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || 500;
    const height = containerRef.current.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 9.5);
    cameraRef.current = camera;

    // 3. Renderer with antialias and alpha
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // 4. Lighting setup (Rich studio lighting with warm red accent)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    // Key Light (Crisp soft white)
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.4);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Fill Light (Cool neutral)
    const fillLight = new THREE.DirectionalLight(0xcfd8dc, 1.0);
    fillLight.position.set(-6, -2, 4);
    scene.add(fillLight);

    // Back / Rim Light (Spicy Cabai Red #AF101A glow)
    const rimLight = new THREE.DirectionalLight(0xff3344, 3.5);
    rimLight.position.set(-4, 5, -5);
    scene.add(rimLight);

    // Bottom soft red glow
    const bottomGlow = new THREE.PointLight(0xaf101a, 2.0, 10);
    bottomGlow.position.set(0, -3, 2);
    scene.add(bottomGlow);

    // 5. Chili Master Group
    const chiliGroup = new THREE.Group();
    chiliGroup.position.set(0, 0.2, 0);
    scene.add(chiliGroup);
    chiliGroupRef.current = chiliGroup;

    // 6. Chili Pepper Procedural Mesh
    const curvePoints = [
      new THREE.Vector3(0, 2.8, 0),
      new THREE.Vector3(0.2, 2.1, 0.1),
      new THREE.Vector3(0.45, 1.0, 0.25),
      new THREE.Vector3(0.35, -0.1, 0.35),
      new THREE.Vector3(0.1, -1.2, 0.25),
      new THREE.Vector3(-0.25, -2.1, 0.1),
      new THREE.Vector3(-0.55, -2.8, -0.15),
      new THREE.Vector3(-0.75, -3.2, -0.3)
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
      if (t < 0.08) return 0.45 + t * 5.0; // Top collar
      if (t < 0.35) return 0.95 + (t - 0.08) * 1.1; // Belly
      if (t < 0.7) return 1.25 - (t - 0.35) * 1.4; // Body taper
      return Math.max(0.06, 0.76 - (t - 0.7) * 2.2); // Pointy tip
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

        // Organic 3D print layer ridges & ribbed contour
        const organicBump = 1.0 + Math.sin(theta * 3 + t * 8) * 0.05 + Math.sin(t * 120) * 0.008;
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

    // Material: Tactile Glossy PLA+ with subtle clearcoat sheen
    const chiliMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xaf101a),
      roughness: 0.28,
      metalness: 0.12,
      clearcoat: 0.7,
      clearcoatRoughness: 0.2,
      reflectivity: 0.8
    });
    chiliMaterialRef.current = chiliMaterial as any;

    const chiliMesh = new THREE.Mesh(chiliGeom, chiliMaterial);
    chiliMesh.castShadow = true;
    chiliMesh.receiveShadow = true;
    chiliGroup.add(chiliMesh);

    // Green Calyx / Stem Crown
    const calyxMat = new THREE.MeshStandardMaterial({
      color: 0x228b22,
      roughness: 0.45,
      metalness: 0.08
    });

    const calyxGroup = new THREE.Group();
    calyxGroup.position.set(0, 2.8, 0);

    const leafCount = 5;
    for (let l = 0; l < leafCount; l++) {
      const angle = (l / leafCount) * Math.PI * 2;
      const leafGeom = new THREE.ConeGeometry(0.3, 1.1, 4);
      leafGeom.rotateZ(-Math.PI / 3.2);
      const leafMesh = new THREE.Mesh(leafGeom, calyxMat);
      leafMesh.position.set(Math.cos(angle) * 0.38, -0.15, Math.sin(angle) * 0.38);
      leafMesh.rotation.y = angle;
      leafMesh.rotation.x = 0.22;
      calyxGroup.add(leafMesh);
    }

    // Curved Stem
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.08, 0.45, 0.05),
      new THREE.Vector3(0.2, 0.9, -0.1),
      new THREE.Vector3(0.3, 1.3, -0.3)
    ]);
    const stemGeom = new THREE.TubeGeometry(stemCurve, 16, 0.12, 10, false);
    const stemMesh = new THREE.Mesh(stemGeom, calyxMat);
    calyxGroup.add(stemMesh);

    // Keychain Eyelet Loop
    const loopGeom = new THREE.TorusGeometry(0.25, 0.06, 12, 24);
    const loopMat = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.2,
      metalness: 0.85
    });
    const loopMesh = new THREE.Mesh(loopGeom, loopMat);
    loopMesh.position.set(0.32, 1.35, -0.32);
    loopMesh.rotation.x = Math.PI / 2;
    loopMesh.rotation.y = Math.PI / 4;
    calyxGroup.add(loopMesh);

    chiliGroup.add(calyxGroup);

    // Subtle Ground Shadow Plate (Soft dark vignette floor)
    const shadowGeom = new THREE.PlaneGeometry(8, 8);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45
    });
    const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -3.6;
    scene.add(shadowMesh);

    // 7. Maker Particle Field (Floating glowing specks)
    const particleCount = 28;
    const particleGeom = new THREE.BufferGeometry();
    const particlePos: number[] = [];
    for (let p = 0; p < particleCount; p++) {
      particlePos.push(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5
      );
    }
    particleGeom.setAttribute('position', new THREE.Float32BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xff4d5a,
      size: 0.06,
      transparent: true,
      opacity: 0.4
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // 8. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Subtle float / hover bobbing
      chiliGroup.position.y = 0.2 + Math.sin(elapsedTime * 1.6) * 0.15;
      
      // Slow, smooth gentle rotation (NOT fast spinning)
      const baseRotationY = elapsedTime * 0.35;
      
      // Interactive mouse tilt interpolation
      const targetRotX = (mousePosRef.current.y * 0.3) + Math.sin(elapsedTime * 0.8) * 0.05;
      const targetRotY = baseRotationY + (mousePosRef.current.x * 0.5);

      chiliGroup.rotation.x += (targetRotX - chiliGroup.rotation.x) * 0.05;
      chiliGroup.rotation.y += (targetRotY - chiliGroup.rotation.y) * 0.05;
      chiliGroup.rotation.z = Math.sin(elapsedTime * 1.2) * 0.04;

      // Slowly rotate particle field
      particles.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize handler
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

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Update color dynamically if user toggles filament swatch
  const handleColorChange = (hex: string) => {
    setSelectedColorHex(hex);
    if (chiliMaterialRef.current) {
      chiliMaterialRef.current.color.set(hex);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    mousePosRef.current = { x, y };
  };

  const handlePointerLeave = () => {
    mousePosRef.current = { x: 0, y: 0 };
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full h-[380px] sm:h-[460px] lg:h-[520px] flex items-center justify-center select-none ${className}`}
    >
      {/* Background Soft Red Radial Glow */}
      <div className="absolute inset-0 bg-radial from-[#AF101A]/20 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing block"
      />

      {/* Interactive 3D Model Spec Card (Overlay Top Right) */}
      <div className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 flex flex-col items-end gap-2 pointer-events-auto">
        <div className="px-3 py-1.5 rounded-full bg-[#151518]/90 border border-white/10 backdrop-blur-md text-[11px] font-mono-code text-white/80 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-[#AF101A] animate-pulse" />
          <span className="font-bold text-white">0.12mm Precision PLA+</span>
        </div>
      </div>

      {/* Filament Swatches Picker on Bottom */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#111113]/90 border border-white/10 backdrop-blur-md shadow-2xl">
        <span className="text-[10px] font-mono-code text-white/50 uppercase tracking-wider mr-1 hidden sm:inline">
          Filament:
        </span>
        {[
          { label: 'Cabai Red', hex: '#af101a' },
          { label: 'Silk Gold', hex: '#d99b26' },
          { label: 'Jet Black', hex: '#1c1c1f' },
          { label: 'Pearl White', hex: '#f3f4f6' },
          { label: 'Cyber Cyan', hex: '#0284c7' }
        ].map((c) => (
          <button
            key={c.hex}
            onClick={() => handleColorChange(c.hex)}
            className={`w-6 h-6 rounded-full transition-transform cursor-pointer border ${
              selectedColorHex === c.hex
                ? 'scale-125 border-white shadow-md ring-2 ring-[#AF101A]/60'
                : 'border-white/20 hover:scale-110'
            }`}
            style={{ backgroundColor: c.hex }}
            title={c.label}
          />
        ))}
      </div>

      {/* Interaction Hint */}
      <div className="absolute bottom-4 right-4 z-10 text-[10px] font-mono-code text-white/40 hidden md:flex items-center gap-1.5 pointer-events-none">
        <RotateCcw className="w-3 h-3 text-white/30" />
        <span>Move cursor to inspect 3D physical piece</span>
      </div>
    </div>
  );
};
