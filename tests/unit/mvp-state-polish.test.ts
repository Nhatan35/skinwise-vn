import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const rootNotFoundPath = join(projectRoot, "src/app/not-found.tsx");
const rootErrorPath = join(projectRoot, "src/app/error.tsx");
const dashboardLoadingPath = join(
  projectRoot,
  "src/app/(dashboard)/loading.tsx",
);
const dashboardErrorPath = join(
  projectRoot,
  "src/app/(dashboard)/error.tsx",
);

const rootNotFoundSource = readFileSync(rootNotFoundPath, "utf8");
const rootErrorSource = readFileSync(rootErrorPath, "utf8");
const dashboardLoadingSource = readFileSync(dashboardLoadingPath, "utf8");
const dashboardErrorSource = readFileSync(dashboardErrorPath, "utf8");

describe("MVP route-level UI states", () => {
  it("adds visible loading and safe error boundaries", () => {
    expect(existsSync(rootErrorPath)).toBe(true);
    expect(existsSync(dashboardLoadingPath)).toBe(true);
    expect(existsSync(dashboardErrorPath)).toBe(true);

    expect(dashboardLoadingSource).toContain("LoadingState");
    expect(dashboardLoadingSource).toContain("Đang tải trang SkinWise");

    for (const source of [rootErrorSource, dashboardErrorSource]) {
      expect(source.startsWith('"use client";')).toBe(true);
      expect(source).toContain("ErrorState");
      expect(source).toContain("reset");
      expect(source).toContain("Thử tải lại");
      expect(source).not.toContain("error.message");
      expect(source).not.toContain("error.stack");
    }
  });

  it("adds a helpful route not-found state with safe navigation", () => {
    expect(existsSync(rootNotFoundPath)).toBe(true);
    expect(rootNotFoundSource).toContain("EmptyState");
    expect(rootNotFoundSource).toContain("Không tìm thấy trang");
    expect(rootNotFoundSource).toContain("routes.HOME");
    expect(rootNotFoundSource).toContain("routes.DASHBOARD");
    expect(rootNotFoundSource).toContain("Về trang chủ");
    expect(rootNotFoundSource).toContain("Mở dashboard");
  });
});
