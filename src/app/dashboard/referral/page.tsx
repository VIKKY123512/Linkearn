import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import ReferralLinkBox from "@/components/ReferralLinkBox";

export default async function ReferralPage() {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id as string;
  const [user, referrals, settings] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.user.findMany({ where: { referredById: userId }, select: { name: true, createdAt: true, totalEarned: true } }),
    prisma.settings.findUnique({ where: { id: 1 } }),
  ]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold">Invite friends</h1>
      <p className="mt-1 text-sm text-paper/50">
        Earn {settings?.referralPercent}% commission from every link your referrals create — for as long as they keep earning.
      </p>

      <div className="ledger-card mt-6 p-6">
        <p className="label mb-3">Your referral link</p>
        <ReferralLinkBox code={user?.referralCode ?? ""} />
        <p className="mt-4 tabular text-lg text-mint">{formatCurrency(user?.referralEarn ?? 0)} earned from referrals</p>
      </div>

      <div className="ledger-card mt-6 overflow-hidden">
        <p className="label border-b border-ink-700 px-6 py-4">Your referrals ({referrals.length})</p>
        {referrals.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-paper/40">No referrals yet — share your link to start earning.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-paper/40">
              <tr>
                <th className="px-6 py-3 font-normal">Name</th>
                <th className="px-6 py-3 font-normal">Joined</th>
                <th className="px-6 py-3 font-normal">Their earnings</th>
              </tr>
            </thead>
            <tbody>
              {referrals.map((r, i) => (
                <tr key={i} className="border-t border-ink-700">
                  <td className="px-6 py-3">{r.name}</td>
                  <td className="px-6 py-3">{r.createdAt.toLocaleDateString()}</td>
                  <td className="px-6 py-3 tabular">{formatCurrency(r.totalEarned)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
