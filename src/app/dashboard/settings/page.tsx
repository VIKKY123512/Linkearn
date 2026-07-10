import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session!.user as any).id as string;
  const user = await prisma.user.findUnique({ where: { id: userId } });

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="ledger-card mt-6 space-y-4 p-6">
        <div>
          <p className="label">Name</p>
          <p className="mt-1">{user?.name}</p>
        </div>
        <div>
          <p className="label">Email</p>
          <p className="mt-1">{user?.email}</p>
        </div>
      </div>

      <div className="ledger-card mt-6 p-6">
        <p className="label">API key</p>
        <p className="tabular mt-2 break-all text-amber">{user?.apiKey}</p>
        <p className="mt-3 text-xs text-paper/40">
          Use this to create links programmatically — see <code>/dashboard/settings</code> below for a usage example.
        </p>
        <pre className="ledger-lines mt-4 overflow-x-auto rounded bg-ink-950 p-4 text-xs text-paper/70">
{`curl -X POST https://your-domain.com/api/v1/links \\
  -H "Authorization: Bearer ${user?.apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"originalUrl": "https://example.com"}'`}
        </pre>
      </div>
    </div>
  );
}
