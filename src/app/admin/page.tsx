import { prisma } from "@/lib/prisma";
import StatCard from "@/components/ui/StatCard";
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [totalUsers, totalLinks, totalClicks, fraudClicks, pendingWithdrawals, paidOut, revenueAgg] = await Promise.all([
    prisma.user.count(),
    prisma.link.count(),
    prisma.click.count(),
    prisma.click.count({ where: { isFraud: true } }),
    prisma.withdrawal.aggregate({ where: { status: "PENDING" }, _sum: { amount: true }, _count: true }),
    prisma.withdrawal.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    prisma.click.aggregate({ where: { isFraud: false }, _sum: { earning: true } }),
  ]);

  const userPayout = revenueAgg._sum.earning ?? 0;
  // Platform revenue = total ad revenue implied by CPM minus what's paid to users.
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  const totalAdRevenue = ((settings?.cpmRate ?? 5) / 1000) * (totalClicks - fraudClicks);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Admin overview</h1>
      <p className="mt-1 text-sm text-paper/50">Platform-wide metrics, live.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={totalUsers.toLocaleString()} />
        <StatCard label="Total links" value={totalLinks.toLocaleString()} />
        <StatCard label="Total views" value={totalClicks.toLocaleString()} />
        <StatCard
          label="Fraud rate"
          value={totalClicks ? `${((fraudClicks / totalClicks) * 100).toFixed(1)}%` : "0%"}
          accent={fraudClicks / (totalClicks || 1) > 0.1 ? "text-rose" : "text-mint"}
        />
        <StatCard label="Est. ad revenue" value={formatCurrency(totalAdRevenue)} accent="text-amber" />
        <StatCard label="Paid to users" value={formatCurrency(userPayout)} />
        <StatCard label="Paid out (withdrawals)" value={formatCurrency(paidOut._sum.amount ?? 0)} accent="text-mint" />
        <StatCard
          label="Pending withdrawals"
          value={formatCurrency(pendingWithdrawals._sum.amount ?? 0)}
          sub={`${pendingWithdrawals._count} request(s)`}
          accent="text-rose"
        />
      </div>
    </div>
  );
}
