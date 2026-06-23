import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/users/app-user-profile.repository", () => ({
  findAppUserProfileByUserId: vi.fn(),
}));

vi.mock("@/modules/ingredients/ingredient.use-case", () => {
  class DuplicateIngredientInciNameError extends Error {
    constructor() {
      super("Ingredient INCI name already exists.");
      this.name = "DuplicateIngredientInciNameError";
    }
  }

  return {
    createIngredientForAdmin: vi.fn(),
    DuplicateIngredientInciNameError,
    getIngredientById: vi.fn(),
    listIngredients: vi.fn(),
    listIngredientsForAdmin: vi.fn(),
    updateIngredientForAdmin: vi.fn(),
  };
});

vi.mock("@/modules/ingredients/explain-ingredient.use-case", () => ({
  explainIngredient: vi.fn(),
}));

vi.mock("@/infrastructure/rate-limiting/rate-limit", () => ({
  checkRateLimit: vi.fn(),
}));

import * as adminIngredientByIdRoute from "@/app/api/admin/ingredients/[id]/route";
import * as adminIngredientsRoute from "@/app/api/admin/ingredients/route";
import * as ingredientByIdRoute from "@/app/api/ingredients/[id]/route";
import * as ingredientExplanationRoute from "@/app/api/ingredients/explain/route";
import * as ingredientsRoute from "@/app/api/ingredients/route";
import { checkRateLimit } from "@/infrastructure/rate-limiting/rate-limit";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import type { IngredientExplanationDto } from "@/modules/ingredients/ingredient-explanation.dto";
import { explainIngredient } from "@/modules/ingredients/explain-ingredient.use-case";
import {
  createIngredientForAdmin,
  DuplicateIngredientInciNameError,
  getIngredientById,
  listIngredients,
  listIngredientsForAdmin,
  updateIngredientForAdmin,
} from "@/modules/ingredients/ingredient.use-case";
import type { Ingredient } from "@/modules/ingredients/ingredient.types";
import { findAppUserProfileByUserId } from "@/modules/users/app-user-profile.repository";
import type { AppUserProfile } from "@/modules/users/app-user-profile.types";

const mockedCheckRateLimit = vi.mocked(checkRateLimit);
const mockedCreateIngredientForAdmin = vi.mocked(createIngredientForAdmin);
const mockedExplainIngredient = vi.mocked(explainIngredient);
const mockedFindAppUserProfileByUserId = vi.mocked(findAppUserProfileByUserId);
const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedGetIngredientById = vi.mocked(getIngredientById);
const mockedListIngredients = vi.mocked(listIngredients);
const mockedListIngredientsForAdmin = vi.mocked(listIngredientsForAdmin);
const mockedUpdateIngredientForAdmin = vi.mocked(updateIngredientForAdmin);

const authUserId = "auth-user-id";
const ingredientId = "665000000000000000000810";
const missingIngredientId = "665000000000000000000811";
const fixedDate = new Date("2026-06-21T00:00:00.000Z");

function createProfile(
  overrides: Partial<AppUserProfile> = {},
): AppUserProfile {
  return {
    _id: new ObjectId("665000000000000000000800"),
    accountDeletionRequestedAt: null,
    createdAt: fixedDate,
    onboardingCompleted: true,
    role: "USER",
    updatedAt: fixedDate,
    userId: authUserId,
    ...overrides,
  };
}

function createIngredient(
  overrides: Partial<Ingredient> = {},
): Ingredient {
  return {
    _id: new ObjectId(ingredientId),
    aliases: ["Vitamin B3"],
    avoidWith: [],
    cautionFor: ["very sensitive skin"],
    commonUses: ["barrier support"],
    createdAt: fixedDate,
    evidenceLevel: "moderate",
    functions: ["barrier_support"],
    inciName: "Niacinamide",
    sourceRefs: ["manual-curation"],
    suitableFor: ["oily"],
    updatedAt: fixedDate,
    ...overrides,
  };
}

function createAdminIngredientPayload() {
  return {
    aliases: ["Vitamin B3"],
    avoidWith: [],
    cautionFor: ["very sensitive skin"],
    commonUses: ["barrier support"],
    evidenceLevel: "moderate",
    functions: ["barrier_support"],
    inciName: "Admin Smoke Ingredient",
    sourceRefs: ["manual-curation"],
    suitableFor: ["oily"],
  };
}

function routeContext(id: string) {
  return {
    params: Promise.resolve({ id }),
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

function mockCurrentUser() {
  mockedGetCurrentUser.mockResolvedValue({
    email: "an@example.com",
    id: authUserId,
    name: "An",
  });
}

function mockAdminUser() {
  mockCurrentUser();
  mockedFindAppUserProfileByUserId.mockResolvedValue(
    createProfile({ role: "ADMIN" }),
  );
}

function mockRegularUser() {
  mockCurrentUser();
  mockedFindAppUserProfileByUserId.mockResolvedValue(createProfile());
}

const explanation = {
  avoidWith: [],
  beginnerAdvice: "Introduce gradually and follow product instructions.",
  cautions: ["Tolerance can vary."],
  commonUses: ["barrier support"],
  disclaimer: "Educational information only.",
  ingredientName: "Niacinamide",
  simpleExplanation: "Niacinamide is explained in simple skincare terms.",
  source: "fallback",
  suitableFor: ["oily skin"],
} satisfies IngredientExplanationDto;

describe("/api/admin/ingredients contract", () => {
  beforeEach(() => {
    mockedCheckRateLimit.mockReset();
    mockedCreateIngredientForAdmin.mockReset();
    mockedExplainIngredient.mockReset();
    mockedFindAppUserProfileByUserId.mockReset();
    mockedGetCurrentUser.mockReset();
    mockedGetIngredientById.mockReset();
    mockedListIngredients.mockReset();
    mockedListIngredientsForAdmin.mockReset();
    mockedUpdateIngredientForAdmin.mockReset();
    mockedCheckRateLimit.mockResolvedValue({
      allowed: true,
      limit: 10,
      remaining: 9,
      retryAfterSeconds: 3600,
    });
    mockedExplainIngredient.mockResolvedValue(explanation);
  });

  it("uses the Node.js runtime and exports expected handlers", () => {
    expect(adminIngredientsRoute.runtime).toBe("nodejs");
    expect(adminIngredientByIdRoute.runtime).toBe("nodejs");
    expect(adminIngredientsRoute.GET).toBeTypeOf("function");
    expect(adminIngredientsRoute.POST).toBeTypeOf("function");
    expect(adminIngredientByIdRoute.PATCH).toBeTypeOf("function");
  });

  it("blocks unauthenticated users from admin ingredient endpoints", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const listResponse = await adminIngredientsRoute.GET(
      new Request("http://localhost/api/admin/ingredients"),
    );
    const createResponse = await adminIngredientsRoute.POST(
      jsonRequest(
        "http://localhost/api/admin/ingredients",
        "POST",
        createAdminIngredientPayload(),
      ),
    );
    const patchResponse = await adminIngredientByIdRoute.PATCH(
      jsonRequest(
        `http://localhost/api/admin/ingredients/${ingredientId}`,
        "PATCH",
        { commonUses: ["updated use"] },
      ),
      routeContext(ingredientId),
    );

    for (const response of [listResponse, createResponse, patchResponse]) {
      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "UNAUTHORIZED",
        },
      });
      expect(response.status).toBe(401);
    }
    expect(mockedListIngredientsForAdmin).not.toHaveBeenCalled();
    expect(mockedCreateIngredientForAdmin).not.toHaveBeenCalled();
    expect(mockedUpdateIngredientForAdmin).not.toHaveBeenCalled();
  });

  it("blocks non-admin users from admin ingredient endpoints", async () => {
    mockRegularUser();

    const listResponse = await adminIngredientsRoute.GET(
      new Request("http://localhost/api/admin/ingredients"),
    );
    const createResponse = await adminIngredientsRoute.POST(
      jsonRequest(
        "http://localhost/api/admin/ingredients",
        "POST",
        createAdminIngredientPayload(),
      ),
    );
    const patchResponse = await adminIngredientByIdRoute.PATCH(
      jsonRequest(
        `http://localhost/api/admin/ingredients/${ingredientId}`,
        "PATCH",
        { commonUses: ["updated use"] },
      ),
      routeContext(ingredientId),
    );

    for (const response of [listResponse, createResponse, patchResponse]) {
      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "FORBIDDEN",
        },
      });
      expect(response.status).toBe(403);
    }
  });

  it("lists admin ingredients in the expected envelope", async () => {
    mockAdminUser();
    mockedListIngredientsForAdmin.mockResolvedValue([createIngredient()]);

    const response = await adminIngredientsRoute.GET(
      new Request(
        "http://localhost/api/admin/ingredients?q= nia &function=barrier_support&limit=50",
      ),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      data: {
        items: [
          {
            id: ingredientId,
            inciName: "Niacinamide",
          },
        ],
      },
      error: null,
    });
    expect(mockedListIngredientsForAdmin).toHaveBeenCalledWith({
      function: "barrier_support",
      limit: 50,
      q: "nia",
    });
    expect(serializedBody).not.toContain("_id");
    expect(serializedBody).not.toContain("ObjectId");
  });

  it("creates valid admin ingredients", async () => {
    mockAdminUser();
    mockedCreateIngredientForAdmin.mockResolvedValue(createIngredient());

    const response = await adminIngredientsRoute.POST(
      jsonRequest(
        "http://localhost/api/admin/ingredients",
        "POST",
        createAdminIngredientPayload(),
      ),
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
    expect(response.status).toBe(201);
    expect(mockedCreateIngredientForAdmin).toHaveBeenCalledWith(
      expect.objectContaining({
        inciName: "Admin Smoke Ingredient",
      }),
    );
  });

  it("rejects invalid create payloads and internal fields", async () => {
    mockAdminUser();

    for (const body of [
      { ...createAdminIngredientPayload(), inciName: "" },
      { ...createAdminIngredientPayload(), evidenceLevel: "clinical" },
      { ...createAdminIngredientPayload(), _id: ingredientId },
      { ...createAdminIngredientPayload(), id: ingredientId },
      { ...createAdminIngredientPayload(), createdAt: fixedDate.toISOString() },
      { ...createAdminIngredientPayload(), updatedAt: fixedDate.toISOString() },
    ]) {
      const response = await adminIngredientsRoute.POST(
        jsonRequest("http://localhost/api/admin/ingredients", "POST", body),
      );

      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
      expect(response.status).toBe(400);
    }
    expect(mockedCreateIngredientForAdmin).not.toHaveBeenCalled();
  });

  it("returns CONFLICT when creating duplicate normalized INCI names", async () => {
    mockAdminUser();
    mockedCreateIngredientForAdmin.mockRejectedValue(
      new DuplicateIngredientInciNameError(),
    );

    const response = await adminIngredientsRoute.POST(
      jsonRequest(
        "http://localhost/api/admin/ingredients",
        "POST",
        createAdminIngredientPayload(),
      ),
    );

    await expect(readJson(response)).resolves.toEqual({
      data: null,
      error: {
        code: "CONFLICT",
        details: {},
        message: "Ingredient INCI name already exists.",
      },
    });
    expect(response.status).toBe(409);
  });

  it("updates valid admin ingredients", async () => {
    mockAdminUser();
    mockedUpdateIngredientForAdmin.mockResolvedValue(
      createIngredient({ commonUses: ["updated use"] }),
    );

    const response = await adminIngredientByIdRoute.PATCH(
      jsonRequest(
        `http://localhost/api/admin/ingredients/${ingredientId}`,
        "PATCH",
        { commonUses: ["updated use"] },
      ),
      routeContext(ingredientId),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: {
        ingredient: {
          commonUses: ["updated use"],
          id: ingredientId,
        },
      },
      error: null,
    });
    expect(response.status).toBe(200);
    expect(mockedUpdateIngredientForAdmin).toHaveBeenCalledWith(ingredientId, {
      commonUses: ["updated use"],
    });
  });

  it("returns 400 for invalid PATCH ids before calling use case", async () => {
    mockAdminUser();

    const response = await adminIngredientByIdRoute.PATCH(
      jsonRequest("http://localhost/api/admin/ingredients/not-an-id", "PATCH", {
        commonUses: ["updated use"],
      }),
      routeContext("not-an-id"),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "VALIDATION_ERROR",
      },
    });
    expect(response.status).toBe(400);
    expect(mockedUpdateIngredientForAdmin).not.toHaveBeenCalled();
  });

  it("returns 404 for valid missing PATCH ids", async () => {
    mockAdminUser();
    mockedUpdateIngredientForAdmin.mockResolvedValue(null);

    const response = await adminIngredientByIdRoute.PATCH(
      jsonRequest(
        `http://localhost/api/admin/ingredients/${missingIngredientId}`,
        "PATCH",
        { commonUses: ["updated use"] },
      ),
      routeContext(missingIngredientId),
    );

    await expect(readJson(response)).resolves.toEqual({
      data: null,
      error: {
        code: "NOT_FOUND",
        details: {},
        message: "Ingredient was not found.",
      },
    });
    expect(response.status).toBe(404);
  });

  it("rejects invalid update payloads and duplicate INCI names", async () => {
    mockAdminUser();

    for (const body of [
      {},
      { inciName: "" },
      { evidenceLevel: "clinical" },
      { id: ingredientId },
      { createdAt: fixedDate.toISOString() },
      { updatedAt: fixedDate.toISOString() },
    ]) {
      const response = await adminIngredientByIdRoute.PATCH(
        jsonRequest(
          `http://localhost/api/admin/ingredients/${ingredientId}`,
          "PATCH",
          body,
        ),
        routeContext(ingredientId),
      );

      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
      expect(response.status).toBe(400);
    }

    mockedUpdateIngredientForAdmin.mockRejectedValue(
      new DuplicateIngredientInciNameError(),
    );

    const conflictResponse = await adminIngredientByIdRoute.PATCH(
      jsonRequest(
        `http://localhost/api/admin/ingredients/${ingredientId}`,
        "PATCH",
        { inciName: "Panthenol" },
      ),
      routeContext(ingredientId),
    );

    await expect(readJson(conflictResponse)).resolves.toMatchObject({
      data: null,
      error: {
        code: "CONFLICT",
      },
    });
    expect(conflictResponse.status).toBe(409);
  });

  it("keeps existing user-facing ingredient list and detail API handlers working", async () => {
    mockCurrentUser();
    mockedListIngredients.mockResolvedValue([createIngredient()]);
    mockedGetIngredientById.mockResolvedValue(createIngredient());

    const listResponse = await ingredientsRoute.GET(
      new Request("http://localhost/api/ingredients?q=nia&limit=5"),
    );
    const detailResponse = await ingredientByIdRoute.GET(
      new Request(`http://localhost/api/ingredients/${ingredientId}`),
      routeContext(ingredientId),
    );

    expect(listResponse.status).toBe(200);
    expect(detailResponse.status).toBe(200);
    expect(mockedListIngredients).toHaveBeenCalledWith({
      limit: 5,
      q: "nia",
    });
    expect(mockedGetIngredientById).toHaveBeenCalledWith(ingredientId);
  });

  it("keeps existing ingredient explanation route working", async () => {
    mockCurrentUser();

    const response = await ingredientExplanationRoute.POST(
      jsonRequest("http://localhost/api/ingredients/explain", "POST", {
        ingredientName: "Niacinamide",
      }),
    );

    await expect(readJson(response)).resolves.toEqual({
      data: {
        explanation,
      },
      error: null,
    });
    expect(response.status).toBe(200);
    expect(mockedExplainIngredient).toHaveBeenCalledWith({
      ingredientName: "Niacinamide",
    });
  });
});
