import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/products/product.use-case", () => ({
  listProductsForAdmin: vi.fn(),
}));

vi.mock("@/modules/ingredients/ingredient.use-case", () => ({
  countIngredientsForAdmin: vi.fn(),
}));

import {
  ADMIN_CONTENT_DASHBOARD_BOUNDARY_NOTE,
  getAdminContentSummary,
  summarizeAdminProductStatuses,
} from "@/modules/admin/admin-content-summary.use-case";
import { countIngredientsForAdmin } from "@/modules/ingredients/ingredient.use-case";
import { listProductsForAdmin } from "@/modules/products/product.use-case";
import { routes } from "@/shared/constants/routes";

const mockedListProductsForAdmin = vi.mocked(listProductsForAdmin);
const mockedCountIngredientsForAdmin = vi.mocked(countIngredientsForAdmin);

function productWithStatus(verificationStatus?: string | null) {
  return {
    verificationStatus,
  } as never;
}

describe("Admin content summary use case", () => {
  beforeEach(() => {
    mockedListProductsForAdmin.mockReset();
    mockedCountIngredientsForAdmin.mockReset();
  });

  it("returns zero counts when products and ingredients are empty", async () => {
    mockedListProductsForAdmin.mockResolvedValue([]);
    mockedCountIngredientsForAdmin.mockResolvedValue(0);

    await expect(getAdminContentSummary()).resolves.toMatchObject({
      products: {
        total: 0,
        unverified: 0,
        reviewed: 0,
        verified: 0,
      },
      ingredients: {
        total: 0,
      },
    });
  });

  it("counts total products and verification status buckets", async () => {
    mockedListProductsForAdmin.mockResolvedValue([
      productWithStatus("unverified"),
      productWithStatus("unverified"),
      productWithStatus("reviewed"),
      productWithStatus("verified"),
      productWithStatus("verified"),
    ]);
    mockedCountIngredientsForAdmin.mockResolvedValue(12);

    await expect(getAdminContentSummary()).resolves.toMatchObject({
      products: {
        total: 5,
        unverified: 2,
        reviewed: 1,
        verified: 2,
      },
      ingredients: {
        total: 12,
      },
    });
    expect(mockedListProductsForAdmin).toHaveBeenCalledWith({});
  });

  it("returns admin management links and the release boundary note", async () => {
    mockedListProductsForAdmin.mockResolvedValue([]);
    mockedCountIngredientsForAdmin.mockResolvedValue(0);

    const summary = await getAdminContentSummary();

    expect(summary.products.manageHref).toBe(routes.ADMIN_PRODUCTS);
    expect(summary.ingredients.manageHref).toBe(routes.ADMIN_INGREDIENTS);
    expect(summary.boundaryNote).toBe(ADMIN_CONTENT_DASHBOARD_BOUNDARY_NOTE);
    expect(summary.boundaryNote).toContain("Production-ready is not claimed");
    expect(summary.boundaryNote).toContain("v1.48 remains incomplete");
  });

  it("does not mutate product input data while summarizing", () => {
    const products = [
      productWithStatus("unverified"),
      productWithStatus("reviewed"),
      productWithStatus("verified"),
    ];
    const before = JSON.stringify(products);

    summarizeAdminProductStatuses(products);

    expect(JSON.stringify(products)).toBe(before);
  });

  it("handles unknown or missing product status safely", () => {
    expect(
      summarizeAdminProductStatuses([
        productWithStatus("legacy-status"),
        productWithStatus(null),
        productWithStatus(undefined),
        productWithStatus("unverified"),
      ]),
    ).toEqual({
      total: 4,
      unverified: 1,
      reviewed: 0,
      verified: 0,
    });
  });
});
