import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useMemo, useState } from 'react';

import AssetWarnings from '../../components/AssetWarnings';
import NeetInfoPanel from '../../components/NeetInfoPanel';
import { HEART_ASSET_PATHS, HEART_CONTENT } from '../../components/heartContent';

async function checkAsset(path) {
  try {
    const response = await fetch(path, { method: 'HEAD', cache: 'no-store' });
    return response.ok;
  } catch {
    return false;
  }
}

export default function HeartFallbackPage() {
  const [ready, setReady] = useState(false);
  const [modelViewerReady, setModelViewerReady] = useState(false);
  const [assetState, setAssetState] = useState({ model: null, poster: null });
  const [activeTopic, setActiveTopic] = useState('default');
  const [detail, setDetail] = useState(HEART_CONTENT.default);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function runChecks() {
      const [model, poster] = await Promise.all([
        checkAsset(HEART_ASSET_PATHS.model),
        checkAsset(HEART_ASSET_PATHS.poster),
      ]);

      if (!cancelled) {
        setAssetState({ model, poster });
      }
    }

    runChecks();

    return () => {
      cancelled = true;
    };
  }, []);

  const warnings = useMemo(() => {
    const items = [];

    if (assetState.model === false) {
      items.push({
        label: 'Heart model is missing',
        message: 'The fallback viewer cannot load the 3D heart until the model file is added.',
        path: HEART_ASSET_PATHS.model,
      });
    }

    if (assetState.poster === false) {
      items.push({
        label: 'Poster image is missing',
        message: 'The QR poster page uses this image preview, so add the poster PNG before printing.',
        path: HEART_ASSET_PATHS.poster,
      });
    }

    return items;
  }, [assetState.model, assetState.poster]);

  if (!ready) {
    return null;
  }

  return (
    <main className="min-h-[100svh] bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),_transparent_28%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] px-4 py-4 text-white sm:px-6 sm:py-6">
      <Script
        src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
        strategy="afterInteractive"
        type="module"
        onLoad={() => setModelViewerReady(true)}
      />

      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-6xl flex-col gap-4 sm:min-h-[calc(100vh-3rem)]">
        <div className="rounded-3xl border border-white/10 bg-slate-950/75 p-4 shadow-xl shadow-black/20 backdrop-blur-md sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-sky-300/80">Fallback viewer</p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Human Heart 3D Viewer</h1>
              <p className="text-sm leading-6 text-slate-300 sm:text-base">
                Use this page if marker AR is unavailable on the device. It keeps the same NEET explanation content and lets the student inspect the heart model with touch controls.
              </p>
            </div>
            <Link
              href="/ar/heart"
              className="inline-flex items-center justify-center rounded-full bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300"
            >
              Back to Marker AR
            </Link>
          </div>
        </div>

        <div className="grid flex-1 gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-xl shadow-black/20">
            <div className="h-[60vh] min-h-[26rem] bg-slate-950">
              {modelViewerReady && assetState.model !== false ? (
                <model-viewer
                  src={HEART_ASSET_PATHS.model}
                  alt="Human heart 3D model"
                  camera-controls
                  auto-rotate
                  auto-rotate-delay="0"
                  rotation-per-second="20deg"
                  shadow-intensity="1"
                  exposure="1.1"
                  environment-image="neutral"
                  ar="false"
                  class="h-full w-full"
                  style={{
                    background: 'linear-gradient(180deg, #020617, #0f172a)',
                    // Let vertical swipes scroll the page instead of being
                    // captured for orbit control, so mobile users aren't
                    // stuck unable to scroll past the 3D viewer.
                    touchAction: 'pan-y',
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center p-6 text-center text-slate-300">
                  <div className="max-w-md space-y-3">
                    <p className="text-lg font-semibold text-white">Loading 3D viewer...</p>
                    <p className="text-sm leading-6">
                      The fallback viewer waits for the model-viewer script and the heart.glb file before rendering.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          <div className="flex flex-col gap-4">
            <NeetInfoPanel
              title={detail.title}
              text={detail.text}
              statusText="Fallback 3D view"
              activeTopic={activeTopic}
              onTopicChange={(topic) => {
                setActiveTopic(topic);
                setDetail(HEART_CONTENT[topic] || HEART_CONTENT.default);
              }}
              onBloodFlowToggle={() => {
                setActiveTopic('bloodFlow');
                setDetail(HEART_CONTENT.bloodFlow);
              }}
              bloodFlowActive={false}
              bloodFlowAvailable={false}
              fallbackHref="/ar/heart"
            />
            <AssetWarnings warnings={warnings} />
          </div>
        </div>
      </div>
    </main>
  );
}
