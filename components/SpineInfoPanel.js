import { SPINE_HOTSPOTS } from './spineContent';

export default function SpineInfoPanel({ active, onSelect, compact = false }) {
  return (
    <section className={`rounded-3xl border border-white/15 bg-slate-950/90 text-white shadow-2xl backdrop-blur-md ${compact ? 'p-3' : 'p-4 sm:p-5'}`}>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {SPINE_HOTSPOTS.map((item) => (
          <button key={item.id} type="button" onClick={() => onSelect(item)} aria-label={item.title}
            className={`min-h-11 min-w-11 rounded-full text-sm font-bold ${active.id === item.id ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-white'}`}>
            {item.number}
          </button>
        ))}
      </div>
      <h2 className="mt-2 text-xl font-semibold">{active.title}</h2>
      <div className={`mt-2 space-y-2 text-sm leading-5 text-slate-200 ${compact ? 'max-h-28 overflow-y-auto' : ''}`}>
        <p><span className="font-semibold text-cyan-300">NEET Biology:</span> {active.neet}</p>
        <p><span className="font-semibold text-cyan-300">Simply:</span> {active.patient}</p>
        <p><span className="font-semibold text-cyan-300">Key point:</span> {active.keyPoint}</p>
      </div>
    </section>
  );
}
