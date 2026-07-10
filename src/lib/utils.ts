// Client-safe helpers only. Anything needing Node's `crypto` module lives in
// server.ts instead, so this file can be imported from "use client" components
// without bundling Node built-ins into the browser bundle.

export function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}
