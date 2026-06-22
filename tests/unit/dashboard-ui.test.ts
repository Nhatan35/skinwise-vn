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
const onboardingProgressCardPath = join(
  projectRoot,
  "src/modules/dashboard/components/onboarding-progress-card.tsx",
);
const routineCoverageSummaryCardPath = join(
  projectRoot,
  "src/modules/dashboard/components/routine-coverage-summary-card.tsx",
);
const savedProductTagsSummaryCardPath = join(
  projectRoot,
  "src/modules/dashboard/components/saved-product-tags-summary-card.tsx",
);
const savedProductDecisionQueueCardPath = join(
  projectRoot,
  "src/modules/dashboard/components/saved-product-decision-queue-card.tsx",
);
const dashboardNextActionCopyPath = join(
  projectRoot,
  "src/modules/dashboard/dashboard-next-action-copy.ts",
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
const onboardingProgressCardSource = readFileSync(
  onboardingProgressCardPath,
  "utf8",
);
const routineCoverageSummaryCardSource = readFileSync(
  routineCoverageSummaryCardPath,
  "utf8",
);
const savedProductTagsSummaryCardSource = readFileSync(
  savedProductTagsSummaryCardPath,
  "utf8",
);
const savedProductDecisionQueueCardSource = readFileSync(
  savedProductDecisionQueueCardPath,
  "utf8",
);
const componentSources = [
  "skin-profile-summary-card.tsx",
  "today-routine-progress-card.tsx",
  "routine-summary-card.tsx",
  "routine-coverage-summary-card.tsx",
  "saved-product-tags-summary-card.tsx",
  "saved-product-decision-queue-card.tsx",
  "latest-journal-card.tsx",
  "latest-analysis-card.tsx",
  "next-actions-card.tsx",
  "primary-next-action-card.tsx",
  "saved-products-summary-card.tsx",
].map((fileName) => readFileSync(join(dashboardComponentsDir, fileName), "utf8"));
const dashboardNextActionCopySource = readFileSync(
  dashboardNextActionCopyPath,
  "utf8",
);

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
    expect(dashboardOverviewSource).toContain("RoutineCoverageSummaryCard");
    expect(dashboardOverviewSource).toContain("dashboard.routineCoverage");
    expect(dashboardOverviewSource).toContain("SavedProductTagsSummaryCard");
    expect(dashboardOverviewSource).toContain("dashboard.savedProductTags");
    expect(dashboardOverviewSource).toContain("SavedProductDecisionQueueCard");
    expect(dashboardOverviewSource).toContain(
      "dashboard.savedProductDecisionQueue",
    );
    expect(dashboardOverviewSource).toContain("Đang tải dashboard chăm sóc da");
    expect(dashboardOverviewSource).toContain("Không thể tải tổng quan dashboard");
    expect(dashboardOverviewSource).toContain("Cập nhật hồ sơ da");
    expect(dashboardOverviewSource).toContain("Ghi nhận routine");
    expect(dashboardOverviewSource).toContain("routes.SKIN_PROFILE");
    expect(dashboardOverviewSource).toContain("routes.TODAY_LOG");

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

  it("derives first-session next-step guidance from onboarding steps", () => {
    expect(dashboardOverviewSource).toContain("buildOnboardingSteps");
    expect(dashboardOverviewSource).toContain("getNextIncompleteOnboardingStep");
    expect(dashboardOverviewSource).toContain("OnboardingNextStepCard");
    expect(dashboardOverviewSource).toContain(
      "action.href !== nextOnboardingStep.href",
    );
    expect(dashboardOverviewSource).not.toContain("FirstTimeDashboardGuidance");
    expect(dashboardOverviewSource).not.toContain("routes.ONBOARDING_SKIN_PROFILE");
    expect(dashboardOverviewSource).not.toContain("routes.JOURNAL");
  });

  it("reuses the browser local date helper introduced by RoutineLog UI", () => {
    const helperSource = readFileSync(dashboardClientHelperPath, "utf8");

    expect(helperSource).toContain("getBrowserLocalDate");
    expect(helperSource).toContain("date.getFullYear()");
    expect(helperSource).toContain("date.getMonth() + 1");
    expect(helperSource).toContain("date.getDate()");
    expect(helperSource).not.toContain("toISOString().slice(0, 10)");
  });

  it("renders the onboarding progress checklist from DashboardOverview", () => {
    expect(existsSync(onboardingProgressCardPath)).toBe(true);
    expect(dashboardOverviewSource).toContain("OnboardingProgressCard");
    expect(dashboardOverviewSource).toContain(
      'from "./onboarding-progress-card"',
    );
    expect(dashboardOverviewSource).toContain(
      "<OnboardingProgressCard dashboard={dashboard} />",
    );

    expect(onboardingProgressCardSource).toContain("Thiết lập SkinWise của bạn");
    expect(onboardingProgressCardSource).toContain("Bước nên làm tiếp theo");
    expect(onboardingProgressCardSource).toContain("Kết quả bạn nhận được");
    expect(onboardingProgressCardSource).toContain("Bạn đã hoàn thành các bước khởi đầu.");
    expect(onboardingProgressCardSource).toContain(
      "Tiếp tục duy trì routine, ghi nhận journal và xem lại dữ liệu cá",
    );
    expect(onboardingProgressCardSource).toContain(
      'from "@/shared/constants/routes"',
    );

    for (const routeConstant of [
      "routes.ONBOARDING_SKIN_PROFILE",
      "routes.PRODUCT_MATCH",
      "routes.ROUTINES",
      "routes.TODAY_LOG",
      "routes.JOURNAL",
    ]) {
      expect(onboardingProgressCardSource).toContain(routeConstant);
    }

    expect(onboardingProgressCardSource).not.toContain("routes.SKIN_PROFILE");

    for (const hardCodedRoute of [
      '"/onboarding/skin-profile"',
      '"/skin-profile"',
      '"/product-match"',
      '"/routines"',
      '"/routine-logs/today"',
      '"/journal"',
    ]) {
      expect(onboardingProgressCardSource).not.toContain(hardCodedRoute);
    }

    expect(onboardingProgressCardSource).toContain('role="progressbar"');
    expect(onboardingProgressCardSource).toContain("aria-valuemin");
    expect(onboardingProgressCardSource).toContain("aria-valuemax");
    expect(onboardingProgressCardSource).toContain("aria-valuenow");
  });

  it("keeps first-session dashboard copy inside the safety boundary", () => {
    const guidedDashboardCopySource = [
      dashboardOverviewSource,
      onboardingProgressCardSource,
    ]
      .join("\n")
      .toLowerCase();
    const forbiddenTerms = [
      "diagnosis",
      "diagnose",
      "treatment",
      "treat",
      "prescription",
      "skinscore",
      "skin score",
      "medical diagnosis",
      "disease",
      "chẩn đoán",
      "điều trị",
      "kê đơn",
      "bệnh da",
      "điểm da",
      "chấm điểm da",
      "chữa khỏi",
      "cam kết cải thiện",
    ];

    for (const forbiddenTerm of forbiddenTerms) {
      expect(guidedDashboardCopySource).not.toContain(forbiddenTerm);
    }
  });

  it("renders the dashboard routine coverage summary card from safe UI source", () => {
    expect(existsSync(routineCoverageSummaryCardPath)).toBe(true);
    expect(routineCoverageSummaryCardSource).toContain(
      "RoutineCoverageSummaryCard",
    );
    expect(routineCoverageSummaryCardSource).toContain(
      'testId="dashboard-routine-coverage-summary-card"',
    );
    expect(routineCoverageSummaryCardSource).toContain(
      'data-testid="dashboard-routine-coverage-next-action"',
    );
    expect(routineCoverageSummaryCardSource).toContain(
      'data-testid={`dashboard-routine-coverage-item-${item.id}`}',
    );

    for (const label of [
      "Tổng quan routine",
      "Routine đã được tạo",
      "Routine buổi sáng",
      "Routine buổi tối",
      "Chống nắng buổi sáng",
      "Dưỡng ẩm",
      "Bước nên kiểm tra tiếp theo",
      "Quản lý routine",
      "không thay thế tư vấn chuyên môn",
    ]) {
      expect(routineCoverageSummaryCardSource).toContain(label);
    }

    for (const forbiddenTerm of [
      "diagnosis",
      "treatment",
      "skinScore",
      "severityScore",
      "chẩn đoán",
      "điều trị",
      "điểm da",
    ]) {
      expect(routineCoverageSummaryCardSource).not.toContain(forbiddenTerm);
    }
  });

  it("renders the dashboard saved product tags summary card from safe UI source", () => {
    expect(existsSync(savedProductTagsSummaryCardPath)).toBe(true);
    expect(savedProductTagsSummaryCardSource).toContain(
      "SavedProductTagsSummaryCard",
    );
    expect(savedProductTagsSummaryCardSource).toContain(
      'testId="dashboard-saved-product-tags-summary-card"',
    );
    expect(savedProductTagsSummaryCardSource).toContain(
      'data-testid="dashboard-saved-product-tags-top-tags"',
    );
    expect(savedProductTagsSummaryCardSource).toContain(
      "dashboard-saved-product-tag-${toTagTestId",
    );

    for (const label of [
      "Phân loại sản phẩm đã lưu",
      "Tóm tắt này giúp bạn xem cách bạn đang tự phân loại sản phẩm đã lưu",
      "Tổng sản phẩm đã lưu",
      "Đã có tag cá nhân",
      "Chưa có tag",
      "Tag dùng nhiều",
      "Quản lý sản phẩm đã lưu",
      "Các tag này đến từ ghi chú cá nhân của bạn",
    ]) {
      expect(savedProductTagsSummaryCardSource).toContain(label);
    }

    for (const forbiddenTerm of [
      "diagnosis",
      "treatment",
      "skinScore",
      "severityScore",
      "chẩn đoán",
      "điều trị",
      "điểm da",
    ]) {
      expect(savedProductTagsSummaryCardSource).not.toContain(forbiddenTerm);
    }
  });

  it("renders the dashboard saved product decision queue card from safe UI source", () => {
    expect(existsSync(savedProductDecisionQueueCardPath)).toBe(true);
    expect(savedProductDecisionQueueCardSource).toContain(
      "SavedProductDecisionQueueCard",
    );
    expect(savedProductDecisionQueueCardSource).toContain(
      'testId="dashboard-saved-product-decision-queue-card"',
    );
    expect(savedProductDecisionQueueCardSource).toContain(
      'data-testid="dashboard-saved-product-decision-breakdown"',
    );
    expect(savedProductDecisionQueueCardSource).toContain(
      'data-testid="dashboard-saved-product-missing-routine-slot"',
    );
    expect(savedProductDecisionQueueCardSource).toContain(
      'data-testid="dashboard-saved-product-missing-personal-note"',
    );
    expect(savedProductDecisionQueueCardSource).toContain(
      "savedProductDecisionQueue.totalSavedProducts === 0",
    );
    expect(savedProductDecisionQueueCardSource).toContain(
      "savedProductDecisionQueue.reviewNeededCount === 0",
    );
    expect(savedProductDecisionQueueCardSource).toContain(
      "savedProductDecisionQueue.reviewNeededCount > 0",
    );
    expect(savedProductDecisionQueueCardSource).toContain(
      "savedProductDecisionQueue.nextAction.href",
    );
    expect(savedProductDecisionQueueCardSource).toContain(
      "savedProductDecisionQueue.nextAction.label",
    );

    for (const label of [
      "Hàng chờ xem lại sản phẩm",
      "Tóm tắt này giúp bạn biết sản phẩm nào vẫn cần xem lại trước khi đưa vào routine.",
      "Bạn chưa lưu sản phẩm nào. Khi lưu sản phẩm, dashboard sẽ giúp bạn xem sản phẩm nào cần cân nhắc tiếp.",
      "Các sản phẩm đã lưu hiện đã có đủ trạng thái, kế hoạch routine và ghi chú cá nhân.",
      "Tổng sản phẩm đã lưu",
      "Cần xem lại",
      "Trạng thái quyết định cá nhân",
      "Đang cân nhắc",
      "Đang dùng thử",
      "Tạm dừng",
      "Muốn giữ lại",
      "Chưa chọn trạng thái",
      "Thiếu kế hoạch routine",
      "Thiếu ghi chú cá nhân",
      "Bước tiếp theo",
      "Đây là công cụ tổ chức cá nhân, không phải khuyến nghị điều trị hoặc",
      "đảm bảo sản phẩm phù hợp với da.",
    ]) {
      expect(savedProductDecisionQueueCardSource).toContain(label);
    }

    for (const forbiddenTerm of [
      "diagnosis",
      "skinScore",
      "severityScore",
      "chẩn đoán",
      "điểm da",
    ]) {
      expect(savedProductDecisionQueueCardSource).not.toContain(forbiddenTerm);
    }
  });

  it("renders the required non-placeholder dashboard card labels", () => {
    const combinedComponentSource = [
      ...componentSources,
      dashboardNextActionCopySource,
    ].join("\n");

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
      "Chuỗi",
      "Nhật ký gần đây",
      "14 ngày gần đây",
      "Xu hướng dấu hiệu",
      "Ngày ghi nhận",
      "Quan sát",
      "Dấu hiệu đã ghi nhận",
      "Mức stress",
      "Ghi chú",
      "Sản phẩm đã dùng",
      "Thêm nhật ký hôm nay",
      "Xem nhật ký",
      "Gợi ý tiếp theo",
      "Vì sao SkinWise gợi ý bước này",
      "Lý do:",
      "Xem insights cá nhân",
      "Dashboard và Insights phản ánh thói quen hiện tại",
    ]) {
      expect(combinedComponentSource).toContain(label);
    }

    expect(combinedComponentSource).not.toContain("Sẽ được kết nối");
    expect(combinedComponentSource).not.toContain("Chưa implement trong Task 6");
    expect(combinedComponentSource).not.toContain("both");
    expect(combinedComponentSource).not.toContain("imageUrl");
    expect(combinedComponentSource).not.toContain("skinScore");
    expect(combinedComponentSource).not.toContain("diagnosis");
    expect(combinedComponentSource).not.toContain("Chẩn đoán");
    expect(combinedComponentSource).not.toContain("Điều trị");
    expect(combinedComponentSource).not.toContain("skinFeeling");
    expect(combinedComponentSource).not.toContain("severityScore");
  });
});
