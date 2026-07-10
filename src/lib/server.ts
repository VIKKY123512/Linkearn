import crypto from "crypto";

const ALPHABET = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ"; // no 0/O/1/l/I

export function generateShortCode(length = 6): string {
  let out = "";
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

/** One-way hash so we can dedupe/rate-limit clicks without storing raw IPs. */
export function hashIp(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(ip + (process.env.NEXTAUTH_SECRET || "salt"))
    .digest("hex");
}
