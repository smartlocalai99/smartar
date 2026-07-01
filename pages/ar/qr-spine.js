import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import AssetWarnings from '../../components/AssetWarnings';
import { SPINE_ASSET_PATHS } from '../../components/spineContent';

export default function QrSpinePage() {
  const qrRef = useRef(null);
  const [url, setUrl] = useState('');
  const [qrReady, setQrReady] = useState(false);
  const [posterAvailable, setPosterAvailable] = useState(null);
  const [local, setLocal] = useState(false);
  useEffect(() => {
    const origin = window.location.origin;
    setUrl(`${origin}/ar/spine`);
    setLocal(/^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname) || window.location.protocol !== 'https:');
    fetch(SPINE_ASSET_PATHS.poster, { method: 'HEAD', cache: 'no-store' }).then((r) => setPosterAvailable(r.ok)).catch(() => setPosterAvailable(false));
  }, []);
  useEffect(() => {
    if (!qrReady || !url || !qrRef.current || !window.QRCode) return undefined;
    qrRef.current.innerHTML = '';
    new window.QRCode(qrRef.current, { text: url, width: 256, height: 256, colorDark: '#020617', colorLight: '#ffffff', correctLevel: window.QRCode.CorrectLevel.H });
    return () => { if (qrRef.current) qrRef.current.innerHTML = ''; };
  }, [qrReady, url]);
  const warnings = posterAvailable === false ? [{ label: 'Spine poster is missing', message: 'Add the tracking poster before printing.', path: SPINE_ASSET_PATHS.poster }] : [];
  return (
    <main className="min-h-screen bg-slate-100 p-4 text-slate-950 sm:p-6 print:bg-white print:p-0">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" strategy="afterInteractive" onLoad={() => setQrReady(true)} />
      <div className="mx-auto max-w-4xl space-y-4">
        <header className="rounded-3xl bg-white p-6 shadow-lg print:shadow-none">
          <h1 className="text-4xl font-semibold">Scan to View Spine AR</h1>
          <p className="mt-2 text-slate-600">Open camera and point at this poster.</p>
          <button type="button" onClick={() => window.print()} className="mt-4 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white print:hidden">Print Page</button>
          {local ? <p className="mt-4 rounded-xl bg-amber-100 p-3 text-sm font-medium text-amber-900 print:hidden">Use a Vercel preview or HTTPS deployment before printing for client demo.</p> : null}
        </header>
        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow-lg print:shadow-none"><div ref={qrRef} className="flex min-h-64 items-center justify-center" aria-label="QR code for Spine AR" /><p className="mt-3 break-all text-xs text-slate-500">{url}</p></div>
          <div className="overflow-hidden rounded-3xl bg-white p-4 shadow-lg print:shadow-none"><img src={SPINE_ASSET_PATHS.poster} alt="Human spine AR tracking poster" className="h-full w-full object-contain" /></div>
        </section>
        <section className="rounded-3xl bg-white p-6 shadow-lg print:shadow-none">
          <ol className="space-y-2 text-sm text-slate-700"><li>1. Print this page clearly.</li><li>2. Scan the QR code using a phone.</li><li>3. Allow camera permission.</li><li>4. Point the camera at the spine poster.</li><li>5. Tap numbered hotspots to learn.</li></ol>
          <div className="mt-4"><AssetWarnings warnings={warnings} /></div>
        </section>
      </div>
    </main>
  );
}
