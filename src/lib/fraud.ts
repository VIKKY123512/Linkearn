import { prisma } from "@/lib/prisma";

const BOT_UA_PATTERNS = [/bot/i, /spider/i, /crawl/i, /headless/i, /curl/i, /wget/i, /python-requests/i];

export interface FraudCheckInput {
  linkId: string;
  ipHash: string;
  userAgent: string;
  completedChallenge: boolean; // did the client finish the countdown + JS challenge?
}

export interface FraudCheckResult {
  isFraud: boolean;
  reason?: string;
}

/**
 * Lightweight, dependency-free heuristics. This is a starting point, not a
 * replacement for a real bot-mitigation product (e.g. Cloudflare Turnstile) —
 * see README for how to layer one in front of the redirect route.
 */
export async function checkFraud(input: FraudCheckInput): Promise<FraudCheckResult> {
  if (!input.completedChallenge) {
    return { isFraud: true, reason: "Challenge not completed" };
  }

  if (BOT_UA_PATTERNS.some((re) => re.test(input.userAgent))) {
    return { isFraud: true, reason: "Bot-like user agent" };
  }

  // Same IP hitting the same link more than 3 times in 10 minutes -> flag.
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  const recentCount = await prisma.click.count({
    where: {
      linkId: input.linkId,
      ipHash: input.ipHash,
      createdAt: { gte: tenMinutesAgo },
    },
  });
  if (recentCount >= 3) {
    return { isFraud: true, reason: "Repeat clicks from same source" };
  }

  return { isFraud: false };
}
