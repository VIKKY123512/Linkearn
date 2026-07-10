import { prisma } from "@/lib/prisma";

/**
 * Pays out one valid (non-fraud) click.
 * CPM is $ per 1000 views, so a single view is worth cpmRate / 1000.
 * The link owner gets `userSharePercent` of that; if they were referred,
 * the referrer gets `referralPercent` of the *owner's* cut (not the platform's).
 */
export async function payOutClick(linkId: string): Promise<number> {
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  const cpmRate = settings?.cpmRate ?? 5;
  const userShare = (settings?.userSharePercent ?? 70) / 100;
  const referralShare = (settings?.referralPercent ?? 20) / 100;

  const perView = cpmRate / 1000;
  const ownerEarning = perView * userShare;

  const link = await prisma.link.findUnique({
    where: { id: linkId },
    include: { owner: true },
  });
  if (!link) return 0;

  await prisma.user.update({
    where: { id: link.ownerId },
    data: {
      balance: { increment: ownerEarning },
      totalEarned: { increment: ownerEarning },
    },
  });

  if (link.owner.referredById) {
    const referralEarning = ownerEarning * referralShare;
    await prisma.user.update({
      where: { id: link.owner.referredById },
      data: {
        balance: { increment: referralEarning },
        referralEarn: { increment: referralEarning },
        totalEarned: { increment: referralEarning },
      },
    });
  }

  return ownerEarning;
}
