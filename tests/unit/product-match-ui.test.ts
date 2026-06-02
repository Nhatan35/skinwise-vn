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
const productMatchExplanationCardSource = readFileSync(
  join(productMatchModuleDir, "components/product-match-explanation-card.tsx"),
  "utf8",
);
const productMatchSummarySource = readFileSync(
  join(productMatchModuleDir, "components/product-match-summary.tsx"),
  "utf8",
);
const productMatchExplanationSource = readFileSync(
  join(productMatchModuleDir, "product-match-explanation.ts"),
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
  productMatchExplanationCardSource,
  productMatchSummarySource,
  productMatchExplanationSource,
  productMatchEmptyStateSource,
].join("\n");
const combinedProductMatchCardSource = `${productMatchCardSource}\n${productMatchExplanationCardSource}`;

describe("Product Match UI source", () => {
  it("adds the protected /product-match dashboard page", () => {
    expect(existsSync(productMatchPagePath)).toBe(true);
    expect(routes.PRODUCT_MATCH).toBe("/product-match");
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
    for (const expectedSource of [
      "LoadingState",
      "ErrorState",
      "loadProductMatches",
      "ProductMatchNoProfileEmptyState",
      "ProductMatchNoProductsEmptyState",
      "ProductMatchSummary",
    ]) {
      expect(productMatchComponentSource).toContain(expectedSource);
    }

    expect(productMatchEmptyStateSource).toContain(
      "href={routes.ONBOARDING_SKIN_PROFILE}",
    );
  });

  it("renders match cards with score, level, explanation, save, and detail actions", () => {
    for (const expectedSource of [
      'data-testid="product-match-card"',
      'data-testid="product-match-score"',
      'data-testid="product-match-level"',
      'data-testid="product-match-reasons"',
      'data-testid="product-match-cautions"',
      'data-testid="product-match-view-details-link"',
      "Vì sao",
      "product-match-explanation",
      "product-match-explanation-summary",
      "product-match-ingredient-highlights",
      "product-match-data-quality-notes",
      "buildProductMatchExplanationViewModel",
      "matchExplanation",
      "positiveReasons.map",
      "cautionReasons.map",
      "ingredientHighlights",
      "usageNote",
      "matchedSignals",
      "SavedProductToggleButton",
      "initialSaved={item.isSaved}",
      "productId={product.id}",
    ]) {
      expect(combinedProductMatchCardSource).toContain(expectedSource);
    }

    expect(combinedProductMatchCardSource).toContain("fallback.visibleReasons");
    expect(combinedProductMatchCardSource).toContain("fallback.visibleCautions");
    expect(combinedProductMatchCardSource).not.toContain("item.reasons.map");
    expect(combinedProductMatchCardSource).not.toContain("item.cautions.map");
  });

  it("uses a focused Product Match explanation helper with safe fallbacks", () => {
    for (const expectedSource of [
      "buildProductMatchExplanationViewModel",
      "buildProductMatchExplanation",
      "MAX_VISIBLE_REASONS = 3",
      "MAX_VISIBLE_CAUTIONS = 2",
      "SkinWise chưa có đủ tín hiệu rõ ràng để giải thích chi tiết.",
      "Nên xem kỹ bảng thành phần và thử trên một vùng da nhỏ",
      "matchLevel",
      "matchedSignals",
      "dataQualityNotes",
    ]) {
      expect(productMatchExplanationSource).toContain(expectedSource);
    }
  });

  it("keeps Product Match UI client-safe and free of unsafe skincare claims", () => {
    const lowerSource = combinedProductMatchSource.toLowerCase();

    for (const forbiddenImport of [
      "repository",
      "use-case",
      "database",
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
      "chữa khỏi",
      "điều trị chắc chắn",
      "đảm bảo hiệu quả",
      "an toàn tuyệt đối",
      "chắc chắn phù hợp",
      "hiệu quả 100%",
      "trị mụn",
      "chữa mụn",
      "skin score",
      "skinscore",
      "diagnosis",
      "diagnose",
      "cure",
      "heal",
      "guaranteed",
      "guarantee",
      "100% effective",
      "perfectly safe",
      "will treat acne",
      "medical diagnosis",
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
