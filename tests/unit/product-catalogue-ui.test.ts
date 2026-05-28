import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { dashboardNavItems } from "@/modules/dashboard/dashboard-shell.config";
import { routes } from "@/shared/constants/routes";

const projectRoot = process.cwd();
const productsPagePath = join(
  projectRoot,
  "src/app/(dashboard)/products/page.tsx",
);
const mistakenProductsRoutePath = join(projectRoot, "src/app/products/page.tsx");
const productCataloguePath = join(
  projectRoot,
  "src/modules/products/components/product-catalogue.tsx",
);
const productCardPath = join(
  projectRoot,
  "src/modules/products/components/product-card.tsx",
);
const productClientPath = join(
  projectRoot,
  "src/modules/products/product.client.ts",
);
const dashboardNavigationPath = join(
  projectRoot,
  "src/modules/dashboard/components/dashboard-navigation.tsx",
);
const proxyPath = join(projectRoot, "src/proxy.ts");

const productsPageSource = readFileSync(productsPagePath, "utf8");
const productCatalogueSource = readFileSync(productCataloguePath, "utf8");
const productCardSource = readFileSync(productCardPath, "utf8");
const productClientSource = readFileSync(productClientPath, "utf8");
const dashboardNavigationSource = readFileSync(dashboardNavigationPath, "utf8");
const proxySource = readFileSync(proxyPath, "utf8");
const combinedProductUiSource = `${productsPageSource}\n${productCatalogueSource}\n${productCardSource}\n${productClientSource}`;

describe("Product Catalogue UI", () => {
  it("adds the protected /products dashboard page and renders ProductCatalogue", () => {
    expect(existsSync(productsPagePath)).toBe(true);
    expect(existsSync(mistakenProductsRoutePath)).toBe(false);
    expect(routes.PRODUCTS).toBe("/products");
    expect(productsPageSource).toContain(
      "@/modules/products/components/product-catalogue",
    );
    expect(productsPageSource).toContain("<ProductCatalogue />");
    expect(productsPageSource).toContain("routes.PRODUCTS");
    expect(productsPageSource).toContain("data-route={routes.PRODUCTS}");
  });

  it("enables Products navigation and protects /products", () => {
    expect(
      dashboardNavItems.find((item) => item.label === "Products"),
    ).toEqual({
      disabled: false,
      href: routes.PRODUCTS,
      label: "Products",
      status: "Active",
    });
    expect(proxySource).toContain('"/products/:path*"');
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
    expect(dashboardNavigationSource).toContain("usePathname");
    expect(dashboardNavigationSource).toContain(
      "isActiveDashboardPath(pathname, item.href)",
    );
    expect(dashboardNavigationSource).toContain(
      'aria-current={isActive ? "page" : undefined}',
    );

    expect(
      dashboardNavItems.find((item) => item.label === "Today Log"),
    ).toEqual({
      disabled: false,
      href: routes.TODAY_LOG,
      label: "Today Log",
      status: "Active",
    });
  });

  it("keeps ProductCatalogue as a client component using the Product API client", () => {
    expect(productCatalogueSource.startsWith('"use client";')).toBe(true);
    expect(productCatalogueSource).toContain(
      "@/modules/products/product.client",
    );
    expect(productCatalogueSource).toContain("listProducts");
    expect(productCatalogueSource).toContain("ProductCard");
    expect(productClientSource).toContain(
      'const PRODUCTS_API_BASE_PATH = "/api/products"',
    );
    expect(productClientSource).toContain("body.data.items");
    expect(productClientSource).not.toContain("data.products");
  });

  it("supports search and Product API filters without adding CRUD behavior", () => {
    for (const requiredSource of [
      "product-search",
      "Tìm sản phẩm",
      "Xóa bộ lọc",
      "category",
      "priceRange",
      "skinType",
      "concern",
      "limit: 50",
      "getProductsApiPath",
      'params.set("q", q)',
      'params.set("category", input.category)',
      'params.set("priceRange", input.priceRange)',
      'params.set("skinType", input.skinType)',
      'params.set("concern", input.concern)',
    ]) {
      expect(combinedProductUiSource).toContain(requiredSource);
    }

    for (const forbiddenScope of [
      "createProduct",
      "updateProduct",
      "deleteProduct",
      'method: "POST"',
      'method: "PATCH"',
      'method: "DELETE"',
      "saved product library",
      "image upload",
      "AI recommendation",
      "skin score",
    ]) {
      expect(combinedProductUiSource).not.toContain(forbiddenScope);
    }
  });

  it("renders loading, error, empty, and educational states", () => {
    for (const requiredCopy of [
      "Đang tải danh sách sản phẩm",
      "Không thể tải danh sách sản phẩm",
      "Không tìm thấy sản phẩm phù hợp",
      "Could not load the product catalogue.",
      "Catalogue tham khảo",
      "không phải chẩn đoán y khoa",
    ]) {
      expect(combinedProductUiSource).toContain(requiredCopy);
    }
  });

  it("displays safe public product DTO fields in ProductCard", () => {
    for (const publicField of [
      "product.name",
      "product.brand",
      "product.category",
      "product.priceRange",
      "product.ingredientsText",
      "product.keyActives",
      "product.tags",
      "product.warnings",
      "product.skinTypes",
      "product.concerns",
      "product.suitableFor",
      "product.notRecommendedFor",
      "product.verificationStatus",
      "product.updatedAt",
    ]) {
      expect(productCardSource).toContain(publicField);
    }

    for (const privateField of ["_id", "userId", "createdByUserId"]) {
      expect(productCardSource).not.toContain(privateField);
    }
  });

  it("keeps the product catalogue UI free of server-only imports", () => {
    for (const forbiddenImport of [
      "server-only",
      "mongodb",
      "getCurrentUser",
      "@/infrastructure/database",
      "product.repository",
      "product.use-case",
      "@/modules/products/index",
      "@/modules/auth",
    ]) {
      expect(combinedProductUiSource).not.toContain(forbiddenImport);
    }
  });
});
