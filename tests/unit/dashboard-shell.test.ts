import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  dashboardNavItems,
  dashboardRoute,
  ingredientsRoute,
  journalRoute,
  productsRoute,
  routinesRoute,
  savedProductsRoute,
  skinProfileRoute,
  todayLogRoute,
} from "@/modules/dashboard/dashboard-shell.config";
import { routes } from "@/shared/constants/routes";

const dashboardConfigSource = readFileSync(
  resolve(process.cwd(), "src/modules/dashboard/dashboard-shell.config.ts"),
  "utf8",
);
const dashboardLayoutSource = readFileSync(
  resolve(process.cwd(), "src/app/(dashboard)/layout.tsx"),
  "utf8",
);
const dashboardNavigationSource = readFileSync(
  resolve(
    process.cwd(),
    "src/modules/dashboard/components/dashboard-navigation.tsx",
  ),
  "utf8",
);

describe("dashboard shell config", () => {
  it("exposes dashboard, Skin Profile, Routines, Today Log, Journal, Products, Saved Products, and Ingredients as enabled protected routes", () => {
    const enabledItems = dashboardNavItems.filter((item) => !item.disabled);

    expect(dashboardRoute).toBe("/dashboard");
    expect(skinProfileRoute).toBe(routes.SKIN_PROFILE);
    expect(routinesRoute).toBe(routes.ROUTINES);
    expect(todayLogRoute).toBe(routes.TODAY_LOG);
    expect(journalRoute).toBe(routes.JOURNAL);
    expect(productsRoute).toBe(routes.PRODUCTS);
    expect(savedProductsRoute).toBe(routes.SAVED_PRODUCTS);
    expect(ingredientsRoute).toBe(routes.INGREDIENTS);
    expect(routes.ONBOARDING_SKIN_PROFILE).toBe("/onboarding/skin-profile");
    expect(routes.ROUTINES).toBe("/routines");
    expect(routes.TODAY_LOG).toBe("/routine-logs/today");
    expect(routes.JOURNAL).toBe("/journal");
    expect(routes.PRODUCTS).toBe("/products");
    expect(routes.SAVED_PRODUCTS).toBe("/saved-products");
    expect(routes.INGREDIENTS).toBe("/ingredients");
    expect(enabledItems).toEqual([
      {
        disabled: false,
        href: "/dashboard",
        label: "Dashboard",
        status: "Active",
      },
      {
        disabled: false,
        href: "/skin-profile",
        label: "Skin Profile",
        status: "Active",
      },
      {
        disabled: false,
        href: "/routines",
        label: "Routines",
        status: "Active",
      },
      {
        disabled: false,
        href: "/routine-logs/today",
        label: "Today Log",
        status: "Active",
      },
      {
        disabled: false,
        href: "/journal",
        label: "Journal",
        status: "Active",
      },
      {
        disabled: false,
        href: "/products",
        label: "Products",
        status: "Active",
      },
      {
        disabled: false,
        href: "/saved-products",
        label: "Saved Products",
        status: "Active",
      },
      {
        disabled: false,
        href: "/ingredients",
        label: "Ingredients",
        status: "Active",
      },
    ]);
  });

  it("does not keep implemented Today Log navigation disabled", () => {
    const disabledItems = dashboardNavItems.filter((item) => item.disabled);

    expect(disabledItems).toEqual([]);
    expect(dashboardNavItems.find((item) => item.label === "Today Log")).toEqual({
      disabled: false,
      href: routes.TODAY_LOG,
      label: "Today Log",
      status: "Active",
    });
  });

  it("does not include placeholder dashboard card metadata after DB-001", () => {
    expect(dashboardConfigSource).not.toContain("dashboardPlaceholderCards");
    expect(dashboardConfigSource).not.toContain("Chưa implement trong Task 6");
    expect(dashboardConfigSource).not.toContain(
      "Sẽ được kết nối ở task/module sau",
    );
  });

  it("does not include out-of-scope navigation metadata", () => {
    const metadata = JSON.stringify({
      nav: dashboardNavItems,
    }).toLowerCase();

    expect(metadata).not.toContain("marketplace");
    expect(metadata).not.toContain("community");
    expect(metadata).not.toContain("skin-score");
    expect(metadata).not.toContain("skin score");
    expect(metadata).not.toContain("admin");
    expect(metadata).not.toContain("subscription");
    expect(metadata).not.toContain("notifications");
  });

  it("derives active navigation state from the current dashboard path", () => {
    expect(dashboardLayoutSource).toContain("<DashboardNavigation />");
    expect(dashboardNavigationSource.startsWith('"use client";')).toBe(true);
    expect(dashboardNavigationSource).toContain("usePathname");
    expect(dashboardNavigationSource).toContain(
      "isActiveDashboardPath(pathname, item.href)",
    );
    expect(dashboardNavigationSource).toContain(
      'pathname.startsWith(`${href}/`)',
    );
    expect(dashboardNavigationSource).toContain(
      'aria-current={isActive ? "page" : undefined}',
    );
    expect(dashboardLayoutSource).not.toContain("item.href === dashboardRoute");
  });

  it("does not import auth, database, server-only, or API code", () => {
    expect(dashboardConfigSource).toContain("@/shared/constants/routes");
    expect(dashboardConfigSource).not.toContain("auth");
    expect(dashboardConfigSource).not.toContain("mongodb");
    expect(dashboardConfigSource).not.toContain("server-only");
    expect(dashboardConfigSource).not.toContain("fetch(");
    expect(dashboardConfigSource).not.toContain("/api/");
  });
});
