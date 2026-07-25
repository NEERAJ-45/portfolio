'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';

export default function InteractiveCube() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shuffleRef = useRef<() => void>(undefined);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    console.log('Three.js InteractiveCube mounting...');

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
    const cubies: { 
      mesh: THREE.Mesh; 
      gridX: number; 
      gridY: number; 
      gridZ: number;
      origX: number;
      origY: number;
      origZ: number;
    }[] = [];

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
          cubies.push({ mesh: cubie, gridX: x, gridY: y, gridZ: z, origX: x, origY: y, origZ: z });
        }
      }
    }

    console.log(`Created Rubik's Cube group with ${cubies.length} cubies.`);

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

    // Shuffle & Reset Timers State
    let isShuffling = false;
    let resetTimeoutId: any = null;

    // Reset Functionality (solved state recovery)
    const performReset = () => {
      console.log('performReset triggered (10s idle time reached)...');
      if (isShuffling) return;
      isShuffling = true;

      controls.autoRotate = false;
      const resetState = { spacing: 1.0 };

      // 1. Explode cubies outwards
      console.log('Animating reset explosion...');
      gsap.to(resetState, {
        spacing: 2.2,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: () => {
          cubies.forEach(c => {
            c.mesh.position.set(
              c.gridX * resetState.spacing, 
              c.gridY * resetState.spacing, 
              c.gridZ * resetState.spacing
            );
          });
        },
        onComplete: () => {
          // 2. Restore original grid position indices and zero out orientations at peak
          console.log('Peak of reset, restoring grid and rotations...');
          cubies.forEach(c => {
            c.gridX = c.origX;
            c.gridY = c.origY;
            c.gridZ = c.origZ;

            gsap.to(c.mesh.rotation, {
              x: 0,
              y: 0,
              z: 0,
              duration: 0.5,
              ease: 'power1.inOut',
              onComplete: () => {
                c.mesh.quaternion.set(0, 0, 0, 1);
              }
            });
          });

          // 3. Snap back together elastically
          console.log('Animating reassembly to solved state...');
          gsap.to(resetState, {
            spacing: 1.0,
            duration: 0.7,
            ease: 'bounce.out',
            delay: 0.1,
            onUpdate: () => {
              cubies.forEach(c => {
                c.mesh.position.set(
                  c.gridX * resetState.spacing, 
                  c.gridY * resetState.spacing, 
                  c.gridZ * resetState.spacing
                );
              });
            },
            onComplete: () => {
              isShuffling = false;
              controls.autoRotate = true;
              console.log('Reset completed successfully.');
            }
          });
        }
      });

      // Spin the entire cube group in reverse
      gsap.to(rubiksCubeGroup.rotation, {
        x: rubiksCubeGroup.rotation.x - Math.PI * 2,
        y: rubiksCubeGroup.rotation.y - Math.PI * 2,
        duration: 1.2,
        ease: 'power3.inOut'
      });
    };

    // Shuffle Functionality
    const performShuffle = () => {
      console.log('performShuffle triggered! current status: isShuffling =', isShuffling);
      if (isShuffling) return;
      isShuffling = true;

      // Clear any pending automatic reset timer
      if (resetTimeoutId) {
        console.log('Clearing pending reset timer.');
        clearTimeout(resetTimeoutId);
        resetTimeoutId = null;
      }

      // Disable orbit controls rotation momentarily to showcase shuffle spin
      controls.autoRotate = false;

      // Create a fresh target object on every click to bypass any GSAP cache
      const shuffleState = { spacing: 1.0 };

      // 1. Explode cubies outwards
      console.log('Animating cubies explosion...');
      gsap.to(shuffleState, {
        spacing: 2.2,
        duration: 0.6,
        ease: 'power2.out',
        onUpdate: () => {
          cubies.forEach(c => {
            c.mesh.position.set(
              c.gridX * shuffleState.spacing, 
              c.gridY * shuffleState.spacing, 
              c.gridZ * shuffleState.spacing
            );
          });
        },
        onComplete: () => {
          // 2. Perform 20 valid, random layer turns at the peak of the explosion
          // This keeps the outer colored tiles on the outside, and inner black faces inside!
          console.log('Peak of explosion, scrambling layers...');
          const axes: ('x' | 'y' | 'z')[] = ['x', 'y', 'z'];
          const layerVals = [-1, 0, 1];
          const angles = [Math.PI / 2, -Math.PI / 2];

          for (let i = 0; i < 20; i++) {
            const axis = axes[Math.floor(Math.random() * 3)];
            const layerVal = layerVals[Math.floor(Math.random() * 3)];
            const angle = angles[Math.floor(Math.random() * 2)];
            
            const rotationQuaternion = new THREE.Quaternion();
            const axisVector = new THREE.Vector3();
            if (axis === 'x') axisVector.set(1, 0, 0);
            else if (axis === 'y') axisVector.set(0, 1, 0);
            else axisVector.set(0, 0, 1);
            
            rotationQuaternion.setFromAxisAngle(axisVector, angle);

            cubies.forEach(c => {
              let isMatching = false;
              if (axis === 'x' && Math.round(c.gridX) === layerVal) isMatching = true;
              else if (axis === 'y' && Math.round(c.gridY) === layerVal) isMatching = true;
              else if (axis === 'z' && Math.round(c.gridZ) === layerVal) isMatching = true;

              if (isMatching) {
                // Rotate grid position
                const gridPos = new THREE.Vector3(c.gridX, c.gridY, c.gridZ);
                gridPos.applyQuaternion(rotationQuaternion);
                c.gridX = Math.round(gridPos.x);
                c.gridY = Math.round(gridPos.y);
                c.gridZ = Math.round(gridPos.z);

                // Rotate mesh orientation
                c.mesh.quaternion.premultiply(rotationQuaternion);
              }
            });
          }

          // 3. Snap cubies back together with mechanical bounce elasticity
          console.log('Animating reassembly...');
          gsap.to(shuffleState, {
            spacing: 1.0,
            duration: 0.7,
            ease: 'bounce.out',
            delay: 0.1,
            onUpdate: () => {
              cubies.forEach(c => {
                c.mesh.position.set(
                  c.gridX * shuffleState.spacing, 
                  c.gridY * shuffleState.spacing, 
                  c.gridZ * shuffleState.spacing
                );
              });
            },
            onComplete: () => {
              isShuffling = false;
              controls.autoRotate = true; // Re-enable autoRotate
              console.log('Shuffle completed. Setting automatic 10-second reset timer.');
              
              // Set a new reset timeout for 10 seconds
              resetTimeoutId = setTimeout(performReset, 10000);
            }
          });
        }
      });

      // Spin the entire cube group rapidly
      gsap.to(rubiksCubeGroup.rotation, {
        x: rubiksCubeGroup.rotation.x + Math.PI * 2,
        y: rubiksCubeGroup.rotation.y + Math.PI * 2,
        duration: 1.2,
        ease: 'power3.inOut'
      });
    };

    // Store the function in the Ref so React onClick can trigger it
    shuffleRef.current = performShuffle;

    // Cleanup Resources on Unmount
    return () => {
      console.log('Three.js InteractiveCube unmounting...');
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();

      if (resetTimeoutId) {
        clearTimeout(resetTimeoutId);
      }
      
      // Dispose Geometries and Materials
      cubies.forEach((cubie) => {
        cubie.mesh.geometry.dispose();
        if (Array.isArray(cubie.mesh.material)) {
          cubie.mesh.material.forEach((mat) => mat.dispose());
        } else {
          cubie.mesh.material.dispose();
        }
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="rubik-canvas-container">
      <canvas ref={canvasRef} className="rubik-canvas" />
      <button 
        className="cube-shuffle-btn" 
        id="btn-shuffle-cube"
        onClick={() => {
          console.log('HTML Button Clicked!');
          shuffleRef.current?.();
        }}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
          <polyline points="16 3 21 3 21 8" />
          <line x1="4" y1="20" x2="21" y2="3" />
          <polyline points="21 16 21 21 16 21" />
          <line x1="15" y1="15" x2="21" y2="21" />
          <line x1="4" y1="4" x2="9" y2="9" />
        </svg>
        Shuffle
      </button>
    </div>
  );
}
