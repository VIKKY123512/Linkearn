import { NextRequest } from "next/server";
import QRCode from "qrcode";

export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get("text");
  if (!text) return new Response("Missing text", { status: 400 });

  const buffer = await QRCode.toBuffer(text, { width: 240, margin: 1, color: { dark: "#0B0D10", light: "#F2B70500" } });
  return new Response(new Uint8Array(buffer), { headers: { "Content-Type": "image/png" } });
}
