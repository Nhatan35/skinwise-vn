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
const savedProductToggleButtonSource = readFileSync(
  savedProductToggleButtonPath,
  "utf8",
);
const savedProductClientSource = readFileSync(savedProductClientPath, "utf8");
const proxySource = readFileSync(proxyPath, "utf8");
const combinedSavedProductClientSource = `${savedProductsComponentSource}\n${savedProductCardSource}\n${savedProductToggleButtonSource}\n${savedProductClientSource}`;

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
      "Khám phá sản phẩm",
      "Thử lại",
      "saved-product-card",
    ]) {
      expect(combinedSavedProductClientSource).toContain(requiredCopy);
    }
  });

  it("renders saved product cards with safe ProductDto fields and remove action", () => {
    for (const requiredSource of [
      "product.name",
      "product.brand",
      "product.category",
      "product.keyActives",
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
      "compare",
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
});
