import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatCard from "@/components/ui/StatCard";
import ClicksChart from "@/components/charts/ClicksChart";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id as string;

  const [user, totalClicks, links, settings] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.click.count({ where: { link: { ownerId: userId } } }),
    prisma.link.findMany({ where: { ownerId: userId }, include: { _count: { select: { clicks: true } } } }),
    prisma.settings.findUnique({ where: { id: 1 } }),
  ]);

  const clicks = await prisma.click.findMany({
    where: { link: { ownerId: userId } },
    orderBy: { createdAt: "desc" },
    take: 500,
    select: { createdAt: true },
  });

  const byDay = new Map<string, number>();
  for (const c of clicks) {
    const day = c.createdAt.toISOString().slice(5, 10);
    byDay.set(day, (byDay.get(day) || 0) + 1);
  }
  const chartData = Array.from(byDay.entries())
    .reverse()
    .map(([day, n]) => ({ day, clicks: n }));

  return (
    <div>
      <h1 className="text-2xl font-semibold">Welcome back, {user?.name}</h1>
      <p className="mt-1 text-sm text-paper/50">Here's how your links are performing.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total views" value={totalClicks.toLocaleString()} sub="all time" />
        <StatCard label="Balance" value={formatCurrency(user?.balance ?? 0)} accent="text-amber" sub="available to withdraw" />
        <StatCard label="Total earned" value={formatCurrency(user?.totalEarned ?? 0)} accent="text-mint" sub="lifetime" />
        <StatCard label="CPM rate" value={`$${settings?.cpmRate.toFixed(2)} / 1,000`} sub={`you keep ${settings?.userSharePercent}%`} />
      </div>

      <div className="ledger-card mt-8 p-6">
        <p className="label mb-4">Views, last {chartData.length} days with activity</p>
        {chartData.length > 0 ? (
          <ClicksChart data={chartData} />
        ) : (
          <p className="py-16 text-center text-sm text-paper/40">No views yet — share your first link to see activity here.</p>
        )}
      </div>

      <div className="ledger-card mt-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink-700 px-6 py-4">
          <p className="label">Recent links</p>
          <a href="/dashboard/links" className="text-xs text-amber">Create new →</a>
        </div>
        {links.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-paper/40">You haven't created any links yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-paper/40">
              <tr>
                <th className="px-6 py-3 font-normal">Short link</th>
                <th className="px-6 py-3 font-normal">Views</th>
                <th className="px-6 py-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {links.slice(0, 8).map((l) => (
                <tr key={l.id} className="border-t border-ink-700">
                  <td className="px-6 py-3 tabular text-amber">/r/{l.code}</td>
                  <td className="px-6 py-3 tabular">{l._count.clicks}</td>
                  <td className="px-6 py-3">{l.active ? <span className="text-mint">Active</span> : <span className="text-paper/40">Disabled</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
