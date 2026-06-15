import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/products/product.repository", () => ({
  findProductById: vi.fn(),
  findVisibleProductById: vi.fn(),
  searchProductsForAdmin: vi.fn(),
  searchVisibleProducts: vi.fn(),
  updateProductVerificationStatus: vi.fn(),
}));

import {
  getProductByIdForAdmin,
  getProductById,
  listProductsForAdmin,
  listProducts,
  updateProductVerificationStatusForAdmin,
} from "@/modules/products/product.use-case";
import {
  findProductById,
  findVisibleProductById,
  searchProductsForAdmin,
  searchVisibleProducts,
  updateProductVerificationStatus,
} from "@/modules/products/product.repository";
import type { Product } from "@/modules/products/product.types";

const mockedFindProductById = vi.mocked(findProductById);
const mockedFindVisibleProductById = vi.mocked(findVisibleProductById);
const mockedSearchProductsForAdmin = vi.mocked(searchProductsForAdmin);
const mockedSearchVisibleProducts = vi.mocked(searchVisibleProducts);
const mockedUpdateProductVerificationStatus = vi.mocked(
  updateProductVerificationStatus,
);

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
    mockedFindProductById.mockReset();
    mockedFindVisibleProductById.mockReset();
    mockedSearchProductsForAdmin.mockReset();
    mockedSearchVisibleProducts.mockReset();
    mockedUpdateProductVerificationStatus.mockReset();
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

  it("lists all product verification states for admin through the repository", async () => {
    mockedSearchProductsForAdmin.mockResolvedValue([
      product,
      {
        ...product,
        _id: new ObjectId("665000000000000000000313"),
        verificationStatus: "unverified",
      },
    ]);

    await expect(
      listProductsForAdmin({ verificationStatus: "unverified" }),
    ).resolves.toHaveLength(2);
    expect(mockedSearchProductsForAdmin).toHaveBeenCalledWith({
      verificationStatus: "unverified",
    });
    expect(mockedSearchVisibleProducts).not.toHaveBeenCalled();
  });

  it("gets a product by id for admin without the public visible repository", async () => {
    mockedFindProductById.mockResolvedValue({
      ...product,
      verificationStatus: "unverified",
    });

    await expect(getProductByIdForAdmin(productId)).resolves.toMatchObject({
      verificationStatus: "unverified",
    });
    expect(mockedFindProductById).toHaveBeenCalledWith(productId);
    expect(mockedFindVisibleProductById).not.toHaveBeenCalled();
  });

  it("updates verificationStatus for admin through the repository", async () => {
    mockedUpdateProductVerificationStatus.mockResolvedValue({
      ...product,
      verificationStatus: "verified",
    });

    await expect(
      updateProductVerificationStatusForAdmin(productId, "verified"),
    ).resolves.toMatchObject({
      verificationStatus: "verified",
    });
    expect(mockedUpdateProductVerificationStatus).toHaveBeenCalledWith(
      productId,
      "verified",
    );
  });
});
