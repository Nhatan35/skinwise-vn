import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const productCataloguePath = join(
  projectRoot,
  "src/modules/products/components/product-catalogue.tsx",
);
const productCardPath = join(
  projectRoot,
  "src/modules/products/components/product-card.tsx",
);
const productDetailPath = join(
  projectRoot,
  "src/modules/products/components/product-detail.tsx",
);
const savedProductToggleButtonPath = join(
  projectRoot,
  "src/modules/saved-products/components/saved-product-toggle-button.tsx",
);

const productCatalogueSource = readFileSync(productCataloguePath, "utf8");
const productCardSource = readFileSync(productCardPath, "utf8");
const productDetailSource = readFileSync(productDetailPath, "utf8");
const savedProductToggleButtonSource = readFileSync(
  savedProductToggleButtonPath,
  "utf8",
);
const combinedProductSavedUiSource = `${productCatalogueSource}\n${productCardSource}\n${productDetailSource}\n${savedProductToggleButtonSource}`;

describe("Product UI saved product integration", () => {
  it("loads saved state once in ProductCatalogue and passes it to ProductCard", () => {
    expect(productCatalogueSource).toContain(
      "@/modules/saved-products/saved-product.client",
    );
    expect(productCatalogueSource).toContain("listSavedProducts");
    expect(productCatalogueSource).toContain("new Set");
    expect(productCatalogueSource).toContain("savedProductIds.has(product.id)");
    expect(productCatalogueSource).toContain("onSavedChange");
    expect(productCatalogueSource).toContain("Product browsing still works.");
  });

  it("renders Save/Saved actions on product cards", () => {
    expect(productCardSource).toContain("SavedProductToggleButton");
    expect(productCardSource).toContain("initialSaved");
    expect(productCardSource).toContain("onSavedChange");
    expect(productCardSource).toContain("productId={product.id}");
    expect(savedProductToggleButtonSource).toContain("Save");
    expect(savedProductToggleButtonSource).toContain("Saved");
    expect(savedProductToggleButtonSource).toContain(
      'data-testid={\n          isSaved ? "remove-saved-product-button" : "save-product-button"',
    );
  });

  it("renders Vietnamese save/remove saved actions on product detail", () => {
    expect(productDetailSource).toContain("SavedProductToggleButton");
    expect(productDetailSource).toContain("listSavedProducts");
    expect(productDetailSource).toContain("setIsSaved");
    expect(savedProductToggleButtonSource).toContain("Lưu sản phẩm");
    expect(savedProductToggleButtonSource).toContain("Bỏ lưu sản phẩm");
    expect(savedProductToggleButtonSource).toContain("Chưa thể lưu sản phẩm");
    expect(savedProductToggleButtonSource).toContain(
      "Chưa thể bỏ lưu sản phẩm",
    );
    expect(productDetailSource).toContain("Chưa tải được trạng thái đã lưu");
  });

  it("uses the saved product client helper without importing server modules into product UI", () => {
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
      expect(combinedProductSavedUiSource).not.toContain(forbiddenImport);
    }
  });

  it("does not add out-of-scope commerce, social, or recommendation behavior", () => {
    for (const forbiddenScope of [
      "cart",
      "checkout",
      "payment",
      "marketplace",
      "compare",
      "recommendation",
      "review",
      "rating",
      "like",
      "share",
    ]) {
      expect(combinedProductSavedUiSource).not.toMatch(
        new RegExp(`\\b${forbiddenScope}\\b`, "i"),
      );
    }
  });
});
