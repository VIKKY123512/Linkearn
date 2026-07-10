import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });
  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();

  const settings = await prisma.settings.update({
    where: { id: 1 },
    data: {
      cpmRate: body.cpmRate,
      userSharePercent: body.userSharePercent,
      referralPercent: body.referralPercent,
      minWithdraw: body.minWithdraw,
      siteName: body.siteName,
    },
  });
  return NextResponse.json({ settings });
}
