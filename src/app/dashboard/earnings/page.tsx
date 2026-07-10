import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import StatCard from "@/components/ui/StatCard";
import { formatCurrency } from "@/lib/utils";

export default async function EarningsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const todayEarning = await prisma.click.aggregate({
    where: { link: { ownerId: userId }, createdAt: { gte: startOfDay }, isFraud: false },
    _sum: { earning: true },
  });

  const withdrawals = await prisma.withdrawal.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold">Earnings</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Available balance" value={formatCurrency(user?.balance ?? 0)} accent="text-amber" />
        <StatCard label="Today's earnings" value={formatCurrency(todayEarning._sum.earning ?? 0)} accent="text-mint" />
        <StatCard label="Total earned" value={formatCurrency(user?.totalEarned ?? 0)} />
      </div>

      <div className="mt-6">
        <Link href="/dashboard/withdraw" className="btn-primary">Request payment</Link>
      </div>

      <div className="ledger-card mt-8 overflow-hidden">
        <p className="label border-b border-ink-700 px-6 py-4">Withdrawal history</p>
        {withdrawals.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-paper/40">No withdrawals yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-paper/40">
              <tr>
                <th className="px-6 py-3 font-normal">Date</th>
                <th className="px-6 py-3 font-normal">Method</th>
                <th className="px-6 py-3 font-normal">Amount</th>
                <th className="px-6 py-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w.id} className="border-t border-ink-700">
                  <td className="px-6 py-3">{w.createdAt.toLocaleDateString()}</td>
                  <td className="px-6 py-3">{w.method}</td>
                  <td className="px-6 py-3 tabular">{formatCurrency(w.amount)}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={w.status} />
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

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "PAID" ? "text-mint" : status === "REJECTED" ? "text-rose" : status === "APPROVED" ? "text-amber" : "text-paper/50";
  return <span className={color}>{status}</span>;
}
