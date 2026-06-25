import React, { useRef, useEffect } from 'react';

export function Globe3D({ markers = [], config = {}, onMarkerClick }) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);

  const {
    atmosphereColor = '#4da6ff',
    autoRotateSpeed = 0.3,
  } = config;

  useEffect(() => {
    let active = true;
    let renderer, scene, camera, animationFrameId;
    let eventListeners = [];

    // Helper to add event listener and track for removal
    const addListener = (target, type, fn, opts) => {
      target.addEventListener(type, fn, opts);
      eventListeners.push({ target, type, fn });
    };

    const initThree = () => {
      const THREE = window.THREE;
      if (!THREE || !active || !canvasRef.current || !wrapperRef.current) return;

      const canvas = canvasRef.current;
      const wrapper = wrapperRef.current;
      const tooltip = tooltipRef.current;

      const W = wrapper.clientWidth || 400;
      const H = wrapper.clientHeight || 400;
      const R = 1.5;

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio || 1);
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
      camera.position.z = 5;

      scene.add(new THREE.AmbientLight(0xffffff, 0.6));
      
      const sunColor = new THREE.Color(atmosphereColor);
      const sun = new THREE.DirectionalLight(sunColor, 1.2);
      sun.position.set(5, 3, 5);
      scene.add(sun);

      const texLoader = new THREE.TextureLoader();
      const earthTex = texLoader.load(
        'https://threejs.org/examples/textures/land_ocean_ice_cloud_2048.jpg',
        undefined,
        undefined,
        () => {
          if (earthMat) earthMat.color.set(0x0a1628);
        }
      );
      const bumpTex = texLoader.load('https://threejs.org/examples/textures/earth_normal_2048.jpg');
      const specTex = texLoader.load('https://threejs.org/examples/textures/earth_specular_2048.jpg');

      const earthGeo = new THREE.SphereGeometry(R, 36, 36);
      const earthMat = new THREE.MeshPhongMaterial({
        map: earthTex,
        bumpMap: bumpTex,
        bumpScale: 0.05,
        specularMap: specTex,
        specular: new THREE.Color(0x333333),
        shininess: 15,
      });
      const earth = new THREE.Mesh(earthGeo, earthMat);
      scene.add(earth);

      const atmGeo = new THREE.SphereGeometry(R * 1.07, 36, 36);
      const atmMat = new THREE.MeshPhongMaterial({
        color: sunColor,
        transparent: true,
        opacity: 0.10,
        side: THREE.FrontSide,
        depthWrite: false,
      });
      scene.add(new THREE.Mesh(atmGeo, atmMat));

      const markerMeshes = [];
      const ringMeshes = [];

      function latLngToVec3(lat, lng, radius) {
        const phi = (90 - lat) * Math.PI / 180;
        const theta = (lng + 180) * Math.PI / 180;
        return new THREE.Vector3(
          -radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
      }

      markers.forEach((m) => {
        const pos = latLngToVec3(m.lat, m.lng, R + 0.04);

        // Dot Mesh
        const dotGeo = new THREE.SphereGeometry(0.035, 12, 12);
        const dotMat = new THREE.MeshBasicMaterial({ color: sunColor });
        const dot = new THREE.Mesh(dotGeo, dotMat);
        dot.position.copy(pos);
        dot.userData = { label: m.label, markerData: m };
        earth.add(dot);
        markerMeshes.push(dot);

        // Ring Mesh
        const ringGeo = new THREE.RingGeometry(0.05, 0.07, 20);
        const ringMat = new THREE.MeshBasicMaterial({
          color: sunColor,
          transparent: true,
          opacity: 0.5,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.position.copy(pos);
        ring.lookAt(0, 0, 0);
        ring.userData = { isRing: true };
        earth.add(ring);
        ringMeshes.push(ring);

        // Sprite Mesh
        if (m.src) {
          const avatarTex = texLoader.load(m.src);
          const spriteMat = new THREE.SpriteMaterial({
            map: avatarTex,
            transparent: true,
            depthTest: false,
          });
          const sprite = new THREE.Sprite(spriteMat);
          const sp = latLngToVec3(m.lat, m.lng, R + 0.32);
          sprite.position.copy(sp);
          sprite.scale.set(0.22, 0.22, 1);
          sprite.userData = { label: m.label, markerData: m };
          earth.add(sprite);
          markerMeshes.push(sprite);
        }
      });

      let isDragging = false;
      let prevMouse = { x: 0, y: 0 };
      let rotVel = { x: 0, y: autoRotateSpeed * 0.01 };

      addListener(canvas, 'mousedown', (e) => {
        isDragging = true;
        prevMouse = { x: e.clientX, y: e.clientY };
      });

      addListener(window, 'mouseup', () => {
        isDragging = false;
      });

      addListener(window, 'mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        rotVel.y = dx * 0.004;
        rotVel.x = dy * 0.004;
        prevMouse = { x: e.clientX, y: e.clientY };
      });

      // Handle tooltip hover and click trigger
      const raycaster = new THREE.Raycaster();
      const mouse2D = new THREE.Vector2();
      let hoveredObj = null;

      function getNDC(e) {
        const rect = canvas.getBoundingClientRect();
        mouse2D.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse2D.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      }

      addListener(canvas, 'mousemove', (e) => {
        getNDC(e);
        raycaster.setFromCamera(mouse2D, camera);
        const hits = raycaster.intersectObjects(markerMeshes);
        
        if (hits.length > 0 && hits[0].object.userData.label) {
          hoveredObj = hits[0].object;
          const lbl = hoveredObj.userData.label;
          const rect = canvas.getBoundingClientRect();
          
          tooltip.textContent = '📍 ' + lbl;
          tooltip.style.left = (e.clientX - rect.left + 12) + 'px';
          tooltip.style.top = (e.clientY - rect.top - 30) + 'px';
          tooltip.style.opacity = '1';
          canvas.style.cursor = 'pointer';
        } else {
          hoveredObj = null;
          tooltip.style.opacity = '0';
          canvas.style.cursor = 'grab';
        }
        if (isDragging) {
          canvas.style.cursor = 'grabbing';
        }
      });

      addListener(canvas, 'click', () => {
        if (hoveredObj && onMarkerClick) {
          onMarkerClick(hoveredObj.userData.markerData);
        }
      });

      addListener(canvas, 'mouseleave', () => {
        tooltip.style.opacity = '0';
      });

      let clock = 0;

      function animate() {
        if (!active) return;
        animationFrameId = requestAnimationFrame(animate);
        clock += 0.016;

        // Orbit rotation
        earth.rotation.y += rotVel.y;
        earth.rotation.x += rotVel.x * 0.3;
        rotVel.y = isDragging ? rotVel.y : rotVel.y * 0.97 + (autoRotateSpeed * 0.01) * 0.03;
        rotVel.x *= 0.96;

        // Pulse ring sizes and opacities
        ringMeshes.forEach((ring) => {
          if (ring.material) {
            ring.material.opacity = 0.3 + 0.4 * Math.abs(Math.sin(clock * 2));
            const s = 1 + 0.15 * Math.abs(Math.sin(clock * 2));
            ring.scale.set(s, s, s);
          }
        });

        renderer.render(scene, camera);
      }
      animate();

      const handleResize = () => {
        if (!wrapper || !camera || !renderer) return;
        const nW = wrapper.clientWidth;
        const nH = wrapper.clientHeight;
        camera.aspect = nW / nH;
        camera.updateProjectionMatrix();
        renderer.setSize(nW, nH);
      };
      addListener(window, 'resize', handleResize);
      
      // Initial sizing correction
      setTimeout(handleResize, 50);
    };

    if (window.THREE) {
      initThree();
    } else {
      const scriptId = 'three-js-script';
      let script = document.getElementById(scriptId);
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js';
        document.head.appendChild(script);
      }
      
      const handleScriptLoad = () => {
        initThree();
      };
      script.addEventListener('load', handleScriptLoad);
      
      return () => {
        active = false;
        script.removeEventListener('load', handleScriptLoad);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        eventListeners.forEach(({ target, type, fn }) => {
          if (target) target.removeEventListener(type, fn);
        });
        if (renderer) renderer.dispose();
      };
    }

    return () => {
      active = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      eventListeners.forEach(({ target, type, fn }) => {
        if (target) target.removeEventListener(type, fn);
      });
      if (renderer) renderer.dispose();
    };
  }, [markers, autoRotateSpeed, atmosphereColor]);

  return (
    <div id="globeWrapper" ref={wrapperRef} className="w-full h-full relative">
      <canvas id="globeCanvas" ref={canvasRef} className="w-full h-full block" />
      <div id="globeTooltip" ref={tooltipRef} className="absolute opacity-0 pointer-events-none transition-opacity duration-200" />
    </div>
  );
}
