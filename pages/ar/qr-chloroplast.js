import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { CHLOROPLAST_ASSET_PATHS } from '../../components/chloroplastContent';

export default function QrChloroplastPage() {
  const ref = useRef(null); const [url, setUrl] = useState(''); const [scriptReady, setScriptReady] = useState(false);
  useEffect(() => setUrl(`${window.location.origin}/ar/chloroplast`), []);
  useEffect(() => {
    if (!scriptReady || !url || !ref.current || !window.QRCode) return undefined;
    ref.current.innerHTML = '';
    new window.QRCode(ref.current, { text: url, width: 256, height: 256, colorDark: '#020617', colorLight: '#ffffff', correctLevel: window.QRCode.CorrectLevel.H });
    return () => { if (ref.current) ref.current.innerHTML = ''; };
  }, [scriptReady, url]);
  return (
    <main className="min-h-screen bg-slate-100 p-4 text-slate-950 print:bg-white print:p-0">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js" strategy="afterInteractive" onLoad={() => setScriptReady(true)} />
      <div className="mx-auto max-w-4xl space-y-4">
        <header className="rounded-3xl bg-white p-6"><h1 className="text-4xl font-semibold">Scan to View Chloroplast AR</h1><p className="mt-2 text-slate-600">Open the camera and point it at this poster.</p><button type="button" onClick={() => window.print()} className="mt-4 rounded-full bg-slate-950 px-5 py-3 text-white print:hidden">Print Page</button></header>
        <section className="grid gap-4 md:grid-cols-2"><div className="flex min-h-80 items-center justify-center rounded-3xl bg-white p-6"><div ref={ref} /></div><div className="rounded-3xl bg-white p-4"><img src={CHLOROPLAST_ASSET_PATHS.poster} alt="Chloroplast tracking poster" className="h-full w-full object-contain" /></div></section>
      </div>
    </main>
  );
}
