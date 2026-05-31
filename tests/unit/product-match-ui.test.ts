import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { dashboardNavItems } from "@/modules/dashboard/dashboard-shell.config";
import { routes } from "@/shared/constants/routes";

const projectRoot = process.cwd();
const productMatchPagePath = join(
  projectRoot,
  "src/app/(dashboard)/product-match/page.tsx",
);
const productMatchModuleDir = join(projectRoot, "src/modules/product-match");
const productMatchPageSource = readFileSync(productMatchPagePath, "utf8");
const productMatchComponentSource = readFileSync(
  join(productMatchModuleDir, "components/product-match-page.tsx"),
  "utf8",
);
const productMatchCardSource = readFileSync(
  join(productMatchModuleDir, "components/product-match-card.tsx"),
  "utf8",
);
const productMatchSummarySource = readFileSync(
  join(productMatchModuleDir, "components/product-match-summary.tsx"),
  "utf8",
);
const productMatchEmptyStateSource = readFileSync(
  join(productMatchModuleDir, "components/product-match-empty-state.tsx"),
  "utf8",
);
const combinedProductMatchSource = [
  productMatchPageSource,
  productMatchComponentSource,
  productMatchCardSource,
  productMatchSummarySource,
  productMatchEmptyStateSource,
].join("\n");

describe("Product Match UI source", () => {
  it("adds the protected /product-match dashboard page", () => {
    expect(existsSync(productMatchPagePath)).toBe(true);
    expect(routes.PRODUCT_MATCH).toBe("/product-match");
    expect(productMatchPageSource).toContain("Gợi ý sản phẩm phù hợp");
    expect(productMatchPageSource).toContain(
      "Gợi ý sản phẩm dựa trên hồ sơ da của bạn.",
    );
    expect(productMatchPageSource).toContain("không phải tư vấn y tế.");
    expect(productMatchPageSource).toContain("productMatchRoute");
    expect(productMatchPageSource).toContain("data-route={productMatchRoute}");
    expect(productMatchPageSource).toContain("<ProductMatchPage />");
  });

  it("enables Product Match navigation", () => {
    expect(
      dashboardNavItems.find((item) => item.label === "Product Match"),
    ).toEqual({
      disabled: false,
      href: routes.PRODUCT_MATCH,
      label: "Product Match",
      status: "Active",
    });
  });

  it("renders loading, error, no-profile, and no-product states", () => {
    for (const expectedCopy of [
      "Đang tải gợi ý sản phẩm",
      "Không thể tải gợi ý sản phẩm",
      "Thử lại",
      "Tạo hồ sơ da trước để xem gợi ý sản phẩm phù hợp.",
      "Tạo hồ sơ da",
      "Hiện chưa có gợi ý sản phẩm phù hợp để hiển thị.",
      "Chưa có gợi ý sản phẩm phù hợp",
    ]) {
      expect(combinedProductMatchSource).toContain(expectedCopy);
    }

    expect(productMatchEmptyStateSource).toContain(
      "href={routes.ONBOARDING_SKIN_PROFILE}",
    );
  });

  it("renders match cards with score, level, reasons, cautions, save, and detail actions", () => {
    for (const expectedSource of [
      'data-testid="product-match-card"',
      'data-testid="product-match-score"',
      'data-testid="product-match-level"',
      'data-testid="product-match-reasons"',
      'data-testid="product-match-cautions"',
      "Phù hợp cao",
      "Phù hợp tốt",
      "Cần xem kỹ",
      "Phù hợp thấp",
      "SavedProductToggleButton",
      "initialSaved={item.isSaved}",
      "productId={product.id}",
      'data-testid="product-match-view-details-link"',
      "Xem chi tiết",
    ]) {
      expect(productMatchCardSource).toContain(expectedSource);
    }
  });

  it("keeps Product Match UI client-safe and free of unsafe skincare claims", () => {
    const lowerSource = combinedProductMatchSource.toLowerCase();

    for (const forbiddenImport of [
      "repository",
      "use-case",
      "@/infrastructure/database",
      "mongodb",
      "server-only",
      "getcurrentuser",
      "@/modules/auth",
      "process.env",
    ]) {
      expect(lowerSource).not.toContain(forbiddenImport);
    }

    for (const forbiddenCopy of [
      "skin score",
      "skinscore",
      "diagnosis",
      "diagnose",
      "cure",
      "heal",
      "guaranteed",
      "guarantee",
      "best product",
      "perfect product",
      "face analysis",
      "marketplace",
      "checkout",
      "payment",
    ]) {
      expect(lowerSource).not.toContain(forbiddenCopy);
    }
  });
});
