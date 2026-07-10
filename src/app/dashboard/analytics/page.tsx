import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ClicksChart from "@/components/charts/ClicksChart";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id as string;

  const clicks = await prisma.click.findMany({
    where: { link: { ownerId: userId } },
    orderBy: { createdAt: "desc" },
    take: 2000,
  });

  const byCountry = new Map<string, number>();
  const byDevice = new Map<string, number>();
  const byDay = new Map<string, number>();
  for (const c of clicks) {
    const country = c.country || "Unknown";
    const device = c.device || "Unknown";
    byCountry.set(country, (byCountry.get(country) || 0) + 1);
    byDevice.set(device, (byDevice.get(device) || 0) + 1);
    const day = c.createdAt.toISOString().slice(5, 10);
    byDay.set(day, (byDay.get(day) || 0) + 1);
  }

  const topCountries = [...byCountry.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const topDevices = [...byDevice.entries()].sort((a, b) => b[1] - a[1]);
  const chartData = [...byDay.entries()].reverse().map(([day, n]) => ({ day, clicks: n }));
  const total = clicks.length || 1;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <p className="mt-1 text-sm text-paper/50">Last {clicks.length} recorded views across all your links.</p>

      <div className="ledger-card mt-6 p-6">
        <p className="label mb-4">Views over time</p>
        {chartData.length > 0 ? <ClicksChart data={chartData} /> : <p className="py-16 text-center text-sm text-paper/40">No data yet.</p>}
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="ledger-card p-6">
          <p className="label mb-4">By country</p>
          <div className="space-y-3">
            {topCountries.length === 0 && <p className="text-sm text-paper/40">No data yet.</p>}
            {topCountries.map(([country, n]) => (
              <div key={country}>
                <div className="flex justify-between text-sm">
                  <span>{country}</span>
                  <span className="tabular text-paper/50">{n}</span>
                </div>
                <div className="mt-1 h-1.5 rounded bg-ink-700">
                  <div className="h-1.5 rounded bg-amber" style={{ width: `${(n / total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="ledger-card p-6">
          <p className="label mb-4">By device</p>
          <div className="space-y-3">
            {topDevices.length === 0 && <p className="text-sm text-paper/40">No data yet.</p>}
            {topDevices.map(([device, n]) => (
              <div key={device}>
                <div className="flex justify-between text-sm">
                  <span>{device}</span>
                  <span className="tabular text-paper/50">{n}</span>
                </div>
                <div className="mt-1 h-1.5 rounded bg-ink-700">
                  <div className="h-1.5 rounded bg-mint" style={{ width: `${(n / total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
