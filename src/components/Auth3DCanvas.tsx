import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Auth3DCanvas: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = containerRef.current.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Ambient + Point Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xaf101a, 4, 25);
    pointLight1.position.set(5, 5, 6);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x7c3aed, 3, 25);
    pointLight2.position.set(-6, -4, 4);
    scene.add(pointLight2);

    // Floating 3D Polygons / Filament Loops
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    // 1. Spool Ring
    const spoolMat = new THREE.MeshStandardMaterial({
      color: 0xaf101a,
      roughness: 0.3,
      metalness: 0.4
    });
    const spoolGeom = new THREE.TorusGeometry(3.5, 0.4, 16, 64);
    const spoolMesh = new THREE.Mesh(spoolGeom, spoolMat);
    spoolMesh.position.set(-4, 2, -2);
    spoolMesh.rotation.x = Math.PI / 3;
    objectsGroup.add(spoolMesh);

    // 2. Geometric Icosahedrons (Floating PLA Crystals)
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.7,
      opacity: 0.85,
      transparent: true,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1
    });

    const crystals: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      const geom = new THREE.IcosahedronGeometry(0.6 + Math.random() * 0.5, 0);
      const crystal = new THREE.Mesh(geom, crystalMat);
      crystal.position.set(
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 8
      );
      crystal.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      objectsGroup.add(crystal);
      crystals.push(crystal);
    }

    // 3. Cyber Particles Grid
    const particleCount = 120;
    const particleGeom = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount; p++) {
      particlePos[p * 3] = (Math.random() - 0.5) * 24;
      particlePos[p * 3 + 1] = (Math.random() - 0.5) * 18;
      particlePos[p * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xaf101a,
      size: 0.1,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // Mouse Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth || window.innerWidth;
      const h = containerRef.current.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Render loop
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth mouse follow
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      objectsGroup.rotation.y = elapsed * 0.15 + currentMouseX * 0.4;
      objectsGroup.rotation.x = Math.sin(elapsed * 0.2) * 0.1 + currentMouseY * 0.3;

      spoolMesh.rotation.z += 0.01;

      crystals.forEach((c, idx) => {
        c.rotation.x += 0.01 * (idx % 2 === 0 ? 1 : -1);
        c.rotation.y += 0.015;
        c.position.y += Math.sin(elapsed + idx) * 0.005;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
