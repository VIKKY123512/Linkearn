import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isValidUrl } from "@/lib/utils";
import { generateShortCode } from "@/lib/server";

const schema = z.object({
  originalUrl: z.string().refine(isValidUrl, "Enter a valid http(s) URL."),
  alias: z.string().min(3).max(30).regex(/^[a-zA-Z0-9-_]+$/).optional().or(z.literal("")),
  password: z.string().min(4).optional().or(z.literal("")),
  expiresAt: z.string().optional().or(z.literal("")),
});

async function getUserId() {
  const session = await getServerSession(authOptions);
  return session ? ((session.user as any).id as string) : null;
}

export async function POST(req: NextRequest) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  }
  const { originalUrl, alias, password, expiresAt } = parsed.data;

  let code = alias || generateShortCode();
  if (alias) {
    const taken = await prisma.link.findUnique({ where: { code: alias } });
    if (taken) return NextResponse.json({ error: "That alias is already taken." }, { status: 409 });
  } else {
    // extremely unlikely collision loop, but guard anyway
    while (await prisma.link.findUnique({ where: { code } })) {
      code = generateShortCode();
    }
  }

  const link = await prisma.link.create({
    data: {
      code,
      originalUrl,
      alias: alias || null,
      passwordHash: password ? await bcrypt.hash(password, 10) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      ownerId: userId,
    },
  });

  return NextResponse.json({ code: link.code }, { status: 201 });
}

export async function GET() {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const links = await prisma.link.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { clicks: true } } },
  });

  return NextResponse.json({ links });
}
