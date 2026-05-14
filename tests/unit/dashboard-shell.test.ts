import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

import {
  dashboardNavItems,
  dashboardPlaceholderCards,
  dashboardRoute,
  routinesRoute,
  skinProfileRoute,
} from "@/modules/dashboard/dashboard-shell.config";
import { routes } from "@/shared/constants/routes";

const dashboardConfigSource = readFileSync(
  resolve(process.cwd(), "src/modules/dashboard/dashboard-shell.config.ts"),
  "utf8",
);

describe("dashboard shell config", () => {
  it("exposes dashboard, Skin Profile, and Routines as enabled protected routes", () => {
    const enabledItems = dashboardNavItems.filter((item) => !item.disabled);

    expect(dashboardRoute).toBe("/dashboard");
    expect(skinProfileRoute).toBe(routes.SKIN_PROFILE);
    expect(routinesRoute).toBe(routes.ROUTINES);
    expect(routes.ONBOARDING_SKIN_PROFILE).toBe("/onboarding/skin-profile");
    expect(routes.ROUTINES).toBe("/routines");
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
    ]);
  });

  it("keeps unrelated unimplemented navigation items disabled without hrefs", () => {
    const disabledItems = dashboardNavItems.filter((item) => item.disabled);

    expect(disabledItems.map((item) => item.label)).toEqual([
      "Today Log",
      "Journal",
      "Products",
      "Ingredients",
    ]);
    expect(
      disabledItems.every(
        (item) => item.href === null && item.disabled === true,
      ),
    ).toBe(true);
  });

  it("does not include out-of-scope navigation metadata", () => {
    const metadata = JSON.stringify({
      cards: dashboardPlaceholderCards,
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

  it("defines the seven required placeholder card areas", () => {
    expect(dashboardPlaceholderCards.map((card) => card.label)).toEqual([
      "Skin Profile",
      "Routines",
      "Today Log",
      "Journal",
      "Products",
      "Ingredients",
      "Safety Analysis",
    ]);
  });

  it("keeps placeholder card copy explicit about Task 6 scope", () => {
    expect(
      dashboardPlaceholderCards.every(
        (card) =>
          card.scopeText === "Chưa implement trong Task 6" &&
          card.connectionText === "Sẽ được kết nối ở task/module sau",
      ),
    ).toBe(true);
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
