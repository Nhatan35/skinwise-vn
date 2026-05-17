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

const routineBuilderSource = readFileSync(routineBuilderPath, "utf8");
const routineLogControlsSource = readFileSync(routineLogControlsPath, "utf8");
const routineLogStatusBadgeSource = readFileSync(
  routineLogStatusBadgePath,
  "utf8",
);
const routineLogClientSource = readFileSync(routineLogClientPath, "utf8");
const combinedSource = `${routineBuilderSource}\n${routineLogControlsSource}\n${routineLogStatusBadgeSource}\n${routineLogClientSource}`;

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
