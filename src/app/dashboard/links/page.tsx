"use client";

import { useEffect, useState } from "react";

interface LinkRow {
  id: string;
  code: string;
  originalUrl: string;
  active: boolean;
  createdAt: string;
  _count: { clicks: number };
}

export default function LinksPage() {
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<string | null>(null);
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [loading, setLoading] = useState(false);

  const origin = typeof window !== "undefined" ? window.location.origin : "";

  async function loadLinks() {
    const res = await fetch("/api/links");
    const data = await res.json();
    if (res.ok) setLinks(data.links);
  }

  useEffect(() => {
    loadLinks();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCreated(null);
    setLoading(true);
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalUrl: url, alias, password, expiresAt }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setCreated(data.code);
    setUrl("");
    setAlias("");
    setPassword("");
    setExpiresAt("");
    loadLinks();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/links/${id}`, { method: "DELETE" });
    loadLinks();
  }

  const shortUrl = created ? `${origin}/r/${created}` : "";

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold">Create a short link</h1>
      <p className="mt-1 text-sm text-paper/50">Paste a URL below — you'll get a link that pays you per view.</p>

      <form onSubmit={handleCreate} className="ledger-card mt-6 p-6">
        <input
          required
          placeholder="https://example.com/my-page"
          className="input-field text-lg"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button type="button" onClick={() => setShowOptions((s) => !s)} className="mt-3 text-xs text-paper/50 hover:text-amber">
          {showOptions ? "Hide options" : "✓ Custom alias · ✓ Password · ✓ Expiry"}
        </button>

        {showOptions && (
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">Custom alias</label>
              <input className="input-field mt-1" placeholder="optional" value={alias} onChange={(e) => setAlias(e.target.value)} />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input-field mt-1" placeholder="optional" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
              <label className="label">Expires</label>
              <input type="datetime-local" className="input-field mt-1" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
            </div>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-rose">{error}</p>}

        <button type="submit" disabled={loading} className="btn-primary mt-5 w-full">
          {loading ? "Generating…" : "Generate short link"}
        </button>
      </form>

      {created && (
        <div className="ledger-card mt-4 flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="label">Your link is ready</p>
            <p className="tabular mt-1 text-lg text-amber">{shortUrl}</p>
          </div>
          <div className="flex items-center gap-3">
            <img src={`/api/qr?text=${encodeURIComponent(shortUrl)}`} alt="QR code" className="h-16 w-16 rounded bg-paper/5" />
            <button onClick={() => navigator.clipboard.writeText(shortUrl)} className="btn-ghost text-xs">Copy</button>
          </div>
        </div>
      )}

      <div className="ledger-card mt-10 overflow-hidden">
        <p className="label border-b border-ink-700 px-6 py-4">Link history</p>
        {links.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-paper/40">No links yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-paper/40">
              <tr>
                <th className="px-6 py-3 font-normal">Short link</th>
                <th className="px-6 py-3 font-normal">Destination</th>
                <th className="px-6 py-3 font-normal">Views</th>
                <th className="px-6 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {links.map((l) => (
                <tr key={l.id} className="border-t border-ink-700">
                  <td className="px-6 py-3 tabular text-amber">/r/{l.code}</td>
                  <td className="max-w-xs truncate px-6 py-3 text-paper/60">{l.originalUrl}</td>
                  <td className="px-6 py-3 tabular">{l._count.clicks}</td>
                  <td className="px-6 py-3 text-right">
                    {l.active && (
                      <button onClick={() => handleDelete(l.id)} className="text-xs text-paper/40 hover:text-rose">
                        Disable
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
