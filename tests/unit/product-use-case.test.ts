import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/products/product.repository", () => ({
  findVisibleProductById: vi.fn(),
  searchVisibleProducts: vi.fn(),
}));

import {
  getProductById,
  listProducts,
} from "@/modules/products/product.use-case";
import {
  findVisibleProductById,
  searchVisibleProducts,
} from "@/modules/products/product.repository";
import type { Product } from "@/modules/products/product.types";

const mockedFindVisibleProductById = vi.mocked(findVisibleProductById);
const mockedSearchVisibleProducts = vi.mocked(searchVisibleProducts);

const fixedNow = new Date("2026-05-14T00:00:00.000Z");
const productId = "665000000000000000000312";

const product = {
  _id: new ObjectId(productId),
  name: "Example Gentle Cleanser",
  brand: "Example Brand",
  category: "cleanser",
  priceRange: "budget",
  ingredientsText: "Water, Glycerin, Panthenol",
  keyActives: ["Panthenol"],
  tags: ["gentle"],
  warnings: [],
  skinTypes: ["sensitive"],
  concerns: ["barrier_support"],
  suitableFor: ["basic routine"],
  notRecommendedFor: [],
  source: "manual",
  verificationStatus: "reviewed",
  createdAt: fixedNow,
  updatedAt: fixedNow,
} satisfies Product;

describe("Product use cases", () => {
  beforeEach(() => {
    mockedFindVisibleProductById.mockReset();
    mockedSearchVisibleProducts.mockReset();
  });

  it("lists only reviewed or verified products by default through the repository", async () => {
    mockedSearchVisibleProducts.mockResolvedValue([product]);

    await expect(listProducts({ limit: 20 })).resolves.toEqual([product]);
    expect(mockedSearchVisibleProducts).toHaveBeenCalledWith({ limit: 20 });
  });

  it("passes category filters to the repository", async () => {
    mockedSearchVisibleProducts.mockResolvedValue([product]);

    await listProducts({ category: "cleanser", limit: 10 });

    expect(mockedSearchVisibleProducts).toHaveBeenCalledWith({
      category: "cleanser",
      limit: 10,
    });
  });

  it("passes priceRange filters to the repository", async () => {
    mockedSearchVisibleProducts.mockResolvedValue([product]);

    await listProducts({ priceRange: "budget", limit: 10 });

    expect(mockedSearchVisibleProducts).toHaveBeenCalledWith({
      priceRange: "budget",
      limit: 10,
    });
  });

  it("passes skinType filters to the repository", async () => {
    mockedSearchVisibleProducts.mockResolvedValue([product]);

    await listProducts({ skinType: "sensitive", limit: 10 });

    expect(mockedSearchVisibleProducts).toHaveBeenCalledWith({
      skinType: "sensitive",
      limit: 10,
    });
  });

  it("passes concern filters to the repository", async () => {
    mockedSearchVisibleProducts.mockResolvedValue([product]);

    await listProducts({ concern: "barrier_support", limit: 10 });

    expect(mockedSearchVisibleProducts).toHaveBeenCalledWith({
      concern: "barrier_support",
      limit: 10,
    });
  });

  it("passes q search to the repository", async () => {
    mockedSearchVisibleProducts.mockResolvedValue([product]);

    await listProducts({ q: "cleanser", limit: 5 });

    expect(mockedSearchVisibleProducts).toHaveBeenCalledWith({
      q: "cleanser",
      limit: 5,
    });
  });

  it("gets a visible product by id", async () => {
    mockedFindVisibleProductById.mockResolvedValue(product);

    await expect(getProductById(productId)).resolves.toBe(product);
    expect(mockedFindVisibleProductById).toHaveBeenCalledWith(productId);
  });

  it("returns null for invalid, missing, or not visible products through the repository", async () => {
    mockedFindVisibleProductById.mockResolvedValue(null);

    await expect(getProductById("not-an-object-id")).resolves.toBeNull();
  });
});
