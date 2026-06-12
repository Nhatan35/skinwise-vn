import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const routineBuilderPath = join(
  projectRoot,
  "src/modules/routines/components/routine-builder.tsx",
);
const routineLogControlsPath = join(
  projectRoot,
  "src/modules/routines/components/routine-log-controls.tsx",
);
const routineLogStatusBadgePath = join(
  projectRoot,
  "src/modules/routines/components/routine-log-status-badge.tsx",
);
const routineLogClientPath = join(
  projectRoot,
  "src/modules/routine-logs/routine-log.client.ts",
);
const routineWeeklyReviewPath = join(
  projectRoot,
  "src/modules/routine-logs/routine-weekly-review.ts",
);
const routineWeeklyReviewCardPath = join(
  projectRoot,
  "src/modules/routine-logs/components/routine-weekly-review-card.tsx",
);
const todayRoutineChecklistPath = join(
  projectRoot,
  "src/modules/routine-logs/components/today-routine-checklist.tsx",
);
const todayJournalPromptCardPath = join(
  projectRoot,
  "src/modules/routine-logs/components/today-journal-prompt-card.tsx",
);
const todayJournalPromptPath = join(
  projectRoot,
  "src/modules/routine-logs/today-journal-prompt.ts",
);
const todayRoutineLogPagePath = join(
  projectRoot,
  "src/app/(dashboard)/routine-logs/today/page.tsx",
);
const mistakenSkinJournalModulePath = join(projectRoot, "src/modules/skin-journal");

const routineBuilderSource = readFileSync(routineBuilderPath, "utf8");
const routineLogControlsSource = readFileSync(routineLogControlsPath, "utf8");
const routineLogStatusBadgeSource = readFileSync(
  routineLogStatusBadgePath,
  "utf8",
);
const routineLogClientSource = readFileSync(routineLogClientPath, "utf8");
const routineWeeklyReviewSource = readFileSync(routineWeeklyReviewPath, "utf8");
const routineWeeklyReviewCardSource = readFileSync(
  routineWeeklyReviewCardPath,
  "utf8",
);
const todayRoutineChecklistSource = readFileSync(
  todayRoutineChecklistPath,
  "utf8",
);
const todayJournalPromptCardSource = readFileSync(
  todayJournalPromptCardPath,
  "utf8",
);
const todayJournalPromptSource = readFileSync(todayJournalPromptPath, "utf8");
const todayRoutineLogPageSource = readFileSync(todayRoutineLogPagePath, "utf8");
const combinedSource = `${routineBuilderSource}\n${routineLogControlsSource}\n${routineLogStatusBadgeSource}\n${routineLogClientSource}\n${routineWeeklyReviewSource}\n${routineWeeklyReviewCardSource}\n${todayRoutineChecklistSource}\n${todayJournalPromptCardSource}\n${todayJournalPromptSource}`;

describe("RoutineLog UI integration", () => {
  it("adds focused RoutineLog UI components and client helpers", () => {
    expect(existsSync(routineLogControlsPath)).toBe(true);
    expect(existsSync(routineLogStatusBadgePath)).toBe(true);
    expect(existsSync(routineLogClientPath)).toBe(true);
    expect(existsSync(routineWeeklyReviewPath)).toBe(true);
    expect(existsSync(routineWeeklyReviewCardPath)).toBe(true);
    expect(existsSync(todayJournalPromptCardPath)).toBe(true);
    expect(existsSync(todayJournalPromptPath)).toBe(true);
    expect(routineBuilderSource).toContain("<RoutineLogControls");
    expect(routineBuilderSource).toContain("<RoutineLogStatusBadge");
  });

  it("loads today's routine logs through the finalized GET response shape", () => {
    expect(routineBuilderSource).toContain(
      'const ROUTINE_LOGS_API_PATH = "/api/routine-logs"',
    );
    expect(routineBuilderSource).toContain("getRoutineLogsEndpoint");
    expect(routineBuilderSource).toContain("body.data.routineLogs");
    expect(routineBuilderSource).toContain("groupRoutineLogsByRoutineId");
    expect(routineBuilderSource).not.toContain("body.data.logs");
  });

  it("uses browser local date parts instead of UTC ISO slicing", () => {
    expect(routineLogClientSource).toContain("date.getFullYear()");
    expect(routineLogClientSource).toContain("date.getMonth() + 1");
    expect(routineLogClientSource).toContain("date.getDate()");
    expect(routineLogClientSource).not.toContain("toISOString().slice");
    expect(routineLogClientSource).not.toContain("Date.UTC");
  });

  it("derives timezone and includes it in every RoutineLog payload builder", () => {
    expect(routineLogClientSource).toContain(
      "Intl.DateTimeFormat().resolvedOptions().timeZone",
    );
    expect(routineLogClientSource).toContain('|| "UTC"');
    expect(routineLogClientSource).toContain("timezone,");
    expect(routineBuilderSource).toContain("getBrowserTimezone");
  });

  it("supports completed, partial, skipped, and not-logged Vietnamese labels", () => {
    for (const label of ["Chưa ghi nhận", "Hoàn thành", "Một phần", "Bỏ qua"]) {
      expect(combinedSource).toContain(label);
    }
  });

  it("sends PUT requests to the existing RoutineLog API and reads data.routineLog", () => {
    expect(routineLogControlsSource).toContain(
      'const ROUTINE_LOGS_API_PATH = "/api/routine-logs"',
    );
    expect(routineLogControlsSource).toContain('method: "PUT"');
    expect(routineLogControlsSource).toContain("body.data.routineLog");
    expect(routineLogControlsSource).not.toContain("body.routineLog");
  });

  it("builds safe client payload helpers without adding server-owned fields", () => {
    for (const allowedField of [
      "routineId",
      "localDate",
      "timezone",
      "status",
      "completedStepIds",
    ]) {
      expect(routineLogClientSource).toContain(allowedField);
    }

    expect(routineLogClientSource).toContain("buildCompletedRoutineLogPayload");
    expect(routineLogClientSource).toContain("buildPartialRoutineLogPayload");
    expect(routineLogClientSource).toContain("buildSkippedRoutineLogPayload");
    expect(routineLogClientSource).not.toContain("userId,");
    expect(routineLogClientSource).not.toContain("_id:");
  });

  it("handles partial validation before calling the API", () => {
    expect(routineLogClientSource).toContain(
      "Routine cần ít nhất 2 bước để ghi nhận một phần.",
    );
    expect(routineLogClientSource).toContain(
      "Vui lòng chọn ít nhất một bước đã hoàn thành.",
    );
    expect(routineLogClientSource).toContain(
      "Nếu đã hoàn thành tất cả các bước, hãy chọn Hoàn thành.",
    );
    expect(routineLogControlsSource).toContain('type="checkbox"');
    expect(routineLogControlsSource).toContain("selectedStepIds");
  });


  it("adds the dedicated Today Routine Checklist route and reuses existing RoutineLog UI flow", () => {
    expect(existsSync(todayRoutineLogPagePath)).toBe(true);
    expect(existsSync(todayRoutineChecklistPath)).toBe(true);
    expect(todayRoutineLogPageSource).toContain(
      "@/modules/routine-logs/components/today-routine-checklist",
    );
    expect(todayRoutineLogPageSource).toContain("<TodayRoutineChecklist />");
    expect(todayRoutineLogPageSource).toContain("routes.TODAY_LOG");
    expect(todayRoutineLogPageSource).toContain("data-route={routes.TODAY_LOG}");
    expect(todayRoutineChecklistSource.startsWith('"use client";')).toBe(true);
    expect(todayRoutineChecklistSource).toContain(
      'const ROUTINES_API_PATH = "/api/routines"',
    );
    expect(todayRoutineChecklistSource).toContain(
      'const ROUTINE_LOGS_API_PATH = "/api/routine-logs"',
    );
    expect(todayRoutineChecklistSource).toContain("fetch(ROUTINES_API_PATH");
    expect(todayRoutineChecklistSource).toContain("listRoutineLogsForDate");
    expect(todayRoutineChecklistSource).toContain("listRoutineLogsForDateRange");
    expect(todayRoutineChecklistSource).toContain("getBrowserLocalDate");
    expect(todayRoutineChecklistSource).toContain("getBrowserTimezone");
    expect(todayRoutineChecklistSource).toContain("groupRoutineLogsByRoutineId");
    expect(todayRoutineChecklistSource).toContain("<RoutineLogControls");
    expect(todayRoutineChecklistSource).toContain("<RoutineLogStatusBadge");
    expect(todayRoutineChecklistSource).toContain("handleLogSaved");
    expect(todayRoutineChecklistSource).toContain("setWeeklyRoutineLogs");
    expect(todayRoutineChecklistSource).toContain("buildRoutineWeeklyReview");
    expect(todayRoutineChecklistSource).toContain("<RoutineWeeklyReviewCard");
    expect(todayRoutineChecklistSource).toContain("Routine buổi sáng");
    expect(todayRoutineChecklistSource).toContain("Routine buổi tối");
  });

  it("renders the weekly routine review card with safe habit-tracking copy", () => {
    for (const requiredCopy of [
      "L\u1ecbch s\u1eed routine 7 ng\u00e0y g\u1ea7n \u0111\u00e2y",
      "Th\u00f4ng tin n\u00e0y gi\u00fap b\u1ea1n theo d\u00f5i th\u00f3i quen ch\u0103m s\u00f3c da",
      "kh\u00f4ng \u0111\u00e1nh gi\u00e1",
      "t\u00ecnh tr\u1ea1ng da ho\u1eb7c thay th\u1ebf t\u01b0 v\u1ea5n chuy\u00ean m\u00f4n",
      "Kh\u00f4ng c\u1ea7n k\u1ebft lu\u1eadn qu\u00e1",
      "S\u1ed1 ng\u00e0y \u0111\u00e3 ghi nh\u1eadn",
      "T\u1ec9 l\u1ec7 ho\u00e0n th\u00e0nh routine",
      "Ch\u01b0a c\u00f3 d\u1eef li\u1ec7u routine trong 7 ng\u00e0y g\u1ea7n \u0111\u00e2y.",
      "B\u1eaft \u0111\u1ea7u ghi nh\u1eadn routine h\u00f4m nay \u0111\u1ec3 xem l\u1ecbch s\u1eed duy tr\u00ec th\u00f3i quen.",
      "Ho\u00e0n th\u00e0nh",
      "M\u1ed9t ph\u1ea7n",
      "\u0110\u00e3 b\u1ecf qua",
      "Ch\u01b0a ghi nh\u1eadn",
    ]) {
      expect(routineWeeklyReviewCardSource).toContain(requiredCopy);
    }

    for (const testId of [
      'data-testid="routine-weekly-review-card"',
      'data-testid="routine-weekly-review-day"',
      'data-testid="routine-weekly-review-empty-state"',
      'data-testid="routine-weekly-review-disclaimer"',
    ]) {
      expect(routineWeeklyReviewCardSource).toContain(testId);
    }
  });

  it("keeps weekly review language away from overclaiming patterns", () => {
    const unsafePatterns = [
      new RegExp(["skin", "score"].join("\\s+"), "i"),
      new RegExp(["health", "score"].join("\\s+"), "i"),
      new RegExp(["treatment", "result"].join("\\s+"), "i"),
      new RegExp(["medical", "recommend"].join("\\s+"), "i"),
      new RegExp(["ai", "recommend"].join("\\s+"), "i"),
      /diagnos/i,
      /guarante/i,
      new RegExp(["treat", "acne"].join("s?\\s+"), "i"),
      new RegExp(`\\b${["cu", "re"].join("")}s?\\b`, "i"),
      /improv/i,
      /getting\s+worse/i,
    ];

    for (const unsafePattern of unsafePatterns) {
      expect(routineWeeklyReviewCardSource).not.toMatch(unsafePattern);
    }
  });

  it("renders Today Checklist metadata, progress summary, empty state, and CTAs", () => {
    for (const requiredCopy of [
      "Chưa có routine nào",
      "Không thể tải checklist routine hôm nay",
      "Hãy tạo routine buổi sáng hoặc buổi tối trước khi theo dõi tiến độ hằng ngày.",
      "Tạo routine",
      "Thử lại",
      "Xem routine",
      "Đã ghi nhận tất cả routine hôm nay",
      "Bạn có thể quay lại dashboard để xem tiến độ hôm nay.",
      "Xem dashboard",
      "Ngày hôm nay",
      "Múi giờ",
      "Tổng routine",
      "Hoàn thành",
      "Một phần",
      "Bỏ qua",
      "Chưa ghi nhận",
    ]) {
      expect(todayRoutineChecklistSource).toContain(requiredCopy);
    }

    expect(todayRoutineChecklistSource).toContain("routes.ROUTINES");
    expect(todayRoutineChecklistSource).toContain("routes.DASHBOARD");
    expect(todayRoutineChecklistSource).toContain("reloadKey");
    expect(todayRoutineChecklistSource).not.toContain("routine-log.repository");
    expect(todayRoutineChecklistSource).not.toContain("routine-log.use-case");
    expect(todayRoutineChecklistSource).not.toContain("mongodb");
    expect(todayRoutineChecklistSource).not.toContain("server-only");
  });

  it("explains routine logging and after-log next actions", () => {
    for (const requiredCopy of [
      "Ghi nhận routine hôm nay",
      "Chọn trạng thái sau khi dùng routine để theo dõi thói quen đều đặn",
      "cảm nhận da đáng chú ý",
      "Viết nhật ký",
      "Xem insights",
      "routes.JOURNAL",
      "routes.INSIGHTS",
    ]) {
      expect(routineLogControlsSource).toContain(requiredCopy);
    }
  });

  it("shows action-specific pending state and blocks overlapping log updates", () => {
    expect(routineLogControlsSource).toContain(
      'type RoutineLogPendingAction = "completed" | "partial" | "skipped" | null',
    );
    expect(routineLogControlsSource).toContain("pendingActionRef");
    expect(routineLogControlsSource).toContain("pendingAction !== null");
    expect(routineLogControlsSource).toContain("aria-busy={isSaving}");
    expect(routineLogControlsSource).toContain(
      'pendingAction === "completed" ? "Đang ghi nhận..." : "Hoàn thành"',
    );
    expect(routineLogControlsSource).toContain(
      'pendingAction === "partial" ? "Đang ghi nhận..." : "Một phần"',
    );
    expect(routineLogControlsSource).toContain(
      'pendingAction === "skipped" ? "Đang ghi nhận..." : "Bỏ qua"',
    );
    expect(routineLogControlsSource).toContain("Đã lưu ghi nhận hôm nay.");
    expect(routineLogControlsSource).toContain(
      "Chưa thể cập nhật trạng thái hôm nay. Vui lòng thử lại.",
    );
  });

  it("connects Today Routine Log to Journal after a routine log exists", () => {
    expect(todayRoutineChecklistSource).toContain(
      "@/modules/routine-logs/components/today-journal-prompt-card",
    );
    expect(todayRoutineChecklistSource).toContain(
      "@/modules/routine-logs/today-journal-prompt",
    );
    expect(todayRoutineChecklistSource).toContain(
      "@/modules/journals/skin-journal.client",
    );
    expect(todayRoutineChecklistSource).toContain("listSkinJournals");
    expect(todayRoutineChecklistSource).toContain("hasRoutineLogToday");
    expect(todayRoutineChecklistSource).toContain("summaryCounts.completed");
    expect(todayRoutineChecklistSource).toContain("summaryCounts.partial");
    expect(todayRoutineChecklistSource).toContain("summaryCounts.skipped");
    expect(todayRoutineChecklistSource).toContain("from: localDate");
    expect(todayRoutineChecklistSource).toContain("to: localDate");
    expect(todayRoutineChecklistSource).toContain("limit: 1");
    expect(todayRoutineChecklistSource).toContain("<TodayJournalPromptCard");
    expect(todayRoutineChecklistSource).toContain("routes.JOURNAL");
    expect(todayRoutineChecklistSource).not.toContain('"/journal"');
  });

  it("renders safe Journal prompt copy and CTA states", () => {
    for (const requiredCopy of [
      "Bạn đã ghi nhận routine hôm nay",
      "Viết nhật ký da hôm nay",
      "Bạn đã ghi nhật ký da hôm nay",
      "Đi đến Journal",
      "ghi lại cảm nhận của da",
      "Không cần kết luận quá sớm",
      "tư vấn chuyên môn",
    ]) {
      expect(todayJournalPromptCardSource).toContain(requiredCopy);
    }

    expect(todayJournalPromptCardSource).toContain('state === "hidden"');
    expect(todayJournalPromptCardSource).toContain("journalHref");
    expect(todayJournalPromptCardSource).not.toContain('"/journal"');
  });

  it("keeps the Today Journal prompt client-safe and scoped to existing modules", () => {
    expect(existsSync(mistakenSkinJournalModulePath)).toBe(false);

    for (const forbiddenSource of [
      "@/modules/skin-journal",
      "routine-log.repository",
      "routine-log.use-case",
      "skin-journal.repository",
      "create-skin-journal.use-case",
      "list-skin-journal.use-case",
      "@/infrastructure/database",
      "mongodb",
      "server-only",
      "getCurrentUser",
      "@/modules/auth",
      "da bạn chắc chắn sẽ tốt hơn",
      "routine này chữa mụn",
      "journal sẽ chẩn đoán vấn đề da",
      "đảm bảo tìm ra nguyên nhân kích ứng",
      "da bạn sẽ hết mụn",
      "chữa khỏi",
      "đảm bảo hiệu quả",
      "routine chắc chắn phù hợp",
    ]) {
      expect(combinedSource).not.toContain(forbiddenSource);
    }
  });

  it("lets users delete an existing Today RoutineLog without breaking save controls", () => {
    expect(todayRoutineChecklistSource).toContain("getRoutineLogDeleteEndpoint");
    expect(todayRoutineChecklistSource).toContain('method: "DELETE"');
    expect(todayRoutineChecklistSource).toContain("Xóa ghi nhận");
    expect(todayRoutineChecklistSource).toContain(
      "Bạn có chắc muốn xóa ghi nhận routine này cho hôm nay?",
    );
    expect(todayRoutineChecklistSource).toContain("Đã xóa ghi nhận routine.");
    expect(todayRoutineChecklistSource).toContain(
      "Không thể xóa ghi nhận lúc này. Vui lòng thử lại.",
    );
    expect(todayRoutineChecklistSource).toContain("delete nextLogsByRoutineId");
    expect(todayRoutineChecklistSource).toContain("<RoutineLogControls");
  });

  it("keeps RoutineLog client UI free from server-only imports", () => {
    for (const forbiddenImport of [
      "routine-log.repository",
      "routine-log.use-case",
      "routine.repository",
      "routine.use-case",
      "@/infrastructure/database",
      "mongodb",
      "server-only",
      "getCurrentUser",
      "@/modules/auth",
    ]) {
      expect(combinedSource).not.toContain(forbiddenImport);
    }
  });
});
