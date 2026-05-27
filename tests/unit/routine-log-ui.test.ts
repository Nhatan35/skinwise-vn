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
const todayRoutineChecklistPath = join(
  projectRoot,
  "src/modules/routine-logs/components/today-routine-checklist.tsx",
);
const todayRoutineLogPagePath = join(
  projectRoot,
  "src/app/(dashboard)/routine-logs/today/page.tsx",
);

const routineBuilderSource = readFileSync(routineBuilderPath, "utf8");
const routineLogControlsSource = readFileSync(routineLogControlsPath, "utf8");
const routineLogStatusBadgeSource = readFileSync(
  routineLogStatusBadgePath,
  "utf8",
);
const routineLogClientSource = readFileSync(routineLogClientPath, "utf8");
const todayRoutineChecklistSource = readFileSync(
  todayRoutineChecklistPath,
  "utf8",
);
const todayRoutineLogPageSource = readFileSync(todayRoutineLogPagePath, "utf8");
const combinedSource = `${routineBuilderSource}\n${routineLogControlsSource}\n${routineLogStatusBadgeSource}\n${routineLogClientSource}\n${todayRoutineChecklistSource}`;

describe("RoutineLog UI integration", () => {
  it("adds focused RoutineLog UI components and client helpers", () => {
    expect(existsSync(routineLogControlsPath)).toBe(true);
    expect(existsSync(routineLogStatusBadgePath)).toBe(true);
    expect(existsSync(routineLogClientPath)).toBe(true);
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

  it("builds safe client payloads without server-owned fields", () => {
    for (const allowedField of [
      "routineId",
      "localDate",
      "timezone",
      "status",
      "completedStepIds",
    ]) {
      expect(routineLogClientSource).toContain(allowedField);
    }

    for (const forbiddenField of [
      /\buserId\b/,
      /\bid:\s/,
      /\b_id\b/,
      /\bcreatedAt\b/,
      /\bupdatedAt\b/,
    ]) {
      expect(routineLogClientSource).not.toMatch(forbiddenField);
    }
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
    expect(todayRoutineChecklistSource).toContain("fetch(getRoutineLogsEndpoint");
    expect(todayRoutineChecklistSource).toContain("getBrowserLocalDate");
    expect(todayRoutineChecklistSource).toContain("getBrowserTimezone");
    expect(todayRoutineChecklistSource).toContain("groupRoutineLogsByRoutineId");
    expect(todayRoutineChecklistSource).toContain("<RoutineLogControls");
    expect(todayRoutineChecklistSource).toContain("<RoutineLogStatusBadge");
    expect(todayRoutineChecklistSource).toContain("handleLogSaved");
    expect(todayRoutineChecklistSource).toContain("Routine buổi sáng");
    expect(todayRoutineChecklistSource).toContain("Routine buổi tối");
  });

  it("renders Today Checklist metadata, progress summary, empty state, and CTAs", () => {
    for (const requiredCopy of [
      "Bạn chưa có routine nào để ghi nhận hôm nay.",
      "Hãy tạo morning/evening routine trước khi theo dõi tiến độ hằng ngày.",
      "Đi tới Routine Builder",
      "Bạn đã ghi nhận tất cả routine hôm nay.",
      "Có thể quay lại Dashboard để xem tiến độ.",
      "Xem Dashboard",
      "Local date",
      "Timezone",
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
    expect(todayRoutineChecklistSource).not.toContain("routine-log.repository");
    expect(todayRoutineChecklistSource).not.toContain("routine-log.use-case");
    expect(todayRoutineChecklistSource).not.toContain("mongodb");
    expect(todayRoutineChecklistSource).not.toContain("server-only");
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
