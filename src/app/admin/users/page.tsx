"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  balance: number;
  totalEarned: number;
  suspended: boolean;
  _count: { links: number; referrals: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleSuspend(id: string, suspended: boolean) {
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, suspended: !suspended }),
    });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Users</h1>
      <p className="mt-1 text-sm text-paper/50">{users.length} registered accounts.</p>

      <div className="ledger-card mt-6 overflow-hidden">
        {loading ? (
          <p className="px-6 py-10 text-center text-sm text-paper/40">Loading…</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-paper/40">
              <tr>
                <th className="px-6 py-3 font-normal">Name</th>
                <th className="px-6 py-3 font-normal">Email</th>
                <th className="px-6 py-3 font-normal">Links</th>
                <th className="px-6 py-3 font-normal">Referrals</th>
                <th className="px-6 py-3 font-normal">Balance</th>
                <th className="px-6 py-3 font-normal">Status</th>
                <th className="px-6 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-ink-700">
                  <td className="px-6 py-3">{u.name} {u.role === "ADMIN" && <span className="ml-1 text-xs text-amber">admin</span>}</td>
                  <td className="px-6 py-3 text-paper/60">{u.email}</td>
                  <td className="px-6 py-3 tabular">{u._count.links}</td>
                  <td className="px-6 py-3 tabular">{u._count.referrals}</td>
                  <td className="px-6 py-3 tabular">{formatCurrency(u.balance)}</td>
                  <td className="px-6 py-3">{u.suspended ? <span className="text-rose">Suspended</span> : <span className="text-mint">Active</span>}</td>
                  <td className="px-6 py-3 text-right">
                    {u.role !== "ADMIN" && (
                      <button onClick={() => toggleSuspend(u.id, u.suspended)} className="text-xs text-paper/40 hover:text-amber">
                        {u.suspended ? "Unsuspend" : "Suspend"}
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
