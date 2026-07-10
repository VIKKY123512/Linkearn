"use client";

const ENTRIES = [
  { label: "lnk.rn/A7hD9", delta: "+$0.0042" },
  { label: "lnk.rn/qKp2M", delta: "+$0.0038" },
  { label: "lnk.rn/x9Rtz", delta: "+$0.0051" },
  { label: "lnk.rn/mV3wQ", delta: "+$0.0029" },
  { label: "lnk.rn/pL8cN", delta: "+$0.0044" },
  { label: "lnk.rn/rT5yB", delta: "+$0.0033" },
];

// The signature element: a live-looking ledger of individual view payouts,
// scrolling like a stock ticker — makes the "you get paid per view" pitch
// concrete instead of abstract, and doubles as ambient motion in the hero.
export default function Ticker() {
  const row = [...ENTRIES, ...ENTRIES];
  return (
    <div className="overflow-hidden border-y border-ink-700 bg-ink-900/60">
      <div className="animate-[scroll_28s_linear_infinite] flex w-max gap-10 py-2.5">
        {row.map((e, i) => (
          <span key={i} className="tabular flex items-center gap-2 text-xs text-paper/60 whitespace-nowrap">
            <span className="text-paper/40">{e.label}</span>
            <span className="text-mint">{e.delta}</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
