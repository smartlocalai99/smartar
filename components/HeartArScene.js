import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

import { HEART_ASSET_PATHS } from './heartContent';

export default function HeartArScene() {
  const sceneRef = useRef(null);
  const [clientReady, setClientReady] = useState(false);
  const [aframeReady, setAframeReady] = useState(false);
  const [mindarReady, setMindarReady] = useState(false);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [cameraRunning, setCameraRunning] = useState(false);
  const [cameraStarting, setCameraStarting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setClientReady(true), []);

  const sceneCanRender = clientReady && aframeReady && mindarReady;

  useEffect(() => {
    if (!sceneCanRender || !sceneRef.current) return undefined;

    const scene = sceneRef.current;
    const onLoaded = () => setSceneLoaded(true);
    const onReady = () => {
      setCameraStarting(false);
      setCameraRunning(true);
      setError('');
    };
    const onError = () => {
      setCameraStarting(false);
      setCameraRunning(false);
      setError('Camera could not open. Allow camera permission and try again.');
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
    if (!system) return;

    setCameraStarting(true);
    setError('');

    try {
      system.start();
    } catch {
      setCameraStarting(false);
      setError('Camera could not open. Allow camera permission and try again.');
    }
  };

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
          mindar-image={`imageTargetSrc: ${HEART_ASSET_PATHS.target}; autoStart: false; uiLoading: no; uiScanning: no; uiError: no; filterMinCF: 0.0001; filterBeta: 10; warmupTolerance: 8; missTolerance: 12;`}
          color-space="sRGB"
          renderer="colorManagement: true; physicallyCorrectLights: true; antialias: true; alpha: true;"
          vr-mode-ui="enabled: false"
          device-orientation-permission-ui="enabled: false"
          embedded
          class="heart-ar-scene"
        >
          <a-assets timeout="15000">
            <a-asset-item id="heartModelAsset" src={HEART_ASSET_PATHS.model} />
          </a-assets>

          <a-camera position="0 0 0" look-controls="enabled: false" />

          <a-entity mindar-image-target="targetIndex: 0">
            <a-ambient-light intensity="1.25" />
            <a-directional-light position="1 2 1" intensity="1.5" />
            <a-gltf-model
              src="#heartModelAsset"
              position="0 0 0.08"
              rotation="0 0 0"
              scale="0.35 0.35 0.35"
            />
          </a-entity>
        </a-scene>
      ) : null}

      {!cameraRunning ? (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black">
          <div className="flex max-w-xs flex-col items-center gap-4 px-5 text-center">
            {error ? <p className="text-sm leading-6 text-white">{error}</p> : null}
            <button
              type="button"
              onClick={startCamera}
              disabled={!sceneLoaded || cameraStarting}
              className="rounded-full bg-white px-8 py-4 font-semibold text-black disabled:opacity-50"
            >
              {cameraStarting ? 'Opening Camera…' : sceneLoaded ? 'Open Camera' : 'Loading…'}
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
