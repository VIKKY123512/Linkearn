"use client";

import { useEffect, useState } from "react";

interface LinkRow {
  id: string;
  code: string;
  originalUrl: string;
  active: boolean;
  owner: { name: string; email: string };
  _count: { clicks: number };
}

export default function AdminLinksPage() {
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/links");
    const data = await res.json();
    setLinks(data.links || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(id: string, active: boolean) {
    await fetch("/api/admin/links", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active: !active }),
    });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Links</h1>
      <p className="mt-1 text-sm text-paper/50">Most recent {links.length} links across all users.</p>

      <div className="ledger-card mt-6 overflow-hidden">
        {loading ? (
          <p className="px-6 py-10 text-center text-sm text-paper/40">Loading…</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-paper/40">
              <tr>
                <th className="px-6 py-3 font-normal">Code</th>
                <th className="px-6 py-3 font-normal">Owner</th>
                <th className="px-6 py-3 font-normal">Destination</th>
                <th className="px-6 py-3 font-normal">Views</th>
                <th className="px-6 py-3 font-normal">Status</th>
                <th className="px-6 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {links.map((l) => (
                <tr key={l.id} className="border-t border-ink-700">
                  <td className="px-6 py-3 tabular text-amber">/r/{l.code}</td>
                  <td className="px-6 py-3">{l.owner.name}</td>
                  <td className="max-w-xs truncate px-6 py-3 text-paper/60">{l.originalUrl}</td>
                  <td className="px-6 py-3 tabular">{l._count.clicks}</td>
                  <td className="px-6 py-3">{l.active ? <span className="text-mint">Active</span> : <span className="text-rose">Disabled</span>}</td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => toggle(l.id, l.active)} className="text-xs text-paper/40 hover:text-amber">
                      {l.active ? "Disable" : "Enable"}
                    </button>
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
