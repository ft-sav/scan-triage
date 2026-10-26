import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ChevronDown, ChevronUp, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
import { calculateCloudPointerDisplacement } from '../utils/chatbot-helper';

export type LightTheme = 'Dawn' | 'Gold' | 'Blue';

interface CloudScene3DProps {
  onOpenChatbot: () => void;
  onOpenReportModal: () => void;
}

export function CloudScene3D({ onOpenChatbot, onOpenReportModal }: CloudScene3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // User-facing interactive props matching reference image
  const [lightPreset, setLightPreset] = useState<LightTheme>('Dawn');
  const [partingStrength, setPartingStrength] = useState<number>(1.0);
  const [driftSpeed, setDriftSpeed] = useState<number>(1.0);
  const [exposure, setExposure] = useState<number>(1.0);
  const [isPropsOpen, setIsPropsOpen] = useState<boolean>(true);

  // Mutable refs for high-frequency animation loop
  const paramsRef = useRef({
    lightPreset: 'Dawn' as LightTheme,
    partingStrength: 1.0,
    driftSpeed: 1.0,
    exposure: 1.0,
    pointerPlaneX: 0,
    pointerPlaneZ: 0,
    isHovering: false,
  });

  // Keep ref synchronized with state
  useEffect(() => {
    paramsRef.current.lightPreset = lightPreset;
    paramsRef.current.partingStrength = partingStrength;
    paramsRef.current.driftSpeed = driftSpeed;
    paramsRef.current.exposure = exposure;
  }, [lightPreset, partingStrength, driftSpeed, exposure]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Software WebGL detector as per Three.js skill
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    // 2. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
    // Camera positioned high above the clouds looking slightly down toward the glowing horizon
    camera.position.set(0, 18, 52);
    camera.lookAt(0, 8, -60);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = exposure;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Lighting Presets Configuration
    const lightingThemes = {
      Dawn: {
        skyTop: new THREE.Color(0x655a82),
        skyMid: new THREE.Color(0xb58e98),
        skyHorizon: new THREE.Color(0xf6baa5),
        sunColor: new THREE.Color(0xffffff),
        sunLightColor: new THREE.Color(0xfff3e3),
        ambientColor: new THREE.Color(0x9a889b),
        cloudBaseColor: new THREE.Color(0xffffff),
        cloudShadowColor: new THREE.Color(0xd7cdd9),
        fogColor: new THREE.Color(0xd9b3a8),
        fogNear: 45,
        fogFar: 220,
      },
      Gold: {
        skyTop: new THREE.Color(0x453856),
        skyMid: new THREE.Color(0xba7757),
        skyHorizon: new THREE.Color(0xfab169),
        sunColor: new THREE.Color(0xffffff),
        sunLightColor: new THREE.Color(0xffe2bd),
        ambientColor: new THREE.Color(0xa87c6b),
        cloudBaseColor: new THREE.Color(0xfffaea),
        cloudShadowColor: new THREE.Color(0xdec3b6),
        fogColor: new THREE.Color(0xebb388),
        fogNear: 40,
        fogFar: 210,
      },
      Blue: {
        skyTop: new THREE.Color(0x356ca6),
        skyMid: new THREE.Color(0x7da4d6),
        skyHorizon: new THREE.Color(0xc9e0f7),
        sunColor: new THREE.Color(0xffffff),
        sunLightColor: new THREE.Color(0xffffff),
        ambientColor: new THREE.Color(0x97b5d8),
        cloudBaseColor: new THREE.Color(0xffffff),
        cloudShadowColor: new THREE.Color(0xd3e0ee),
        fogColor: new THREE.Color(0xb5ceea),
        fogNear: 50,
        fogFar: 230,
      },
    };

    const activeTheme = lightingThemes[lightPreset];
    scene.fog = new THREE.Fog(activeTheme.fogColor, activeTheme.fogNear, activeTheme.fogFar);

    // 4. Procedural Sky Dome / Horizon Backdrop
    const skyGeo = new THREE.SphereGeometry(300, 32, 16);
    skyGeo.scale(-1, 1, 1);

    function createSkyTexture(theme: typeof activeTheme) {
      const canvas = document.createElement('canvas');
      canvas.width = 16;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      const grad = ctx.createLinearGradient(0, 0, 0, 512);

      const topHex = '#' + theme.skyTop.getHexString();
      const midHex = '#' + theme.skyMid.getHexString();
      const horizHex = '#' + theme.skyHorizon.getHexString();

      grad.addColorStop(0.0, topHex);
      grad.addColorStop(0.42, midHex);
      grad.addColorStop(0.66, horizHex);
      grad.addColorStop(0.82, horizHex);
      grad.addColorStop(1.0, topHex);

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 512);

      // Atmospheric strata lines matching image_d618aa6f.png
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.fillRect(0, 165, 16, 8);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fillRect(0, 205, 16, 6);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 260, 16, 10);

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    let skyTexture = createSkyTexture(activeTheme);
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTexture,
      depthWrite: false,
    });
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    scene.add(skyMesh);

    // 5. Horizon Glowing Sun (located right of 'Above the weather' matching reference image)
    const sunGroup = new THREE.Group();
    sunGroup.position.set(28, 9.5, -95);

    // Sun disc
    const sunDiscGeo = new THREE.CircleGeometry(4.2, 32);
    const sunDiscMat = new THREE.MeshBasicMaterial({
      color: activeTheme.sunColor,
      transparent: true,
      opacity: 0.99,
      depthWrite: false,
    });
    const sunDisc = new THREE.Mesh(sunDiscGeo, sunDiscMat);
    sunGroup.add(sunDisc);

    // Sun outer glow flare
    function createSunGlowTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;
      const grad = ctx.createRadialGradient(128, 128, 8, 128, 128, 128);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      grad.addColorStop(0.25, 'rgba(255, 248, 235, 0.85)');
      grad.addColorStop(0.55, 'rgba(255, 230, 205, 0.45)');
      grad.addColorStop(0.85, 'rgba(255, 210, 180, 0.12)');
      grad.addColorStop(1, 'rgba(255, 200, 170, 0)');

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    const sunGlowMat = new THREE.MeshBasicMaterial({
      map: createSunGlowTexture(),
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sunGlowMesh = new THREE.Mesh(new THREE.PlaneGeometry(36, 36), sunGlowMat);
    sunGroup.add(sunGlowMesh);

    scene.add(sunGroup);

    // 6. Lights - Key light from top-front to illuminate the billows brilliantly
    const hemiLight = new THREE.HemisphereLight(activeTheme.skyTop, activeTheme.ambientColor, 2.4);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(activeTheme.sunLightColor, 3.2);
    dirLight.position.set(20, 35, 30);
    dirLight.target.position.set(0, 0, -20);
    scene.add(dirLight);
    scene.add(dirLight.target);

    // Secondary back-rim light from the sun
    const rimLight = new THREE.DirectionalLight(activeTheme.sunLightColor, 1.8);
    rimLight.position.set(28, 12, -90);
    rimLight.target.position.set(0, 0, 0);
    scene.add(rimLight);
    scene.add(rimLight.target);

    // 7. Procedural Fluffy Cloud Billow Texture (CanvasTexture)
    function createPuffTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;

      // Draw multi-layered soft cloud puff circles
      const radGrad = ctx.createRadialGradient(128, 128, 8, 128, 128, 124);
      radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      radGrad.addColorStop(0.35, 'rgba(250, 248, 255, 0.75)');
      radGrad.addColorStop(0.7, 'rgba(240, 235, 245, 0.3)');
      radGrad.addColorStop(0.9, 'rgba(230, 225, 240, 0.08)');
      radGrad.addColorStop(1, 'rgba(230, 225, 240, 0)');

      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(128, 128, 120, 0, Math.PI * 2);
      ctx.fill();

      // Additional soft off-center lobes for natural billowy appearance
      const lobes = [
        { x: 95, y: 110, r: 60, op: 0.4 },
        { x: 155, y: 115, r: 65, op: 0.4 },
        { x: 120, y: 150, r: 55, op: 0.35 },
      ];
      lobes.forEach((l) => {
        const lg = ctx.createRadialGradient(l.x, l.y, 4, l.x, l.y, l.r);
        lg.addColorStop(0, `rgba(255, 255, 255, ${l.op})`);
        lg.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = lg;
        ctx.beginPath();
        ctx.arc(l.x, l.y, l.r, 0, Math.PI * 2);
        ctx.fill();
      });

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return tex;
    }

    const cloudPuffTex = createPuffTexture();

    // 8. Generate Ocean of Fluffy Clouds
    // We create a structured grid of cloud cluster nodes with random variations,
    // where each cloud particle smoothly displaces when mouse hovers over it!
    interface CloudNode {
      mesh: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      currentX: number;
      currentZ: number;
      scale: number;
      driftOffset: number;
      rotSpeed: number;
    }

    const cloudNodes: CloudNode[] = [];
    const cloudGroup = new THREE.Group();
    scene.add(cloudGroup);

    const cloudPuffGeo = new THREE.PlaneGeometry(16, 16);

    const cloudMat = new THREE.MeshLambertMaterial({
      map: cloudPuffTex,
      color: activeTheme.cloudBaseColor,
      emissive: activeTheme.cloudBaseColor,
      emissiveIntensity: 0.38,
      transparent: true,
      opacity: 0.94,
      depthWrite: false,
    });

    const rows = 18;
    const cols = 22;
    const spacingX = 8.5;
    const spacingZ = 7.5;
    const startX = -((cols * spacingX) / 2);
    const startZ = -120;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const jitterX = (Math.random() - 0.5) * 5.0;
        const jitterZ = (Math.random() - 0.5) * 4.5;
        // Curvature: lower in front and gently rolling towards the horizon
        const zPos = startZ + r * spacingZ + jitterZ;
        const normZ = (zPos + 120) / 140; // 0 (far) to 1 (near)
        const yPos = -2 + Math.sin(c * 0.4) * 1.5 + Math.cos(r * 0.3) * 1.2 - (1 - normZ) * 3;

        const xPos = startX + c * spacingX + jitterX;
        const scale = 1.0 + Math.random() * 0.9 + (1 - normZ) * 0.4;

        const puffMesh = new THREE.Mesh(cloudPuffGeo, cloudMat);
        puffMesh.position.set(xPos, yPos, zPos);
        // Face slightly upward and towards camera
        puffMesh.rotation.x = -Math.PI * 0.35 + (Math.random() - 0.5) * 0.2;
        puffMesh.rotation.z = (Math.random() - 0.5) * 0.4;
        puffMesh.scale.set(scale, scale, scale);

        cloudGroup.add(puffMesh);

        cloudNodes.push({
          mesh: puffMesh,
          baseX: xPos,
          baseY: yPos,
          baseZ: zPos,
          currentX: xPos,
          currentZ: zPos,
          scale,
          driftOffset: Math.random() * 100,
          rotSpeed: (Math.random() - 0.5) * 0.05,
        });
      }
    }

    // 9. Interactive Pointer Hover Raycasting Plane
    // We project the mouse position onto a reference horizontal plane (y = 0)
    // to part the clouds smoothly!
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-999, -999);
    const hoverPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const planeIntersectPoint = new THREE.Vector3();

    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.ray.intersectPlane(hoverPlane, planeIntersectPoint);
      if (hit) {
        paramsRef.current.pointerPlaneX = planeIntersectPoint.x;
        paramsRef.current.pointerPlaneZ = planeIntersectPoint.z;
        paramsRef.current.isHovering = true;
      }
    };

    const handlePointerLeave = () => {
      paramsRef.current.isHovering = false;
    };

    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerleave', handlePointerLeave);

    // 10. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 11. Animation Loop with Software-WebGL pacing
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    let lastPreset = lightPreset;

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();
      const { partingStrength, driftSpeed, exposure, pointerPlaneX, pointerPlaneZ, isHovering, lightPreset: currPreset } = paramsRef.current;

      // Handle Preset transitions smoothly
      if (currPreset !== lastPreset) {
        lastPreset = currPreset;
        const newTheme = lightingThemes[currPreset];
        scene.fog = new THREE.Fog(newTheme.fogColor, newTheme.fogNear, newTheme.fogFar);
        hemiLight.color.copy(newTheme.skyTop);
        hemiLight.groundColor.copy(newTheme.ambientColor);
        dirLight.color.copy(newTheme.sunLightColor);
        rimLight.color.copy(newTheme.sunLightColor);
        cloudMat.color.copy(newTheme.cloudBaseColor);
        cloudMat.emissive.copy(newTheme.cloudBaseColor);
        sunDiscMat.color.copy(newTheme.sunColor);

        // Update sky dome texture
        skyTexture.dispose();
        skyTexture = createSkyTexture(newTheme);
        skyMat.map = skyTexture;
        skyMat.needsUpdate = true;
      }

      // Update Exposure
      renderer.toneMappingExposure = THREE.MathUtils.damp(
        renderer.toneMappingExposure,
        exposure,
        4.0,
        delta
      );

      // Gentle cloud ocean drifting and pointer hover parting
      const drift = elapsed * 1.5 * driftSpeed;

      for (let i = 0; i < cloudNodes.length; i++) {
        const node = cloudNodes[i];

        // Natural continuous gentle billow drift
        const continuousZ = node.baseZ + ((drift + node.driftOffset) % 135) - 30;
        const bob = Math.sin(elapsed * 0.8 + node.driftOffset) * 0.4;

        // Pointer hover parting displacement
        let targetX = node.baseX;
        let targetZ = continuousZ;

        if (isHovering && partingStrength > 0.05) {
          const disp = calculateCloudPointerDisplacement(
            node.currentX,
            node.currentZ,
            pointerPlaneX,
            pointerPlaneZ,
            partingStrength
          );
          targetX += disp.dx;
          targetZ += disp.dz;
        }

        // Elastic smooth damping towards targets
        node.currentX = THREE.MathUtils.damp(node.currentX, targetX, 5.0, delta);
        node.currentZ = THREE.MathUtils.damp(node.currentZ, targetZ, 5.0, delta);

        node.mesh.position.x = node.currentX;
        node.mesh.position.y = node.baseY + bob;
        node.mesh.position.z = node.currentZ;
      }

      // Subtle parallax camera sway on pointer
      if (isHovering) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 3.5, 2.0, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, 18 - pointer.y * 1.5, 2.0, delta);
      } else {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, 0, 1.5, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, 18, 1.5, delta);
      }
      camera.lookAt(0, 8, -60);

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    // Start render loop
    if (isSoftwareGl) {
      afterDraw(tick);
    } else {
      frameId = requestAnimationFrame(tick);
    }

    // Clean up
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      skyTexture.dispose();
      cloudPuffTex.dispose();
      cloudPuffGeo.dispose();
      cloudMat.dispose();
      skyGeo.dispose();
      skyMat.dispose();
      sunDiscGeo.dispose();
      sunDiscMat.dispose();
      sunGlowMat.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden select-none bg-slate-950">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full cursor-crosshair"
        title="Hover to move and part the clouds"
      />

      {/* Top Left Subtle Header: MOVE THROUGH THE CLOUDS */}
      <div className="absolute top-6 left-8 z-20 pointer-events-none">
        <h2 className="text-[11px] font-sans font-medium tracking-[0.28em] text-slate-300/80 uppercase">
          MOVE THROUGH THE CLOUDS
        </h2>
      </div>

      {/* Top Right Quick Actions: Scam Defense AI Chatbot & Report */}
      <div className="absolute top-6 right-8 z-20 flex items-center gap-3">
        <button
          onClick={onOpenChatbot}
          className="px-4 py-2 rounded-full text-xs font-medium tracking-wide bg-slate-900/70 hover:bg-slate-900/90 text-white border border-white/15 shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-none"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Scam Defense AI Chat</span>
        </button>

        <button
          onClick={onOpenReportModal}
          className="px-4 py-2 rounded-full text-xs font-semibold tracking-wide bg-blue-600/85 hover:bg-blue-600 text-white border border-blue-400/30 shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Report Scam</span>
        </button>
      </div>

      {/* Center Serif Hero: 'Above the weather' with gentle translucent atmospheric presence */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none pb-28">
        <div className="text-center px-4 max-w-4xl">
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-normal text-white/95 font-light"
            style={{
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.25), 0 0 60px rgba(255, 230, 200, 0.3)',
            }}
          >
            Above the weather
          </h1>

          <p className="mt-4 text-xs md:text-sm font-sans tracking-wide text-white/80 max-w-lg mx-auto font-light leading-relaxed">
            Rise above fraud, fear, and manufactured urgency. Hover to part the clouds, analyze suspicious communications, and file incident reports.
          </p>

          <div className="mt-6 flex items-center justify-center gap-3 pointer-events-auto">
            <button
              onClick={onOpenChatbot}
              className="px-6 py-2.5 rounded-full text-xs font-medium tracking-wider bg-white/90 hover:bg-white text-slate-900 shadow-xl transition-all hover:shadow-2xl hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span>Ask Forensic Investigator</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="px-5 py-2.5 rounded-full text-xs font-medium tracking-wider bg-slate-900/60 hover:bg-slate-900/80 text-white border border-white/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Log Phishing Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Right Floating Glass Controls Card matching image_d618aa6f.png: PROPS ^ */}
      <div className="absolute bottom-6 right-6 z-30 w-72 md:w-80">
        <div className="bg-[#242426]/90 border border-white/10 rounded-2xl p-4 text-white shadow-2xl">
          {/* Header with Title and Chevron */}
          <div
            onClick={() => setIsPropsOpen(!isPropsOpen)}
            className="flex items-center justify-between cursor-pointer pb-2"
          >
            <span className="text-[11px] font-sans font-bold tracking-[0.2em] text-slate-200 uppercase">
              PROPS
            </span>
            <button
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Toggle props drawer"
            >
              {isPropsOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Collapsible Body */}
          {isPropsOpen && (
            <div className="pt-2 space-y-4 text-xs font-sans">
              {/* Light preset buttons */}
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium text-[11px]">Light</span>
                <div className="flex bg-[#18181a] rounded-lg p-0.5 border border-white/10">
                  {(['Dawn', 'Gold', 'Blue'] as LightTheme[]).map((theme) => {
                    const active = lightPreset === theme;
                    return (
                      <button
                        key={theme}
                        onClick={() => setLightPreset(theme)}
                        className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer ${
                          active
                            ? 'bg-[#3b3b40] text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {theme}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Parting slider */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-300 font-medium text-[11px] w-14">Parting</span>
                <input
                  type="range"
                  min="0"
                  max="2.5"
                  step="0.05"
                  value={partingStrength}
                  onChange={(e) => setPartingStrength(parseFloat(e.target.value))}
                  className="flex-1 accent-white h-1 bg-white/20 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] font-mono text-slate-300 w-8 text-right">
                  {partingStrength.toFixed(2)}
                </span>
              </div>

              {/* Drift slider */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-300 font-medium text-[11px] w-14">Drift</span>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={driftSpeed}
                  onChange={(e) => setDriftSpeed(parseFloat(e.target.value))}
                  className="flex-1 accent-white h-1 bg-white/20 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] font-mono text-slate-300 w-8 text-right">
                  {driftSpeed.toFixed(1)}x
                </span>
              </div>

              {/* Exposure slider */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-300 font-medium text-[11px] w-14">Exposure</span>
                <input
                  type="range"
                  min="0.4"
                  max="2.2"
                  step="0.05"
                  value={exposure}
                  onChange={(e) => setExposure(parseFloat(e.target.value))}
                  className="flex-1 accent-white h-1 bg-white/20 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] font-mono text-slate-300 w-8 text-right">
                  {exposure.toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
