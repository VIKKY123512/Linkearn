import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-700 bg-ink-950/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg font-bold tracking-tight">
          Link<span className="text-amber">Earn</span>
        </Link>
        <div className="hidden items-center gap-8 text-sm text-paper/70 md:flex">
          <Link href="/#how-it-works" className="hover:text-paper">How it works</Link>
          <Link href="/#rates" className="hover:text-paper">Rates</Link>
          <Link href="/#features" className="hover:text-paper">Features</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-paper/70 hover:text-paper">Log in</Link>
          <Link href="/register" className="btn-primary text-sm">Start earning</Link>
        </div>
      </nav>
    </header>
  );
}
