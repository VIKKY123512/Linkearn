import { prisma } from "@/lib/prisma";
import RedirectClient from "@/components/RedirectClient";

export default async function RedirectPage({ params }: { params: { code: string } }) {
  const link = await prisma.link.findUnique({ where: { code: params.code } });

  if (!link || !link.active) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <p className="font-display text-2xl font-bold">Link not found</p>
          <p className="mt-2 text-paper/50">This LinkEarn link doesn't exist or has been disabled.</p>
        </div>
      </main>
    );
  }

  if (link.expiresAt && link.expiresAt < new Date()) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 text-center">
        <div>
          <p className="font-display text-2xl font-bold">Link expired</p>
          <p className="mt-2 text-paper/50">This link is no longer active.</p>
        </div>
      </main>
    );
  }

  return <RedirectClient code={link.code} requiresPassword={Boolean(link.passwordHash)} />;
}
