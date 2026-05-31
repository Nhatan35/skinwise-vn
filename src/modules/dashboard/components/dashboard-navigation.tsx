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

const navLabelMap: Record<string, string> = {
  Dashboard: "Tổng quan",
  "Skin Profile": "Hồ sơ da",
  Routines: "Routine",
  "Today Log": "Hôm nay",
  Journal: "Nhật ký",
  Products: "Sản phẩm",
  "Product Match": "Gợi ý sản phẩm",
  "Saved Products": "Đã lưu",
  Insights: "Tiến độ",
  Ingredients: "Thành phần",
  Settings: "Cài đặt",
};

export function DashboardNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard navigation" className="space-y-1">
      {dashboardNavItems.map((item) => {
        const isActive =
          item.href !== null && isActiveDashboardPath(pathname, item.href);
        const itemClassName = cn(
          "flex min-h-11 items-center justify-between gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition-colors",
          isActive
            ? "bg-secondary text-primary"
            : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
          item.disabled ? "cursor-not-allowed opacity-70" : "",
        );
        const visibleLabel = navLabelMap[item.label] ?? item.label;

        if (item.href === null) {
          return (
            <span
              aria-disabled="true"
              className={itemClassName}
              data-nav-label={item.label}
              key={item.label}
            >
              <span>{visibleLabel}</span>
              <Badge variant="outline">{item.status}</Badge>
            </span>
          );
        }

        return (
          <Link
            aria-current={isActive ? "page" : undefined}
            className={itemClassName}
            data-nav-label={item.label}
            href={item.href}
            key={item.href}
          >
            <span>{visibleLabel}</span>
            <Badge variant={isActive ? "default" : "secondary"}>{item.status}</Badge>
          </Link>
        );
      })}
    </nav>
  );
}
