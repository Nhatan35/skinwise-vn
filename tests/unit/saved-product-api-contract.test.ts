import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/saved-products/saved-product.use-case", () => {
  class SavedProductProductNotFoundError extends Error {
    constructor(message = "Product was not found.") {
      super(message);
      this.name = "SavedProductProductNotFoundError";
    }
  }

  return {
    listSavedProductsForUser: vi.fn(),
    removeSavedProductForUser: vi.fn(),
    saveProductForUser: vi.fn(),
    SavedProductProductNotFoundError,
    updateSavedProductMetadata: vi.fn(),
  };
});

import * as savedProductByProductIdRoute from "@/app/api/saved-products/[productId]/route";
import * as savedProductsRoute from "@/app/api/saved-products/route";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import type { SavedProductDto } from "@/modules/saved-products/saved-product.dto";
import {
  listSavedProductsForUser,
  removeSavedProductForUser,
  saveProductForUser,
  SavedProductProductNotFoundError,
  updateSavedProductMetadata,
} from "@/modules/saved-products/saved-product.use-case";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedListSavedProductsForUser = vi.mocked(listSavedProductsForUser);
const mockedRemoveSavedProductForUser = vi.mocked(removeSavedProductForUser);
const mockedSaveProductForUser = vi.mocked(saveProductForUser);
const mockedUpdateSavedProductMetadata = vi.mocked(
  updateSavedProductMetadata,
);

const authUserId = "auth-user-id";
const productId = "665000000000000000000320";
const savedProductId = "665000000000000000000620";
const fixedDate = "2026-05-24T00:00:00.000Z";

function createSavedProduct(
  overrides: Partial<SavedProductDto> = {},
): SavedProductDto {
  return {
    id: savedProductId,
    productId,
    product: {
      id: productId,
      name: "Niacinamide 5% Serum",
      brand: "SkinWise Demo",
      category: "serum",
      priceRange: "budget",
      ingredientsText: "Water, Niacinamide, Zinc PCA, Panthenol",
      keyActives: ["Niacinamide"],
      tags: ["oiliness-support"],
      warnings: ["Introduce gradually if your skin is easily irritated."],
      skinTypes: ["oily", "combination"],
      concerns: ["acne", "oiliness"],
      suitableFor: ["beginner serum step"],
      notRecommendedFor: ["currently irritated skin"],
      verificationStatus: "verified",
      createdAt: fixedDate,
      updatedAt: fixedDate,
    },
    tags: [],
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

function routeContext(id: string) {
  return {
    params: Promise.resolve({ productId: id }),
  };
}

function jsonRequest(url: string, method: string, body: unknown) {
  return new Request(url, {
    body: JSON.stringify(body),
    method,
  });
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

describe("/api/saved-products contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedListSavedProductsForUser.mockReset();
    mockedRemoveSavedProductForUser.mockReset();
    mockedSaveProductForUser.mockReset();
    mockedUpdateSavedProductMetadata.mockReset();
  });

  it("uses the Node.js runtime and exports expected handlers", () => {
    expect(savedProductsRoute.runtime).toBe("nodejs");
    expect(savedProductByProductIdRoute.runtime).toBe("nodejs");
    expect(savedProductsRoute.GET).toBeTypeOf("function");
    expect(savedProductsRoute.POST).toBeTypeOf("function");
    expect(savedProductByProductIdRoute.PATCH).toBeTypeOf("function");
    expect(savedProductByProductIdRoute.DELETE).toBeTypeOf("function");
  });

  it("requires authentication for saved product endpoints", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const getResponse = await savedProductsRoute.GET();
    const postResponse = await savedProductsRoute.POST(
      jsonRequest("http://localhost/api/saved-products", "POST", { productId }),
    );
    const deleteResponse = await savedProductByProductIdRoute.DELETE(
      new Request(`http://localhost/api/saved-products/${productId}`, {
        method: "DELETE",
      }),
      routeContext(productId),
    );
    const patchResponse = await savedProductByProductIdRoute.PATCH(
      jsonRequest(
        `http://localhost/api/saved-products/${productId}`,
        "PATCH",
        { decisionStatus: "testing" },
      ),
      routeContext(productId),
    );

    for (const response of [
      getResponse,
      postResponse,
      deleteResponse,
      patchResponse,
    ]) {
      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "UNAUTHORIZED",
        },
      });
      expect(response.status).toBe(401);
    }
    expect(mockedListSavedProductsForUser).not.toHaveBeenCalled();
    expect(mockedSaveProductForUser).not.toHaveBeenCalled();
    expect(mockedRemoveSavedProductForUser).not.toHaveBeenCalled();
    expect(mockedUpdateSavedProductMetadata).not.toHaveBeenCalled();
  });

  it("returns current user saved products in the expected envelope", async () => {
    mockAuthenticatedUser();
    mockedListSavedProductsForUser.mockResolvedValue([createSavedProduct()]);

    const response = await savedProductsRoute.GET();
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: {
        items: [createSavedProduct()],
      },
      error: null,
    });
    expect(mockedListSavedProductsForUser).toHaveBeenCalledWith(authUserId);
    expect(serializedBody).not.toContain("userId");
    expect(serializedBody).not.toContain("_id");
    expect(serializedBody).not.toContain("ObjectId");
  });

  it("saves one product for the authenticated user", async () => {
    mockAuthenticatedUser();
    mockedSaveProductForUser.mockResolvedValue(createSavedProduct());

    const response = await savedProductsRoute.POST(
      jsonRequest("http://localhost/api/saved-products", "POST", { productId }),
    );

    await expect(readJson(response)).resolves.toEqual({
      data: {
        item: createSavedProduct(),
      },
      error: null,
    });
    expect(response.status).toBe(201);
    expect(mockedSaveProductForUser).toHaveBeenCalledWith(authUserId, productId);
  });

  it("rejects invalid POST bodies and client-submitted ownership fields", async () => {
    mockAuthenticatedUser();

    const invalidBodies = [
      {},
      { productId: "not-an-object-id" },
      { productId, userId: authUserId },
      { productId, id: savedProductId },
      { productId, createdAt: fixedDate },
    ];

    for (const body of invalidBodies) {
      const response = await savedProductsRoute.POST(
        jsonRequest("http://localhost/api/saved-products", "POST", body),
      );

      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
      expect(response.status).toBe(400);
    }
    expect(mockedSaveProductForUser).not.toHaveBeenCalled();
  });

  it("returns NOT_FOUND when saving a nonexistent product", async () => {
    mockAuthenticatedUser();
    mockedSaveProductForUser.mockRejectedValue(
      new SavedProductProductNotFoundError(),
    );

    const response = await savedProductsRoute.POST(
      jsonRequest("http://localhost/api/saved-products", "POST", { productId }),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "NOT_FOUND",
      },
    });
    expect(response.status).toBe(404);
  });

  it("removes only the current user's saved product idempotently", async () => {
    mockAuthenticatedUser();
    mockedRemoveSavedProductForUser.mockResolvedValue(true);

    const response = await savedProductByProductIdRoute.DELETE(
      new Request(`http://localhost/api/saved-products/${productId}`, {
        method: "DELETE",
      }),
      routeContext(productId),
    );

    await expect(readJson(response)).resolves.toEqual({
      data: {
        removed: true,
      },
      error: null,
    });
    expect(response.status).toBe(200);
    expect(mockedRemoveSavedProductForUser).toHaveBeenCalledWith(
      authUserId,
      productId,
    );
  });

  it("updates saved product metadata for the authenticated owner", async () => {
    mockAuthenticatedUser();
    const updatedItem = createSavedProduct({
      decisionStatus: "testing",
      plannedRoutineSlot: "evening",
      personalNote: "Muốn thử sau khi routine hiện tại ổn định hơn.",
    });

    mockedUpdateSavedProductMetadata.mockResolvedValue(updatedItem);

    const response = await savedProductByProductIdRoute.PATCH(
      jsonRequest(
        `http://localhost/api/saved-products/${productId}`,
        "PATCH",
        {
          decisionStatus: "testing",
          plannedRoutineSlot: "evening",
          personalNote: "  Muốn thử sau khi routine hiện tại ổn định hơn.  ",
        },
      ),
      routeContext(productId),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: {
        item: updatedItem,
      },
      error: null,
    });
    expect(mockedUpdateSavedProductMetadata).toHaveBeenCalledWith(
      authUserId,
      productId,
      {
        decisionStatus: "testing",
        plannedRoutineSlot: "evening",
        personalNote: "Muốn thử sau khi routine hiện tại ổn định hơn.",
      },
    );

    for (const privateField of [
      "userId",
      "_id",
      "ObjectId",
      "owner",
      "ownership",
    ]) {
      expect(serializedBody).not.toContain(privateField);
    }
  });

  it("updates saved product tags for the authenticated owner", async () => {
    mockAuthenticatedUser();
    const updatedItem = createSavedProduct({ tags: ["To buy", "Patch test"] });

    mockedUpdateSavedProductMetadata.mockResolvedValue(updatedItem);

    const response = await savedProductByProductIdRoute.PATCH(
      jsonRequest(
        `http://localhost/api/saved-products/${productId}`,
        "PATCH",
        {
          tags: ["  To buy  ", "Patch test"],
        },
      ),
      routeContext(productId),
    );

    expect(response.status).toBe(200);
    await expect(readJson(response)).resolves.toEqual({
      data: {
        item: updatedItem,
      },
      error: null,
    });
    expect(mockedUpdateSavedProductMetadata).toHaveBeenCalledWith(
      authUserId,
      productId,
      {
        tags: ["To buy", "Patch test"],
      },
    );
  });

  it("rejects invalid PATCH params, bodies, metadata, JSON, and internal fields", async () => {
    mockAuthenticatedUser();

    const invalidRequests: Array<{
      body: BodyInit;
      id: string;
    }> = [
      { body: JSON.stringify({ decisionStatus: "testing" }), id: "bad-id" },
      { body: JSON.stringify({}), id: productId },
      {
        body: JSON.stringify({ decisionStatus: "recommended" }),
        id: productId,
      },
      {
        body: JSON.stringify({ plannedRoutineSlot: "weekly" }),
        id: productId,
      },
      {
        body: JSON.stringify({ personalNote: "a".repeat(1001) }),
        id: productId,
      },
      { body: JSON.stringify({ tags: [""] }), id: productId },
      { body: JSON.stringify({ tags: ["To buy", "to buy"] }), id: productId },
      { body: JSON.stringify({ tags: ["a".repeat(31)] }), id: productId },
      { body: JSON.stringify({ tags: ["not allowed!"] }), id: productId },
      {
        body: JSON.stringify({
          tags: [
            "one",
            "two",
            "three",
            "four",
            "five",
            "six",
            "seven",
            "eight",
            "nine",
          ],
        }),
        id: productId,
      },
      { body: JSON.stringify({ userId: authUserId }), id: productId },
      { body: JSON.stringify({ productId }), id: productId },
      { body: JSON.stringify({ product: {} }), id: productId },
      { body: JSON.stringify({ owner: authUserId }), id: productId },
      { body: JSON.stringify({ ownership: "current" }), id: productId },
      { body: "{", id: productId },
    ];

    for (const invalidRequest of invalidRequests) {
      const response = await savedProductByProductIdRoute.PATCH(
        new Request(
          `http://localhost/api/saved-products/${invalidRequest.id}`,
          {
            body: invalidRequest.body,
            method: "PATCH",
          },
        ),
        routeContext(invalidRequest.id),
      );

      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
      expect(response.status).toBe(400);
    }

    expect(mockedUpdateSavedProductMetadata).not.toHaveBeenCalled();
  });

  it("returns NOT_FOUND when the current user has not saved the product", async () => {
    mockAuthenticatedUser();
    mockedUpdateSavedProductMetadata.mockResolvedValue(null);

    const response = await savedProductByProductIdRoute.PATCH(
      jsonRequest(
        `http://localhost/api/saved-products/${productId}`,
        "PATCH",
        { personalNote: "Ghi chú riêng." },
      ),
      routeContext(productId),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "NOT_FOUND",
      },
    });
    expect(response.status).toBe(404);
  });

  it("returns generic INTERNAL_ERROR when PATCH fails unexpectedly", async () => {
    mockAuthenticatedUser();
    mockedUpdateSavedProductMetadata.mockRejectedValue(
      new Error("MongoServerError secret ownership stack"),
    );

    const response = await savedProductByProductIdRoute.PATCH(
      jsonRequest(
        `http://localhost/api/saved-products/${productId}`,
        "PATCH",
        { decisionStatus: "kept" },
      ),
      routeContext(productId),
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
    expect(serializedBody).not.toContain("secret");
    expect(serializedBody).not.toContain("stack");
  });

  it("rejects invalid DELETE productId params", async () => {
    mockAuthenticatedUser();

    const response = await savedProductByProductIdRoute.DELETE(
      new Request("http://localhost/api/saved-products/not-an-object-id", {
        method: "DELETE",
      }),
      routeContext("not-an-object-id"),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "VALIDATION_ERROR",
      },
    });
    expect(response.status).toBe(400);
    expect(mockedRemoveSavedProductForUser).not.toHaveBeenCalled();
  });

  it("returns generic INTERNAL_ERROR without leaking raw errors", async () => {
    mockAuthenticatedUser();
    mockedListSavedProductsForUser.mockRejectedValue(
      new Error(
        "MongoServerError MONGODB_URI=mongodb+srv://secret AUTH_SECRET=secret token session stack",
      ),
    );

    const response = await savedProductsRoute.GET();
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
