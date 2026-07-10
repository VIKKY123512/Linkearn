import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "🏠" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/links", label: "Links", icon: "🔗" },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: "💳" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if ((session.user as any).role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex">
      <Sidebar items={NAV} root="/admin" />
      <div className="flex-1 bg-ink-950 p-8">{children}</div>
    </div>
  );
}
