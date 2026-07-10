"use client";

import { useEffect, useRef, useState } from "react";

const COUNTDOWN_SECONDS = 10;

export default function RedirectClient({ code, requiresPassword }: { code: string; requiresPassword: boolean }) {
  const [unlocked, setUnlocked] = useState(!requiresPassword);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  // A simple interaction check: real browsers fire this; naive scrapers usually don't.
  const interacted = useRef(false);

  useEffect(() => {
    const mark = () => (interacted.current = true);
    window.addEventListener("mousemove", mark, { once: true });
    window.addEventListener("touchstart", mark, { once: true });
    window.addEventListener("scroll", mark, { once: true });
    return () => {
      window.removeEventListener("mousemove", mark);
      window.removeEventListener("touchstart", mark);
      window.removeEventListener("scroll", mark);
    };
  }, []);

  useEffect(() => {
    if (!unlocked || seconds <= 0) {
      if (unlocked) setReady(true);
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [unlocked, seconds]);

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    const res = await fetch(`/api/redirect/${code}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setPasswordError(data.error || "Incorrect password.");
      return;
    }
    setUnlocked(true);
  }

  async function handleContinue() {
    setError("");
    const res = await fetch(`/api/redirect/${code}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completedChallenge: interacted.current && seconds <= 0 }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }
    window.location.href = data.destination;
  }

  if (!unlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <form onSubmit={handleUnlock} className="ledger-card w-full max-w-sm p-6 text-center">
          <p className="font-display text-lg font-bold">
            Link<span className="text-amber">Earn</span>
          </p>
          <p className="mt-4 text-sm text-paper/60">This link is password protected.</p>
          <input
            type="password"
            required
            autoFocus
            className="input-field mt-4"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="mt-2 text-sm text-rose">{passwordError}</p>}
          <button type="submit" className="btn-primary mt-4 w-full">Unlock</button>
        </form>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <p className="font-display text-lg font-bold">
          Link<span className="text-amber">Earn</span>
        </p>
        <p className="mt-2 text-sm text-paper/50">Your link is ready</p>

        {/* Ad slot — wire in your ad network's script/tag here. */}
        <div className="ledger-card mt-6 flex h-64 items-center justify-center border-dashed">
          <span className="label">Advertisement</span>
        </div>

        <div className="mt-6 flex items-center justify-center gap-4">
          {seconds > 0 ? (
            <div className="tabular flex h-14 w-14 items-center justify-center rounded-full border-2 border-amber text-lg text-amber">
              {seconds}
            </div>
          ) : (
            <button onClick={handleContinue} disabled={ready === false} className="btn-primary">
              Continue →
            </button>
          )}
        </div>

        {error && <p className="mt-4 text-sm text-rose">{error}</p>}
      </div>
    </main>
  );
}
