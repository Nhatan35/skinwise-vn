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

function createSavedProduct(
  product: ProductDto,
  overrides: Partial<SavedProductDto> = {},
): SavedProductDto {
  return {
    id: `saved-${product.id}`,
    productId: product.id,
    product,
    tags: [],
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
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
        keyActives: ["Glycerin"],
        source: "saved",
      }),
    ]);
  });

  it("preserves saved-product decision metadata without mutating the input", () => {
    const savedProduct = createSavedProduct(createProduct("product-context"), {
      decisionStatus: "testing",
      plannedRoutineSlot: "evening",
      personalNote: "Theo dõi cảm nhận trước khi thêm vào routine.",
    });
    const originalSavedProduct = structuredClone(savedProduct);

    const options = buildRoutineProductOptions({
      catalogueProducts: [],
      savedProducts: [savedProduct],
    });

    expect(options.savedProductOptions[0]).toMatchObject({
      decisionStatus: "testing",
      plannedRoutineSlot: "evening",
      personalNote: "Theo dõi cảm nhận trước khi thêm vào routine.",
      source: "saved",
    });
    expect(savedProduct).toEqual(originalSavedProduct);
  });

  it("handles missing saved metadata without creating implied defaults", () => {
    const options = buildRoutineProductOptions({
      catalogueProducts: [],
      savedProducts: [
        createSavedProduct(createProduct("saved-without-context")),
      ],
    });
    const option = options.savedProductOptions[0];

    expect(option).not.toHaveProperty("decisionStatus");
    expect(option).not.toHaveProperty("plannedRoutineSlot");
    expect(option).not.toHaveProperty("personalNote");
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
        keyActives: ["Glycerin"],
        source: "catalogue",
      }),
    ]);
    expect(options.catalogueProductOptions[0]).not.toHaveProperty(
      "decisionStatus",
    );
    expect(options.catalogueProductOptions[0]).not.toHaveProperty(
      "plannedRoutineSlot",
    );
    expect(options.catalogueProductOptions[0]).not.toHaveProperty(
      "personalNote",
    );
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
      keyActives: [],
      skinTypes: [],
      source: "saved",
      tags: [],
      warnings: [],
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
      keyActives: [],
      skinTypes: [],
      source: "saved",
      tags: [],
      warnings: [],
    };
    const catalogueOption: RoutineProductOption = {
      id: "catalogue-product",
      name: "Catalogue Sunscreen",
      brand: "Demo",
      category: "sunscreen",
      concerns: [],
      keyActives: [],
      skinTypes: [],
      source: "catalogue",
      tags: [],
      warnings: [],
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

  it("does not apply saved decision metadata to the routine step", () => {
    const selectedOption: RoutineProductOption = {
      id: "saved-product",
      name: "Saved Serum",
      brand: "Demo",
      category: "serum",
      concerns: [],
      decisionStatus: "considering",
      keyActives: [],
      personalNote: "Muốn xem lại trước khi thêm.",
      plannedRoutineSlot: "either",
      skinTypes: [],
      source: "saved",
      tags: [],
      warnings: [],
    };

    expect(
      applyRoutineProductSelection({
        selectedOption,
        step: {
          category: "cleanser",
          customProductName: "",
        },
      }),
    ).toEqual({
      productId: "saved-product",
      category: "serum",
      customProductName: "",
    });
  });
});
