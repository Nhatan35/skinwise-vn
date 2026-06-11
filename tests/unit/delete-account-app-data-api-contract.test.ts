import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/account-data/account-data-export.use-case", () => ({
  deleteAccountAppDataForUser: vi.fn(),
  getAccountAppDataSummaryForUser: vi.fn(),
}));

import * as appDataRoute from "@/app/api/account/app-data/route";
import {
  deleteAccountAppDataForUser,
  getAccountAppDataSummaryForUser,
} from "@/modules/account-data/account-data-export.use-case";
import type { AccountAppDataSummaryDto } from "@/modules/account-data/account-app-data-summary.dto";
import type { DeleteAccountAppDataDto } from "@/modules/account-data/delete-account-app-data.dto";
import { getCurrentUser } from "@/modules/auth/get-current-user";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedDeleteAccountAppDataForUser = vi.mocked(deleteAccountAppDataForUser);
const mockedGetAccountAppDataSummaryForUser = vi.mocked(
  getAccountAppDataSummaryForUser,
);

const authUser = {
  id: "auth-user-id",
  email: "an@example.com",
  name: "An",
};

const deleteResult: DeleteAccountAppDataDto = {
  deleted: true,
  deletedAt: "2026-06-01T00:00:00.000Z",
  deletedCounts: {
    skinProfiles: 1,
    savedProducts: 2,
    routines: 3,
    routineLogs: 4,
    routineAnalyses: 5,
    skinJournals: 6,
  },
  appUserProfile: {
    preserved: true,
    onboardingCompletedReset: true,
  },
};

const summaryResult: AccountAppDataSummaryDto = {
  generatedAt: "2026-06-01T00:00:00.000Z",
  counts: {
    skinProfiles: 1,
    savedProducts: 2,
    routines: 3,
    routineLogs: 4,
    routineAnalyses: 5,
    skinJournals: 6,
  },
  sharedCatalogueData: {
    productsPreserved: true,
    ingredientsPreserved: true,
  },
};

async function readJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

const forbiddenSensitiveSubstrings = [
  "secret",
  "auth_secret",
  "mongodb_uri",
  "auth_google_secret",
  "google_client_secret",
  "ai_api_key",
  "openai_api_key",
  "token",
  "accesstoken",
  "refreshtoken",
  "userid",
  "email",
  "password",
  "rawdocument",
  "process.env",
  "stack",
  "mongoservererror",
];

function expectNoSensitiveExposure(body: unknown) {
  const serializedBody = JSON.stringify(body).toLowerCase();

  for (const forbidden of forbiddenSensitiveSubstrings) {
    expect(serializedBody).not.toContain(forbidden);
  }
}

describe("/api/account/app-data contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedDeleteAccountAppDataForUser.mockReset();
    mockedGetAccountAppDataSummaryForUser.mockReset();
  });

  it("uses Node.js runtime and exposes only GET and DELETE", () => {
    expect(appDataRoute.runtime).toBe("nodejs");
    expect(appDataRoute.GET).toBeTypeOf("function");
    expect(appDataRoute.DELETE).toBeTypeOf("function");
    expect((appDataRoute as Record<string, unknown>).POST).toBeUndefined();
    expect((appDataRoute as Record<string, unknown>).PUT).toBeUndefined();
    expect((appDataRoute as Record<string, unknown>).PATCH).toBeUndefined();
  });

  it("rejects unauthenticated app data summary requests", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const response = await appDataRoute.GET();

    await expect(readJson(response)).resolves.toEqual({
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be signed in to access this resource.",
        details: {},
      },
    });
    expect(response.status).toBe(401);
    expect(mockedGetAccountAppDataSummaryForUser).not.toHaveBeenCalled();
  });

  it("returns a count-only account app data summary for the authenticated user", async () => {
    mockedGetCurrentUser.mockResolvedValue(authUser);
    mockedGetAccountAppDataSummaryForUser.mockResolvedValue(summaryResult);

    const response = await appDataRoute.GET();
    const body = await readJson(response);
    const summary = (body.data as { summary: AccountAppDataSummaryDto }).summary;
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: {
        summary: summaryResult,
      },
      error: null,
    });
    expect(mockedGetAccountAppDataSummaryForUser).toHaveBeenCalledWith(
      authUser.id,
    );
    expect(summary).toHaveProperty("generatedAt");
    expect(summary).toHaveProperty("counts");
    expect(summary.sharedCatalogueData).toEqual({
      productsPreserved: true,
      ingredientsPreserved: true,
    });
    expect(summary).not.toHaveProperty("userId");
    expect(summary).not.toHaveProperty("_id");
    expect(summary).not.toHaveProperty("providerAccountId");
    expect(serializedBody).not.toContain("accessToken");
    expect(serializedBody).not.toContain("refreshToken");
    expect(serializedBody).not.toContain("sessionToken");
    expect(serializedBody).not.toContain("AUTH_SECRET");
    expect(serializedBody).not.toContain("DATABASE_URL");
    expect(serializedBody).not.toContain("skinProfile\":{");
    expect(serializedBody).not.toContain("savedProducts\":[");
    expect(serializedBody).not.toContain("routineLogs\":[");
    expect(serializedBody).not.toContain("skinJournals\":[");
  });

  it("returns safe zero counts for users without app data", async () => {
    mockedGetCurrentUser.mockResolvedValue(authUser);
    mockedGetAccountAppDataSummaryForUser.mockResolvedValue({
      ...summaryResult,
      counts: {
        skinProfiles: 0,
        savedProducts: 0,
        routines: 0,
        routineLogs: 0,
        routineAnalyses: 0,
        skinJournals: 0,
      },
    });

    const response = await appDataRoute.GET();

    await expect(readJson(response)).resolves.toMatchObject({
      data: {
        summary: {
          counts: {
            skinProfiles: 0,
            savedProducts: 0,
            routines: 0,
            routineLogs: 0,
            routineAnalyses: 0,
            skinJournals: 0,
          },
          sharedCatalogueData: {
            productsPreserved: true,
            ingredientsPreserved: true,
          },
        },
      },
      error: null,
    });
    expect(response.status).toBe(200);
  });

  it("rejects unauthenticated app data deletion requests", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const response = await appDataRoute.DELETE();
    const body = await readJson(response);

    expect(body).toEqual({
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be signed in to access this resource.",
        details: {},
      },
    });
    expect(response.status).toBe(401);
    expect(mockedDeleteAccountAppDataForUser).not.toHaveBeenCalled();
    expectNoSensitiveExposure(body);
  });

  it("deletes only for the authenticated user and returns counts", async () => {
    mockedGetCurrentUser.mockResolvedValue(authUser);
    mockedDeleteAccountAppDataForUser.mockResolvedValue(deleteResult);

    const response = await appDataRoute.DELETE();
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: deleteResult,
      error: null,
    });
    expect(mockedDeleteAccountAppDataForUser).toHaveBeenCalledWith(authUser.id);
    expect(serializedBody).toContain("deletedCounts");
    expect(serializedBody).toContain("appUserProfile");
    expect(serializedBody).not.toContain("accounts");
    expect(serializedBody).not.toContain("sessions");
    expect(serializedBody).not.toContain("verification_tokens");
    expect(serializedBody).not.toContain("products");
    expect(serializedBody).not.toContain("ingredients");
    expect(serializedBody).not.toContain("refreshToken");
    expectNoSensitiveExposure(body);
  });

  it("ignores malicious client-provided userId values and uses the authenticated user", async () => {
    mockedGetCurrentUser.mockResolvedValue(authUser);
    mockedDeleteAccountAppDataForUser.mockResolvedValue(deleteResult);

    const hostileRequest = new Request(
      "https://skinwise.vn/api/account/app-data?userId=other-user-id",
      {
        body: JSON.stringify({
          userId: "other-user-id",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "DELETE",
      },
    );
    const deleteHandler = appDataRoute.DELETE as unknown as (
      request: Request,
    ) => Promise<Response>;

    const response = await deleteHandler(hostileRequest);
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(mockedDeleteAccountAppDataForUser).toHaveBeenCalledTimes(1);
    expect(mockedDeleteAccountAppDataForUser).toHaveBeenCalledWith(authUser.id);
    expect(mockedDeleteAccountAppDataForUser).not.toHaveBeenCalledWith(
      "other-user-id",
    );
    expectNoSensitiveExposure(body);
  });

  it("is idempotent when no app data exists", async () => {
    mockedGetCurrentUser.mockResolvedValue(authUser);
    mockedDeleteAccountAppDataForUser.mockResolvedValue({
      ...deleteResult,
      deletedCounts: {
        skinProfiles: 0,
        savedProducts: 0,
        routines: 0,
        routineLogs: 0,
        routineAnalyses: 0,
        skinJournals: 0,
      },
      appUserProfile: {
        preserved: true,
        onboardingCompletedReset: false,
      },
    });

    const response = await appDataRoute.DELETE();

    await expect(readJson(response)).resolves.toMatchObject({
      data: {
        deleted: true,
        deletedCounts: {
          skinProfiles: 0,
          savedProducts: 0,
          routines: 0,
          routineLogs: 0,
          routineAnalyses: 0,
          skinJournals: 0,
        },
      },
      error: null,
    });
    expect(response.status).toBe(200);
  });

  it("returns INTERNAL_ERROR and no deleted true claim when deletion fails", async () => {
    mockedGetCurrentUser.mockResolvedValue(authUser);
    mockedDeleteAccountAppDataForUser.mockRejectedValue(
      new Error("MongoServerError provider token stack"),
    );

    const response = await appDataRoute.DELETE();
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
    expect(serializedBody).not.toContain("deleted\":true");
    expect(serializedBody).not.toContain("MongoServerError");
    expect(serializedBody).not.toContain("provider token");
    expect(serializedBody).not.toContain("stack");
    expectNoSensitiveExposure(body);
  });
});
