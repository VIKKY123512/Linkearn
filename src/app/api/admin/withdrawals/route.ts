import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const withdrawals = await prisma.withdrawal.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });
  return NextResponse.json({ withdrawals });
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, status } = await req.json();

  if (!["APPROVED", "REJECTED", "PAID"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const withdrawal = await prisma.withdrawal.findUnique({ where: { id } });
  if (!withdrawal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // If rejected, refund the balance back to the user.
  if (status === "REJECTED" && withdrawal.status !== "REJECTED") {
    await prisma.user.update({ where: { id: withdrawal.userId }, data: { balance: { increment: withdrawal.amount } } });
  }

  await prisma.withdrawal.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true });
}
