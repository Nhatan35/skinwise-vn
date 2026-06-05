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
    expect(routePageSource).toContain("Insights tiến trình chăm sóc da");
    expect(routePageSource).toContain(
      "Nhìn lại độ đều đặn của routine, nhật ký da, hoạt động theo dõi gần",
    );
    expect(insightsPageSource).toContain(
      "không phải chẩn đoán y khoa",
    );
    expect(routePageSource).toContain("data-route={insightsRoute}");
    expect(routePageSource).toContain("<InsightsPage />");
  });

  it("has loading, error, and empty states using shared components", () => {
    expect(insightsPageSource.startsWith('"use client";')).toBe(true);
    expect(insightsPageSource).toContain("LoadingState");
    expect(insightsPageSource).toContain("Đang chuẩn bị insights tiến trình");
    expect(insightsPageSource).toContain("ErrorState");
    expect(insightsPageSource).toContain("Chưa thể chuẩn bị insights tiến trình");
    expect(insightsPageSource).toContain("EmptyState");
    expect(insightsPageSource).toContain("Chưa đủ dữ liệu để xem insights");
    expect(insightsPageSource).toContain(
      "Đi tới routine hôm nay",
    );
  });

  it("renders the required overview, calendar, trend, product usage, and next-action sections", () => {
    for (const expectedCopy of [
      "Tỷ lệ hoàn thành routine",
      "Chuỗi ngày gần đây",
      "Chuỗi dài nhất",
      "Nhật ký da",
      "Triệu chứng thường gặp",
      "Lịch độ đều đặn routine",
      "Hoàn thành",
      "Hoàn thành một phần",
      "Đã ghi nhận chưa làm",
      "Chưa có log",
      "Xu hướng nhật ký da",
      "Sản phẩm xuất hiện trong nhật ký",
      "không kết luận sản phẩm gây ra hay",
      "Gợi ý tiếp theo",
      "dựa trên trạng thái",
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
