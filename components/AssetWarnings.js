export default function AssetWarnings({ warnings }) {
  if (!warnings || warnings.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-rose-500/30 bg-rose-950/75 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.35)] backdrop-blur-md">
      <p className="text-sm font-semibold text-rose-100">Missing file warnings</p>
      <div className="mt-3 space-y-3 text-sm text-rose-100/90">
        {warnings.map((warning) => (
          <div key={warning.path} className="rounded-2xl border border-rose-400/20 bg-black/20 p-3">
            <p className="font-semibold text-rose-50">{warning.label}</p>
            <p className="mt-1 leading-6 text-rose-100/80">{warning.message}</p>
            <p className="mt-2 text-xs uppercase tracking-[0.24em] text-rose-200/70">Place it here: {warning.path}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
