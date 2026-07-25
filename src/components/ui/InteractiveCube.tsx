'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function InteractiveCube() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Three.js Scene Setup
    const scene = new THREE.Scene();

    // Perspective Camera Setup
    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    
    // Set initial position based on viewport width
    if (window.innerWidth < 768) {
      camera.position.set(7.5, 7.5, 7.5);
    } else {
      camera.position.set(6.5, 6.5, 6.5);
    }

    // WebGL Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);

    // Orbit Controls Setup (allows click & drag to rotate the cube)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // Prevent page scroll hijacking
    controls.enablePan = false; // Keep cube centered
    controls.autoRotate = true; // Slowly spin cube when idle
    controls.autoRotateSpeed = 1.0;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(10, 15, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight2.position.set(-10, -15, -10);
    scene.add(dirLight2);

    // Rubik's Cube Colors Matching Theme Aesthetics
    const colors = {
      white: new THREE.Color('#ffffff'), // Top
      yellow: new THREE.Color('#e2e8f0'), // Bottom (soft metallic grey/silver instead of plain yellow for premium dark mode)
      orange: new THREE.Color('#ff8a3d'), // Right
      red: new THREE.Color('#ff5277'), // Left
      blue: new THREE.Color('#5584ff'), // Front
      green: new THREE.Color('#c5ff7c'), // Back (Theme Accent Lime!)
      internal: new THREE.Color('#0a0d16'), // Internal faces (Dark obsidian/navy)
    };

    // Create the Rubik's Cube Group
    const rubiksCubeGroup = new THREE.Group();
    scene.add(rubiksCubeGroup);

    const cubieSize = 0.95; // Small gap between cubies
    const spacing = 1.0;
    const cubies: THREE.Mesh[] = [];

    // Helper to assign colors to outer faces, dark to inner faces
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // Skip the center cubie (hollow core)
          if (x === 0 && y === 0 && z === 0) continue;

          const geometry = new THREE.BoxGeometry(cubieSize, cubieSize, cubieSize);

          const materials = [
            new THREE.MeshStandardMaterial({ color: x === 1 ? colors.orange : colors.internal, roughness: 0.2, metalness: 0.2 }), // Right (+X)
            new THREE.MeshStandardMaterial({ color: x === -1 ? colors.red : colors.internal, roughness: 0.2, metalness: 0.2 }),  // Left (-X)
            new THREE.MeshStandardMaterial({ color: y === 1 ? colors.white : colors.internal, roughness: 0.2, metalness: 0.2 }),  // Top (+Y)
            new THREE.MeshStandardMaterial({ color: y === -1 ? colors.yellow : colors.internal, roughness: 0.2, metalness: 0.2 }), // Bottom (-Y)
            new THREE.MeshStandardMaterial({ color: z === 1 ? colors.blue : colors.internal, roughness: 0.2, metalness: 0.2 }),  // Front (+Z)
            new THREE.MeshStandardMaterial({ color: z === -1 ? colors.green : colors.internal, roughness: 0.2, metalness: 0.2 }), // Back (-Z)
          ];

          const cubie = new THREE.Mesh(geometry, materials);
          cubie.position.set(x * spacing, y * spacing, z * spacing);
          rubiksCubeGroup.add(cubie);
          cubies.push(cubie);
        }
      }
    }

    // Set initial cube rotation for dynamic aesthetic
    rubiksCubeGroup.rotation.set(0.35, 0.45, 0);

    // Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        camera.aspect = width / height;

        // Mobile responsiveness: Zoom camera out slightly on smaller screens
        if (width < 768) {
          camera.position.set(7.5, 7.5, 7.5);
        } else {
          camera.position.set(6.5, 6.5, 6.5);
        }
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      // Update OrbitControls (enables smooth damping and auto-rotation)
      controls.update();
      
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup Resources on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      
      // Dispose Geometries and Materials
      cubies.forEach((cubie) => {
        cubie.geometry.dispose();
        if (Array.isArray(cubie.material)) {
          cubie.material.forEach((mat) => mat.dispose());
        } else {
          cubie.material.dispose();
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="rubik-canvas-container">
      <canvas ref={canvasRef} className="rubik-canvas" />
    </div>
  );
}
