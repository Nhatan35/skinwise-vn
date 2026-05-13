import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getCurrentUser } from "@/modules/auth/get-current-user";
import {
  dashboardNavItems,
  dashboardRoute,
} from "@/modules/dashboard/dashboard-shell.config";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils";

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
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-medium text-emerald-700">SkinWise VN</p>
            <h1 className="mt-1 text-2xl font-semibold">
              Dashboard foundation
            </h1>
          </div>

          <div className="flex flex-col gap-1 text-sm lg:items-end">
            <span className="font-medium text-stone-900">{displayName}</span>
            {currentUser.email ? (
              <span className="text-stone-600">{currentUser.email}</span>
            ) : null}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[16rem_1fr]">
        <aside className="h-fit border border-stone-200 bg-white p-3">
          <nav aria-label="Dashboard navigation" className="space-y-1">
            {dashboardNavItems.map((item) => {
              const itemClassName = cn(
                "flex min-h-10 items-center justify-between gap-3 px-3 py-2 text-sm font-medium",
                item.href === dashboardRoute
                  ? "bg-emerald-50 text-emerald-900"
                  : "text-stone-500",
                item.disabled ? "cursor-not-allowed opacity-70" : "",
              );

              if (item.href === null) {
                return (
                  <span
                    aria-disabled="true"
                    className={itemClassName}
                    key={item.label}
                  >
                    <span>{item.label}</span>
                    <Badge variant="outline">{item.status}</Badge>
                  </span>
                );
              }

              return (
                <Link className={itemClassName} href={item.href} key={item.href}>
                  <span>{item.label}</span>
                  <Badge variant="secondary">{item.status}</Badge>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
