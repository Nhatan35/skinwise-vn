import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getCurrentUser } from "@/modules/auth/get-current-user";
import { DashboardNavigation } from "@/modules/dashboard/components/dashboard-navigation";

export const dynamic = "force-dynamic";

type DashboardLayoutProps = {
  children: ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const currentUser = await getCurrentUser();

  if (currentUser === null) {
    redirect("/api/auth/signin?callbackUrl=/dashboard");
  }

  const displayName = currentUser.name ?? currentUser.email ?? "SkinWise user";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/80 bg-card/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold text-primary">SkinWise VN</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Không gian theo dõi skincare
            </h1>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/60 px-4 py-3 text-sm lg:text-right">
            <span className="block font-semibold text-foreground">{displayName}</span>
            {currentUser.email ? (
              <span className="mt-1 block text-muted-foreground">{currentUser.email}</span>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-5 sm:px-6 lg:grid-cols-[17rem_1fr] lg:px-8">
        <aside className="h-fit rounded-3xl border border-border bg-card p-3 shadow-sm shadow-stone-950/5">
          <DashboardNavigation />
        </aside>

        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
