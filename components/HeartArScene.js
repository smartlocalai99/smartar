import Script from 'next/script';
import { useEffect, useMemo, useRef, useState } from 'react';

import AssetWarnings from './AssetWarnings';
import NeetInfoPanel from './NeetInfoPanel';
import {
  HEART_ASSET_PATHS,
  HEART_CONTENT,
  HEART_TOPICS,
} from './heartContent';

function useClientReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return ready;
}

async function checkAsset(path) {
  try {
    const response = await fetch(path, { method: 'HEAD', cache: 'no-store' });
    return response.ok;
  } catch {
    return false;
  }
}

export default function HeartArScene() {
  const isClient = useClientReady();
  const sceneRef = useRef(null);
  const targetRef = useRef(null);
  const modelRef = useRef(null);
  const [aframeReady, setAframeReady] = useState(false);
  const [mindarReady, setMindarReady] = useState(false);
  const [assetsChecked, setAssetsChecked] = useState(false);
  const [modelAvailable, setModelAvailable] = useState(null);
  const [targetAvailable, setTargetAvailable] = useState(null);
  const [posterAvailable, setPosterAvailable] = useState(null);
  const [bloodFlowModelAvailable, setBloodFlowModelAvailable] = useState(null);
  const [statusText, setStatusText] = useState('Point your camera at the Heart AR poster.');
  const [activeTopic, setActiveTopic] = useState('default');
  const [detail, setDetail] = useState(HEART_CONTENT.default);
  const [bloodFlowActive, setBloodFlowActive] = useState(false);
  const [sceneState, setSceneState] = useState('loading');

  useEffect(() => {
    let cancelled = false;

    async function runChecks() {
      const [model, target, poster, bloodFlow] = await Promise.all([
        checkAsset(HEART_ASSET_PATHS.model),
        checkAsset(HEART_ASSET_PATHS.target),
        checkAsset(HEART_ASSET_PATHS.poster),
        checkAsset(HEART_ASSET_PATHS.bloodFlowModel),
      ]);

      if (cancelled) {
        return;
      }

      setModelAvailable(model);
      setTargetAvailable(target);
      setPosterAvailable(poster);
      setBloodFlowModelAvailable(bloodFlow);
      setAssetsChecked(true);
    }

    runChecks();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!aframeReady || !mindarReady) {
      return undefined;
    }

    const targetEl = targetRef.current;
    const modelEl = modelRef.current;
    const sceneEl = sceneRef.current;

    if (!targetEl || !modelEl || !sceneEl) {
      return undefined;
    }

    const handleFound = () => {
      setSceneState('found');
      setStatusText('Poster detected ✅');
    };

    const handleLost = () => {
      setSceneState('lost');
      setStatusText('Move camera back to the poster');
    };

    const handleModelError = () => {
      if (bloodFlowActive) {
        setBloodFlowActive(false);
        setDetail({
          title: 'Blood Flow',
          text: 'Blood flow model not added yet. Add public/models/heart-bloodflow.glb to enable this.',
        });
      }
      setBloodFlowModelAvailable(false);
    };

    targetEl.addEventListener('targetFound', handleFound);
    targetEl.addEventListener('targetLost', handleLost);
    modelEl.addEventListener('model-error', handleModelError);

    return () => {
      targetEl.removeEventListener('targetFound', handleFound);
      targetEl.removeEventListener('targetLost', handleLost);
      modelEl.removeEventListener('model-error', handleModelError);
    };
  }, [aframeReady, mindarReady, bloodFlowActive]);

  const warnings = useMemo(() => {
    const items = [];

    if (assetsChecked && modelAvailable === false) {
      items.push({
        label: 'Heart model is missing',
        message: 'The main AR model was not found, so the anchor cannot render the 3D heart.',
        path: HEART_ASSET_PATHS.model,
      });
    }

    if (assetsChecked && targetAvailable === false) {
      items.push({
        label: 'MindAR target is missing',
        message: 'The image target file is required for poster detection on the printed image.',
        path: HEART_ASSET_PATHS.target,
      });
    }

    if (assetsChecked && posterAvailable === false) {
      items.push({
        label: 'Poster image is missing',
        message: 'The poster preview image is missing, so the QR poster page cannot show the tracking image.',
        path: HEART_ASSET_PATHS.poster,
      });
    }

    return items;
  }, [assetsChecked, modelAvailable, posterAvailable, targetAvailable]);

  const sceneCanRender = Boolean(isClient && aframeReady && mindarReady);

  const currentSrc = bloodFlowActive && bloodFlowModelAvailable ? HEART_ASSET_PATHS.bloodFlowModel : HEART_ASSET_PATHS.model;

  const handleTopicChange = (topic) => {
    setActiveTopic(topic);
    if (topic === 'bloodFlow') {
      if (!bloodFlowModelAvailable) {
        setBloodFlowActive(false);
        setDetail({
          title: 'Blood Flow',
          text: 'Blood flow model not added yet. Add public/models/heart-bloodflow.glb to enable this.',
        });
        return;
      }

      setBloodFlowActive((current) => !current);
      setDetail(HEART_CONTENT.bloodFlow);
      return;
    }

    setBloodFlowActive(false);
    setDetail(HEART_CONTENT[topic] || HEART_CONTENT.default);
  };

  const handleBloodFlowToggle = () => {
    setActiveTopic('bloodFlow');
    if (!bloodFlowModelAvailable) {
      setBloodFlowActive(false);
      setDetail({
        title: 'Blood Flow',
        text: 'Blood flow model not added yet. Add public/models/heart-bloodflow.glb to enable this.',
      });
      return;
    }

    setBloodFlowActive((current) => {
      const next = !current;
      setDetail(HEART_CONTENT.bloodFlow);
      return next;
    });
  };

  if (!isClient) {
    return null;
  }

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-slate-950 text-white">
      <Script
        src="https://aframe.io/releases/1.5.0/aframe.min.js"
        strategy="afterInteractive"
        onLoad={() => setAframeReady(true)}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js"
        strategy="afterInteractive"
        onLoad={() => setMindarReady(true)}
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.22),_transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.9),rgba(2,6,23,0.45))]" />

      {sceneCanRender ? (
        <a-scene
          ref={sceneRef}
          mindar-image={`imageTargetSrc: ${HEART_ASSET_PATHS.target}; autoStart: true; uiLoading: no; uiScanning: no;`}
          color-space="sRGB"
          renderer="colorManagement: true, physicallyCorrectLights: true, antialias: true, alpha: true"
          vr-mode-ui="enabled: false"
          device-orientation-permission-ui="enabled: false"
          embedded
          className="absolute inset-0"
        >
          <a-assets timeout="10000">
            {modelAvailable !== false ? (
              <a-asset-item id="heartModelAsset" src={HEART_ASSET_PATHS.model} />
            ) : null}
            {bloodFlowModelAvailable ? (
              <a-asset-item id="heartBloodFlowAsset" src={HEART_ASSET_PATHS.bloodFlowModel} />
            ) : null}
          </a-assets>

          <a-camera position="0 0 0" look-controls="enabled: false" />

          <a-entity mindar-image-target="targetIndex: 0" ref={targetRef}>
            <a-ambient-light intensity="1.25" />
            <a-directional-light position="1 2 1" intensity="1.5" />
            {modelAvailable !== false ? (
              <a-gltf-model
                ref={modelRef}
                src={currentSrc === HEART_ASSET_PATHS.bloodFlowModel ? '#heartBloodFlowAsset' : '#heartModelAsset'}
                position="0 0 0"
                rotation="0 0 0"
                scale="0.35 0.35 0.35"
              />
            ) : (
              <a-plane width="1.4" height="0.45" color="#7f1d1d" position="0 0 0">
                <a-text
                  value="Heart model missing"
                  align="center"
                  color="#ffffff"
                  width="2.4"
                  position="0 0 0.01"
                />
              </a-plane>
            )}
            {/* Adjust position, rotation, and scale here if the heart needs to sit higher, turn, or grow/shrink on the poster. */}
          </a-entity>
        </a-scene>
      ) : null}

      <div className="relative z-10 flex min-h-[100svh] flex-col">
        <div className="px-4 pt-4 sm:px-6 sm:pt-6">
          <div className="mx-auto max-w-3xl rounded-full border border-white/10 bg-slate-950/70 px-4 py-3 text-center text-sm font-medium text-slate-100 shadow-lg shadow-black/20 backdrop-blur-md sm:text-base">
            {sceneState === 'found' ? 'Poster detected ✅' : statusText}
          </div>
        </div>

        <div className="flex-1" />

        <div className="mx-auto w-full max-w-3xl px-3 pb-3 sm:px-6 sm:pb-6">
          {!sceneCanRender ? (
            <div className="mb-3 rounded-3xl border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-100 backdrop-blur-md sm:p-5">
              <p className="font-semibold text-white">AR loading state</p>
              <p className="mt-2 leading-6 text-slate-300">
                The marker AR scene is waiting for the client scripts to load.
              </p>
              <div className="mt-4">
                <AssetWarnings warnings={warnings} />
              </div>
              <p className="mt-4 text-xs leading-5 text-slate-400">
                If the poster target or heart model is missing, the camera can still open but tracking will not start until those files are added.
              </p>
            </div>
          ) : null}

          <NeetInfoPanel
            title={detail.title}
            text={detail.text}
            statusText={sceneState === 'found' ? 'Poster detected' : 'Move camera to the poster'}
            activeTopic={activeTopic}
            onTopicChange={handleTopicChange}
            onBloodFlowToggle={handleBloodFlowToggle}
            bloodFlowActive={bloodFlowActive}
            bloodFlowAvailable={bloodFlowModelAvailable === true}
          />

          <div className="mt-3 sm:mt-4">
            <AssetWarnings warnings={warnings} />
          </div>
        </div>
      </div>
    </main>
  );
}
