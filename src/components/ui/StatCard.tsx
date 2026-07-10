export default function StatCard({
  label,
  value,
  sub,
  accent = "text-paper",
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="ledger-card p-5">
      <p className="label">{label}</p>
      <p className={`tabular mt-2 text-2xl ${accent}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-paper/40">{sub}</p>}
    </div>
  );
}
