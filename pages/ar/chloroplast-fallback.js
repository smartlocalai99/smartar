import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { CHLOROPLAST_ASSET_PATHS } from '../../components/chloroplastContent';

export default function ChloroplastFallbackPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <main className="min-h-[100svh] bg-slate-950 p-4 text-white">
      <Script src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" strategy="afterInteractive" type="module" onLoad={() => setReady(true)} />
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">Fallback mode: 3D model viewer without image tracking.</p>
          <h1 className="mt-2 text-3xl font-semibold">Chloroplast 3D Viewer</h1>
          <Link href="/ar/chloroplast" className="mt-4 inline-flex rounded-full bg-emerald-400 px-5 py-3 font-semibold text-slate-950">Back to Chloroplast AR</Link>
        </header>
        <section className="h-[72vh] min-h-[30rem] overflow-hidden rounded-3xl border border-white/10 bg-black">
          {ready ? <model-viewer src={CHLOROPLAST_ASSET_PATHS.model} alt="Chloroplast 3D model" camera-controls auto-rotate shadow-intensity="1" exposure="1.1" environment-image="neutral" class="h-full w-full" /> : null}
        </section>
      </div>
    </main>
  );
}
