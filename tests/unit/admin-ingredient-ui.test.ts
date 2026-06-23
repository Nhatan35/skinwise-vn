import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { dashboardNavItems } from "@/modules/dashboard/dashboard-shell.config";
import { routes } from "@/shared/constants/routes";

const projectRoot = process.cwd();
const adminIngredientsPagePath = join(
  projectRoot,
  "src/app/admin/ingredients/page.tsx",
);
const adminIngredientManagementPath = join(
  projectRoot,
  "src/modules/ingredients/components/admin-ingredient-management.tsx",
);
const adminIngredientFormPath = join(
  projectRoot,
  "src/modules/ingredients/components/admin-ingredient-form.tsx",
);
const adminIngredientClientPath = join(
  projectRoot,
  "src/modules/ingredients/admin-ingredient.client.ts",
);
const ingredientLibraryPath = join(
  projectRoot,
  "src/modules/ingredients/components/ingredient-library.tsx",
);
const ingredientDetailPath = join(
  projectRoot,
  "src/modules/ingredients/components/ingredient-detail.tsx",
);
const dashboardShellConfigPath = join(
  projectRoot,
  "src/modules/dashboard/dashboard-shell.config.ts",
);
const proxyPath = join(projectRoot, "src/proxy.ts");

const adminIngredientsPageSource = readFileSync(
  adminIngredientsPagePath,
  "utf8",
);
const adminIngredientManagementSource = readFileSync(
  adminIngredientManagementPath,
  "utf8",
);
const adminIngredientFormSource = readFileSync(
  adminIngredientFormPath,
  "utf8",
);
const adminIngredientClientSource = readFileSync(
  adminIngredientClientPath,
  "utf8",
);
const ingredientLibrarySource = readFileSync(ingredientLibraryPath, "utf8");
const ingredientDetailSource = readFileSync(ingredientDetailPath, "utf8");
const dashboardShellConfigSource = readFileSync(
  dashboardShellConfigPath,
  "utf8",
);
const proxySource = readFileSync(proxyPath, "utf8");
const adminIngredientsRoute = routes.ADMIN_INGREDIENTS as string;
const combinedAdminIngredientSource = `${adminIngredientsPageSource}\n${adminIngredientManagementSource}\n${adminIngredientFormSource}\n${adminIngredientClientSource}`;
const combinedUserFacingIngredientSource = `${ingredientLibrarySource}\n${ingredientDetailSource}`;

describe("Admin Ingredient Create/Edit Lite UI", () => {
  it("adds the protected /admin/ingredients route with a server-side admin guard", () => {
    expect(existsSync(adminIngredientsPagePath)).toBe(true);
    expect(existsSync(adminIngredientManagementPath)).toBe(true);
    expect(existsSync(adminIngredientFormPath)).toBe(true);
    expect(routes.ADMIN_INGREDIENTS).toBe("/admin/ingredients");
    expect(adminIngredientsPageSource).toContain(
      'export const dynamic = "force-dynamic"',
    );
    expect(adminIngredientsPageSource).toContain("requireAdminUser");
    expect(adminIngredientsPageSource).toContain("AuthenticationRequiredError");
    expect(adminIngredientsPageSource).toContain("AdminPermissionRequiredError");
    expect(adminIngredientsPageSource).toContain(
      'redirect("/api/auth/signin?callbackUrl=/admin/ingredients")',
    );
    expect(adminIngredientsPageSource).toContain("Cần quyền truy cập admin");
    expect(adminIngredientsPageSource).toContain("<AdminIngredientManagement />");
    expect(adminIngredientsPageSource).toContain(
      "data-route={routes.ADMIN_INGREDIENTS}",
    );
    expect(proxySource).toContain('"/admin/:path*"');
  });

  it("keeps dashboard navigation free of global admin ingredient links", () => {
    expect(
      dashboardNavItems.some((item) => item.href === adminIngredientsRoute),
    ).toBe(false);
    expect(
      dashboardNavItems.some((item) => item.label.toLowerCase().includes("admin")),
    ).toBe(false);
    expect(dashboardShellConfigSource).not.toContain("ADMIN_INGREDIENTS");
  });

  it("keeps admin ingredient UI client-side and uses only the admin ingredient client", () => {
    expect(adminIngredientManagementSource.startsWith('"use client";')).toBe(
      true,
    );
    expect(adminIngredientFormSource.startsWith('"use client";')).toBe(true);
    expect(adminIngredientManagementSource).toContain(
      "@/modules/ingredients/admin-ingredient.client",
    );
    expect(adminIngredientManagementSource).toContain("listAdminIngredients");
    expect(adminIngredientManagementSource).toContain("createAdminIngredient");
    expect(adminIngredientManagementSource).toContain("updateAdminIngredient");
    expect(adminIngredientClientSource).toContain(
      'const ADMIN_INGREDIENTS_API_BASE_PATH = "/api/admin/ingredients"',
    );
    expect(adminIngredientManagementSource).not.toContain(
      "@/modules/ingredients/ingredient.client",
    );
  });

  it("renders required list, create, edit, loading, success, and error states", () => {
    for (const requiredSource of [
      "Quản lý thành phần",
      "Tạo thành phần",
      "Chỉnh sửa thành phần",
      "Lưu thành phần",
      "Hủy",
      "Tên INCI",
      "Tên khác / alias",
      "Công dụng",
      "Cách dùng phổ biến",
      "Phù hợp với",
      "Cần thận trọng với",
      "Tránh kết hợp với",
      "Mức độ bằng chứng",
      "Nguồn tham khảo",
      "Tạo thành phần thành công",
      "Cập nhật thành phần thành công",
      "Không thể lưu thành phần",
      "Tên INCI đã tồn tại",
      "Tìm kiếm thành phần",
      "Lọc theo công dụng",
      "Đang tải danh sách thành phần admin",
      "Không thể tải danh sách thành phần admin",
      "Không tìm thấy thành phần phù hợp",
      "data-testid=\"admin-ingredient-list\"",
      "data-testid=\"admin-ingredient-row\"",
      "Chỉnh sửa",
    ]) {
      expect(combinedAdminIngredientSource).toContain(requiredSource);
    }
  });

  it("does not show admin create/edit controls in user-facing ingredient surfaces", () => {
    for (const adminOnlyCopy of [
      "Tạo thành phần",
      "Chỉnh sửa thành phần",
      "admin-ingredient-form",
      "admin-ingredient-list",
      "createAdminIngredient",
      "updateAdminIngredient",
      "/api/admin/ingredients",
    ]) {
      expect(combinedUserFacingIngredientSource).not.toContain(adminOnlyCopy);
    }
  });

  it("does not import server-only admin guards or repositories into client UI", () => {
    for (const forbiddenImport of [
      "server-only",
      "requireAdminUser",
      "getCurrentUser",
      "mongodb",
      "@/infrastructure/database",
      "ingredient.repository",
      "ingredient.use-case",
      "@/modules/auth",
    ]) {
      expect(adminIngredientManagementSource).not.toContain(forbiddenImport);
      expect(adminIngredientFormSource).not.toContain(forbiddenImport);
      expect(adminIngredientClientSource).not.toContain(forbiddenImport);
    }
  });

  it("keeps create/edit lite free of delete, merge, bulk import, image, marketplace, AI, or diagnosis scope", () => {
    for (const forbiddenScope of [
      "deleteIngredient",
      'method: "DELETE"',
      "soft delete",
      "mergeIngredient",
      "dedupe",
      "bulk import",
      "CSV",
      "image upload",
      "OpenAI",
      "Gemini",
      "diagnosis",
      "treatment",
      "marketplace",
      "payment",
      "checkout",
      "cart",
      "autoLink",
      "parseProductIngredients",
    ]) {
      expect(combinedAdminIngredientSource).not.toContain(forbiddenScope);
    }
  });
});
