import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/products/product.use-case", () => ({
  getProductById: vi.fn(),
  listProducts: vi.fn(),
}));

import * as productByIdRoute from "@/app/api/products/[id]/route";
import * as productsRoute from "@/app/api/products/route";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import {
  getProductById,
  listProducts,
} from "@/modules/products/product.use-case";
import type { Product } from "@/modules/products/product.types";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedGetProductById = vi.mocked(getProductById);
const mockedListProducts = vi.mocked(listProducts);

const authUserId = "auth-user-id";
const productId = "665000000000000000000320";
const fixedDate = new Date("2026-05-14T00:00:00.000Z");

function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    _id: new ObjectId(productId),
    name: "Example Gentle Cleanser",
    brand: "Example Brand",
    category: "cleanser",
    priceRange: "budget",
    ingredientsText: "Water, Glycerin, Panthenol",
    keyActives: ["Panthenol"],
    tags: ["gentle", "basic-routine"],
    warnings: [],
    skinTypes: ["sensitive"],
    concerns: ["barrier_support"],
    suitableFor: ["basic morning routine"],
    notRecommendedFor: ["known allergy to listed ingredients"],
    source: "user_submitted",
    verificationStatus: "reviewed",
    createdByUserId: new ObjectId("665000000000000000000321"),
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

function routeContext(id: string) {
  return {
    params: Promise.resolve({ id }),
  };
}

async function readJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

function mockAuthenticatedUser(userId = authUserId) {
  mockedGetCurrentUser.mockResolvedValue({
    id: userId,
    email: "an@example.com",
    name: "An",
  });
}

describe("/api/products contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedGetProductById.mockReset();
    mockedListProducts.mockReset();
  });

  it("uses the Node.js runtime and exports the expected handlers", () => {
    expect(productsRoute.runtime).toBe("nodejs");
    expect(productByIdRoute.runtime).toBe("nodejs");
    expect(productsRoute.GET).toBeTypeOf("function");
    expect(productByIdRoute.GET).toBeTypeOf("function");
  });

  it("requires authentication for product endpoints", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const listResponse = await productsRoute.GET(
      new Request("http://localhost/api/products"),
    );
    const detailResponse = await productByIdRoute.GET(
      new Request(`http://localhost/api/products/${productId}`),
      routeContext(productId),
    );

    for (const response of [listResponse, detailResponse]) {
      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "UNAUTHORIZED",
        },
      });
      expect(response.status).toBe(401);
    }
    expect(mockedListProducts).not.toHaveBeenCalled();
    expect(mockedGetProductById).not.toHaveBeenCalled();
  });

  it("returns products in the expected list envelope", async () => {
    mockAuthenticatedUser();
    mockedListProducts.mockResolvedValue([createProduct()]);

    const response = await productsRoute.GET(
      new Request(
        "http://localhost/api/products?q= cleanser &category=cleanser&priceRange=budget&skinType=sensitive&concern=barrier_support&limit=5",
      ),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: {
        items: [
          {
            id: productId,
            name: "Example Gentle Cleanser",
            brand: "Example Brand",
            category: "cleanser",
            priceRange: "budget",
            ingredientsText: "Water, Glycerin, Panthenol",
            keyActives: ["Panthenol"],
            tags: ["gentle", "basic-routine"],
            warnings: [],
            skinTypes: ["sensitive"],
            concerns: ["barrier_support"],
            suitableFor: ["basic morning routine"],
            notRecommendedFor: ["known allergy to listed ingredients"],
            verificationStatus: "reviewed",
            createdAt: fixedDate.toISOString(),
            updatedAt: fixedDate.toISOString(),
          },
        ],
      },
      error: null,
    });
    expect(mockedListProducts).toHaveBeenCalledWith({
      q: "cleanser",
      category: "cleanser",
      priceRange: "budget",
      skinType: "sensitive",
      concern: "barrier_support",
      limit: 5,
    });
    expect(serializedBody).not.toContain("_id");
    expect(serializedBody).not.toContain("ObjectId");
    expect(serializedBody).not.toContain("createdByUserId");
    expect(serializedBody).not.toContain("source");
  });

  it("rejects invalid query params with VALIDATION_ERROR", async () => {
    mockAuthenticatedUser();

    const response = await productsRoute.GET(
      new Request("http://localhost/api/products?includeMine=true"),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "VALIDATION_ERROR",
      },
    });
    expect(response.status).toBe(400);
    expect(mockedListProducts).not.toHaveBeenCalled();
  });

  it("returns one visible product in the expected detail envelope", async () => {
    mockAuthenticatedUser();
    mockedGetProductById.mockResolvedValue(createProduct());

    const response = await productByIdRoute.GET(
      new Request(`http://localhost/api/products/${productId}`),
      routeContext(productId),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: {
        product: {
          id: productId,
          name: "Example Gentle Cleanser",
          verificationStatus: "reviewed",
        },
      },
      error: null,
    });
    expect(response.status).toBe(200);
    expect(mockedGetProductById).toHaveBeenCalledWith(productId);
  });

  it("returns NOT_FOUND for invalid, missing, or not visible product ids", async () => {
    mockAuthenticatedUser();
    mockedGetProductById.mockResolvedValue(null);

    const invalidResponse = await productByIdRoute.GET(
      new Request("http://localhost/api/products/not-an-object-id"),
      routeContext("not-an-object-id"),
    );
    const missingResponse = await productByIdRoute.GET(
      new Request(`http://localhost/api/products/${productId}`),
      routeContext(productId),
    );
    const notVisibleResponse = await productByIdRoute.GET(
      new Request("http://localhost/api/products/665000000000000000000399"),
      routeContext("665000000000000000000399"),
    );

    for (const response of [
      invalidResponse,
      missingResponse,
      notVisibleResponse,
    ]) {
      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "NOT_FOUND",
        },
      });
      expect(response.status).toBe(404);
    }
  });

  it("returns generic INTERNAL_ERROR without leaking raw errors", async () => {
    mockAuthenticatedUser();
    mockedListProducts.mockRejectedValue(
      new Error(
        "MongoServerError MONGODB_URI=mongodb+srv://secret AUTH_SECRET=secret token session stack",
      ),
    );

    const response = await productsRoute.GET(
      new Request("http://localhost/api/products"),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(500);
    expect(body).toEqual({
      data: null,
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong.",
        details: {},
      },
    });
    expect(serializedBody).not.toContain("MongoServerError");
    expect(serializedBody).not.toContain("MONGODB_URI");
    expect(serializedBody).not.toContain("AUTH_SECRET");
    expect(serializedBody).not.toContain("token");
    expect(serializedBody).not.toContain("session");
    expect(serializedBody).not.toContain("stack");
  });
});
