import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const insightsPageRoutePath = join(
  projectRoot,
  "src/app/(dashboard)/insights/page.tsx",
);
const insightsComponentsDir = join(projectRoot, "src/modules/insights/components");
const insightsPageSource = readFileSync(
  join(insightsComponentsDir, "insights-page.tsx"),
  "utf8",
);
const overviewCardsSource = readFileSync(
  join(insightsComponentsDir, "insights-overview-cards.tsx"),
  "utf8",
);
const calendarSource = readFileSync(
  join(insightsComponentsDir, "routine-consistency-calendar.tsx"),
  "utf8",
);
const symptomTrendSource = readFileSync(
  join(insightsComponentsDir, "symptom-trend-card.tsx"),
  "utf8",
);
const productUsageSource = readFileSync(
  join(insightsComponentsDir, "product-usage-card.tsx"),
  "utf8",
);
const nextActionsSource = readFileSync(
  join(insightsComponentsDir, "insights-next-actions-card.tsx"),
  "utf8",
);
const routePageSource = readFileSync(insightsPageRoutePath, "utf8");
const combinedInsightsSource = [
  routePageSource,
  insightsPageSource,
  overviewCardsSource,
  calendarSource,
  symptomTrendSource,
  productUsageSource,
  nextActionsSource,
].join("\n");

describe("Insights UI source", () => {
  it("renders the protected Insights page title, subtitle, and safe disclaimer", () => {
    expect(existsSync(insightsPageRoutePath)).toBe(true);
    expect(routePageSource).toContain("Skin Progress Insights");
    expect(routePageSource).toContain(
      "Review your routine consistency, journal activity, and recent skincare",
    );
    expect(insightsPageSource).toContain(
      "This page summarizes your self-tracked data and is not medical advice.",
    );
    expect(routePageSource).toContain("data-route={insightsRoute}");
    expect(routePageSource).toContain("<InsightsPage />");
  });

  it("has loading, error, and empty states using shared components", () => {
    expect(insightsPageSource.startsWith('"use client";')).toBe(true);
    expect(insightsPageSource).toContain("LoadingState");
    expect(insightsPageSource).toContain("Loading Skin Progress Insights");
    expect(insightsPageSource).toContain("ErrorState");
    expect(insightsPageSource).toContain("load your insights. Please try again.");
    expect(insightsPageSource).toContain("EmptyState");
    expect(insightsPageSource).toContain("Not enough tracking data yet.");
    expect(insightsPageSource).toContain(
      "Start by logging your routine or writing a skin journal entry.",
    );
  });

  it("renders the required overview, calendar, trend, product usage, and next-action sections", () => {
    for (const expectedCopy of [
      "Routine completion rate",
      "Current streak",
      "Best streak",
      "Journal entries",
      "Most common symptom",
      "Routine consistency calendar",
      "Completed",
      "Partial",
      "Skipped",
      "Not logged",
      "Top symptoms",
      "Product usage in journal",
      "Products that appeared most often in your journal entries.",
      "Next actions",
      "Safe actions that help keep your self-tracked history easier to review.",
    ]) {
      expect(combinedInsightsSource).toContain(expectedCopy);
    }
  });

  it("keeps Insights UI client-safe and avoids unsafe skincare claims", () => {
    const lowerSource = combinedInsightsSource.toLowerCase();

    for (const forbiddenImport of [
      "repository",
      "use-case",
      "@/infrastructure/database",
      "mongodb",
      "server-only",
      "getcurrentuser",
      "@/modules/auth",
    ]) {
      expect(lowerSource).not.toContain(forbiddenImport);
    }

    for (const forbiddenCopy of [
      "skin score",
      "skinscore",
      "diagnosis",
      "diagnose",
      "product caused",
      "caused acne",
      "caused irritation",
      "your skin is worse",
      "your skin is bad",
      "attractiveness",
      "face analysis",
      "medication",
    ]) {
      expect(lowerSource).not.toContain(forbiddenCopy);
    }
  });
});
