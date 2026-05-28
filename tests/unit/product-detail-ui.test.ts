import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const productDetailPagePath = join(
  projectRoot,
  "src/app/(dashboard)/products/[id]/page.tsx",
);
const productDetailPath = join(
  projectRoot,
  "src/modules/products/components/product-detail.tsx",
);
const productCardPath = join(
  projectRoot,
  "src/modules/products/components/product-card.tsx",
);
const productClientPath = join(
  projectRoot,
  "src/modules/products/product.client.ts",
);

const productDetailPageSource = readFileSync(productDetailPagePath, "utf8");
const productDetailSource = readFileSync(productDetailPath, "utf8");
const productCardSource = readFileSync(productCardPath, "utf8");
const productClientSource = readFileSync(productClientPath, "utf8");
const combinedClientSource = `${productDetailSource}\n${productCardSource}\n${productClientSource}`;
const combinedProductDetailUiSource = `${productDetailPageSource}\n${combinedClientSource}`;

describe("Product Detail UI", () => {
  it("adds the protected product detail dashboard page and component files", () => {
    expect(existsSync(productDetailPagePath)).toBe(true);
    expect(existsSync(productDetailPath)).toBe(true);
    expect(productDetailPageSource).toContain(
      "@/modules/products/components/product-detail",
    );
    expect(productDetailPageSource).toContain("params: Promise");
    expect(productDetailPageSource).toContain("const { id } = await params");
    expect(productDetailPageSource).toContain(
      "<ProductDetail productId={id} />",
    );
  });

  it("keeps ProductDetail as a client component using the product detail client helper", () => {
    expect(productDetailSource.startsWith('"use client";')).toBe(true);
    expect(productDetailSource).toContain(
      "@/modules/products/product.client",
    );
    expect(productDetailSource).toContain("getProduct");
    expect(productDetailSource).toContain("productId: string");
    expect(productDetailSource).toContain("getProduct(productId)");
    expect(productDetailSource).toContain("useEffect");
    expect(productDetailSource).toContain("let isMounted = true");
    expect(productDetailSource).toContain("reloadKey");
  });

  it("renders loading, error, not-found, retry, and back states", () => {
    for (const requiredCopy of [
      "Đang tải thông tin sản phẩm",
      "Không thể tải thông tin sản phẩm",
      "Không tìm thấy sản phẩm",
      "Could not load the product details.",
      "Thử lại",
      "Quay lại sản phẩm",
      'href="/products"',
    ]) {
      expect(productDetailSource).toContain(requiredCopy);
    }
  });

  it("displays only safe public ProductDto fields in ProductDetail", () => {
    for (const publicField of [
      "product.id",
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
      expect(productDetailSource).toContain(publicField);
    }

    for (const internalField of [
      "_id",
      "source",
      "createdByUserId",
      "ObjectId",
    ]) {
      expect(productDetailSource).not.toContain(internalField);
    }
  });

  it("adds ProductCard navigation to product detail pages", () => {
    expect(productCardSource).toContain('href={`/products/${product.id}`}');
    expect(productCardSource).toContain("Xem chi tiết");
  });

  it("keeps client-side product detail files free of server-only imports", () => {
    for (const forbiddenImport of [
      "server-only",
      "mongodb",
      "getCurrentUser",
      "product.repository",
      "product.use-case",
      "@/infrastructure/database",
    ]) {
      expect(combinedClientSource).not.toContain(forbiddenImport);
    }
  });

  it("does not add out-of-scope product behavior", () => {
    for (const forbiddenScope of [
      'method: "POST"',
      'method: "PATCH"',
      'method: "DELETE"',
      "createProduct",
      "updateProduct",
      "deleteProduct",
      "saved product library",
      "image upload",
      "AI recommendation",
    ]) {
      expect(combinedProductDetailUiSource).not.toContain(forbiddenScope);
    }
  });
});
