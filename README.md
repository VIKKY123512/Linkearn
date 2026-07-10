# LinkEarn

A pay-per-view link shortener: users shorten URLs, visitors pass through a
short sponsored step before continuing, and link owners earn a share of that
ad revenue. Built as a complete, runnable clone of the ShortXLinks/EarnLinks
category of product, with its own visual identity ("ledger + ticker" theme —
flat dark surfaces, one amber accent, tabular numerals — deliberately not the
neon-glassmorphism look of the reference site).

## Stack

- **Next.js 14** (App Router, TypeScript) — frontend + API routes in one app
- **Tailwind CSS** — styling, using the custom tokens in `tailwind.config.ts`
- **Prisma + SQLite** — zero-config database (swap to Postgres/MySQL for production, see below)
- **NextAuth** — credentials-based auth (email + password) with JWT sessions
- **Recharts** — dashboard charts
- **qrcode** — QR code generation for short links

No paid services are required to run this locally.

## Quick start

```bash
cp .env.example .env
# edit .env: set NEXTAUTH_SECRET to a random string
#   openssl rand -base64 32

npm install
npm run db:push     # creates dev.db (SQLite) from the Prisma schema
npm run db:seed      # creates the Settings row + an admin account
npm run dev
```

Visit `http://localhost:3000`.

Seeded admin login: `admin@linkearn.local` / `ChangeMe123!` — **change this
password immediately** by editing it directly in the database or adding a
password-change flow (not included; see Roadmap).

## Feature map

**Public site**
- Marketing homepage (hero, how-it-works, rates table, feature list)
- Register / login (credentials-based)
- Referral links (`/register?ref=<code>`) — referrer earns a % of the
  referred user's future earnings

**User dashboard** (`/dashboard`)
- Overview: total views, balance, lifetime earnings, current CPM, views chart
- Create link: long URL in, short code out; optional custom alias, password
  protection, expiry date, and a generated QR code
- Link history: all your links with live view counts, disable any link
- Analytics: views over time, breakdown by country and device
- Earnings: balance, today's earnings, lifetime total, withdrawal history
- Referral: your referral link, list of people you referred and what they've earned
- Withdraw: request a payout via UPI, PayPal, or bank transfer
- Settings: your API key + a `curl` example for the public API

**Redirect engine** (`/r/[code]`)
- Password gate for protected links (checked server-side, never exposed to the client)
- Ad slot + 10-second countdown before the "Continue" button appears
- Basic anti-bot heuristics: user-agent pattern matching, one-time interaction
  check, and rate-limiting repeat clicks from the same IP within a 10-minute
  window (see `src/lib/fraud.ts`)
- Records every view (fraud or not) and pays the link owner (and their
  referrer, if any) automatically for valid views

**Admin panel** (`/admin`, requires an ADMIN-role account)
- Overview: total users/links/views, fraud rate, estimated ad revenue, amounts paid out
- Users: list, balances, suspend/unsuspend
- Links: list all links platform-wide, disable any of them
- Withdrawals: approve, reject (auto-refunds the balance), or mark paid
- Settings: CPM rate, user revenue share %, referral commission %, minimum withdrawal

**Public API**
- `POST /api/v1/links` with `Authorization: Bearer <apiKey>` — create a link
  programmatically (returns the short URL)

## How the money math works

Set in Admin → Settings, applied in `src/lib/earnings.ts`:

```
per-view payout   = cpmRate / 1000
owner earns       = per-view payout × userSharePercent
referrer earns    = owner's cut × referralPercent   (only if the owner was referred)
```

Everything else (the remainder of the CPM) is the platform's revenue. Fraud-
flagged clicks are recorded but never paid out or counted toward revenue
estimates.

## Production checklist / roadmap

This is a complete, working MVP of every feature you listed, wired end to
end. A few items from the original brief need infrastructure only you (the
operator) can provide, so they're stubbed with clear extension points rather
than faked:

- **Real ad network integration** — the redirect page has a labeled ad slot
  (`src/components/RedirectClient.tsx`) ready for your ad network's script tag.
- **Real payment gateway payouts** — withdrawals are tracked end-to-end
  (request → approve → paid) but the "Mark paid" step is a manual admin
  action. Wire in Stripe Connect / PayPal Payouts / Razorpay in
  `src/app/api/admin/withdrawals/route.ts` if you want payouts to fire automatically.
- **Google / Telegram login** — `src/lib/auth.ts` is where you'd add
  `GoogleProvider` / a Telegram widget provider once you have OAuth credentials.
- **Custom domains, PWA packaging, "AI traffic analysis"** — not implemented;
  each is a substantial project on its own (domain verification + routing,
  a manifest + service worker, and a real ML pipeline respectively).
- **Stronger bot mitigation** — the built-in heuristics are a reasonable
  starting point, not a replacement for a dedicated product like Cloudflare
  Turnstile in front of `/r/[code]`.
- **Redis** — not needed at this scale (SQLite/Postgres handle click counting
  fine); add it later only if you need sub-millisecond redirect counters at
  very high traffic.
- **Swap SQLite → Postgres for production**: change `provider = "sqlite"` to
  `"postgresql"` in `prisma/schema.prisma`, set `DATABASE_URL` to your
  connection string, then `npm run db:push`.

## Project structure

```
prisma/schema.prisma        Data model (User, Link, Click, Withdrawal, Settings)
src/app/                    Pages (App Router) + API routes
  admin/                    Admin panel pages
  dashboard/                User dashboard pages
  r/[code]/                 Redirect/ad landing page
  api/                      All backend logic
src/components/             UI components
src/lib/                    Auth config, Prisma client, earnings/fraud logic
```
