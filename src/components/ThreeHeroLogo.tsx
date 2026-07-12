import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export const ThreeHeroLogo: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // --- SCENE SETUP ---
    const scene = new THREE.Scene();

    // --- CAMERA ---
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 8;

    // --- RENDERER ---
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // --- GENERATE HIGH-RES EMBLEM TEXTURES ON-THE-FLY ---
    // We render the high-fidelity logo design to a canvas, then load it as a texture.
    const createEmblemCanvas = (isBumpMap: boolean) => {
      const size = 1024;
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const ctx = c.getContext('2d');
      if (!ctx) return c;

      // Clear
      ctx.clearRect(0, 0, size, size);

      if (!isBumpMap) {
        // Color Texture Background: Deep teal/emerald gradient
        const bgGrad = ctx.createRadialGradient(size/2, size/2, 10, size/2, size/2, size/2);
        bgGrad.addColorStop(0, '#14B8A6'); // Teal-500
        bgGrad.addColorStop(0.4, '#0F766E'); // Teal-800
        bgGrad.addColorStop(0.8, '#065F46'); // Emerald-900
        bgGrad.addColorStop(1, '#052e16'); // Dark green edge
        ctx.fillStyle = bgGrad;
        ctx.beginPath();
        ctx.arc(size/2, size/2, size/2 - 16, 0, Math.PI * 2);
        ctx.fill();

        // Outer Rim (Gold)
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 14;
        ctx.stroke();
      } else {
        // BumpMap Background: Black (flat)
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, size, size);
      }

      // Drawing metallic/bump features (Circuits & Leaf)
      // We use white for bump map (highest elevation) and gold for color map
      const activeColor = isBumpMap ? '#FFFFFF' : '#D4AF37';
      const nodeFill = isBumpMap ? '#FFFFFF' : '#14B8A6';

      // --- LEFT HALF: CIRCUIT BOARD ---
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Track 1
      ctx.beginPath();
      ctx.moveTo(200, 380);
      ctx.lineTo(340, 380);
      ctx.lineTo(420, 460);
      ctx.lineTo(420, 512);
      ctx.stroke();

      // Track 2
      ctx.beginPath();
      ctx.moveTo(180, 460);
      ctx.lineTo(300, 460);
      ctx.lineTo(380, 540);
      ctx.lineTo(450, 540);
      ctx.stroke();

      // Track 3
      ctx.beginPath();
      ctx.moveTo(190, 550);
      ctx.lineTo(270, 550);
      ctx.lineTo(350, 630);
      ctx.lineTo(350, 720);
      ctx.lineTo(400, 720);
      ctx.stroke();

      // Track 4
      ctx.beginPath();
      ctx.moveTo(230, 640);
      ctx.lineTo(310, 640);
      ctx.lineTo(370, 700);
      ctx.lineTo(370, 840);
      ctx.stroke();

      // Track 5
      ctx.beginPath();
      ctx.moveTo(320, 290);
      ctx.lineTo(500, 290);
      ctx.lineTo(540, 330);
      ctx.stroke();

      // Draw nodes
      const drawNode = (x: number, y: number, r: number, isRelief: boolean) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        if (isBumpMap) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        } else {
          ctx.fillStyle = nodeFill;
          ctx.fill();
          ctx.strokeStyle = '#D4AF37';
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      };

      // Draw simple endpoints
      const drawPoint = (x: number, y: number, r: number) => {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = activeColor;
        ctx.fill();
      };

      drawNode(420, 460, 10, true);
      drawNode(380, 540, 10, true);
      drawNode(350, 630, 10, true);
      drawPoint(400, 720, 14);
      drawPoint(370, 840, 14);
      drawPoint(200, 380, 16);
      drawPoint(180, 460, 16);
      drawPoint(190, 550, 16);
      drawPoint(230, 640, 16);
      drawPoint(320, 290, 16);
      drawNode(540, 330, 12, true);

      // --- RIGHT HALF: ORGANIC LEAF ---
      ctx.lineWidth = 14;
      // Main stem
      ctx.beginPath();
      ctx.moveTo(460, 800);
      ctx.bezierCurveTo(480, 740, 520, 560, 680, 360);
      ctx.bezierCurveTo(740, 284, 800, 230, 850, 200);
      ctx.stroke();

      // Leaf outer boundary (Right)
      ctx.beginPath();
      ctx.moveTo(460, 800);
      ctx.bezierCurveTo(660, 780, 860, 660, 850, 200);
      ctx.stroke();

      // Leaf inner boundary (Left)
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(460, 800);
      ctx.bezierCurveTo(440, 620, 520, 420, 680, 360);
      ctx.stroke();

      // Veins
      ctx.lineWidth = 10;
      // Vein 1
      ctx.beginPath();
      ctx.moveTo(504, 680);
      ctx.bezierCurveTo(580, 690, 680, 660, 750, 600);
      ctx.stroke();

      // Vein 2
      ctx.beginPath();
      ctx.moveTo(564, 540);
      ctx.bezierCurveTo(640, 550, 740, 500, 790, 420);
      ctx.stroke();

      // Vein 3
      ctx.beginPath();
      ctx.moveTo(630, 420);
      ctx.bezierCurveTo(690, 410, 770, 370, 810, 290);
      ctx.stroke();

      // Vein Left 1
      ctx.beginPath();
      ctx.moveTo(530, 590);
      ctx.bezierCurveTo(510, 560, 500, 500, 530, 460);
      ctx.stroke();

      // Vein Left 2
      ctx.beginPath();
      ctx.moveTo(590, 470);
      ctx.bezierCurveTo(570, 430, 570, 390, 610, 360);
      ctx.stroke();

      // Fusion center dot
      drawPoint(460, 800, 20);

      return c;
    };

    // Create texture sources
    const colorCanvas = createEmblemCanvas(false);
    const bumpCanvas = createEmblemCanvas(true);

    const colorTexture = new THREE.CanvasTexture(colorCanvas);
    const bumpTexture = new THREE.CanvasTexture(bumpCanvas);

    // --- DYNAMIC 3D EMBLEM DISC ---
    const emblemGroup = new THREE.Group();
    scene.add(emblemGroup);

    // Emblem Disc Geometry
    // We use Cylinder to give it a clean solid 3D depth
    const discGeom = new THREE.CylinderGeometry(2.2, 2.2, 0.16, 128);
    discGeom.rotateX(Math.PI / 2); // Make flat face point along Z-axis

    // Materials
    // Face material with high-res texture and metallic bump map
    const faceMaterial = new THREE.MeshStandardMaterial({
      map: colorTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.08,
      metalness: 0.9,
      roughness: 0.18,
      side: THREE.DoubleSide,
    });

    // Side metal material (luxurious matte dark gold)
    const sideMaterial = new THREE.MeshStandardMaterial({
      color: 0x9A7B1C,
      metalness: 0.95,
      roughness: 0.25,
    });

    // Apply multi-materials (index 0 is cylinder side, 1 is top cap, 2 is bottom cap)
    const materials = [sideMaterial, faceMaterial, faceMaterial];
    const emblemMesh = new THREE.Mesh(discGeom, materials);
    emblemMesh.castShadow = true;
    emblemMesh.receiveShadow = true;
    emblemGroup.add(emblemMesh);

    // Add a golden outer structural ring for extra premium engineering aesthetic
    const ringGeom = new THREE.TorusGeometry(2.25, 0.08, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      metalness: 0.95,
      roughness: 0.15,
    });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    ringMesh.position.z = 0;
    emblemGroup.add(ringMesh);

    // --- FLOATING TECH CRYSTALS (Background Particles) ---
    const crystalGroup = new THREE.Group();
    scene.add(crystalGroup);

    const crystals: THREE.Mesh[] = [];
    const crystalCount = 45;

    // We generate a set of mini glowing tetrahedrons & octahedrons floating in 3D
    const octaGeom = new THREE.OctahedronGeometry(1, 0);
    const tetraGeom = new THREE.TetrahedronGeometry(1, 0);

    const crystalMaterials = [
      new THREE.MeshStandardMaterial({
        color: 0x0F766E, // Emerald
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.6,
        wireframe: true,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xD4AF37, // Gold
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.5,
        wireframe: true,
      }),
    ];

    for (let i = 0; i < crystalCount; i++) {
      const isOcta = Math.random() > 0.5;
      const geom = isOcta ? octaGeom : tetraGeom;
      const mat = crystalMaterials[Math.floor(Math.random() * crystalMaterials.length)];
      
      const mesh = new THREE.Mesh(geom, mat);
      
      // Random position around emblem
      const radius = 4 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
      mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
      mesh.position.z = radius * Math.cos(phi) - 2; // Keep slightly behind
      
      // Scale
      const scale = 0.08 + Math.random() * 0.18;
      mesh.scale.set(scale, scale, scale);
      
      // Store initial drift velocity in userData
      mesh.userData = {
        spinX: (Math.random() - 0.5) * 0.01,
        spinY: (Math.random() - 0.5) * 0.01,
        driftY: (Math.random() - 0.5) * 0.002,
        initialY: mesh.position.y,
        floatOffset: Math.random() * Math.PI * 2,
      };

      crystalGroup.add(mesh);
      crystals.push(mesh);
    }

    // --- LIGHTS ---
    // Ambient Light (deep rich tech undertones)
    const ambientLight = new THREE.AmbientLight(0x021d1a, 2.0);
    scene.add(ambientLight);

    // Directional Gold Light (main sun source for high-reflection highlights)
    const goldLight = new THREE.DirectionalLight(0xD4AF37, 4.0);
    goldLight.position.set(5, 5, 4);
    goldLight.castShadow = true;
    scene.add(goldLight);

    // Point Light (Teal/Emerald neon glow on the bottom-left)
    const emeraldLight = new THREE.PointLight(0x14B8A6, 8.0, 15);
    emeraldLight.position.set(-4, -2, 2);
    scene.add(emeraldLight);

    // Dynamic revolving Highlight light
    const movingLight = new THREE.PointLight(0xF59E0B, 5.0, 10);
    scene.add(movingLight);

    // --- MOUSE TRACKING & INTERACTIVE TILT ---
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const onMouseMove = (event: MouseEvent) => {
      // Normalize mouse coordinates to [-1, 1]
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mouse.targetX = (x / rect.width) * 2 - 1;
      mouse.targetY = -(y / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    // --- ANIMATION LOOP ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation (Damping / Lerp)
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      // Rotate Emblem: Base Y rotation + mouse drift
      emblemGroup.rotation.y = elapsedTime * 0.22 + mouse.x * 0.6;
      emblemGroup.rotation.x = mouse.y * 0.5;
      
      // Floating physical motion
      emblemGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.12;

      // Animate background crystals
      crystals.forEach((mesh) => {
        mesh.rotation.x += mesh.userData.spinX;
        mesh.rotation.y += mesh.userData.spinY;
        
        // Gentle drift & bobbing
        mesh.position.y = mesh.userData.initialY + Math.sin(elapsedTime * 0.5 + mesh.userData.floatOffset) * 0.25;
      });

      // Slowly rotate the entire crystal container
      crystalGroup.rotation.z = elapsedTime * 0.02;

      // Animate revolving specular light
      movingLight.position.x = Math.sin(elapsedTime * 1.5) * 4;
      movingLight.position.y = Math.cos(elapsedTime * 1.5) * 4;
      movingLight.position.z = 3;

      renderer.render(scene, camera);
    };

    animate();

    // --- RESIZE HANDLER ---
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = container.clientWidth;
      const height = container.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // --- CLEANUP ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      resizeObserver.disconnect();
      
      // Geometries & Materials disposal
      discGeom.dispose();
      ringGeom.dispose();
      octaGeom.dispose();
      tetraGeom.dispose();
      faceMaterial.dispose();
      sideMaterial.dispose();
      ringMat.dispose();
      colorTexture.dispose();
      bumpTexture.dispose();
      crystalMaterials.forEach((m) => m.dispose());
      
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[320px] md:h-[450px] lg:h-[550px] flex items-center justify-center cursor-grab active:cursor-grabbing"
      id="three-logo-container"
    >
      <canvas ref={canvasRef} className="absolute w-full h-full block touch-none z-10" />
      
      {/* Decorative Glowing Rings behind the 3D canvas */}
      <div className="absolute w-64 h-64 md:w-96 md:h-96 rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none z-0 animate-pulse" />
      <div className="absolute w-40 h-40 md:w-60 md:h-60 rounded-full bg-amber-500/5 blur-[60px] pointer-events-none z-0" />
    </div>
  );
};
