import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      balance: true,
      totalEarned: true,
      suspended: true,
      createdAt: true,
      _count: { select: { links: true, referrals: true } },
    },
  });
  return NextResponse.json({ users });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, suspended } = await req.json();
  await prisma.user.update({ where: { id }, data: { suspended } });
  return NextResponse.json({ ok: true });
}
