import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { dashboardNavItems } from "@/modules/dashboard/dashboard-shell.config";
import { routes } from "@/shared/constants/routes";

const projectRoot = process.cwd();
const journalPagePath = join(projectRoot, "src/app/(dashboard)/journal/page.tsx");
const mistakenSkinJournalPagePath = join(
  projectRoot,
  "src/app/(dashboard)/skin-journal/page.tsx",
);
const mistakenDashboardSkinJournalPagePath = join(
  projectRoot,
  "src/app/(dashboard)/dashboard/skin-journal/page.tsx",
);
const timelinePath = join(
  projectRoot,
  "src/modules/journals/components/skin-journal-timeline.tsx",
);
const cardPath = join(
  projectRoot,
  "src/modules/journals/components/skin-journal-entry-card.tsx",
);
const formPath = join(
  projectRoot,
  "src/modules/journals/components/skin-journal-entry-form.tsx",
);
const clientPath = join(
  projectRoot,
  "src/modules/journals/skin-journal.client.ts",
);
const validationPath = join(
  projectRoot,
  "src/modules/journals/skin-journal-form.validation.ts",
);
const productDisplayPath = join(
  projectRoot,
  "src/modules/journals/skin-journal-product-display.ts",
);
const productClientPath = join(
  projectRoot,
  "src/modules/products/product.client.ts",
);
const proxyPath = join(projectRoot, "src/proxy.ts");

const journalPageSource = readFileSync(journalPagePath, "utf8");
const timelineSource = readFileSync(timelinePath, "utf8");
const cardSource = readFileSync(cardPath, "utf8");
const formSource = readFileSync(formPath, "utf8");
const clientSource = readFileSync(clientPath, "utf8");
const validationSource = readFileSync(validationPath, "utf8");
const productDisplaySource = readFileSync(productDisplayPath, "utf8");
const productClientSource = readFileSync(productClientPath, "utf8");
const proxySource = readFileSync(proxyPath, "utf8");
const combinedUiSource = `${journalPageSource}\n${timelineSource}\n${cardSource}\n${formSource}\n${clientSource}\n${validationSource}\n${productDisplaySource}\n${productClientSource}`;

describe("SkinJournal Timeline UI", () => {
  it("adds the protected /journal page and renders SkinJournalTimeline", () => {
    expect(existsSync(journalPagePath)).toBe(true);
    expect(existsSync(mistakenSkinJournalPagePath)).toBe(false);
    expect(existsSync(mistakenDashboardSkinJournalPagePath)).toBe(false);
    expect(routes.JOURNAL).toBe("/journal");
    expect(journalPageSource).toContain(
      "@/modules/journals/components/skin-journal-timeline",
    );
    expect(journalPageSource).toContain("<SkinJournalTimeline />");
    expect(journalPageSource).toContain("routes.JOURNAL");
    expect(journalPageSource).toContain("data-route={routes.JOURNAL}");
  });

  it("enables Journal and Today Log navigation", () => {
    expect(
      dashboardNavItems.find((item) => item.label === "Journal"),
    ).toEqual({
      disabled: false,
      href: routes.JOURNAL,
      label: "Journal",
      status: "Active",
    });
    expect(
      dashboardNavItems.find((item) => item.label === "Products"),
    ).toEqual({
      disabled: false,
      href: routes.PRODUCTS,
      label: "Products",
      status: "Active",
    });
    expect(
      dashboardNavItems.find((item) => item.label === "Ingredients"),
    ).toEqual({
      disabled: false,
      href: routes.INGREDIENTS,
      label: "Ingredients",
      status: "Active",
    });
    expect(
      dashboardNavItems.find((item) => item.label === "Saved Products"),
    ).toEqual({
      disabled: false,
      href: routes.SAVED_PRODUCTS,
      label: "Saved Products",
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
  });

  it("protects /journal through the existing auth proxy matcher", () => {
    expect(proxySource).toContain('"/journal/:path*"');
    expect(proxySource).toContain('"/dashboard/:path*"');
    expect(proxySource).toContain('"/routines/:path*"');
  });

  it("keeps journal UI components client-safe", () => {
    expect(timelineSource.startsWith('"use client";')).toBe(true);
    expect(formSource.startsWith('"use client";')).toBe(true);

    for (const forbiddenImport of [
      "@/modules/journals/index",
      "skin-journal.repository",
      "create-skin-journal.use-case",
      "list-skin-journal.use-case",
      "update-skin-journal.use-case",
      "delete-skin-journal.use-case",
      "@/infrastructure/database",
      "mongodb",
      "server-only",
      "getCurrentUser",
      "@/modules/auth",
      "product.repository",
      "product.use-case",
    ]) {
      expect(combinedUiSource).not.toContain(forbiddenImport);
    }
  });

  it("uses the existing SkinJournal API contract from the client helper", () => {
    expect(clientSource).toContain('const SKIN_JOURNAL_API_PATH = "/api/skin-journal"');
    expect(clientSource).toContain('method: "GET"');
    expect(clientSource).toContain('method: "POST"');
    expect(clientSource).toContain('method: "PATCH"');
    expect(clientSource).toContain('method: "DELETE"');
    expect(clientSource).toContain("data.skinJournals");
    expect(clientSource).toContain("data.skinJournal");
    expect(clientSource).toContain("data.deleted");
    expect(clientSource).toContain(
      "Bạn đã có nhật ký cho ngày này.",
    );
  });

  it("loads the visible product catalogue through the Product API client", () => {
    expect(productClientSource).toContain(
      'const PRODUCTS_API_BASE_PATH = "/api/products"',
    );
    expect(productClientSource).toContain('params.set("limit", String(limit))');
    expect(productClientSource).toContain('method: "GET"');
    expect(productClientSource).toContain("body.data.items");
    expect(productClientSource).not.toContain("data.products");
    expect(timelineSource).toContain("@/modules/products/product.client");
    expect(timelineSource).toContain("listProducts");
    expect(timelineSource).toContain("isProductLoading");
    expect(timelineSource).toContain(
      "Không thể tải danh mục sản phẩm",
    );
    expect(timelineSource).toContain("setProductLoadError");
  });

  it("resolves journal product ids to readable card labels", () => {
    expect(cardSource).toContain("resolveJournalProductLabels");
    expect(cardSource).toContain("productLookup");
    expect(cardSource).toContain("productLabel.label");
    expect(cardSource).toContain("Chưa ghi nhận sản phẩm nào.");
    expect(productDisplaySource).toContain(" - ");
    expect(productDisplaySource).toContain("Sản phẩm chưa xác định");
  });

  it("renders product selection without sending product names or objects", () => {
    expect(formSource).toContain("ProductSelectionField");
    expect(formSource).toContain("type=\"checkbox\"");
    expect(formSource).toContain("selectedProductIds");
    expect(formSource).toContain("toggleProduct");
    expect(formSource).toContain("getProductDisplayName(product)");
    expect(formSource).toContain("UNKNOWN_PRODUCT_LABEL");
    expect(formSource).toContain("unresolvedProductIds.map");
    expect(formSource).toContain("onToggle(productId, event.target.checked)");
    expect(formSource).toContain("Các sản phẩm đã chọn trước đó sẽ được giữ lại");
    expect(validationSource).toContain("productsUsed: string[]");
    expect(validationSource).toContain(
      "productsUsed: normalizeProductsUsed(formState.productsUsed)",
    );
    expect(validationSource).not.toContain("productName");
    expect(validationSource).not.toContain("productBrand");
  });

  it("renders loading, error, empty, success, create, edit, and delete flows", () => {
    for (const requiredCopy of [
      "Đang tải nhật ký da",
      "Không thể tải nhật ký da",
      "Chưa có nhật ký da",
      "Đã thêm nhật ký.",
      "Đã cập nhật nhật ký.",
      "Đã xóa nhật ký.",
      "Thêm nhật ký",
      "Sửa",
      "Lưu nhật ký",
      "Xóa",
      "window.confirm",
    ]) {
      expect(combinedUiSource).toContain(requiredCopy);
    }
  });

  it("uses only canonical SkinJournal UI fields", () => {
    for (const allowedField of [
      "localDate",
      "timezone",
      "productsUsed",
      "observations",
      "symptoms",
      "sleepHours",
      "stressLevel",
      "notes",
      "createdAt",
      "updatedAt",
    ]) {
      expect(combinedUiSource).toContain(allowedField);
    }

    for (const forbiddenField of [
      "mood",
      "skinCondition",
      "acneLevel",
      "rednessLevel",
      "drynessLevel",
      "oilinessLevel",
      "sensitivityLevel",
    ]) {
      expect(combinedUiSource).not.toContain(forbiddenField);
    }
  });

  it("does not implement out-of-scope SkinJournal features", () => {
    for (const forbiddenScope of [
      "calendar heatmap",
      "AI journal analysis",
      "analytics view",
      "insight view",
      "image upload",
      "image preview",
      "Product CRUD",
      "saved products",
    ]) {
      expect(combinedUiSource).not.toContain(forbiddenScope);
    }
  });
});
