import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/users/app-user-profile.repository", () => ({
  findAppUserProfileByUserId: vi.fn(),
}));

vi.mock("@/modules/products/product.use-case", () => ({
  listProductsForAdmin: vi.fn(),
  updateProductVerificationStatusForAdmin: vi.fn(),
}));

import * as adminProductVerificationStatusRoute from "@/app/api/admin/products/[id]/verification-status/route";
import * as adminProductsRoute from "@/app/api/admin/products/route";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import {
  listProductsForAdmin,
  updateProductVerificationStatusForAdmin,
} from "@/modules/products/product.use-case";
import type { Product } from "@/modules/products/product.types";
import { findAppUserProfileByUserId } from "@/modules/users/app-user-profile.repository";
import type { AppUserProfile } from "@/modules/users/app-user-profile.types";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedFindAppUserProfileByUserId = vi.mocked(findAppUserProfileByUserId);
const mockedListProductsForAdmin = vi.mocked(listProductsForAdmin);
const mockedUpdateProductVerificationStatusForAdmin = vi.mocked(
  updateProductVerificationStatusForAdmin,
);

const authUserId = "auth-user-id";
const productId = "665000000000000000000710";
const unverifiedProductId = "665000000000000000000711";
const fixedDate = new Date("2026-06-15T00:00:00.000Z");

function createProfile(
  overrides: Partial<AppUserProfile> = {},
): AppUserProfile {
  return {
    _id: new ObjectId("665000000000000000000700"),
    userId: authUserId,
    role: "USER",
    onboardingCompleted: true,
    accountDeletionRequestedAt: null,
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

function createProduct(
  id: string,
  overrides: Partial<Product> = {},
): Product {
  return {
    _id: new ObjectId(id),
    name: "Admin Review Product",
    brand: "SkinWise Demo",
    category: "serum",
    priceRange: "budget",
    ingredientsText: "Water, Niacinamide",
    keyActives: ["Niacinamide"],
    tags: ["review-candidate"],
    warnings: [],
    skinTypes: ["oily"],
    concerns: ["oiliness"],
    suitableFor: ["basic serum step"],
    notRecommendedFor: [],
    source: "user_submitted",
    verificationStatus: "reviewed",
    createdByUserId: new ObjectId("665000000000000000000712"),
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
    id: authUserId,
    email: "an@example.com",
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

describe("/api/admin/products contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedFindAppUserProfileByUserId.mockReset();
    mockedListProductsForAdmin.mockReset();
    mockedUpdateProductVerificationStatusForAdmin.mockReset();
  });

  it("uses the Node.js runtime and exports expected handlers", () => {
    expect(adminProductsRoute.runtime).toBe("nodejs");
    expect(adminProductVerificationStatusRoute.runtime).toBe("nodejs");
    expect(adminProductsRoute.GET).toBeTypeOf("function");
    expect(adminProductVerificationStatusRoute.PATCH).toBeTypeOf("function");
  });

  it("blocks unauthenticated users from admin product endpoints", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const listResponse = await adminProductsRoute.GET(
      new Request("http://localhost/api/admin/products"),
    );
    const patchResponse = await adminProductVerificationStatusRoute.PATCH(
      jsonRequest(
        `http://localhost/api/admin/products/${productId}/verification-status`,
        "PATCH",
        { verificationStatus: "reviewed" },
      ),
      routeContext(productId),
    );

    for (const response of [listResponse, patchResponse]) {
      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "UNAUTHORIZED",
        },
      });
      expect(response.status).toBe(401);
    }
    expect(mockedFindAppUserProfileByUserId).not.toHaveBeenCalled();
    expect(mockedListProductsForAdmin).not.toHaveBeenCalled();
    expect(mockedUpdateProductVerificationStatusForAdmin).not.toHaveBeenCalled();
  });

  it("blocks authenticated non-admin users from admin product endpoints", async () => {
    mockRegularUser();

    const listResponse = await adminProductsRoute.GET(
      new Request("http://localhost/api/admin/products"),
    );
    const patchResponse = await adminProductVerificationStatusRoute.PATCH(
      jsonRequest(
        `http://localhost/api/admin/products/${productId}/verification-status`,
        "PATCH",
        { verificationStatus: "verified" },
      ),
      routeContext(productId),
    );

    for (const response of [listResponse, patchResponse]) {
      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "FORBIDDEN",
        },
      });
      expect(response.status).toBe(403);
    }
    expect(mockedFindAppUserProfileByUserId).toHaveBeenCalledWith(authUserId);
    expect(mockedListProductsForAdmin).not.toHaveBeenCalled();
    expect(mockedUpdateProductVerificationStatusForAdmin).not.toHaveBeenCalled();
  });

  it("lets admins list all product verification states without exposing private fields", async () => {
    mockAdminUser();
    mockedListProductsForAdmin.mockResolvedValue([
      createProduct(unverifiedProductId, {
        name: "Pending User Submission",
        verificationStatus: "unverified",
      }),
      createProduct(productId, {
        name: "Reviewed Product",
        verificationStatus: "reviewed",
      }),
    ]);

    const response = await adminProductsRoute.GET(
      new Request(
        "http://localhost/api/admin/products?q= pending &category=serum&verificationStatus=unverified",
      ),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      data: {
        items: [
          {
            id: unverifiedProductId,
            name: "Pending User Submission",
            verificationStatus: "unverified",
          },
          {
            id: productId,
            name: "Reviewed Product",
            verificationStatus: "reviewed",
          },
        ],
      },
      error: null,
    });
    expect(mockedListProductsForAdmin).toHaveBeenCalledWith({
      q: "pending",
      category: "serum",
      verificationStatus: "unverified",
    });
    expect(serializedBody).not.toContain("_id");
    expect(serializedBody).not.toContain("ObjectId");
    expect(serializedBody).not.toContain("createdByUserId");
    expect(serializedBody).not.toContain("source");
  });

  it("rejects invalid admin product list queries", async () => {
    mockAdminUser();

    const response = await adminProductsRoute.GET(
      new Request("http://localhost/api/admin/products?verificationStatus=draft"),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "VALIDATION_ERROR",
      },
    });
    expect(response.status).toBe(400);
    expect(mockedListProductsForAdmin).not.toHaveBeenCalled();
  });

  it("lets admins update product verificationStatus only", async () => {
    mockAdminUser();
    mockedUpdateProductVerificationStatusForAdmin.mockResolvedValue(
      createProduct(productId, {
        verificationStatus: "verified",
        updatedAt: new Date("2026-06-15T01:00:00.000Z"),
      }),
    );

    const response = await adminProductVerificationStatusRoute.PATCH(
      jsonRequest(
        `http://localhost/api/admin/products/${productId}/verification-status`,
        "PATCH",
        { verificationStatus: "verified" },
      ),
      routeContext(productId),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: {
        product: {
          id: productId,
          verificationStatus: "verified",
        },
      },
      error: null,
    });
    expect(response.status).toBe(200);
    expect(mockedUpdateProductVerificationStatusForAdmin).toHaveBeenCalledWith(
      productId,
      "verified",
    );
  });

  it("rejects invalid verificationStatus bodies and internal fields", async () => {
    mockAdminUser();

    const invalidBodies = [
      {},
      { verificationStatus: "draft" },
      { verificationStatus: "reviewed", source: "admin" },
      { verificationStatus: "reviewed", createdByUserId: authUserId },
      { verificationStatus: "reviewed", updatedAt: fixedDate.toISOString() },
    ];

    for (const body of invalidBodies) {
      const response = await adminProductVerificationStatusRoute.PATCH(
        jsonRequest(
          `http://localhost/api/admin/products/${productId}/verification-status`,
          "PATCH",
          body,
        ),
        routeContext(productId),
      );

      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
      expect(response.status).toBe(400);
    }
    expect(mockedUpdateProductVerificationStatusForAdmin).not.toHaveBeenCalled();
  });

  it("returns VALIDATION_ERROR for invalid product ids", async () => {
    mockAdminUser();

    const response = await adminProductVerificationStatusRoute.PATCH(
      jsonRequest(
        "http://localhost/api/admin/products/not-an-object-id/verification-status",
        "PATCH",
        { verificationStatus: "reviewed" },
      ),
      routeContext("not-an-object-id"),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "VALIDATION_ERROR",
      },
    });
    expect(response.status).toBe(400);
    expect(mockedUpdateProductVerificationStatusForAdmin).not.toHaveBeenCalled();
  });

  it("returns NOT_FOUND when admin updates a missing product", async () => {
    mockAdminUser();
    mockedUpdateProductVerificationStatusForAdmin.mockResolvedValue(null);

    const response = await adminProductVerificationStatusRoute.PATCH(
      jsonRequest(
        `http://localhost/api/admin/products/${productId}/verification-status`,
        "PATCH",
        { verificationStatus: "unverified" },
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
});
