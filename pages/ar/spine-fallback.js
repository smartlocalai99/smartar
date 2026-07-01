import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useMemo, useState } from 'react';
import AssetWarnings from '../../components/AssetWarnings';
import SpineInfoPanel from '../../components/SpineInfoPanel';
import { DEFAULT_SPINE_HOTSPOT, SPINE_ASSET_PATHS } from '../../components/spineContent';

async function exists(path) { try { return (await fetch(path, { method: 'HEAD', cache: 'no-store' })).ok; } catch { return false; } }

export default function SpineFallbackPage() {
  const [ready, setReady] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const [modelAvailable, setModelAvailable] = useState(null);
  const [active, setActive] = useState(DEFAULT_SPINE_HOTSPOT);
  useEffect(() => setReady(true), []);
  useEffect(() => { let live = true; exists(SPINE_ASSET_PATHS.model).then((value) => live && setModelAvailable(value)); return () => { live = false; }; }, []);
  const warnings = useMemo(() => modelAvailable === false ? [{ label: 'Spine model is missing', message: 'The 3D viewer needs the optimized spine model.', path: SPINE_ASSET_PATHS.model }] : [], [modelAvailable]);
  if (!ready) return null;
  return (
    <main className="min-h-[100svh] bg-slate-950 p-4 text-white sm:p-6">
      <Script src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" strategy="afterInteractive" type="module" onLoad={() => setViewerReady(true)} />
      <div className="mx-auto max-w-6xl space-y-4">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">Fallback mode: 3D model viewer without image tracking.</p>
          <h1 className="mt-2 text-3xl font-semibold">Human Spine 3D Viewer</h1>
          <Link href="/ar/spine" className="mt-4 inline-flex rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950">Back to Spine AR</Link>
        </header>
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="h-[60vh] min-h-[28rem] overflow-hidden rounded-3xl border border-white/10 bg-black">
            {viewerReady && modelAvailable !== false ? (
              <model-viewer src={SPINE_ASSET_PATHS.model} alt="Human spine 3D model" camera-controls auto-rotate shadow-intensity="1" exposure="1.1" environment-image="neutral" class="h-full w-full" />
            ) : <div className="flex h-full items-center justify-center text-slate-300">Loading 3D spine…</div>}
          </section>
          <div className="space-y-4"><SpineInfoPanel active={active} onSelect={setActive} /><AssetWarnings warnings={warnings} /></div>
        </div>
      </div>
    </main>
  );
}
