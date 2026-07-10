import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import { prisma } from "@/lib/prisma";
import { hashIp } from "@/lib/server";
import { checkFraud } from "@/lib/fraud";
import { payOutClick } from "@/lib/earnings";

export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
  const link = await prisma.link.findUnique({ where: { code: params.code } });
  if (!link || !link.active) {
    return NextResponse.json({ error: "This link is no longer available." }, { status: 404 });
  }
  if (link.expiresAt && link.expiresAt < new Date()) {
    return NextResponse.json({ error: "This link has expired." }, { status: 410 });
  }

  const body = await req.json().catch(() => ({}));
  const completedChallenge = Boolean(body.completedChallenge);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "0.0.0.0";
  const ua = req.headers.get("user-agent") || "";
  const parsed = new UAParser(ua).getResult();
  const ipHash = hashIp(ip);

  const fraudResult = await checkFraud({ linkId: link.id, ipHash, userAgent: ua, completedChallenge });

  let earning = 0;
  if (!fraudResult.isFraud) {
    earning = await payOutClick(link.id);
  }

  await prisma.click.create({
    data: {
      linkId: link.id,
      ipHash,
      country: req.headers.get("x-vercel-ip-country") || undefined,
      device: parsed.device.type || "desktop",
      browser: parsed.browser.name || undefined,
      earning,
      isFraud: fraudResult.isFraud,
      fraudReason: fraudResult.reason,
    },
  });

  return NextResponse.json({ destination: link.originalUrl });
}
