import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { dashboardNavItems } from "@/modules/dashboard/dashboard-shell.config";
import { routes } from "@/shared/constants/routes";

const projectRoot = process.cwd();
const adminProductsPagePath = join(
  projectRoot,
  "src/app/admin/products/page.tsx",
);
const adminProductReviewPath = join(
  projectRoot,
  "src/modules/products/components/admin-product-review.tsx",
);
const adminProductFormPath = join(
  projectRoot,
  "src/modules/products/components/admin-product-form.tsx",
);
const adminProductClientPath = join(
  projectRoot,
  "src/modules/products/admin-product.client.ts",
);
const dashboardShellConfigPath = join(
  projectRoot,
  "src/modules/dashboard/dashboard-shell.config.ts",
);
const proxyPath = join(projectRoot, "src/proxy.ts");

const adminProductsPageSource = readFileSync(adminProductsPagePath, "utf8");
const adminProductReviewSource = readFileSync(adminProductReviewPath, "utf8");
const adminProductFormSource = readFileSync(adminProductFormPath, "utf8");
const adminProductClientSource = readFileSync(adminProductClientPath, "utf8");
const dashboardShellConfigSource = readFileSync(
  dashboardShellConfigPath,
  "utf8",
);
const proxySource = readFileSync(proxyPath, "utf8");
const adminProductsRoute = routes.ADMIN_PRODUCTS as string;
const combinedAdminProductSource = `${adminProductsPageSource}\n${adminProductReviewSource}\n${adminProductFormSource}\n${adminProductClientSource}`;

describe("Admin Product Review UI", () => {
  it("adds the protected /admin/products route with a server-side admin guard", () => {
    expect(existsSync(adminProductsPagePath)).toBe(true);
    expect(existsSync(adminProductFormPath)).toBe(true);
    expect(routes.ADMIN_PRODUCTS).toBe("/admin/products");
    expect(adminProductsPageSource).toContain('export const dynamic = "force-dynamic"');
    expect(adminProductsPageSource).toContain("requireAdminUser");
    expect(adminProductsPageSource).toContain("AuthenticationRequiredError");
    expect(adminProductsPageSource).toContain("AdminPermissionRequiredError");
    expect(adminProductsPageSource).toContain(
      'redirect("/api/auth/signin?callbackUrl=/admin/products")',
    );
    expect(adminProductsPageSource).toContain("Admin access required");
    expect(adminProductsPageSource).toContain("<AdminProductReview />");
    expect(adminProductsPageSource).toContain("data-route={routes.ADMIN_PRODUCTS}");
    expect(proxySource).toContain('"/admin/:path*"');
  });

  it("keeps the dashboard navigation free of a global admin link", () => {
    expect(
      dashboardNavItems.some((item) => item.href === adminProductsRoute),
    ).toBe(false);
    expect(
      dashboardNavItems.some((item) => item.label.toLowerCase().includes("admin")),
    ).toBe(false);
    expect(dashboardShellConfigSource).not.toContain("ADMIN_PRODUCTS");
  });

  it("keeps the review component client-side and uses only the admin product client", () => {
    expect(adminProductReviewSource.startsWith('"use client";')).toBe(true);
    expect(adminProductReviewSource).toContain(
      "@/modules/products/admin-product.client",
    );
    expect(adminProductReviewSource).toContain("listAdminProducts");
    expect(adminProductReviewSource).toContain("createAdminProduct");
    expect(adminProductReviewSource).toContain("updateAdminProduct");
    expect(adminProductReviewSource).toContain(
      "updateAdminProductVerificationStatus",
    );
    expect(adminProductFormSource.startsWith('"use client";')).toBe(true);
    expect(adminProductClientSource).toContain(
      'const ADMIN_PRODUCTS_API_BASE_PATH = "/api/admin/products"',
    );
    expect(adminProductReviewSource).not.toContain(
      "@/modules/products/product.client",
    );
  });

  it("renders required review workflow states and status labels", () => {
    for (const requiredSource of [
      "Admin Product Review",
      "Search products",
      "Verification status",
      "All statuses",
      "Pending review",
      "Reviewed",
      "Verified",
      "Loading admin product review queue",
      "No products to review",
      "Could not load admin products",
      "Admin access required",
      "Updating status",
      "Status updated",
      "Update failed",
      "Hidden from public catalogue",
      "Visible in public catalogue",
      "visibility still remains based on reviewed or verified status",
      "Tạo sản phẩm",
      "Chỉnh sửa sản phẩm",
      "Lưu sản phẩm",
      "Hủy",
      "Tên sản phẩm",
      "Thương hiệu",
      "Danh mục",
      "Khoảng giá",
      "Thành phần",
      "Hoạt chất chính",
      "Thẻ",
      "Cảnh báo",
      "Loại da phù hợp",
      "Mối quan tâm da",
      "Phù hợp với",
      "Không khuyến nghị cho",
      "Trạng thái kiểm duyệt",
      "Tạo sản phẩm thành công",
      "Cập nhật sản phẩm thành công",
      "Không thể lưu sản phẩm",
      "Edit",
    ]) {
      expect(combinedAdminProductSource).toContain(requiredSource);
    }
  });

  it("does not import server-only admin guards or product repositories into client UI", () => {
    for (const forbiddenImport of [
      "server-only",
      "requireAdminUser",
      "getCurrentUser",
      "mongodb",
      "@/infrastructure/database",
      "product.repository",
      "product.use-case",
      "@/modules/auth",
    ]) {
      expect(adminProductReviewSource).not.toContain(forbiddenImport);
      expect(adminProductFormSource).not.toContain(forbiddenImport);
      expect(adminProductClientSource).not.toContain(forbiddenImport);
    }
  });

  it("keeps create/edit lite free of hard delete, isActive, marketplace, payment, image upload, or AI scope", () => {
    for (const forbiddenScope of [
      "isActive",
      "hard delete",
      "deleteProduct",
      'method: "DELETE"',
      "full CRUD",
      "marketplace",
      "payment",
      "checkout",
      "cart",
      "image upload",
      "OpenAI",
      "Gemini",
      "diagnosis",
      "skin score",
    ]) {
      expect(combinedAdminProductSource).not.toContain(forbiddenScope);
    }
  });
});
