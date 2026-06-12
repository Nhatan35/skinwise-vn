import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const insightsPageRoutePath = join(
  projectRoot,
  "src/app/(dashboard)/insights/page.tsx",
);
const insightsComponentsDir = join(projectRoot, "src/modules/insights/components");
const insightSummaryMapperPath = join(
  projectRoot,
  "src/modules/insights/insight-summary.mapper.ts",
);
const insightsPageSource = readFileSync(
  join(insightsComponentsDir, "insights-page.tsx"),
  "utf8",
);
const insightSummaryMapperSource = readFileSync(
  insightSummaryMapperPath,
  "utf8",
);
const insightSummarySectionSource = readFileSync(
  join(insightsComponentsDir, "insight-summary-section.tsx"),
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
  insightSummarySectionSource,
  overviewCardsSource,
  calendarSource,
  symptomTrendSource,
  productUsageSource,
  nextActionsSource,
].join("\n");
const insightSummaryCopySource = [
  insightSummarySectionSource,
  insightSummaryMapperSource,
].join("\n");

describe("Insights UI source", () => {
  it("renders the protected Insights page title, subtitle, and safe disclaimer", () => {
    expect(existsSync(insightsPageRoutePath)).toBe(true);
    expect(routePageSource).toContain("Insights tiến trình chăm sóc da");
    expect(routePageSource).toContain(
      "Nhìn lại độ đều đặn của routine, nhật ký da, hoạt động theo dõi gần",
    );
    expect(insightsPageSource).toContain("Insights cá nhân");
    expect(insightsPageSource).toContain("Dựa trên ghi nhận của bạn");
    expect(insightsPageSource).toContain(
      "không nên",
    );
    expect(insightsPageSource).toContain(
      "kết luận quá sớm từ dữ liệu ngắn hạn",
    );
    expect(insightsPageSource).toContain("tư vấn chuyên");
    expect(insightsPageSource).toContain("môn");
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
    expect(insightsPageSource).toContain("Cần thêm dữ liệu để xem rõ hơn");
    expect(insightsPageSource).toContain("Ghi nhận routine");
    expect(insightsPageSource).toContain("Viết journal");
    expect(insightsPageSource).toContain("Xem lại routine");
    expect(insightSummarySectionSource).toContain("LoadingState");
    expect(insightSummarySectionSource).toContain(
      "Đang tải phần tự quan sát cá nhân",
    );
    expect(insightSummarySectionSource).toContain("ErrorState");
    expect(insightSummarySectionSource).toContain(
      "Không thể tải phần tự quan sát cá nhân",
    );
    expect(insightSummarySectionSource).toContain("EmptyState");
    expect(insightSummarySectionSource).toContain(
      "Cần thêm dữ liệu cho phần tự quan sát cá nhân",
    );
  });

  it("renders the required overview, calendar, trend, product usage, and next-action sections", () => {
    for (const expectedCopy of [
      "Tỷ lệ hoàn thành routine",
      "Chuỗi ngày gần đây",
      "Chuỗi dài nhất",
      "Nhật ký da",
      "Dấu hiệu thường ghi",
      "Lịch độ đều đặn routine",
      "Hoàn thành",
      "Hoàn thành một phần",
      "Đã ghi nhận chưa làm",
      "Chưa có log",
      "Xu hướng nhật ký da",
      "Sản phẩm xuất hiện trong nhật ký",
      "không kết luận nguyên nhân hoặc hiệu",
      "Gợi ý tiếp theo",
      "dựa trên trạng thái",
      "Tự quan sát cá nhân",
      "Độ đều đặn routine",
      "Tần suất dấu hiệu trong journal",
      "Ghi nhận stress",
      "Sản phẩm được nhắc trong journal",
      "Cách tính",
      "Checklist dữ liệu theo dõi",
      "Các thẻ này chỉ tóm tắt dữ liệu bạn đã tự ghi lại",
      "tư vấn chuyên môn",
    ]) {
      expect(combinedInsightsSource).toContain(expectedCopy);
    }
    expect(insightsPageSource).toContain("<InsightSummarySection");
    expect(insightsPageSource).toContain("to={dateRange.to}");
  });

  it("renders insight calculation notes and tracking quality checklist copy", () => {
    for (const expectedCopy of [
      "Cách tính",
      "Giai đoạn xem lại",
      "Dữ liệu sử dụng",
      "Cách tổng hợp",
      "Checklist dữ liệu theo dõi",
      "Routine log trong 7 ngày gần đây",
      "Journal trong 30 ngày gần đây",
      "Ghi nhận dấu hiệu trong 30 ngày gần đây",
      "Ghi nhận stress trong 30 ngày gần đây",
      "Sản phẩm được nhắc trong 30 ngày gần đây",
      "Đủ dữ liệu theo dõi",
      "Còn hạn chế",
      "Cần thêm dữ liệu",
      "Chưa thiết lập",
      "không phải đánh giá làn da",
      "tư vấn chuyên môn",
    ]) {
      expect(insightSummaryCopySource).toContain(expectedCopy);
    }

    for (const dangerousLabel of [
      "Poor",
      "Risky",
      "Danger",
      "Unhealthy",
      "Needs treatment",
      "High risk",
      "Low score",
      "Failed",
    ]) {
      expect(insightSummarySectionSource).not.toContain(dangerousLabel);
    }
  });

  it("renders safe missing-data fallback and safety note copy for personal insight review", () => {
    for (const expectedCopy of [
      "Bạn chưa có routine nào được thiết lập.",
      "Chưa có ghi chú triệu chứng gần đây.",
      "Chưa có ghi chú mức độ stress gần đây.",
      "Chưa tìm thấy sản phẩm nào được nhắc đến trong nhật ký gần đây.",
      "không thay thế tư vấn chuyên môn",
      "không xác nhận nguyên nhân",
      "không xác nhận hiệu quả, tác hại hoặc nguyên nhân từ sản phẩm",
    ]) {
      expect(insightSummaryCopySource).toContain(expectedCopy);
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
      "caused your acne",
      "this product caused",
      "you have acne because",
      "confirmed condition",
      "you should use this treatment",
      "your skin score is",
      "diagnosed with",
      "cure your",
      "this confirms acne",
      "this confirms irritation",
      "this product is harmful",
      "this product is effective",
      "stress caused",
      "routine caused",
      "skipping your routine caused",
      "improved your skin",
      "made your skin worse",
    ]) {
      expect(lowerSource).not.toContain(forbiddenCopy);
    }
  });

  it("keeps the new summary UI privacy-safe and distinct from existing insight cards", () => {
    expect(insightSummarySectionSource).toContain("getInsightSummary");
    expect(insightSummarySectionSource).toContain(
      'const safeKey = `${product.name}-${product.brand ?? "unknown"}-${index}`',
    );
    expect(insightSummarySectionSource).not.toContain("productId");
    expect(insightSummarySectionSource).not.toContain("routineId");
    expect(insightSummarySectionSource).not.toContain("journalId");
    expect(insightSummarySectionSource).not.toContain("userId");

    for (const existingInsightTitle of [
      "Tỷ lệ hoàn thành routine",
      "Lịch độ đều đặn routine",
      "Xu hướng nhật ký da",
      "Sản phẩm xuất hiện trong nhật ký",
      "Gợi ý tiếp theo",
    ]) {
      expect(insightSummarySectionSource).not.toContain(existingInsightTitle);
    }
  });
});
