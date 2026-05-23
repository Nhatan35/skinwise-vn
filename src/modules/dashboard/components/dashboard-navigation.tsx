"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  dashboardNavItems,
  dashboardRoute,
} from "@/modules/dashboard/dashboard-shell.config";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils";

function isActiveDashboardPath(pathname: string, href: string) {
  if (href === dashboardRoute) {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard navigation" className="space-y-1">
      {dashboardNavItems.map((item) => {
        const isActive =
          item.href !== null && isActiveDashboardPath(pathname, item.href);
        const itemClassName = cn(
          "flex min-h-10 items-center justify-between gap-3 px-3 py-2 text-sm font-medium",
          isActive ? "bg-emerald-50 text-emerald-900" : "text-stone-500",
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
          <Link
            aria-current={isActive ? "page" : undefined}
            className={itemClassName}
            href={item.href}
            key={item.href}
          >
            <span>{item.label}</span>
            <Badge variant="secondary">{item.status}</Badge>
          </Link>
        );
      })}
    </nav>
  );
}
