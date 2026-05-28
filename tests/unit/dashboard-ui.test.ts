import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const dashboardPagePath = join(
  projectRoot,
  "src/app/(dashboard)/dashboard/page.tsx",
);
const mistakenDashboardPagePath = join(projectRoot, "src/app/dashboard/page.tsx");
const dashboardOverviewPath = join(
  projectRoot,
  "src/modules/dashboard/components/dashboard-overview.tsx",
);
const dashboardClientHelperPath = join(
  projectRoot,
  "src/modules/routine-logs/routine-log.client.ts",
);
const dashboardComponentsDir = join(
  projectRoot,
  "src/modules/dashboard/components",
);

const dashboardPageSource = readFileSync(dashboardPagePath, "utf8");
const dashboardOverviewSource = readFileSync(dashboardOverviewPath, "utf8");
const componentSources = [
  "skin-profile-summary-card.tsx",
  "today-routine-progress-card.tsx",
  "routine-summary-card.tsx",
  "latest-journal-card.tsx",
  "latest-analysis-card.tsx",
  "next-actions-card.tsx",
  "primary-next-action-card.tsx",
  "saved-products-summary-card.tsx",
].map((fileName) => readFileSync(join(dashboardComponentsDir, fileName), "utf8"));

describe("Dashboard DB-001 UI integration", () => {
  it("uses the existing protected dashboard route and renders DashboardOverview", () => {
    expect(existsSync(dashboardPagePath)).toBe(true);
    expect(existsSync(mistakenDashboardPagePath)).toBe(false);
    expect(dashboardPageSource).toContain(
      "@/modules/dashboard/components/dashboard-overview",
    );
    expect(dashboardPageSource).toContain("<DashboardOverview />");
    expect(dashboardPageSource).toContain("SkinWise overview");
    expect(dashboardPageSource).not.toContain("dashboardPlaceholderCards");
    expect(dashboardPageSource).not.toContain("Protected dashboard shell");
  });

  it("keeps the dashboard overview client-safe and calls the Dashboard API", () => {
    expect(dashboardOverviewSource.startsWith('"use client";')).toBe(true);
    expect(dashboardOverviewSource).toContain(
      'const DASHBOARD_API_PATH = "/api/dashboard"',
    );
    expect(dashboardOverviewSource).toContain("?localDate=");
    expect(dashboardOverviewSource).toContain("body.data.dashboard");
    expect(dashboardOverviewSource).toContain("getBrowserLocalDate");
    expect(dashboardOverviewSource).toContain("LatestJournalCard");
    expect(dashboardOverviewSource).toContain("dashboard.latestJournal");
    expect(dashboardOverviewSource).toContain("Đang tải dashboard");
    expect(dashboardOverviewSource).toContain("Không thể tải dashboard");

    for (const forbiddenImport of [
      "repository",
      "use-case",
      "@/infrastructure/database",
      "mongodb",
      "server-only",
      "getCurrentUser",
      "@/modules/auth",
    ]) {
      expect(dashboardOverviewSource).not.toContain(forbiddenImport);
    }
  });

  it("reuses the browser local date helper introduced by RoutineLog UI", () => {
    const helperSource = readFileSync(dashboardClientHelperPath, "utf8");

    expect(helperSource).toContain("getBrowserLocalDate");
    expect(helperSource).toContain("date.getFullYear()");
    expect(helperSource).toContain("date.getMonth() + 1");
    expect(helperSource).toContain("date.getDate()");
    expect(helperSource).not.toContain("toISOString().slice(0, 10)");
  });

  it("renders the required non-placeholder dashboard card labels", () => {
    const combinedComponentSource = componentSources.join("\n");

    for (const label of [
      "Hồ sơ da",
      "Loại da",
      "Vấn đề chính",
      "Mức độ nhạy cảm",
      "Tiến độ hôm nay",
      "Hoàn thành",
      "Một phần",
      "Bỏ qua",
      "Chưa ghi nhận",
      "Routine của bạn",
      "Tổng số routine",
      "Buổi sáng",
      "Buổi tối",
      "Phân tích an toàn gần nhất",
      "Mức rủi ro",
      "Cảnh báo",
      "Mức độ hoàn thiện",
      "Sản phẩm đã lưu",
      "Routine 7 ngày",
      "Đang xây dựng thói quen",
      "Nhật ký gần đây",
      "Ngày ghi nhận",
      "Quan sát",
      "Dấu hiệu đã ghi nhận",
      "Mức stress",
      "Ghi chú",
      "Sản phẩm đã dùng",
      "Thêm nhật ký hôm nay",
      "Xem nhật ký",
      "Gợi ý tiếp theo",
    ]) {
      expect(combinedComponentSource).toContain(label);
    }

    expect(combinedComponentSource).not.toContain("Sẽ được kết nối");
    expect(combinedComponentSource).not.toContain("Chưa implement trong Task 6");
    expect(combinedComponentSource).not.toContain("both");
    expect(combinedComponentSource).not.toContain("imageUrl");
    expect(combinedComponentSource).not.toContain("skinScore");
    expect(combinedComponentSource).not.toContain("diagnosis");
    expect(combinedComponentSource).not.toContain("skinFeeling");
    expect(combinedComponentSource).not.toContain("severityScore");
  });
});
