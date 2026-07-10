"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

interface Item {
  href: string;
  label: string;
  icon: string;
}

export default function Sidebar({ items, root }: { items: Item[]; root: string }) {
  const pathname = usePathname();
  return (
    <aside className="flex h-screen w-60 flex-col justify-between border-r border-ink-700 bg-ink-900 px-4 py-6">
      <div>
        <Link href="/" className="mb-8 block px-2 font-display text-lg font-bold">
          Link<span className="text-amber">Earn</span>
        </Link>
        <nav className="space-y-1">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                  active ? "bg-ink-800 text-amber" : "text-paper/60 hover:bg-ink-800 hover:text-paper"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-paper/60 hover:bg-ink-800 hover:text-rose"
      >
        🚪 Log out
      </button>
    </aside>
  );
}
