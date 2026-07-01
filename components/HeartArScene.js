import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

import { HEART_ASSET_PATHS } from './heartContent';

export default function HeartArScene({
  assetPaths = HEART_ASSET_PATHS,
  modelAssetId = 'trackedModelAsset',
  modelScale = '0.14 0.14 0.14',
  modelPosition = '0 0 0.08',
}) {
  const sceneRef = useRef(null);
  const modelPivotRef = useRef(null);
  const startAttemptedRef = useRef(false);
  const cameraStartingRef = useRef(false);
  const [clientReady, setClientReady] = useState(false);
  const [aframeReady, setAframeReady] = useState(false);
  const [mindarReady, setMindarReady] = useState(false);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [cameraRunning, setCameraRunning] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [error, setError] = useState('');

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
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const begin = (event) => {
      if (!cameraRunning || !modelPivotRef.current) return;
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
    };
    const move = (event) => {
      if (!dragging || !modelPivotRef.current) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      modelPivotRef.current.object3D.rotation.y += dx * 0.012;
      modelPivotRef.current.object3D.rotation.x += dy * 0.012;
      event.preventDefault();
    };
    const end = () => { dragging = false; };

    window.addEventListener('pointerdown', begin);
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);

    return () => {
      window.removeEventListener('pointerdown', begin);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
  }, [cameraRunning]);

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
          mindar-image={`imageTargetSrc: ${assetPaths.target}; autoStart: false; uiLoading: no; uiScanning: no; uiError: no; filterMinCF: 0.0001; filterBeta: 0.01; warmupTolerance: 10; missTolerance: 20;`}
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

          <a-camera position="0 0 0" look-controls="enabled: false" />

          <a-entity mindar-image-target="targetIndex: 0">
            <a-ambient-light intensity="1.25" />
            <a-directional-light position="1 2 1" intensity="1.5" />
            <a-entity ref={modelPivotRef} position={modelPosition}>
              <a-gltf-model
                src={`#${modelAssetId}`}
                rotation="0 0 0"
                scale={modelScale}
              />
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
    </main>
  );
}
