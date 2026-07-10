import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { code: string } }) {
  const link = await prisma.link.findUnique({ where: { code: params.code } });
  if (!link || !link.active) return NextResponse.json({ ok: false, error: "Link not found." }, { status: 404 });
  if (!link.passwordHash) return NextResponse.json({ ok: true });

  const { password } = await req.json();
  const valid = password && (await bcrypt.compare(password, link.passwordHash));
  if (!valid) return NextResponse.json({ ok: false, error: "Incorrect password." }, { status: 401 });

  return NextResponse.json({ ok: true });
}
