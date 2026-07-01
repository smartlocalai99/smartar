import Link from 'next/link';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { ANIMAL_CELL_ASSET_PATHS } from '../../components/animalCellContent';

export default function AnimalCellFallbackPage() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return (
    <main className="min-h-[100svh] bg-slate-950 p-4 text-white">
      <Script src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js" strategy="afterInteractive" type="module" onLoad={() => setReady(true)} />
      <div className="mx-auto max-w-5xl space-y-4">
        <header className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-violet-300">Fallback mode: 3D model viewer without image tracking.</p>
          <h1 className="mt-2 text-3xl font-semibold">Animal Cell 3D Viewer</h1>
          <Link href="/ar/animal-cell" className="mt-4 inline-flex rounded-full bg-violet-400 px-5 py-3 font-semibold text-slate-950">Back to Animal Cell AR</Link>
        </header>
        <section className="h-[72vh] min-h-[30rem] overflow-hidden rounded-3xl border border-white/10 bg-black">
          {ready ? <model-viewer src={ANIMAL_CELL_ASSET_PATHS.model} alt="Animal cell 3D model" camera-controls auto-rotate shadow-intensity="1" exposure="1.1" environment-image="neutral" class="h-full w-full" /> : null}
        </section>
      </div>
    </main>
  );
}
