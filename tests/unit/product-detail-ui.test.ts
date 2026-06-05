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
const productMatchExplanationCardPath = join(
  projectRoot,
  "src/modules/product-match/components/product-match-explanation-card.tsx",
);
const productMatchClientPath = join(
  projectRoot,
  "src/modules/product-match/product-match.client.ts",
);
const decisionSupportPath = join(
  projectRoot,
  "src/modules/products/product-detail-decision-support.ts",
);

const productDetailPageSource = readFileSync(productDetailPagePath, "utf8");
const productDetailSource = readFileSync(productDetailPath, "utf8");
const productCardSource = readFileSync(productCardPath, "utf8");
const productClientSource = readFileSync(productClientPath, "utf8");
const productMatchExplanationCardSource = readFileSync(
  productMatchExplanationCardPath,
  "utf8",
);
const productMatchClientSource = readFileSync(productMatchClientPath, "utf8");
const decisionSupportSource = readFileSync(decisionSupportPath, "utf8");
const combinedClientSource = `${productDetailSource}\n${productCardSource}\n${productClientSource}\n${productMatchExplanationCardSource}\n${productMatchClientSource}\n${decisionSupportSource}`;
const combinedProductDetailUiSource = `${productDetailPageSource}\n${combinedClientSource}`;

describe("Product Detail UI", () => {
  it("adds the protected product detail dashboard page and component files", () => {
    expect(existsSync(productDetailPagePath)).toBe(true);
    expect(existsSync(productDetailPath)).toBe(true);
    expect(existsSync(decisionSupportPath)).toBe(true);
    expect(productDetailPageSource).toContain(
      "@/modules/products/components/product-detail",
    );
    expect(productDetailPageSource).toContain("params: Promise");
    expect(productDetailPageSource).toContain("const { id } = await params");
    expect(productDetailPageSource).toContain(
      "<ProductDetail productId={id} />",
    );
  });

  it("keeps ProductDetail as a client component using product and saved-product clients", () => {
    expect(productDetailSource.startsWith('"use client";')).toBe(true);
    expect(productDetailSource).toContain(
      "@/modules/products/product.client",
    );
    expect(productDetailSource).toContain("getProduct");
    expect(productDetailSource).toContain("getProduct(productId)");
    expect(productDetailSource).toContain("listSavedProducts");
    expect(productDetailSource).toContain("getProductMatchForProduct");
    expect(productDetailSource).toContain("ProductMatchExplanationCard");
    expect(productDetailSource).toContain("SavedProductToggleButton");
    expect(productDetailSource).toContain('mode="full"');
    expect(productDetailSource).toContain("useEffect");
    expect(productDetailSource).toContain("let isMounted = true");
    expect(productDetailSource).toContain("reloadKey");
  });

  it("renders loading, error, not-found, retry, and product title states", () => {
    for (const requiredSource of [
      "Đang tải thông tin sản phẩm",
      "Không thể tải thông tin sản phẩm",
      "Không tìm thấy sản phẩm",
      "Vui lòng quay lại danh mục sản phẩm hoặc thử lại sau.",
      "Thử lại",
      "product.name",
      "Product ID: {product.id}",
    ]) {
      expect(productDetailSource).toContain(requiredSource);
    }
  });

  it("renders Product Detail decision support sections", () => {
    for (const sectionHeading of [
      "Tổng quan sản phẩm",
      "Phù hợp với",
      "Thành phần / hoạt chất nổi bật",
      "Cần lưu ý",
      "Gợi ý dùng trong routine",
    ]) {
      expect(productDetailSource).toContain(sectionHeading);
    }

    expect(productDetailSource).toContain(
      "buildProductDetailDecisionSupport(product)",
    );
    expect(productDetailSource).toContain(
      "Các thành phần dưới đây được hiển thị từ dữ liệu sản phẩm hiện có.",
    );
    expect(productDetailSource).toContain(
      "Dữ liệu thành phần chưa đầy đủ.",
    );
  });

  it("renders a non-blocking personalized match explanation section", () => {
    for (const requiredSource of [
      "ProductDetailPersonalizedMatchSection",
      "Giải thích mức độ phù hợp cá nhân hóa",
      "Đang tải giải thích phù hợp cá nhân hóa",
      "Chưa tải được giải thích cá nhân hóa",
      "Bạn vẫn có thể xem thông tin sản phẩm bên dưới.",
      "productMatch.matchAvailable",
      "productMatch.matchExplanation",
      "match={productMatch.match}",
      "onRetry={() => void loadPersonalizedMatch()}",
    ]) {
      expect(productDetailSource).toContain(requiredSource);
    }

    for (const requiredSource of [
      'data-testid="product-match-explanation-card"',
      'data-testid="product-match-explanation-summary"',
      'data-testid="product-match-reasons"',
      'data-testid="product-match-cautions"',
      'data-testid="product-match-ingredient-highlights"',
      "Điểm phù hợp",
      "Tín hiệu phù hợp:",
      "Cần lưu ý:",
      "Thành phần liên quan",
    ]) {
      expect(productMatchExplanationCardSource).toContain(requiredSource);
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
      "product.verificationStatus",
      "product.updatedAt",
    ]) {
      expect(productDetailSource).toContain(publicField);
    }

    for (const helperField of [
      "product.skinTypes",
      "product.concerns",
      "product.suitableFor",
      "product.notRecommendedFor",
      "product.keyActives",
      "product.warnings",
      "product.tags",
    ]) {
      expect(decisionSupportSource).toContain(helperField);
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

  it("uses route constants for product detail, Product Match, and Products links", () => {
    expect(productDetailSource).toContain("@/shared/constants/routes");
    expect(productDetailSource).toContain("routes.PRODUCTS");
    expect(productDetailSource).toContain("routes.PRODUCT_MATCH");
    expect(productDetailSource).not.toContain('href="/products"');
    expect(productDetailSource).not.toContain('href="/product-match"');

    expect(productCardSource).toContain("@/shared/constants/routes");
    expect(productCardSource).toContain(
      "`${routes.PRODUCTS}/${product.id}`",
    );
    expect(productCardSource).not.toContain("href={`/products/${product.id}`}");
  });

  it("keeps client-side product detail files free of server-only imports", () => {
    for (const forbiddenImport of [
      "server-only",
      "mongodb",
      "getCurrentUser",
      "repository",
      "use-case",
      "database",
      "@/infrastructure/database",
      "@/modules/auth",
      "process.env",
    ]) {
      expect(combinedClientSource.toLowerCase()).not.toContain(
        forbiddenImport.toLowerCase(),
      );
    }
  });

  it("keeps Product Detail source free of unsafe skincare claims", () => {
    const lowerSource = combinedProductDetailUiSource.toLocaleLowerCase("vi-VN");

    for (const forbiddenCopy of [
      "chữa khỏi",
      "điều trị chắc chắn",
      "đảm bảo hết mụn",
      "đảm bảo hiệu quả",
      "an toàn tuyệt đối",
      "phù hợp 100%",
      "phù hợp tuyệt đối",
      "trị mụn chắc chắn",
      "hiệu quả 100%",
      "sản phẩm này sẽ trị mụn",
      "sản phẩm này chữa mụn",
      "cure",
      "guaranteed",
      "100% effective",
      "perfectly safe",
      "will treat acne",
      "medical diagnosis",
    ]) {
      expect(lowerSource).not.toContain(forbiddenCopy);
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
      "AI recommendation",
      "add-to-routine",
    ]) {
      expect(combinedProductDetailUiSource).not.toContain(forbiddenScope);
    }
  });
});
