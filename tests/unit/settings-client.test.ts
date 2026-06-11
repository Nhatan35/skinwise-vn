import { beforeEach, describe, expect, it, vi } from "vitest";

import type { AccountDataExportDto } from "@/modules/account-data/account-data-export.dto";
import type { AccountAppDataSummaryDto } from "@/modules/account-data/account-app-data-summary.dto";
import type { DeleteAccountAppDataDto } from "@/modules/account-data/delete-account-app-data.dto";
import {
  deleteAccountAppData,
  exportAccountData,
  getAccountAppDataSummary,
  SettingsClientError,
} from "@/modules/settings/settings.client";

const mockedFetch = vi.fn();

const accountDataExport: AccountDataExportDto = {
  schemaVersion: "1.0",
  exportedAt: "2026-06-01T00:00:00.000Z",
  user: {
    id: "auth-user-id",
    email: "an@example.com",
    name: "An",
  },
  appProfile: null,
  skinProfile: null,
  savedProducts: [],
  routines: [],
  routineLogs: [],
  routineAnalyses: [],
  skinJournals: [],
};

const deleteResult: DeleteAccountAppDataDto = {
  deleted: true,
  deletedAt: "2026-06-01T00:00:00.000Z",
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

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
    },
    status,
  });
}

describe("Settings client data control helpers", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
    vi.stubGlobal("fetch", mockedFetch);
  });

  it("exports only body.data.export from the wrapped API response", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: {
          export: accountDataExport,
        },
        error: null,
      }),
    );

    await expect(exportAccountData()).resolves.toEqual(accountDataExport);
    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/account/export",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
        }),
        method: "GET",
      }),
    );
  });

  it("treats malformed export responses as errors", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: null,
        error: null,
      }),
    );

    await expect(exportAccountData()).rejects.toBeInstanceOf(SettingsClientError);
  });

  it("fetches only body.data.summary from the app data summary response", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: {
          summary: summaryResult,
        },
        error: null,
      }),
    );

    await expect(getAccountAppDataSummary()).resolves.toEqual(summaryResult);
    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/account/app-data",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
        }),
        method: "GET",
      }),
    );
  });

  it("treats malformed app data summary responses as errors", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: null,
        error: null,
      }),
    );

    await expect(getAccountAppDataSummary()).rejects.toBeInstanceOf(
      SettingsClientError,
    );
  });

  it("deletes app data through DELETE /api/account/app-data", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: deleteResult,
        error: null,
      }),
    );

    await expect(deleteAccountAppData()).resolves.toEqual(deleteResult);
    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/account/app-data",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
        }),
        method: "DELETE",
      }),
    );
    const [, requestInit] = mockedFetch.mock.calls[0] as [
      string,
      RequestInit,
    ];

    expect(requestInit).not.toHaveProperty("body");
  });

  it("treats malformed app data deletion responses as errors", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: null,
        error: null,
      }),
    );

    await expect(deleteAccountAppData()).rejects.toBeInstanceOf(
      SettingsClientError,
    );
  });
});
