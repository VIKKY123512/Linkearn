"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface WithdrawalRow {
  id: string;
  amount: number;
  method: string;
  details: string;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
}

export default function AdminWithdrawalsPage() {
  const [rows, setRows] = useState<WithdrawalRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/withdrawals");
    const data = await res.json();
    setRows(data.withdrawals || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: string) {
    await fetch("/api/admin/withdrawals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Withdrawals</h1>
      <p className="mt-1 text-sm text-paper/50">Approve, reject, or mark payment requests as paid.</p>

      <div className="ledger-card mt-6 overflow-hidden">
        {loading ? (
          <p className="px-6 py-10 text-center text-sm text-paper/40">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-paper/40">No withdrawal requests.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-paper/40">
              <tr>
                <th className="px-6 py-3 font-normal">User</th>
                <th className="px-6 py-3 font-normal">Amount</th>
                <th className="px-6 py-3 font-normal">Method</th>
                <th className="px-6 py-3 font-normal">Details</th>
                <th className="px-6 py-3 font-normal">Status</th>
                <th className="px-6 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((w) => (
                <tr key={w.id} className="border-t border-ink-700">
                  <td className="px-6 py-3">{w.user.name}</td>
                  <td className="px-6 py-3 tabular text-amber">{formatCurrency(w.amount)}</td>
                  <td className="px-6 py-3">{w.method}</td>
                  <td className="px-6 py-3 text-paper/60">{w.details}</td>
                  <td className="px-6 py-3">{w.status}</td>
                  <td className="px-6 py-3 text-right">
                    {w.status === "PENDING" && (
                      <div className="flex justify-end gap-3">
                        <button onClick={() => setStatus(w.id, "APPROVED")} className="text-xs text-mint">Approve</button>
                        <button onClick={() => setStatus(w.id, "REJECTED")} className="text-xs text-rose">Reject</button>
                      </div>
                    )}
                    {w.status === "APPROVED" && (
                      <button onClick={() => setStatus(w.id, "PAID")} className="text-xs text-amber">Mark paid</button>
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
