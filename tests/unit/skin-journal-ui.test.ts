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
const filterPanelPath = join(
  projectRoot,
  "src/modules/journals/components/skin-journal-filter-panel.tsx",
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
const filtersPath = join(
  projectRoot,
  "src/modules/journals/skin-journal-filters.ts",
);
const productClientPath = join(
  projectRoot,
  "src/modules/products/product.client.ts",
);
const proxyPath = join(projectRoot, "src/proxy.ts");

const journalPageSource = readFileSync(journalPagePath, "utf8");
const timelineSource = readFileSync(timelinePath, "utf8");
const filterPanelSource = readFileSync(filterPanelPath, "utf8");
const cardSource = readFileSync(cardPath, "utf8");
const formSource = readFileSync(formPath, "utf8");
const clientSource = readFileSync(clientPath, "utf8");
const validationSource = readFileSync(validationPath, "utf8");
const productDisplaySource = readFileSync(productDisplayPath, "utf8");
const filtersSource = readFileSync(filtersPath, "utf8");
const productClientSource = readFileSync(productClientPath, "utf8");
const proxySource = readFileSync(proxyPath, "utf8");
const combinedUiSource = `${journalPageSource}\n${timelineSource}\n${filterPanelSource}\n${cardSource}\n${formSource}\n${clientSource}\n${validationSource}\n${productDisplaySource}\n${filtersSource}\n${productClientSource}`;

describe("SkinJournal Timeline UI", () => {
  it("adds the protected /journal page and renders SkinJournalTimeline", () => {
    expect(existsSync(journalPagePath)).toBe(true);
    expect(existsSync(filterPanelPath)).toBe(true);
    expect(existsSync(filtersPath)).toBe(true);
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

  it("adds the SkinJournal filter panel with safe reflection copy", () => {
    for (const requiredCopy of [
      "B\u1ed9 l\u1ecdc nh\u1eadt k\u00fd da",
      "B\u1ed9 l\u1ecdc n\u00e0y gi\u00fap b\u1ea1n xem l\u1ea1i ghi ch\u00fa ch\u0103m s\u00f3c da \u0111\u00e3 t\u1ef1 ghi nh\u1eadn.",
      "Th\u00f4ng",
      "tin ch\u1ec9 h\u1ed7 tr\u1ee3 ph\u1ea3n \u00e1nh th\u00f3i quen v\u00e0 quan s\u00e1t c\u00e1 nh\u00e2n",
      "kh\u00f4ng d\u00f9ng \u0111\u1ec3",
      "k\u1ebft lu\u1eadn nguy\u00ean nh\u00e2n ch\u1eafc ch\u1eafn",
      "thay th\u1ebf t\u01b0 v\u1ea5n chuy\u00ean m\u00f4n",
      "Tri\u1ec7u ch\u1ee9ng/ghi nh\u1eadn",
      "M\u1ee9c \u0111\u1ed9 c\u0103ng th\u1eb3ng",
      "S\u1ea3n ph\u1ea9m \u0111\u00e3 d\u00f9ng",
      "Kho\u1ea3ng th\u1eddi gian",
      "T\u1ea5t c\u1ea3 nh\u1eadt k\u00fd \u0111\u00e3 t\u1ea3i",
      "7 ng\u00e0y g\u1ea7n \u0111\u00e2y",
      "14 ng\u00e0y g\u1ea7n \u0111\u00e2y",
      "30 ng\u00e0y g\u1ea7n \u0111\u00e2y",
      "Hi\u1ec3n th\u1ecb",
      "X\u00f3a b\u1ed9 l\u1ecdc",
      "B\u1ed9 l\u1ecdc ch\u1ec9 \u00e1p d\u1ee5ng cho danh s\u00e1ch nh\u1eadt k\u00fd \u0111\u00e3 t\u1ea3i.",
    ]) {
      expect(filterPanelSource).toContain(requiredCopy);
    }

    for (const testId of [
      'data-testid="skin-journal-filter-panel"',
      'data-testid="skin-journal-filter-disclaimer"',
      'data-testid="skin-journal-filter-result-count"',
      'data-testid="skin-journal-filter-clear-button"',
      'data-testid={dataTestId}',
    ]) {
      expect(filterPanelSource).toContain(testId);
    }
  });

  it("guides journal users from routine records to reflection and next actions", () => {
    for (const requiredCopy of [
      "Bạn chưa có ghi nhận nào",
      "sau khi dùng routine",
      "Xem routine",
      "Xem lại routine",
      "Xem insights",
      "Ghi lại routine hoặc sản phẩm đã dùng",
      "Không cần kết luận quá sớm sau một vài lần dùng",
      "tư vấn chuyên môn",
      "routes.ROUTINES",
      "routes.INSIGHTS",
    ]) {
      expect(combinedUiSource).toContain(requiredCopy);
    }
  });

  it("renders loaded-entry filters and preserves separate empty states", () => {
    expect(timelineSource).toContain("listSkinJournals({ limit: 50 })");
    expect(timelineSource).toContain("SkinJournalFilterPanel");
    expect(timelineSource).toContain("filterState");
    expect(timelineSource).toContain("getSkinJournalFilterOptions");
    expect(timelineSource).toContain("hasActiveSkinJournalFilters");
    expect(timelineSource).toContain("filteredEntries");
    expect(timelineSource).toContain("filteredEntries.map");
    expect(timelineSource).toContain("sortedEntries.length === 0");
    expect(timelineSource).toContain("showFilterEmptyState");
    expect(timelineSource).toContain(
      'data-testid="skin-journal-filter-empty-state"',
    );
    expect(timelineSource).toContain("Kh\u00f4ng c\u00f3 nh\u1eadt k\u00fd ph\u00f9 h\u1ee3p");
    expect(timelineSource).toContain(
      "Kh\u00f4ng c\u00f3 nh\u1eadt k\u00fd n\u00e0o kh\u1edbp v\u1edbi b\u1ed9 l\u1ecdc hi\u1ec7n t\u1ea1i.",
    );
  });

  it("keeps SkinJournal filter copy away from overclaiming patterns", () => {
    const filterSources = `${filterPanelSource}\n${filtersSource}\n${timelineSource}`;
    const unsafePatterns = [
      new RegExp(["skin", "score"].join("\\s+"), "i"),
      new RegExp(["health", "score"].join("\\s+"), "i"),
      new RegExp(["treatment", "result"].join("\\s+"), "i"),
      new RegExp(["medical", "recommend"].join("\\s+"), "i"),
      new RegExp(["ai", "recommend"].join("\\s+"), "i"),
      /diagnos/i,
      /guarante/i,
      /\bcaused?\b/i,
      /improv/i,
      /getting\s+worse/i,
    ];

    for (const unsafePattern of unsafePatterns) {
      expect(filterSources).not.toMatch(unsafePattern);
    }
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

  it("guards journal submission while preserving recoverable failure input", () => {
    expect(formSource).toContain("submitLockRef");
    expect(formSource).toContain("aria-busy={isSaving}");
    expect(formSource).toContain("disabled={isSaving}");
    expect(formSource).toContain("Nội dung bạn đã nhập vẫn được giữ lại");
    expect(formSource).toContain("Chưa thể lưu ghi nhận");
    expect(formSource).toContain("Bạn đã có nhật ký cho ngày này");
    expect(formSource).toContain("setFormError(null)");
  });

  it("adds journal validation focus and accessible field relationships", () => {
    expect(formSource).toContain("focusFirstJournalError");
    expect(formSource).toContain("skinJournalFocusTargets");
    expect(formSource).toContain("document.querySelector<HTMLElement>");
    expect(formSource).toContain("id={SKIN_JOURNAL_FORM_ERROR_ID}");
    expect(formSource).toContain("tabIndex={-1}");
    expect(formSource).toContain('name="skin-journal-products-used"');
    expect(formSource).toContain('name="skin-journal-symptom"');
    expect(formSource).toContain(
      "aria-invalid={fieldErrors.symptoms ? true : undefined}",
    );
    expect(formSource).toContain("aria-invalid={error ? true : undefined}");
    expect(formSource).toContain("const descriptionId = description");
    expect(formSource).toContain("aria-describedby={describedBy}");
    expect(formSource).toContain("id={descriptionId}");
    expect(timelineSource).toContain(
      'role={feedback.type === "success" ? "status" : "alert"}',
    );
    expect(combinedUiSource).not.toContain("tabIndex={1");
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
