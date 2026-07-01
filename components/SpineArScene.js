import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useMemo, useRef, useState } from 'react';
import AssetWarnings from './AssetWarnings';
import SpineInfoPanel from './SpineInfoPanel';
import { DEFAULT_SPINE_HOTSPOT, SPINE_ASSET_PATHS, SPINE_HOTSPOTS } from './spineContent';

async function assetExists(path) {
  try { return (await fetch(path, { method: 'HEAD', cache: 'no-store' })).ok; } catch { return false; }
}

export default function SpineArScene() {
  const sceneRef = useRef(null);
  const hotspotsRef = useRef(null);
  const startedRef = useRef(false);
  const [client, setClient] = useState(false);
  const [aframe, setAframe] = useState(false);
  const [mindar, setMindar] = useState(false);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [cameraRunning, setCameraRunning] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');
  const [active, setActive] = useState(DEFAULT_SPINE_HOTSPOT);
  const [assets, setAssets] = useState({ model: null, poster: null, target: null });

  useEffect(() => setClient(true), []);
  useEffect(() => {
    let live = true;
    Promise.all(Object.values(SPINE_ASSET_PATHS).map(assetExists)).then(([model, poster, target]) => {
      if (live) setAssets({ model, poster, target });
    });
    return () => { live = false; };
  }, []);

  const ready = client && aframe && mindar;
  const startCamera = () => {
    if (!window.isSecureContext) { setError('Camera requires HTTPS on mobile. Use an HTTPS deployment or localhost.'); return; }
    const system = sceneRef.current?.systems?.['mindar-image-system'];
    if (!system || starting) return;
    setStarting(true); setError('');
    try { system.start(); } catch { setStarting(false); setError('Camera could not open. Check permission and try again.'); }
  };

  useEffect(() => {
    if (!ready || !sceneRef.current) return undefined;
    const scene = sceneRef.current;
    const loaded = () => setSceneLoaded(true);
    const arReady = () => { setStarting(false); setCameraRunning(true); };
    const arError = () => { setStarting(false); setCameraRunning(false); setError('AR camera failed. Allow camera access, close other camera apps, then restart.'); };
    scene.addEventListener('loaded', loaded); scene.addEventListener('arReady', arReady); scene.addEventListener('arError', arError);
    if (scene.hasLoaded) loaded();
    return () => { scene.removeEventListener('loaded', loaded); scene.removeEventListener('arReady', arReady); scene.removeEventListener('arError', arError); };
  }, [ready]);

  useEffect(() => {
    if (sceneLoaded && !startedRef.current) { startedRef.current = true; startCamera(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sceneLoaded]);

  useEffect(() => {
    if (!sceneLoaded || !hotspotsRef.current) return undefined;
    const nodes = [...hotspotsRef.current.querySelectorAll('[data-hotspot]')];
    const handlers = nodes.map((node) => {
      const handler = () => setActive(SPINE_HOTSPOTS.find((item) => item.id === node.dataset.hotspot) || DEFAULT_SPINE_HOTSPOT);
      node.addEventListener('click', handler); return [node, handler];
    });
    return () => handlers.forEach(([node, handler]) => node.removeEventListener('click', handler));
  }, [sceneLoaded]);

  const warnings = useMemo(() => [
    assets.model === false && { label: 'Spine model is missing', message: 'Add the optimized spine GLB.', path: SPINE_ASSET_PATHS.model },
    assets.poster === false && { label: 'Spine poster is missing', message: 'Add the printable tracking poster.', path: SPINE_ASSET_PATHS.poster },
    assets.target === false && { label: 'Spine target is missing', message: 'Compile the poster with the MindAR compiler.', path: SPINE_ASSET_PATHS.target },
  ].filter(Boolean), [assets]);

  if (!client) return null;
  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-slate-950 text-white">
      <Script src="https://aframe.io/releases/1.5.0/aframe.min.js" strategy="afterInteractive" onLoad={() => setAframe(true)} onError={() => setError('A-Frame failed to load. Check your connection.')} />
      {aframe ? <Script src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js" strategy="afterInteractive" onLoad={() => setMindar(true)} onError={() => setError('MindAR failed to load. Check your connection.')} /> : null}
      {ready ? (
        <a-scene ref={sceneRef} class="heart-ar-scene" embedded
          mindar-image={`imageTargetSrc: ${SPINE_ASSET_PATHS.target}; autoStart: false; uiLoading: no; uiScanning: no; uiError: no; filterMinCF: 0.0001; filterBeta: 0.01; warmupTolerance: 10; missTolerance: 20;`}
          renderer="colorManagement: true; physicallyCorrectLights: true; antialias: true; alpha: true;"
          vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false">
          <a-assets timeout="15000"><a-asset-item id="spineModelAsset" src={SPINE_ASSET_PATHS.model} /></a-assets>
          <a-camera position="0 0 0" look-controls="enabled: false" cursor="rayOrigin: mouse" raycaster="objects: .spine-hotspot" />
          <a-entity mindar-image-target="targetIndex: 0">
            <a-ambient-light intensity="1.3" /><a-directional-light position="1 2 1" intensity="1.6" />
            <a-gltf-model src="#spineModelAsset" position="0 0 0.06" scale="0.25 0.25 0.25" />
            <a-entity ref={hotspotsRef}>
              {SPINE_HOTSPOTS.map((item) => (
                <a-entity key={item.id} data-hotspot={item.id} class="spine-hotspot" position={item.position}
                  geometry="primitive: circle; radius: 0.075" material="color: #22d3ee; emissive: #0891b2; emissiveIntensity: 1; opacity: 0.95"
                  text={`value: ${item.number}; align: center; color: #020617; width: 1.2; zOffset: 0.002`} />
              ))}
            </a-entity>
          </a-entity>
        </a-scene>
      ) : null}

      <div className="pointer-events-none relative z-20 flex min-h-[100svh] flex-col p-3">
        <header className="pointer-events-auto rounded-2xl bg-slate-950/80 p-3 backdrop-blur-md">
          <h1 className="text-lg font-semibold">Human Spine AR</h1>
          <p className="text-xs text-slate-300">Scan the printed spine poster to view the 3D spine model.</p>
          <p className="mt-1 text-xs font-medium text-cyan-300">Point your camera at the printed spine poster.</p>
        </header>
        <div className="flex-1" />
        <div className="pointer-events-auto space-y-2">
          {warnings.length ? <AssetWarnings warnings={warnings} /> : null}
          {(!cameraRunning || error) ? (
            <button type="button" onClick={startCamera} disabled={!sceneLoaded || starting} className="w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 disabled:opacity-60">
              {starting ? 'Opening camera…' : error ? 'Restart camera' : 'Open camera'}
            </button>
          ) : null}
          {error ? <p className="rounded-xl bg-rose-950/90 p-3 text-sm">{error}</p> : null}
          <SpineInfoPanel active={active} onSelect={setActive} compact />
          <div className="grid grid-cols-2 gap-2">
            <Link href="/ar/spine-fallback" className="rounded-xl bg-white/10 p-3 text-center text-xs font-semibold">Open fallback viewer</Link>
            <Link href="/ar/qr-spine" className="rounded-xl bg-white/10 p-3 text-center text-xs font-semibold">Open printable QR poster</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
