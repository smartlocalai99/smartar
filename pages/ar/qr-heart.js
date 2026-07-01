import Script from 'next/script';
import { useEffect, useMemo, useRef, useState } from 'react';

import AssetWarnings from '../../components/AssetWarnings';
import { HEART_ASSET_PATHS, HEART_REMOTE_POSTER_IMAGE } from '../../components/heartContent';

async function checkAsset(path) {
  try {
    const response = await fetch(path, { method: 'HEAD', cache: 'no-store' });
    return response.ok;
  } catch {
    return false;
  }
}

export default function QrHeartPage() {
  const qrRef = useRef(null);
  const [clientUrl, setClientUrl] = useState('');
  const [scriptReady, setScriptReady] = useState(false);
  const [posterAvailable, setPosterAvailable] = useState(null);
  const posterImageSrc = posterAvailable === false ? HEART_REMOTE_POSTER_IMAGE : HEART_ASSET_PATHS.poster;

  useEffect(() => {
    setClientUrl(`${window.location.origin}/ar/heart`);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function runChecks() {
      const poster = await checkAsset(HEART_ASSET_PATHS.poster);
      if (!cancelled) {
        setPosterAvailable(poster);
      }
    }

    runChecks();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!scriptReady || !clientUrl || !qrRef.current || !window.QRCode) {
      return undefined;
    }

    qrRef.current.innerHTML = '';
    const qr = new window.QRCode(qrRef.current, {
      text: clientUrl,
      width: 256,
      height: 256,
      colorDark: '#020617',
      colorLight: '#ffffff',
      correctLevel: window.QRCode.CorrectLevel.H,
    });

    return () => {
      if (qr && qrRef.current) {
        qrRef.current.innerHTML = '';
      }
    };
  }, [clientUrl, scriptReady]);

  const warnings = useMemo(() => {
    const items = [];

    if (posterAvailable === false) {
      items.push({
        label: 'Poster image is missing',
        message: 'Add the tracking image before printing this QR poster so the AR target can be compiled from it.',
        path: HEART_ASSET_PATHS.poster,
      });
    }

    return items;
  }, [posterAvailable]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-[100svh] bg-slate-100 px-4 py-4 text-slate-950 sm:px-6 sm:py-6 print:bg-white print:px-0 print:py-0">
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"
        strategy="afterInteractive"
        onLoad={() => setScriptReady(true)}
      />

      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-4xl flex-col gap-4 sm:min-h-[calc(100vh-3rem)] print:min-h-0">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60 sm:p-8 print:shadow-none">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-700">Printable QR poster</p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">Scan to See Human Heart in AR</h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Point your phone camera at this QR code, then point the AR camera at this poster.
              </p>
            </div>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 print:hidden"
            >
              Print Page
            </button>
          </div>
        </section>

        <section className="grid flex-1 gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60 sm:p-6 print:shadow-none">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">QR code</p>
            <div className="mt-4 flex items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div ref={qrRef} className="flex items-center justify-center" aria-label="QR code for /ar/heart" />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              This QR opens the mobile marker AR page at /ar/heart. The phone must then point at the printed poster image below for tracking.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-200/60 sm:p-6 print:shadow-none">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Tracking image</p>
            <div className="mt-4 overflow-hidden rounded-3xl border border-slate-200 bg-slate-50">
              <img
                src={posterImageSrc}
                alt="Human heart poster tracking image"
                className="h-full w-full object-cover"
              />
            </div>
            <ol className="mt-4 space-y-2 text-sm leading-6 text-slate-600">
              <li>1. Print this page clearly.</li>
              <li>2. Scan QR code.</li>
              <li>3. Allow camera permission.</li>
              <li>4. Point camera at the poster image.</li>
              <li>5. 3D heart will appear on the poster.</li>
            </ol>
            <div className="mt-4">
              <AssetWarnings warnings={warnings} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
