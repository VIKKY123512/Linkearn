import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isValidUrl } from "@/lib/utils";
import { generateShortCode } from "@/lib/server";

const schema = z.object({
  originalUrl: z.string().refine(isValidUrl, "Enter a valid http(s) URL."),
  alias: z.string().min(3).max(30).optional(),
});

/**
 * Public API — authenticate with `Authorization: Bearer <apiKey>`.
 * Lets users create links from scripts/bots without logging into the UI.
 */
export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const apiKey = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!apiKey) return NextResponse.json({ error: "Missing API key" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { apiKey } });
  if (!user || user.suspended) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
  const { originalUrl, alias } = parsed.data;

  let code = alias || generateShortCode();
  if (alias) {
    const taken = await prisma.link.findUnique({ where: { code: alias } });
    if (taken) return NextResponse.json({ error: "Alias already taken." }, { status: 409 });
  } else {
    while (await prisma.link.findUnique({ where: { code } })) code = generateShortCode();
  }

  const link = await prisma.link.create({
    data: { code, originalUrl, alias: alias || null, ownerId: user.id },
  });

  return NextResponse.json(
    { code: link.code, shortUrl: `${req.nextUrl.origin}/r/${link.code}` },
    { status: 201 }
  );
}
