import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

import { HEART_ASSET_PATHS } from './heartContent';

export default function HeartArScene({
  assetPaths = HEART_ASSET_PATHS,
  modelAssetId = 'trackedModelAsset',
  modelScale = '0.14 0.14 0.14',
  modelPosition = '0 0 0.08',
  modelLocalPosition = '0 0 0',
  modelRotation = '0 0 0',
  hotspots = [],
}) {
  const sceneRef = useRef(null);
  const modelPivotRef = useRef(null);
  const modelZoomRef = useRef(1);
  const startAttemptedRef = useRef(false);
  const cameraStartingRef = useRef(false);
  const [clientReady, setClientReady] = useState(false);
  const [aframeReady, setAframeReady] = useState(false);
  const [mindarReady, setMindarReady] = useState(false);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [cameraRunning, setCameraRunning] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [error, setError] = useState('');
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  useEffect(() => {
    cameraStartingRef.current = cameraStarting;
  }, [cameraStarting]);

  useEffect(() => setClientReady(true), []);

  const sceneCanRender = clientReady && aframeReady && mindarReady;

  useEffect(() => {
    if (!sceneCanRender || !sceneRef.current) return undefined;

    const scene = sceneRef.current;
    const onLoaded = () => setSceneLoaded(true);
    const onReady = () => {
      cameraStartingRef.current = false;
      setCameraStarting(false);
      setCameraRunning(true);
      setError('');
    };
    const onError = () => {
      cameraStartingRef.current = false;
      setCameraStarting(false);
      setCameraRunning(false);
      setError('Camera could not open. Tap anywhere to try again.');
    };

    scene.addEventListener('loaded', onLoaded);
    scene.addEventListener('arReady', onReady);
    scene.addEventListener('arError', onError);
    if (scene.hasLoaded) onLoaded();

    return () => {
      scene.removeEventListener('loaded', onLoaded);
      scene.removeEventListener('arReady', onReady);
      scene.removeEventListener('arError', onError);
    };
  }, [sceneCanRender]);

  const startCamera = async () => {
    if (!window.isSecureContext) {
      setError('Camera requires HTTPS or localhost.');
      return;
    }

    const system = sceneRef.current?.systems?.['mindar-image-system'];
    if (!system || cameraRunning || cameraStartingRef.current) return;

    cameraStartingRef.current = true;
    setCameraStarting(true);
    setError('');

    // Best-effort: real edge-to-edge fullscreen only works with a user
    // gesture, and isn't supported by every mobile browser (notably plain
    // iOS Safari tabs) — safe to ignore failures here.
    try {
      await document.documentElement.requestFullscreen?.();
    } catch {
      // ignore, not critical
    }

    try {
      system.start();
    } catch {
      cameraStartingRef.current = false;
      setCameraStarting(false);
      setError('Camera could not open. Tap anywhere to try again.');
    }
  };

  useEffect(() => {
    if (!sceneLoaded || startAttemptedRef.current) return;
    startAttemptedRef.current = true;
    startCamera();
    // startCamera intentionally runs once when MindAR finishes loading.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneLoaded]);

  useEffect(() => {
    const pointers = new Map();
    let lastX = 0;
    let lastY = 0;
    let pinchDistance = 0;
    let dragDistance = 0;

    const applyZoom = (nextZoom) => {
      const pivot = modelPivotRef.current;
      if (!pivot) return;
      modelZoomRef.current = Math.min(3, Math.max(0.45, nextZoom));
      pivot.object3D.scale.setScalar(modelZoomRef.current);
    };

    const distanceBetweenPointers = () => {
      const [first, second] = [...pointers.values()];
      return Math.hypot(second.x - first.x, second.y - first.y);
    };

    const begin = (event) => {
      if (!cameraRunning || !modelPivotRef.current) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      lastX = event.clientX;
      lastY = event.clientY;
      dragDistance = 0;
      if (pointers.size === 2) pinchDistance = distanceBetweenPointers();
    };
    const move = (event) => {
      if (!pointers.has(event.pointerId) || !modelPivotRef.current) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

      if (pointers.size === 2) {
        const nextDistance = distanceBetweenPointers();
        if (pinchDistance > 0) applyZoom(modelZoomRef.current * (nextDistance / pinchDistance));
        pinchDistance = nextDistance;
      } else if (pointers.size === 1) {
        const dx = event.clientX - lastX;
        const dy = event.clientY - lastY;
        dragDistance += Math.hypot(dx, dy);
        lastX = event.clientX;
        lastY = event.clientY;
        if (dragDistance > 6) {
          modelPivotRef.current.object3D.rotation.y += dx * 0.012;
          modelPivotRef.current.object3D.rotation.x += dy * 0.012;
        }
      }
      if (pointers.size === 2 || dragDistance > 6) event.preventDefault();
    };
    const end = (event) => {
      pointers.delete(event.pointerId);
      pinchDistance = pointers.size === 2 ? distanceBetweenPointers() : 0;
      if (pointers.size === 1) {
        const remaining = [...pointers.values()][0];
        lastX = remaining.x;
        lastY = remaining.y;
      }
    };
    const wheel = (event) => {
      if (!cameraRunning || !modelPivotRef.current) return;
      applyZoom(modelZoomRef.current * Math.exp(-event.deltaY * 0.001));
      event.preventDefault();
    };

    window.addEventListener('pointerdown', begin);
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    window.addEventListener('wheel', wheel, { passive: false });

    return () => {
      window.removeEventListener('pointerdown', begin);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
      window.removeEventListener('wheel', wheel);
    };
  }, [cameraRunning]);

  useEffect(() => {
    if (!sceneLoaded || hotspots.length === 0 || !sceneRef.current) return undefined;
    const nodes = [...sceneRef.current.querySelectorAll('[data-ar-hotspot]')];
    const listeners = nodes.map((node) => {
      const handler = (event) => {
        event.stopPropagation();
        const selected = hotspots.find((item) => item.id === node.dataset.arHotspot);
        if (selected) setSelectedHotspot(selected);
      };
      node.addEventListener('mousedown', handler);
      node.addEventListener('click', handler);
      return [node, handler];
    });
    return () => listeners.forEach(([node, handler]) => {
      node.removeEventListener('mousedown', handler);
      node.removeEventListener('click', handler);
    });
  }, [hotspots, sceneLoaded]);

  if (!clientReady) return null;

  return (
    <main className="fixed inset-0 overflow-hidden bg-black">
      <Script
        src="https://aframe.io/releases/1.5.0/aframe.min.js"
        strategy="afterInteractive"
        onLoad={() => setAframeReady(true)}
        onError={() => setError('AR could not load. Check your internet connection.')}
      />
      {aframeReady ? (
        <Script
          src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"
          strategy="afterInteractive"
          onLoad={() => setMindarReady(true)}
          onError={() => setError('AR could not load. Check your internet connection.')}
        />
      ) : null}

      {sceneCanRender ? (
        <a-scene
          ref={sceneRef}
          mindar-image={`imageTargetSrc: ${assetPaths.target}; autoStart: false; uiLoading: no; uiScanning: no; uiError: no; filterMinCF: 0.00005; filterBeta: 0.001; warmupTolerance: 15; missTolerance: 30;`}
          color-space="sRGB"
          renderer="colorManagement: true; physicallyCorrectLights: true; antialias: true; alpha: true;"
          vr-mode-ui="enabled: false"
          device-orientation-permission-ui="enabled: false"
          embedded
          class="heart-ar-scene"
        >
          <a-assets timeout="15000">
            <a-asset-item id={modelAssetId} src={assetPaths.model} />
          </a-assets>

          <a-camera
            position="0 0 0"
            look-controls="enabled: false"
            cursor={hotspots.length ? 'rayOrigin: mouse; fuse: false; mouseCursorStylesEnabled: false' : undefined}
            raycaster={hotspots.length ? 'objects: .ar-hotspot' : undefined}
          />

          <a-entity mindar-image-target="targetIndex: 0">
            <a-ambient-light intensity="1.25" />
            <a-directional-light position="1 2 1" intensity="1.5" />
            <a-entity ref={modelPivotRef} position={modelPosition}>
              <a-gltf-model
                src={`#${modelAssetId}`}
                position={modelLocalPosition}
                rotation={modelRotation}
                scale={modelScale}
              />
              {hotspots.map((item) => (
                <a-entity
                  key={item.id}
                  data-ar-hotspot={item.id}
                  class="ar-hotspot"
                  position={item.position}
                  geometry="primitive: sphere; radius: 0.045"
                  material="color: #22d3ee; emissive: #0891b2; emissiveIntensity: 1; opacity: 0.95"
                  text={`value: ${item.number}; align: center; color: #020617; width: 0.72; zOffset: 0.046`}
                />
              ))}
            </a-entity>
          </a-entity>
        </a-scene>
      ) : null}

      {!cameraRunning ? (
        <div
          role="button"
          tabIndex={0}
          onClick={startCamera}
          className="absolute inset-0 z-20 flex items-center justify-center bg-black"
        >
          {error ? (
            <p className="max-w-xs px-5 text-center text-sm leading-6 text-white">{error}</p>
          ) : (
            <p className="text-sm text-white/60">
              {cameraStarting ? 'Starting camera…' : sceneLoaded ? 'Tap to open camera' : 'Loading AR…'}
            </p>
          )}
        </div>
      ) : null}

      {cameraRunning && selectedHotspot ? (
        <section className="absolute bottom-3 left-3 right-3 z-30 max-h-[46svh] overflow-y-auto rounded-3xl border border-white/15 bg-slate-950/95 p-4 text-left text-white shadow-2xl backdrop-blur-md sm:bottom-5 sm:left-1/2 sm:right-auto sm:w-[30rem] sm:-translate-x-1/2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">Spine part {selectedHotspot.number}</p>
              <h2 className="mt-1 text-xl font-semibold">{selectedHotspot.title}</h2>
            </div>
            <button type="button" onClick={() => setSelectedHotspot(null)} aria-label="Close details" className="min-h-10 min-w-10 rounded-full bg-white/10 text-lg">×</button>
          </div>
          <div className="mt-3 space-y-3 text-sm leading-5 text-slate-200">
            <p><span className="font-semibold text-cyan-300">NEET Biology:</span> {selectedHotspot.neet}</p>
            <p><span className="font-semibold text-cyan-300">Simple explanation:</span> {selectedHotspot.patient}</p>
            <p className="rounded-2xl bg-cyan-400/10 p-3"><span className="font-semibold text-cyan-300">Key point:</span> {selectedHotspot.keyPoint}</p>
          </div>
        </section>
      ) : null}
    </main>
  );
}
