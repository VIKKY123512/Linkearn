import Link from "next/link";
import Navbar from "@/components/Navbar";
import Ticker from "@/components/Ticker";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Ticker />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="label mb-4">Every view, on the record</p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              Shorten a link.
              <br />
              Get paid <span className="text-amber">per view.</span>
            </h1>
            <p className="mt-5 max-w-md text-paper/60">
              LinkEarn turns your traffic into income. Paste a URL, share the short
              version, and earn a transparent share of ad revenue every time someone
              opens it.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/register" className="btn-primary">Create free account</Link>
              <Link href="/#how-it-works" className="btn-ghost">See how it works</Link>
            </div>
            <div className="mt-10 flex gap-8 tabular text-sm">
              <div>
                <div className="text-2xl text-amber">$5.20</div>
                <div className="text-paper/40">per 1,000 views</div>
              </div>
              <div>
                <div className="text-2xl text-amber">70%</div>
                <div className="text-paper/40">paid to you</div>
              </div>
              <div>
                <div className="text-2xl text-amber">20%</div>
                <div className="text-paper/40">referral commission</div>
              </div>
            </div>
          </div>

          <div className="ledger-card bg-ledger-lines p-6">
            <p className="label mb-4">Your dashboard, live</p>
            <div className="space-y-3">
              {[
                ["Total views", "12,540", "text-paper"],
                ["Balance", "$45.80", "text-amber"],
                ["Referral income", "$12.50", "text-mint"],
              ].map(([k, v, c]) => (
                <div key={k} className="flex items-center justify-between border-b border-ink-700 pb-3">
                  <span className="text-sm text-paper/60">{k}</span>
                  <span className={`tabular text-lg ${c}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-ink-700 bg-ink-900/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="label mb-10">How it works</p>
          <div className="grid gap-10 md:grid-cols-3">
            {[
              {
                t: "Paste your link",
                d: "Drop in any long URL. Add a custom alias, a password, or an expiry date if you want.",
              },
              {
                t: "Share the short one",
                d: "We generate a short LinkEarn URL. Post it anywhere your audience already is.",
              },
              {
                t: "Get paid per view",
                d: "Every visitor sees a brief sponsored step before continuing. You earn a share of that ad revenue automatically.",
              },
            ].map((s, i) => (
              <div key={s.t} className="border-t border-amber/60 pt-4">
                <span className="tabular text-sm text-paper/40">0{i + 1}</span>
                <h3 className="mt-2 text-lg font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-paper/60">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rates */}
      <section id="rates" className="mx-auto max-w-6xl px-6 py-20">
        <p className="label mb-10">Rates</p>
        <div className="ledger-card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-700 text-paper/50">
              <tr>
                <th className="px-6 py-3 font-normal">Region tier</th>
                <th className="px-6 py-3 font-normal">CPM</th>
                <th className="px-6 py-3 font-normal">Your share (70%)</th>
              </tr>
            </thead>
            <tbody className="tabular">
              {[
                ["Tier 1 — US, UK, CA, AU", "$5.20", "$3.64"],
                ["Tier 2 — EU, IN, BR", "$2.80", "$1.96"],
                ["Tier 3 — Rest of world", "$1.10", "$0.77"],
              ].map((r) => (
                <tr key={r[0]} className="border-b border-ink-700 last:border-0">
                  <td className="px-6 py-4">{r[0]}</td>
                  <td className="px-6 py-4">{r[1]}</td>
                  <td className="px-6 py-4 text-amber">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-paper/40">
          Rates are set platform-wide by the operator and shown live on your dashboard.
        </p>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-ink-700 bg-ink-900/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <p className="label mb-10">What's included</p>
          <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Custom aliases",
              "Password-protected links",
              "Expiring links",
              "QR code generation",
              "Click analytics by country & device",
              "Referral program (20% commission)",
              "Withdrawals via UPI, PayPal, bank transfer",
              "Public API with API key",
              "Fraud & bot click filtering",
              "Full admin control panel",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 border-b border-ink-700 py-3 text-sm">
                <span className="text-mint">●</span>
                {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-ink-700 px-6 py-10 text-center text-xs text-paper/40">
        © {new Date().getFullYear()} LinkEarn. Not affiliated with any other link-shortening service.
      </footer>
    </main>
  );
}
