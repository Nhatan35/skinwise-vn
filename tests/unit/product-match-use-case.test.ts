import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/products/product.repository", () => ({
  listVisibleProductsForMatching: vi.fn(),
}));

vi.mock("@/modules/saved-products/saved-product.repository", () => ({
  listSavedProductsByUser: vi.fn(),
}));

vi.mock("@/modules/skin-profile/skin-profile.use-case", () => ({
  getSkinProfileForUser: vi.fn(),
}));

import { listVisibleProductsForMatching } from "@/modules/products/product.repository";
import type { Product } from "@/modules/products/product.types";
import { getProductMatchesForUser } from "@/modules/product-match/product-match.use-case";
import { listSavedProductsByUser } from "@/modules/saved-products/saved-product.repository";
import type { SavedProduct } from "@/modules/saved-products/saved-product.types";
import { getSkinProfileForUser } from "@/modules/skin-profile/skin-profile.use-case";
import type { SkinProfile } from "@/modules/skin-profile/skin-profile.types";

const mockedGetSkinProfileForUser = vi.mocked(getSkinProfileForUser);
const mockedListVisibleProductsForMatching = vi.mocked(
  listVisibleProductsForMatching,
);
const mockedListSavedProductsByUser = vi.mocked(listSavedProductsByUser);

const userId = "auth-user-id";
const fixedDate = new Date("2026-05-31T00:00:00.000Z");
const strongProductId = "665000000000000000002001";
const lowProductId = "665000000000000000002002";

function createSkinProfile(): SkinProfile {
  return {
    _id: new ObjectId("665000000000000000002101"),
    userId,
    skinType: "oily",
    concerns: ["acne", "oiliness"],
    sensitivityLevel: "medium",
    budgetRange: "300k_700k",
    experienceLevel: "beginner",
    avoidIngredients: [],
    createdAt: fixedDate,
    updatedAt: fixedDate,
  };
}

function createProduct(id: string, overrides: Partial<Product> = {}): Product {
  return {
    _id: new ObjectId(id),
    name: "Product",
    brand: "SkinWise Demo",
    category: "cleanser",
    priceRange: "budget",
    ingredientsText: "Water, Glycerin",
    keyActives: [],
    tags: [],
    warnings: [],
    skinTypes: ["oily"],
    concerns: ["acne", "oiliness"],
    suitableFor: [],
    notRecommendedFor: [],
    source: "admin",
    verificationStatus: "verified",
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

function createSavedProduct(productId: string): SavedProduct {
  return {
    _id: new ObjectId("665000000000000000002201"),
    userId,
    productId: new ObjectId(productId),
    createdAt: fixedDate,
    updatedAt: fixedDate,
  };
}

describe("Product Match use case", () => {
  beforeEach(() => {
    mockedGetSkinProfileForUser.mockReset();
    mockedListVisibleProductsForMatching.mockReset();
    mockedListSavedProductsByUser.mockReset();
  });

  it("returns no-profile response without loading products or saved products", async () => {
    mockedGetSkinProfileForUser.mockResolvedValue(null);

    const response = await getProductMatchesForUser(userId, { limit: 12 });

    expect(response).toMatchObject({
      skinProfileExists: false,
      items: [],
    });
    expect(response.generatedAt).toBeTruthy();
    expect(mockedGetSkinProfileForUser).toHaveBeenCalledWith(userId);
    expect(mockedListVisibleProductsForMatching).not.toHaveBeenCalled();
    expect(mockedListSavedProductsByUser).not.toHaveBeenCalled();
  });

  it("scores all visible candidates before sorting and applying the limit", async () => {
    mockedGetSkinProfileForUser.mockResolvedValue(createSkinProfile());
    mockedListVisibleProductsForMatching.mockResolvedValue([
      createProduct(lowProductId, {
        name: "Low Fit Treatment",
        category: "treatment",
        priceRange: "premium",
        keyActives: ["Retinol"],
        warnings: ["Can irritate sensitive skin."],
        skinTypes: ["dry"],
        concerns: ["texture"],
        verificationStatus: "reviewed",
      }),
      createProduct(strongProductId, {
        name: "Oily Skin Cleanser",
      }),
    ]);
    mockedListSavedProductsByUser.mockResolvedValue([
      createSavedProduct(strongProductId),
    ]);

    const response = await getProductMatchesForUser(userId, { limit: 1 });

    expect(mockedListVisibleProductsForMatching).toHaveBeenCalledTimes(1);
    expect(mockedListSavedProductsByUser).toHaveBeenCalledWith(userId);
    expect(response.skinProfileExists).toBe(true);
    expect(response.skinProfileSummary).toMatchObject({
      skinType: "oily",
      concerns: ["acne", "oiliness"],
      sensitivityLevel: "medium",
      budgetRange: "300k_700k",
      experienceLevel: "beginner",
    });
    expect(response.items).toHaveLength(1);
    expect(response.items[0]).toMatchObject({
      product: {
        id: strongProductId,
        name: "Oily Skin Cleanser",
      },
      matchScore: 100,
      matchLevel: "strong",
      isSaved: true,
    });
    expect(response.items[0]?.product).not.toHaveProperty("_id");
    expect(JSON.stringify(response)).not.toContain("userId");
    expect(JSON.stringify(response)).not.toContain("ObjectId");
  });

  it("returns all sorted items when limit allows them", async () => {
    mockedGetSkinProfileForUser.mockResolvedValue(createSkinProfile());
    mockedListVisibleProductsForMatching.mockResolvedValue([
      createProduct(lowProductId, {
        name: "Low Fit Treatment",
        category: "treatment",
        priceRange: "premium",
        keyActives: ["Retinol"],
        warnings: ["Can irritate sensitive skin."],
        skinTypes: ["dry"],
        concerns: ["texture"],
        verificationStatus: "reviewed",
      }),
      createProduct(strongProductId, {
        name: "Oily Skin Cleanser",
      }),
    ]);
    mockedListSavedProductsByUser.mockResolvedValue([]);

    const response = await getProductMatchesForUser(userId, { limit: 24 });

    expect(response.items.map((item) => item.product.id)).toEqual([
      strongProductId,
      lowProductId,
    ]);
    expect(response.items.every((item) => item.isSaved === false)).toBe(true);
  });
});
