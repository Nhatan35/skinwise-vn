import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { dashboardNavItems } from "@/modules/dashboard/dashboard-shell.config";
import { routes } from "@/shared/constants/routes";

const projectRoot = process.cwd();
const routinesPagePath = join(
  projectRoot,
  "src/app/(dashboard)/routines/page.tsx",
);
const routineBuilderPath = join(
  projectRoot,
  "src/modules/routines/components/routine-builder.tsx",
);
const proxyPath = join(projectRoot, "src/proxy.ts");

const routinesPageSource = readFileSync(routinesPagePath, "utf8");
const routineBuilderSource = readFileSync(routineBuilderPath, "utf8");
const proxySource = readFileSync(proxyPath, "utf8");

function getPayloadSource() {
  const match = routineBuilderSource.match(
    /const routinePayload = \{[\s\S]*?\n  \};/,
  );

  return match?.[0] ?? "";
}

describe("Routine Builder UI foundation", () => {
  it("adds the protected /routines page and renders the module client component", () => {
    expect(existsSync(routinesPagePath)).toBe(true);
    expect(routes.ROUTINES).toBe("/routines");
    expect(routinesPageSource).toContain(
      "@/modules/routines/components/routine-builder",
    );
    expect(routinesPageSource).toContain("<RoutineBuilder />");
    expect(routinesPageSource).toContain("routes.ROUTINES");
  });

  it("keeps the Routine Builder as a client component without server-only imports", () => {
    expect(routineBuilderSource.startsWith('"use client";')).toBe(true);

    for (const forbiddenImport of [
      "routine.repository",
      "routine.use-case",
      "@/infrastructure/database",
      "mongodb",
      "server-only",
      "getCurrentUser",
      "@/modules/auth",
    ]) {
      expect(routineBuilderSource).not.toContain(forbiddenImport);
    }
  });

  it("calls the existing Routine API with GET, POST, PATCH, and DELETE", () => {
    expect(routineBuilderSource).toContain(
      'const ROUTINES_API_PATH = "/api/routines"',
    );
    expect(routineBuilderSource).toContain("fetch(ROUTINES_API_PATH");
    expect(routineBuilderSource).toContain('method: "GET"');
    expect(routineBuilderSource).toContain('"POST"');
    expect(routineBuilderSource).toContain('"PATCH"');
    expect(routineBuilderSource).toContain("fetch(endpoint");
    expect(routineBuilderSource).toContain(
      "fetch(`${ROUTINES_API_PATH}/${routine.id}`",
    );
    expect(routineBuilderSource).toContain('method: "DELETE"');
  });

  it("includes loading, empty, list, create, edit, error, saving, deleting, and success states", () => {
    for (const stateCopy of [
      "Đang tải routines",
      "Chưa có routine nào",
      "Danh sách routines",
      "Tạo routine",
      "Chỉnh sửa routine",
      "Một vài thông tin chưa hợp lệ",
      "Hiện chưa thể xử lý routine",
      "Đang lưu...",
      "Đang xóa...",
      "Đã tạo routine.",
      "Đã lưu routine.",
      "Đã xóa routine.",
    ]) {
      expect(routineBuilderSource).toContain(stateCopy);
    }
  });

  it("builds a safe payload with only allowed custom routine fields", () => {
    const payloadSource = getPayloadSource();

    for (const allowedField of [
      "name",
      "timeOfDay",
      "steps",
      "customProductName",
      "category",
      "order",
      "frequency",
      "instructions",
    ]) {
      expect(payloadSource).toContain(allowedField);
    }

    for (const forbiddenField of [
      /\bproductId\b/,
      /\bstepId\b/,
      /\bid\b/,
      /\b_id\b/,
      /\buserId\b/,
      /\bcreatedAt\b/,
      /\bupdatedAt\b/,
      /\bproductNameSnapshot\b/,
      /\bbrandSnapshot\b/,
      /\bkeyActivesSnapshot\b/,
      /\bingredientTextSnapshot\b/,
    ]) {
      expect(payloadSource).not.toMatch(forbiddenField);
    }
  });

  it("uses custom product names without implementing a product picker", () => {
    expect(routineBuilderSource).toContain("customProductName");
    expect(routineBuilderSource).not.toContain("ProductPicker");
    expect(routineBuilderSource).not.toContain("product picker");
    expect(routineBuilderSource).not.toContain("@/modules/products");
    expect(routineBuilderSource).not.toContain("/api/products");
  });

  it("enables only the dashboard Routines navigation item for this task", () => {
    const routinesItem = dashboardNavItems.find(
      (item) => item.label === "Routines",
    );

    expect(routinesItem).toEqual({
      disabled: false,
      href: routes.ROUTINES,
      label: "Routines",
      status: "Active",
    });

    for (const disabledLabel of [
      "Today Log",
      "Journal",
      "Products",
      "Ingredients",
    ]) {
      expect(
        dashboardNavItems.find((item) => item.label === disabledLabel),
      ).toMatchObject({
        disabled: true,
        href: null,
      });
    }
  });

  it("protects /routines while preserving existing protected route matchers", () => {
    expect(proxySource).toContain('"/dashboard/:path*"');
    expect(proxySource).toContain('"/onboarding/:path*"');
    expect(proxySource).toContain('"/skin-profile/:path*"');
    expect(proxySource).toContain('"/routines/:path*"');
  });

  it("does not add out-of-scope routine UI routes", () => {
    expect(
      existsSync(join(projectRoot, "src/app/(dashboard)/routines/new")),
    ).toBe(false);
    expect(
      existsSync(join(projectRoot, "src/app/(dashboard)/routines/[id]")),
    ).toBe(false);
    expect(
      existsSync(
        join(projectRoot, "src/app/(dashboard)/routines/[id]/analysis"),
      ),
    ).toBe(false);
    expect(existsSync(join(projectRoot, "src/app/routines"))).toBe(false);
  });

  it("does not introduce forbidden feature scope", () => {
    const combinedSource = `${routinesPageSource}\n${routineBuilderSource}`;

    for (const forbiddenScope of [
      "AIProvider",
      "Routine Analysis",
      "Product module",
      "Product picker",
      "Ingredient module",
      "Product recommendations",
      "Journal",
      "Routine Logs",
      "skin score",
      "medical diagnosis",
      "dashboard data integration",
      "image upload",
    ]) {
      expect(combinedSource).not.toContain(forbiddenScope);
    }
  });
});
