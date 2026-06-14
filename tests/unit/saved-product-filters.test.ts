import { describe, expect, it } from "vitest";

import type { ProductDto } from "@/modules/products/product.dto";
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";
import {
  DEFAULT_SAVED_PRODUCTS_FILTERS,
  filterSavedProducts,
  getSavedProductDecisionSummary,
  hasActiveSavedProductFilters,
  type SavedProductsFilterState,
} from "@/modules/saved-products/saved-product-filters";

const fixedDate = "2026-06-13T00:00:00.000Z";

function createProduct(
  id: string,
  overrides: Partial<ProductDto> = {},
): ProductDto {
  return {
    id,
    name: `Sản phẩm ${id}`,
    brand: "SkinWise Demo",
    category: "serum",
    priceRange: "budget",
    ingredientsText: "Water",
    keyActives: [],
    tags: [],
    warnings: [],
    skinTypes: ["normal"],
    concerns: ["barrier_support"],
    suitableFor: [],
    notRecommendedFor: [],
    verificationStatus: "verified",
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

function createSavedProduct(
  id: string,
  overrides: Partial<SavedProductDto> = {},
): SavedProductDto {
  const product = createProduct(id);

  return {
    id: `saved-${id}`,
    productId: id,
    product,
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

const items: SavedProductDto[] = [
  createSavedProduct("product-1", {
    decisionStatus: "considering",
    plannedRoutineSlot: "morning",
    personalNote: "Theo dõi cảm nhận với niacinamide.",
    product: createProduct("product-1", {
      name: "Serum Niacinamide Dịu Nhẹ",
      brand: "Lá Xanh",
    }),
  }),
  createSavedProduct("product-2", {
    decisionStatus: "testing",
    plannedRoutineSlot: "evening",
    personalNote: "   ",
    product: createProduct("product-2", {
      name: "Kem dưỡng ẩm phục hồi",
      brand: "Da Việt",
    }),
  }),
  createSavedProduct("product-3", {
    decisionStatus: "paused",
    plannedRoutineSlot: "either",
    product: createProduct("product-3", {
      name: "Toner dịu nhẹ",
      brand: "Mộc",
    }),
  }),
  createSavedProduct("product-4", {
    decisionStatus: "kept",
    plannedRoutineSlot: "not_sure",
    personalNote: "Muốn giữ lại để xem sau.",
    product: createProduct("product-4", {
      name: "Sữa rửa mặt hằng ngày",
      brand: "Bình Minh",
    }),
  }),
  createSavedProduct("product-5", {
    product: createProduct("product-5", {
      name: "Kem chống nắng nhẹ mặt",
      brand: "Nắng Mai",
    }),
  }),
  createSavedProduct("product-6", {
    decisionStatus: "" as never,
    plannedRoutineSlot: null as never,
    personalNote: null as never,
    product: createProduct("product-6", {
      name: undefined as never,
      brand: undefined as never,
    }),
  }),
];

function filters(
  overrides: Partial<SavedProductsFilterState> = {},
): SavedProductsFilterState {
  return {
    ...DEFAULT_SAVED_PRODUCTS_FILTERS,
    ...overrides,
  };
}

function productIds(result: SavedProductDto[]) {
  return result.map((item) => item.productId);
}

describe("saved product decision filters", () => {
  it("shows all products by default, including unset metadata", () => {
    expect(filterSavedProducts(items, filters())).toEqual(items);
    expect(hasActiveSavedProductFilters(filters())).toBe(false);
  });

  it.each([
    ["considering", ["product-1"]],
    ["testing", ["product-2"]],
    ["paused", ["product-3"]],
    ["kept", ["product-4"]],
    ["unset", ["product-5", "product-6"]],
  ] as const)("filters decisionStatus %s", (decisionStatus, expectedIds) => {
    expect(
      productIds(filterSavedProducts(items, filters({ decisionStatus }))),
    ).toEqual(expectedIds);
  });

  it("keeps unset decision statuses when the decision filter is all", () => {
    expect(filterSavedProducts(items, filters({ decisionStatus: "all" }))).toHaveLength(
      items.length,
    );
  });

  it.each([
    ["morning", ["product-1"]],
    ["evening", ["product-2"]],
    ["either", ["product-3"]],
    ["not_sure", ["product-4"]],
    ["unset", ["product-5", "product-6"]],
  ] as const)(
    "filters plannedRoutineSlot %s",
    (plannedRoutineSlot, expectedIds) => {
      expect(
        productIds(
          filterSavedProducts(items, filters({ plannedRoutineSlot })),
        ),
      ).toEqual(expectedIds);
    },
  );

  it("keeps unset routine slots when the slot filter is all", () => {
    expect(
      filterSavedProducts(items, filters({ plannedRoutineSlot: "all" })),
    ).toHaveLength(items.length);
  });

  it("filters products with a non-empty personal note", () => {
    expect(
      productIds(
        filterSavedProducts(items, filters({ noteStatus: "with_note" })),
      ),
    ).toEqual(["product-1", "product-4"]);
  });

  it("filters products without a trimmed personal note", () => {
    expect(
      productIds(
        filterSavedProducts(items, filters({ noteStatus: "without_note" })),
      ),
    ).toEqual(["product-2", "product-3", "product-5", "product-6"]);
  });

  it("keeps products with and without notes when the note filter is all", () => {
    expect(
      filterSavedProducts(items, filters({ noteStatus: "all" })),
    ).toHaveLength(items.length);
  });

  it.each([
    ["niacinamide dịu", ["product-1"]],
    ["lá xanh", ["product-1"]],
    ["cảm nhận với", ["product-1"]],
    ["SERUM NIACINAMIDE", ["product-1"]],
    ["  dưỡng ẩm phục hồi  ", ["product-2"]],
    ["sữa rửa mặt", ["product-4"]],
  ] as const)("searches loaded fields with query %s", (query, expectedIds) => {
    expect(
      productIds(filterSavedProducts(items, filters({ query }))),
    ).toEqual(expectedIds);
  });

  it("does not crash when product, name, brand, or note is missing", () => {
    const incompleteItems = [
      createSavedProduct("missing-product", {
        product: undefined as never,
        personalNote: undefined,
      }),
      items[5],
    ];

    expect(() =>
      filterSavedProducts(incompleteItems, filters({ query: "serum" })),
    ).not.toThrow();
    expect(
      filterSavedProducts(incompleteItems, filters({ query: "serum" })),
    ).toEqual([]);
  });

  it("combines search and filters with AND logic", () => {
    expect(
      productIds(
        filterSavedProducts(
          items,
          filters({
            query: "lá xanh",
            decisionStatus: "considering",
            plannedRoutineSlot: "morning",
            noteStatus: "with_note",
          }),
        ),
      ),
    ).toEqual(["product-1"]);

    expect(
      filterSavedProducts(
        items,
        filters({
          query: "lá xanh",
          decisionStatus: "testing",
        }),
      ),
    ).toEqual([]);
  });

  it("returns to all items when filters are reset to the default state", () => {
    const activeFilters = filters({
      query: "lá xanh",
      decisionStatus: "considering",
      plannedRoutineSlot: "morning",
      noteStatus: "with_note",
    });

    expect(hasActiveSavedProductFilters(activeFilters)).toBe(true);
    expect(filterSavedProducts(items, activeFilters)).toHaveLength(1);
    expect(
      filterSavedProducts(items, { ...DEFAULT_SAVED_PRODUCTS_FILTERS }),
    ).toEqual(items);
  });

  it("treats whitespace-only search as inactive", () => {
    expect(hasActiveSavedProductFilters(filters({ query: "   " }))).toBe(
      false,
    );
  });

  it("does not mutate the input items", () => {
    const snapshot = structuredClone(items);

    filterSavedProducts(
      items,
      filters({
        query: "serum",
        decisionStatus: "considering",
      }),
    );

    expect(items).toEqual(snapshot);
  });
});

describe("saved product decision summary", () => {
  it("counts all loaded products and each decision status", () => {
    expect(getSavedProductDecisionSummary(items)).toEqual({
      total: 6,
      considering: 1,
      testing: 1,
      paused: 1,
      kept: 1,
      unset: 2,
    });
  });

  it("remains based on the full loaded list when a filtered subset exists", () => {
    const filteredItems = filterSavedProducts(
      items,
      filters({ decisionStatus: "considering" }),
    );

    expect(filteredItems).toHaveLength(1);
    expect(getSavedProductDecisionSummary(items)).toEqual({
      total: 6,
      considering: 1,
      testing: 1,
      paused: 1,
      kept: 1,
      unset: 2,
    });
  });
});
