import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { dashboardNavItems } from "@/modules/dashboard/dashboard-shell.config";
import { routes } from "@/shared/constants/routes";

const projectRoot = process.cwd();
const savedProductsPagePath = join(
  projectRoot,
  "src/app/(dashboard)/saved-products/page.tsx",
);
const mistakenSavedProductsRoutePath = join(
  projectRoot,
  "src/app/saved-products/page.tsx",
);
const savedProductsComponentPath = join(
  projectRoot,
  "src/modules/saved-products/components/saved-products-page.tsx",
);
const savedProductCardPath = join(
  projectRoot,
  "src/modules/saved-products/components/saved-product-card.tsx",
);
const savedProductsComparisonPanelPath = join(
  projectRoot,
  "src/modules/saved-products/components/saved-products-comparison-panel.tsx",
);
const savedProductToggleButtonPath = join(
  projectRoot,
  "src/modules/saved-products/components/saved-product-toggle-button.tsx",
);
const savedProductClientPath = join(
  projectRoot,
  "src/modules/saved-products/saved-product.client.ts",
);
const proxyPath = join(projectRoot, "src/proxy.ts");

const savedProductsPageSource = readFileSync(savedProductsPagePath, "utf8");
const savedProductsComponentSource = readFileSync(
  savedProductsComponentPath,
  "utf8",
);
const savedProductCardSource = readFileSync(savedProductCardPath, "utf8");
const savedProductsComparisonPanelSource = readFileSync(
  savedProductsComparisonPanelPath,
  "utf8",
);
const savedProductToggleButtonSource = readFileSync(
  savedProductToggleButtonPath,
  "utf8",
);
const savedProductClientSource = readFileSync(savedProductClientPath, "utf8");
const proxySource = readFileSync(proxyPath, "utf8");
const combinedSavedProductClientSource = `${savedProductsComponentSource}\n${savedProductCardSource}\n${savedProductsComparisonPanelSource}\n${savedProductToggleButtonSource}\n${savedProductClientSource}`;

describe("Saved Products UI", () => {
  it("adds the protected /saved-products dashboard page and route constant", () => {
    expect(existsSync(savedProductsPagePath)).toBe(true);
    expect(existsSync(mistakenSavedProductsRoutePath)).toBe(false);
    expect(routes.SAVED_PRODUCTS).toBe("/saved-products");
    expect(savedProductsPageSource).toContain(
      "@/modules/saved-products/components/saved-products-page",
    );
    expect(savedProductsPageSource).toContain("<SavedProductsPage />");
    expect(savedProductsPageSource).toContain("routes.SAVED_PRODUCTS");
    expect(savedProductsPageSource).toContain(
      "data-route={routes.SAVED_PRODUCTS}",
    );
  });

  it("enables Saved Products navigation and protects /saved-products", () => {
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
    expect(proxySource).toContain('"/saved-products/:path*"');
  });

  it("loads saved products through the client helper and renders standard states", () => {
    expect(savedProductsComponentSource.startsWith('"use client";')).toBe(true);
    expect(savedProductsComponentSource).toContain(
      "@/modules/saved-products/saved-product.client",
    );
    expect(savedProductsComponentSource).toContain("listSavedProducts");

    for (const requiredCopy of [
      "Đang tải sản phẩm đã lưu",
      "Không thể tải sản phẩm đã lưu",
      "Chưa có sản phẩm đã lưu",
      "Xem gợi ý sản phẩm",
      "Quay lại Product Match",
      "Thử lại",
      "saved-product-card",
    ]) {
      expect(combinedSavedProductClientSource).toContain(requiredCopy);
    }

    expect(savedProductsComponentSource).toContain("routes.PRODUCT_MATCH");
  });

  it("explains how saved products support routine decisions", () => {
    for (const requiredSource of [
      'data-testid="saved-products-routine-guidance"',
      "Bước tiếp theo",
      "Xem lại sản phẩm đã lưu trước khi xây dựng routine",
      "Thông tin tham khảo",
      "Lưu ý an toàn",
      "Không nên thêm quá nhiều sản phẩm mới cùng lúc",
      "Hãy bắt đầu chậm",
      "Xây dựng routine",
      "routes.ROUTINES",
    ]) {
      expect(savedProductsComponentSource).toContain(requiredSource);
    }

    for (const requiredCardSource of [
      'data-testid="saved-product-routine-reference"',
      "Trước khi thêm vào routine",
      "Xem chi tiết sản phẩm",
      "chỉ thêm từng sản phẩm",
      "mới để dễ theo dõi cảm nhận của da",
    ]) {
      expect(savedProductCardSource).toContain(requiredCardSource);
    }
  });

  it("renders saved product cards with safe ProductDto fields and remove action", () => {
    for (const requiredSource of [
      "product.name",
      "product.brand",
      "product.category",
      "product.keyActives",
      "Thành phần nổi bật",
      "Đã lưu",
      "Xem chi tiết",
      "Bỏ lưu sản phẩm",
      "data-testid=\"saved-product-card\"",
      "remove-saved-product-button",
    ]) {
      expect(combinedSavedProductClientSource).toContain(requiredSource);
    }

    for (const privateField of [
      "createdByUserId",
      "source",
      "_id",
      "ObjectId",
      "userId",
    ]) {
      expect(combinedSavedProductClientSource).not.toContain(privateField);
    }
  });

  it("keeps save and unsave feedback tied to confirmed request completion", () => {
    expect(savedProductToggleButtonSource).toContain(
      'type PendingAction = "remove" | "save" | null',
    );
    expect(savedProductToggleButtonSource).toContain("pendingAction !== null");
    expect(savedProductToggleButtonSource).toContain("onPendingChange?.(true)");
    expect(savedProductToggleButtonSource).toContain("onPendingChange?.(false)");
    expect(savedProductToggleButtonSource).toContain("aria-busy={isPending}");
    expect(savedProductToggleButtonSource).toContain("Đã lưu sản phẩm.");
    expect(savedProductToggleButtonSource).toContain("Đã bỏ lưu sản phẩm.");
    expect(savedProductToggleButtonSource).toContain(
      "Chưa thể lưu sản phẩm lúc này. Vui lòng thử lại.",
    );
    expect(savedProductToggleButtonSource).toContain(
      "Chưa thể bỏ lưu sản phẩm lúc này. Vui lòng thử lại.",
    );
    expect(savedProductToggleButtonSource).toContain('role="status"');

    const saveRequestIndex = savedProductToggleButtonSource.indexOf(
      "await saveProduct(productId)",
    );
    const parentChangeIndex = savedProductToggleButtonSource.indexOf(
      "onChange?.(nextSaved)",
    );

    expect(saveRequestIndex).toBeGreaterThan(-1);
    expect(parentChangeIndex).toBeGreaterThan(saveRequestIndex);
    expect(savedProductToggleButtonSource).not.toContain("setIsSaved(nextSaved)");
    expect(savedProductToggleButtonSource).not.toContain("setIsSaved(!nextSaved)");
  });

  it("adds accessible names and state to saved-product actions", () => {
    expect(savedProductToggleButtonSource).toContain("productName?: string");
    expect(savedProductToggleButtonSource).toContain("getProductActionLabel");
    expect(savedProductToggleButtonSource).toContain(
      "aria-label={accessibleLabel}",
    );
    expect(savedProductToggleButtonSource).toContain("aria-pressed={isSaved}");
    expect(savedProductToggleButtonSource).toContain(
      "aria-describedby={describedBy}",
    );
    expect(savedProductToggleButtonSource).toContain("id={errorId}");
    expect(savedProductToggleButtonSource).toContain("id={statusId}");
    expect(savedProductCardSource).toContain(
      "Bỏ chọn sản phẩm ${product.name} khỏi so sánh",
    );
    expect(savedProductCardSource).toContain(
      "Thêm sản phẩm ${product.name} vào so sánh",
    );
    expect(savedProductCardSource).toContain(
      "Xem chi tiết sản phẩm ${product.name}",
    );
    expect(savedProductCardSource).toContain("productName={product.name}");
    expect(combinedSavedProductClientSource).not.toContain("tabIndex={1");
  });

  it("adds saved product comparison selection with item.productId keys", () => {
    expect(existsSync(savedProductsComparisonPanelPath)).toBe(true);

    for (const requiredSource of [
      "selectedProductIds",
      "useState<Set<string>>",
      "() => new Set()",
      "item.productId",
      "selectedItems",
      "canShowComparison",
      "hasReachedComparisonLimit",
      "SavedProductsComparisonPanel",
      "handleComparisonToggle",
      "handleClearComparison",
      "setSelectedProductIds",
      "currentItems.filter((item) => item.productId !== productId)",
    ]) {
      expect(savedProductsComponentSource).toContain(requiredSource);
    }

    for (const mutableSetOperation of [
      "selectedProductIds.add",
      "selectedProductIds.delete",
      "selectedProductIds.clear",
    ]) {
      expect(savedProductsComponentSource).not.toContain(mutableSetOperation);
    }
  });

  it("renders comparison controls on saved product cards", () => {
    for (const requiredSource of [
      "isSelectedForComparison",
      "comparisonDisabled",
      "onComparisonToggle",
      "data-testid=\"saved-product-comparison-toggle\"",
      "Thêm vào so sánh",
      "Đã chọn so sánh",
      "aria-pressed={isSelectedForComparison}",
      "onComparisonToggle(item.productId)",
      "routes.PRODUCTS",
    ]) {
      expect(savedProductCardSource).toContain(requiredSource);
    }
  });

  it("renders a safe educational comparison panel", () => {
    for (const requiredSource of [
      "SavedProductsComparisonPanel",
      "data-testid=\"saved-products-comparison-panel\"",
      "data-testid=\"clear-saved-products-comparison\"",
      "So sánh sản phẩm đã lưu",
      "Thông tin chỉ mang tính giáo dục, không thay thế tư vấn y khoa.",
      "Dùng bảng này để xem khác biệt giữa loại sản phẩm",
      "Bảng không tự chọn",
      "lựa chọn cuối cùng vẫn phụ thuộc vào phản ứng da",
      "Xóa lựa chọn so sánh",
      "Chưa có thông tin để so sánh",
      "Cần cân nhắc nếu",
      "Không phù hợp trong các trường hợp",
      "item.product.notRecommendedFor",
      "item.product.warnings",
      "item.product.suitableFor",
      "routes.PRODUCTS",
    ]) {
      expect(savedProductsComparisonPanelSource).toContain(requiredSource);
    }
  });

  it("explains comparison selection and disabled limits", () => {
    for (const requiredSource of [
      "COMPARISON_GUIDANCE_ID",
      "getComparisonGuidance",
      "Chọn từ 2 đến 3 sản phẩm",
      "Đã chọn tối đa 3/3 sản phẩm",
      'role="status"',
      "comparisonDescriptionId={COMPARISON_GUIDANCE_ID}",
    ]) {
      expect(savedProductsComponentSource).toContain(requiredSource);
    }

    expect(savedProductCardSource).toContain(
      "aria-describedby={comparisonDescriptionId}",
    );
  });

  it("keeps saved product client-side files free of server-only imports", () => {
    for (const forbiddenImport of [
      "server-only",
      "mongodb",
      "getCurrentUser",
      "@/modules/auth",
      "@/infrastructure/database",
      "saved-product.repository",
      "saved-product.use-case",
      "route.ts",
      "process.env",
    ]) {
      expect(combinedSavedProductClientSource).not.toContain(forbiddenImport);
    }
  });

  it("does not add out-of-scope commerce or social behavior", () => {
    for (const forbiddenScope of [
      "cart",
      "checkout",
      "payment",
      "marketplace",
      "recommendation",
      "review",
      "rating",
      "like",
      "share",
    ]) {
      expect(combinedSavedProductClientSource).not.toMatch(
        new RegExp(`\\b${forbiddenScope}\\b`, "i"),
      );
    }
  });

  it("keeps comparison copy free of ranking, overclaim, and unsafe advice language", () => {
    for (const unsafeCopy of [
      "best",
      "worst",
      "rank",
      "ranking",
      "recommended product",
      "we recommend",
      "diagnose",
      "diagnosis",
      "medical advice",
      "cure",
      "guaranteed",
    ]) {
      expect(combinedSavedProductClientSource).not.toMatch(
        new RegExp(`\\b${unsafeCopy}\\b`, "i"),
      );
    }
  });
});
