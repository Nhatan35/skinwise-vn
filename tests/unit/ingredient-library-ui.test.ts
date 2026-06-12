import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { dashboardNavItems } from "@/modules/dashboard/dashboard-shell.config";
import { routes } from "@/shared/constants/routes";

const projectRoot = process.cwd();
const ingredientsPagePath = join(
  projectRoot,
  "src/app/(dashboard)/ingredients/page.tsx",
);
const mistakenIngredientsRoutePath = join(
  projectRoot,
  "src/app/ingredients/page.tsx",
);
const ingredientLibraryPath = join(
  projectRoot,
  "src/modules/ingredients/components/ingredient-library.tsx",
);
const ingredientCardPath = join(
  projectRoot,
  "src/modules/ingredients/components/ingredient-card.tsx",
);
const ingredientClientPath = join(
  projectRoot,
  "src/modules/ingredients/ingredient.client.ts",
);
const proxyPath = join(projectRoot, "src/proxy.ts");

const ingredientsPageSource = readFileSync(ingredientsPagePath, "utf8");
const ingredientLibrarySource = readFileSync(ingredientLibraryPath, "utf8");
const ingredientCardSource = readFileSync(ingredientCardPath, "utf8");
const ingredientClientSource = readFileSync(ingredientClientPath, "utf8");
const proxySource = readFileSync(proxyPath, "utf8");
const combinedIngredientUiSource = `${ingredientsPageSource}\n${ingredientLibrarySource}\n${ingredientCardSource}\n${ingredientClientSource}`;

describe("Ingredient Library UI", () => {
  it("adds the protected /ingredients dashboard page and renders IngredientLibrary", () => {
    expect(existsSync(ingredientsPagePath)).toBe(true);
    expect(existsSync(mistakenIngredientsRoutePath)).toBe(false);
    expect(routes.INGREDIENTS).toBe("/ingredients");
    expect(ingredientsPageSource).toContain(
      "@/modules/ingredients/components/ingredient-library",
    );
    expect(ingredientsPageSource).toContain("<IngredientLibrary />");
    expect(ingredientsPageSource).toContain("routes.INGREDIENTS");
    expect(ingredientsPageSource).toContain("data-route={routes.INGREDIENTS}");
  });

  it("enables Ingredients navigation and protects /ingredients", () => {
    expect(
      dashboardNavItems.find((item) => item.label === "Ingredients"),
    ).toEqual({
      disabled: false,
      href: routes.INGREDIENTS,
      label: "Ingredients",
      status: "Active",
    });
    expect(
      dashboardNavItems.find((item) => item.label === "Today Log"),
    ).toEqual({
      disabled: false,
      href: routes.TODAY_LOG,
      label: "Today Log",
      status: "Active",
    });
    expect(proxySource).toContain('"/ingredients/:path*"');
  });

  it("keeps IngredientLibrary as a client component using the Ingredient API client", () => {
    expect(ingredientLibrarySource.startsWith('"use client";')).toBe(true);
    expect(ingredientLibrarySource).toContain(
      "@/modules/ingredients/ingredient.client",
    );
    expect(ingredientLibrarySource).toContain("listIngredients");
    expect(ingredientLibrarySource).toContain("IngredientCard");
    expect(ingredientClientSource).toContain(
      'const INGREDIENTS_API_BASE_PATH = "/api/ingredients"',
    );
    expect(ingredientClientSource).toContain("body.data.items");
    expect(ingredientClientSource).not.toContain("data.ingredients");
  });

  it("supports search, function filtering, and reset without adding CRUD behavior", () => {
    for (const requiredSource of [
      "ingredient-search",
      "Tìm thành phần",
      "Xóa bộ lọc",
      "Lọc theo công dụng",
      "Tất cả công dụng",
      "Hỗ trợ hàng rào da",
      "IngredientFilterState",
      "draftFilters",
      "activeFilters",
      "initialIngredientFilters",
      "hasActiveIngredientFilters",
      "getActiveIngredientFilterLabels",
      "limit: 50",
      "getIngredientsApiPath",
      'params.set("q", q)',
      'params.set("function", ingredientFunction)',
      'params.set("limit", String(limit))',
      "...(filters.function ? { function: filters.function } : {})",
      "setDraftFilters(initialIngredientFilters)",
      "setActiveFilters(initialIngredientFilters)",
    ]) {
      expect(combinedIngredientUiSource).toContain(requiredSource);
    }

    for (const forbiddenScope of [
      "createIngredient",
      "updateIngredient",
      "deleteIngredient",
      'method: "PATCH"',
      'method: "DELETE"',
      "admin",
      "image upload",
      "skin score",
    ]) {
      expect(combinedIngredientUiSource).not.toContain(forbiddenScope);
    }
  });

  it("summarizes ingredient result counts, active filters, and recovery guidance", () => {
    for (const requiredSource of [
      "Đang hiển thị",
      "Bộ lọc đang áp dụng",
      'aria-live="polite"',
      "Từ khóa:",
      "Công dụng:",
      "Bạn có thể tìm theo tên INCI",
      "Bộ lọc hiện tại có thể đang quá hẹp",
      "chọn lại nhóm công dụng",
      "Xóa bộ lọc",
    ]) {
      expect(ingredientLibrarySource).toContain(requiredSource);
    }
  });

  it("renders loading, error, empty, educational, and card states", () => {
    for (const requiredCopy of [
      "Đang tải thư viện thành phần",
      "Không thể tải thư viện thành phần",
      "Không tìm thấy thành phần phù hợp",
      "Thư viện thành phần tham khảo",
      "không phải chẩn đoán y khoa",
      "data-testid=\"ingredient-card\"",
      "Xem chi tiết",
    ]) {
      expect(combinedIngredientUiSource).toContain(requiredCopy);
    }

    expect(ingredientCardSource).toContain(
      "Xem chi tiết thành phần ${ingredient.inciName}",
    );
    expect(ingredientCardSource).not.toContain('aria-label="Xem chi tiết"');
  });

  it("keeps ingredient catalogue files free of server-only imports", () => {
    for (const forbiddenImport of [
      "server-only",
      "getCurrentUser",
      "@/modules/auth",
      "@/infrastructure/database",
      "@/infrastructure/ai",
      "mongodb",
      "ingredient.repository",
      "ingredient.use-case",
      "explain-ingredient.use-case",
      "route.ts",
      "process.env",
    ]) {
      expect(combinedIngredientUiSource).not.toContain(forbiddenImport);
    }
  });
});
