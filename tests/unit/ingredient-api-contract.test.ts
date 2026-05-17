import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/ingredients/ingredient.use-case", () => ({
  getIngredientById: vi.fn(),
  listIngredients: vi.fn(),
}));

import * as ingredientByIdRoute from "@/app/api/ingredients/[id]/route";
import * as ingredientsRoute from "@/app/api/ingredients/route";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import {
  getIngredientById,
  listIngredients,
} from "@/modules/ingredients/ingredient.use-case";
import type { Ingredient } from "@/modules/ingredients/ingredient.types";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedGetIngredientById = vi.mocked(getIngredientById);
const mockedListIngredients = vi.mocked(listIngredients);

const authUserId = "auth-user-id";
const ingredientId = "665000000000000000000220";
const fixedDate = new Date("2026-05-14T00:00:00.000Z");

function createIngredient(
  overrides: Partial<Ingredient> = {},
): Ingredient {
  return {
    _id: new ObjectId(ingredientId),
    inciName: "Niacinamide",
    aliases: ["Vitamin B3"],
    functions: ["barrier_support"],
    commonUses: ["barrier support"],
    suitableFor: ["oily"],
    cautionFor: ["very sensitive skin"],
    avoidWith: [],
    evidenceLevel: "moderate",
    sourceRefs: ["manual-curation"],
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

describe("/api/ingredients contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedGetIngredientById.mockReset();
    mockedListIngredients.mockReset();
  });

  it("uses the Node.js runtime and exports the expected handlers", () => {
    expect(ingredientsRoute.runtime).toBe("nodejs");
    expect(ingredientByIdRoute.runtime).toBe("nodejs");
    expect(ingredientsRoute.GET).toBeTypeOf("function");
    expect(ingredientByIdRoute.GET).toBeTypeOf("function");
  });

  it("requires authentication for ingredient endpoints", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const listResponse = await ingredientsRoute.GET(
      new Request("http://localhost/api/ingredients"),
    );
    const detailResponse = await ingredientByIdRoute.GET(
      new Request(`http://localhost/api/ingredients/${ingredientId}`),
      routeContext(ingredientId),
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
    expect(mockedListIngredients).not.toHaveBeenCalled();
    expect(mockedGetIngredientById).not.toHaveBeenCalled();
  });

  it("returns ingredients in the expected list envelope", async () => {
    mockAuthenticatedUser();
    mockedListIngredients.mockResolvedValue([createIngredient()]);

    const response = await ingredientsRoute.GET(
      new Request("http://localhost/api/ingredients?q= nia &function=barrier_support&limit=5"),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: {
        items: [
          {
            id: ingredientId,
            inciName: "Niacinamide",
            aliases: ["Vitamin B3"],
            functions: ["barrier_support"],
            commonUses: ["barrier support"],
            suitableFor: ["oily"],
            cautionFor: ["very sensitive skin"],
            avoidWith: [],
            evidenceLevel: "moderate",
            sourceRefs: ["manual-curation"],
            createdAt: fixedDate.toISOString(),
            updatedAt: fixedDate.toISOString(),
          },
        ],
      },
      error: null,
    });
    expect(mockedListIngredients).toHaveBeenCalledWith({
      q: "nia",
      function: "barrier_support",
      limit: 5,
    });
    expect(serializedBody).not.toContain("_id");
    expect(serializedBody).not.toContain("ObjectId");
  });

  it("rejects invalid query params with VALIDATION_ERROR", async () => {
    mockAuthenticatedUser();

    const response = await ingredientsRoute.GET(
      new Request("http://localhost/api/ingredients?includeMine=true"),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "VALIDATION_ERROR",
      },
    });
    expect(response.status).toBe(400);
    expect(mockedListIngredients).not.toHaveBeenCalled();
  });

  it("returns one ingredient in the expected detail envelope", async () => {
    mockAuthenticatedUser();
    mockedGetIngredientById.mockResolvedValue(createIngredient());

    const response = await ingredientByIdRoute.GET(
      new Request(`http://localhost/api/ingredients/${ingredientId}`),
      routeContext(ingredientId),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: {
        ingredient: {
          id: ingredientId,
          inciName: "Niacinamide",
        },
      },
      error: null,
    });
    expect(response.status).toBe(200);
    expect(mockedGetIngredientById).toHaveBeenCalledWith(ingredientId);
  });

  it("returns NOT_FOUND for invalid or missing ingredient ids", async () => {
    mockAuthenticatedUser();
    mockedGetIngredientById.mockResolvedValue(null);

    const response = await ingredientByIdRoute.GET(
      new Request("http://localhost/api/ingredients/not-an-object-id"),
      routeContext("not-an-object-id"),
    );

    await expect(readJson(response)).resolves.toEqual({
      data: null,
      error: {
        code: "NOT_FOUND",
        message: "Ingredient was not found.",
        details: {},
      },
    });
    expect(response.status).toBe(404);
  });

  it("returns generic INTERNAL_ERROR without leaking raw errors", async () => {
    mockAuthenticatedUser();
    mockedListIngredients.mockRejectedValue(
      new Error(
        "MongoServerError MONGODB_URI=mongodb+srv://secret AUTH_SECRET=secret token session stack",
      ),
    );

    const response = await ingredientsRoute.GET(
      new Request("http://localhost/api/ingredients"),
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
