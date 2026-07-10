"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setSettings(d.settings));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(false);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) setSaved(true);
  }

  if (!settings) return <p className="text-sm text-paper/40">Loading…</p>;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-semibold">Platform settings</h1>
      <p className="mt-1 text-sm text-paper/50">Changes apply to all future views immediately.</p>

      <form onSubmit={handleSave} className="ledger-card mt-6 space-y-5 p-6">
        <div>
          <label className="label">Site name</label>
          <input className="input-field mt-1" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
        </div>
        <div>
          <label className="label">CPM rate ($ per 1,000 views)</label>
          <input type="number" step="0.01" className="input-field mt-1" value={settings.cpmRate} onChange={(e) => setSettings({ ...settings, cpmRate: parseFloat(e.target.value) })} />
        </div>
        <div>
          <label className="label">User share (%)</label>
          <input type="number" step="1" className="input-field mt-1" value={settings.userSharePercent} onChange={(e) => setSettings({ ...settings, userSharePercent: parseFloat(e.target.value) })} />
        </div>
        <div>
          <label className="label">Referral commission (% of referred user's earnings)</label>
          <input type="number" step="1" className="input-field mt-1" value={settings.referralPercent} onChange={(e) => setSettings({ ...settings, referralPercent: parseFloat(e.target.value) })} />
        </div>
        <div>
          <label className="label">Minimum withdrawal ($)</label>
          <input type="number" step="0.01" className="input-field mt-1" value={settings.minWithdraw} onChange={(e) => setSettings({ ...settings, minWithdraw: parseFloat(e.target.value) })} />
        </div>
        {saved && <p className="text-sm text-mint">Saved.</p>}
        <button type="submit" className="btn-primary w-full">Save changes</button>
      </form>
    </div>
  );
}
