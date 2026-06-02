import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/account-data/account-data-export.use-case", () => ({
  exportAccountDataForUser: vi.fn(),
}));

import * as accountExportRoute from "@/app/api/account/export/route";
import { exportAccountDataForUser } from "@/modules/account-data/account-data-export.use-case";
import type { AccountDataExportDto } from "@/modules/account-data/account-data-export.dto";
import { getCurrentUser } from "@/modules/auth/get-current-user";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedExportAccountDataForUser = vi.mocked(exportAccountDataForUser);

const authUser = {
  id: "auth-user-id",
  email: "an@example.com",
  name: "An",
};

const accountDataExport: AccountDataExportDto = {
  schemaVersion: "1.0",
  exportedAt: "2026-06-01T00:00:00.000Z",
  user: authUser,
  appProfile: {
    role: "USER",
    onboardingCompleted: true,
    accountDeletionRequestStatus: "not_requested",
    createdAt: "2026-05-01T00:00:00.000Z",
    updatedAt: "2026-05-02T00:00:00.000Z",
  },
  skinProfile: null,
  savedProducts: [],
  routines: [],
  routineLogs: [],
  routineAnalyses: [],
  skinJournals: [],
};

async function readJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

describe("GET /api/account/export contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedExportAccountDataForUser.mockReset();
  });

  it("uses Node.js runtime and only exposes GET", () => {
    expect(accountExportRoute.runtime).toBe("nodejs");
    expect(accountExportRoute.GET).toBeTypeOf("function");
    expect((accountExportRoute as Record<string, unknown>).POST).toBeUndefined();
    expect((accountExportRoute as Record<string, unknown>).DELETE).toBeUndefined();
  });

  it("rejects unauthenticated export requests", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const response = await accountExportRoute.GET();

    await expect(readJson(response)).resolves.toEqual({
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be signed in to access this resource.",
        details: {},
      },
    });
    expect(response.status).toBe(401);
    expect(mockedExportAccountDataForUser).not.toHaveBeenCalled();
  });

  it("derives the user from auth and returns a wrapped safe export payload", async () => {
    mockedGetCurrentUser.mockResolvedValue(authUser);
    mockedExportAccountDataForUser.mockResolvedValue(accountDataExport);

    const response = await accountExportRoute.GET();
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: {
        export: accountDataExport,
      },
      error: null,
    });
    expect(mockedExportAccountDataForUser).toHaveBeenCalledWith(authUser);
    expect(serializedBody).toContain("schemaVersion");
    expect(serializedBody).toContain("exportedAt");
    expect(serializedBody).not.toContain("_id");
    expect(serializedBody).not.toContain("refreshToken");
    expect(serializedBody).not.toContain("accessToken");
    expect(serializedBody).not.toContain("providerAccountId");
    expect(serializedBody).not.toContain("verificationToken");
  });

  it("returns a generic error without leaking database details", async () => {
    mockedGetCurrentUser.mockResolvedValue(authUser);
    mockedExportAccountDataForUser.mockRejectedValue(
      new Error("MongoServerError refreshToken stack"),
    );

    const response = await accountExportRoute.GET();
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
    expect(serializedBody).not.toContain("refreshToken");
    expect(serializedBody).not.toContain("stack");
  });
});
