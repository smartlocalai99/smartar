import { HEART_BUTTONS, HEART_DISCLOSURE } from './heartContent';

export default function NeetInfoPanel({
  title,
  text,
  statusText,
  activeTopic,
  onTopicChange,
}) {
  return (
    <section className="rounded-t-[1.75rem] border border-white/10 bg-white px-4 pb-5 pt-4 text-slate-950 shadow-[0_-20px_60px_rgba(15,23,42,0.35)] sm:px-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-sky-700">{statusText}</p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h2>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-700 sm:text-[15px]">{text}</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {HEART_BUTTONS.map((button) => {
          const isActive = activeTopic === button.key;
          return (
            <button
              key={button.key}
              type="button"
              onClick={() => {
                onTopicChange(button.key);
              }}
              className={`min-h-[3.25rem] rounded-2xl px-3 py-3 text-sm font-semibold transition active:scale-[0.99] ${
                isActive
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
              }`}
            >
              {button.label}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] leading-5 text-slate-500">{HEART_DISCLOSURE}</p>
    </section>
  );
}
