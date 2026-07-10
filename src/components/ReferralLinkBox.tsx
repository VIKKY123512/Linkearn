"use client";

export default function ReferralLinkBox({ code }: { code: string }) {
  const url = typeof window !== "undefined" ? `${window.location.origin}/register?ref=${code}` : "";
  return (
    <div className="flex items-center gap-3">
      <input readOnly value={url} className="input-field tabular text-sm" />
      <button onClick={() => navigator.clipboard.writeText(url)} className="btn-ghost shrink-0 text-xs">
        Copy
      </button>
    </div>
  );
}
