import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/dashboard/links", label: "Create link", icon: "🔗" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "📊" },
  { href: "/dashboard/earnings", label: "Earnings", icon: "💰" },
  { href: "/dashboard/referral", label: "Referral", icon: "👥" },
  { href: "/dashboard/withdraw", label: "Withdraw", icon: "💳" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙️" },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="flex">
      <Sidebar items={NAV} root="/dashboard" />
      <div className="flex-1 bg-ink-950 p-8">{children}</div>
    </div>
  );
}
