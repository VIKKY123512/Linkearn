"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WithdrawPage() {
  const router = useRouter();
  const [method, setMethod] = useState<"UPI" | "PayPal" | "Bank Transfer">("UPI");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method, details }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setSuccess(true);
    router.refresh();
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-semibold">Request payment</h1>
      <p className="mt-1 text-sm text-paper/50">Your full available balance will be requested for withdrawal.</p>

      {success ? (
        <div className="ledger-card mt-6 p-6 text-mint">
          Withdrawal requested. An admin will review and mark it paid shortly.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="ledger-card mt-6 space-y-4 p-6">
          <div>
            <label className="label">Payment method</label>
            <select className="input-field mt-1" value={method} onChange={(e) => setMethod(e.target.value as any)}>
              <option>UPI</option>
              <option>PayPal</option>
              <option>Bank Transfer</option>
            </select>
          </div>
          <div>
            <label className="label">Account details</label>
            <input
              required
              placeholder={method === "UPI" ? "yourname@upi" : method === "PayPal" ? "you@email.com" : "Account number / IBAN"}
              className="input-field mt-1"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-rose">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Submitting…" : "Request payment"}
          </button>
        </form>
      )}
    </div>
  );
}
