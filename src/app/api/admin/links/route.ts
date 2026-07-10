import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const links = await prisma.link.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    include: { owner: { select: { name: true, email: true } }, _count: { select: { clicks: true } } },
  });
  return NextResponse.json({ links });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, active } = await req.json();
  await prisma.link.update({ where: { id }, data: { active } });
  return NextResponse.json({ ok: true });
}
