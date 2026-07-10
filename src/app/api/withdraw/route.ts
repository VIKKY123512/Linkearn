import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  method: z.enum(["UPI", "PayPal", "Bank Transfer"]),
  details: z.string().min(3).max(200),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id as string;

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid input." }, { status: 400 });

  const [user, settings] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.settings.findUnique({ where: { id: 1 } }),
  ]);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const minWithdraw = settings?.minWithdraw ?? 5;
  if (user.balance < minWithdraw) {
    return NextResponse.json({ error: `Minimum withdrawal is $${minWithdraw.toFixed(2)}.` }, { status: 400 });
  }

  const amount = user.balance;

  await prisma.$transaction([
    prisma.withdrawal.create({
      data: { userId, amount, method: parsed.data.method, details: parsed.data.details },
    }),
    prisma.user.update({ where: { id: userId }, data: { balance: 0 } }),
  ]);

  return NextResponse.json({ ok: true, amount });
}
