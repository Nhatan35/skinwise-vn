import { describe, expect, it } from "vitest";

import type { ProductDto } from "@/modules/products/product.dto";
import {
  applyRoutineProductSelection,
  buildRoutineProductOptions,
  findRoutineProductOption,
  type RoutineProductOption,
} from "@/modules/routines/routine-product-options";
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";

const fixedDate = "2026-05-31T00:00:00.000Z";

function createProduct(
  id: string,
  overrides: Partial<ProductDto> = {},
): ProductDto {
  return {
    id,
    name: "Gentle Cleanser",
    brand: "SkinWise Demo",
    category: "cleanser",
    priceRange: "budget",
    ingredientsText: "Water, Glycerin",
    keyActives: ["Glycerin"],
    tags: [],
    warnings: [],
    skinTypes: ["oily"],
    concerns: ["oiliness"],
    suitableFor: [],
    notRecommendedFor: [],
    verificationStatus: "reviewed",
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

function createSavedProduct(product: ProductDto): SavedProductDto {
  return {
    id: `saved-${product.id}`,
    productId: product.id,
    product,
    createdAt: fixedDate,
    updatedAt: fixedDate,
  };
}

describe("Routine product options", () => {
  it("maps saved products into saved product options", () => {
    const product = createProduct("product-1", {
      brand: "CeraVe",
      category: "moisturizer",
      name: "Moisturizing Cream",
    });

    const options = buildRoutineProductOptions({
      catalogueProducts: [],
      savedProducts: [createSavedProduct(product)],
    });

    expect(options.savedProductOptions).toEqual([
      expect.objectContaining({
        id: "product-1",
        name: "Moisturizing Cream",
        brand: "CeraVe",
        category: "moisturizer",
        source: "saved",
      }),
    ]);
  });

  it("maps catalogue products into catalogue product options", () => {
    const options = buildRoutineProductOptions({
      catalogueProducts: [
        createProduct("product-2", {
          category: "sunscreen",
          name: "Daily Sunscreen",
        }),
      ],
      savedProducts: [],
    });

    expect(options.catalogueProductOptions).toEqual([
      expect.objectContaining({
        id: "product-2",
        category: "sunscreen",
        name: "Daily Sunscreen",
        source: "catalogue",
      }),
    ]);
  });

  it("deduplicates saved products from catalogue products", () => {
    const savedProduct = createProduct("product-3", {
      name: "Saved Serum",
      category: "serum",
    });

    const options = buildRoutineProductOptions({
      catalogueProducts: [
        savedProduct,
        createProduct("product-4", { name: "Catalogue Toner" }),
      ],
      savedProducts: [createSavedProduct(savedProduct)],
    });

    expect(options.savedProductOptions.map((option) => option.id)).toEqual([
      "product-3",
    ]);
    expect(options.catalogueProductOptions.map((option) => option.id)).toEqual([
      "product-4",
    ]);
    expect(options.combinedProductOptions.map((option) => option.id)).toEqual([
      "product-3",
      "product-4",
    ]);
  });

  it("looks up selected saved and catalogue products from combined options", () => {
    const options = buildRoutineProductOptions({
      catalogueProducts: [createProduct("catalogue-product")],
      savedProducts: [
        createSavedProduct(
          createProduct("saved-product", { category: "treatment" }),
        ),
      ],
    });

    expect(
      findRoutineProductOption(options.combinedProductOptions, "saved-product"),
    ).toMatchObject({
      category: "treatment",
      source: "saved",
    });
    expect(
      findRoutineProductOption(
        options.combinedProductOptions,
        "catalogue-product",
      ),
    ).toMatchObject({
      source: "catalogue",
    });
  });

  it("applies selected product id and category without breaking missing category fallback", () => {
    const selectedOption: RoutineProductOption = {
      id: "saved-product",
      name: "Saved Product",
      brand: "",
      concerns: [],
      skinTypes: [],
      source: "saved",
    };

    const nextStep = applyRoutineProductSelection({
      selectedOption,
      step: {
        category: "cleanser",
        customProductName: "Manual product",
      },
    });

    expect(nextStep).toEqual({
      productId: "saved-product",
      customProductName: "",
      category: "cleanser",
    });
  });

  it("auto-fills category for saved and catalogue product selections", () => {
    const savedOption: RoutineProductOption = {
      id: "saved-product",
      name: "Saved Serum",
      brand: "Demo",
      category: "serum",
      concerns: [],
      skinTypes: [],
      source: "saved",
    };
    const catalogueOption: RoutineProductOption = {
      id: "catalogue-product",
      name: "Catalogue Sunscreen",
      brand: "Demo",
      category: "sunscreen",
      concerns: [],
      skinTypes: [],
      source: "catalogue",
    };

    expect(
      applyRoutineProductSelection({
        selectedOption: savedOption,
        step: {
          category: "cleanser",
          customProductName: "",
        },
      }),
    ).toMatchObject({
      productId: "saved-product",
      category: "serum",
      customProductName: "",
    });

    expect(
      applyRoutineProductSelection({
        previousOption: savedOption,
        selectedOption: catalogueOption,
        step: {
          category: "serum",
          customProductName: "",
          productId: "saved-product",
        },
      }),
    ).toMatchObject({
      productId: "catalogue-product",
      category: "sunscreen",
      customProductName: "",
    });
  });
});
