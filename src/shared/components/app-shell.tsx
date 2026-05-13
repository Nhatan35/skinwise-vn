import Link from "next/link";
import type { ReactNode } from "react";

import { routes } from "@/shared/constants/routes";
import { cn } from "@/shared/utils";

type AppShellProps = {
  children: ReactNode;
  className?: string;
  description?: string;
  title?: string;
};

const foundationNavItems = [
  { href: routes.HOME, label: "Home" },
  { href: routes.DASHBOARD, label: "Dashboard shell" },
] as const;

export function AppShell({
  children,
  className,
  description = "Shared UI foundation for SkinWise VN.",
  title = "SkinWise VN",
}: AppShellProps) {
  return (
    <div className={cn("min-h-screen bg-background text-foreground", className)}>
      <header className="border-b bg-card/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Week 1 UI Foundation
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">
              {title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
          <nav aria-label="Foundation navigation" className="flex gap-2">
            {foundationNavItems.map((item) => (
              <Link
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
