import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createSkinJournal,
  deleteSkinJournal,
  listSkinJournals,
  sanitizeCreateSkinJournalPayload,
  sanitizeUpdateSkinJournalPayload,
  SkinJournalClientError,
  updateSkinJournal,
} from "@/modules/journals/skin-journal.client";
import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import type {
  CreateSkinJournalClientInput,
  UpdateSkinJournalClientInput,
} from "@/modules/journals/skin-journal-form.validation";

const mockedFetch = vi.fn();

function createJournal(overrides: Partial<SkinJournalDto> = {}): SkinJournalDto {
  return {
    id: "journal-1",
    localDate: "2026-05-22",
    timezone: "Asia/Ho_Chi_Minh",
    productsUsed: ["product_123"],
    observations: ["Dry cheeks"],
    symptoms: ["dryness"],
    sleepHours: 7,
    stressLevel: "medium",
    notes: "No treatment today.",
    createdAt: "2026-05-22T00:00:00.000Z",
    updatedAt: "2026-05-22T00:00:00.000Z",
    ...overrides,
  };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
    },
    status,
  });
}

function getLastRequestInit() {
  return mockedFetch.mock.calls.at(-1)?.[1] as RequestInit;
}

function getLastRequestPath() {
  return String(mockedFetch.mock.calls.at(-1)?.[0]);
}

function getLastRequestBody() {
  return JSON.parse(String(getLastRequestInit().body)) as Record<
    string,
    unknown
  >;
}

describe("SkinJournal client helpers", () => {
  beforeEach(() => {
    mockedFetch.mockReset();
    vi.stubGlobal("fetch", mockedFetch);
  });

  it("lists journals through GET /api/skin-journal and reads data.skinJournals", async () => {
    const skinJournals = [createJournal()];
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { skinJournals },
        error: null,
      }),
    );

    await expect(listSkinJournals()).resolves.toEqual(skinJournals);
    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/skin-journal",
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
        }),
        method: "GET",
      }),
    );
  });

  it("lists journals with optional date range query params", async () => {
    const skinJournals = [createJournal({ localDate: "2026-06-01" })];
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { skinJournals },
        error: null,
      }),
    );

    await expect(
      listSkinJournals({
        from: "2026-06-01",
        to: "2026-06-01",
        limit: 1,
      }),
    ).resolves.toEqual(skinJournals);

    expect(getLastRequestPath()).toBe(
      "/api/skin-journal?from=2026-06-01&to=2026-06-01&limit=1",
    );
    expect(getLastRequestInit()).toEqual(
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: "application/json",
        }),
        method: "GET",
      }),
    );
  });

  it("does not send undefined journal list query params", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { skinJournals: [] },
        error: null,
      }),
    );

    await expect(listSkinJournals({ from: "2026-06-01" })).resolves.toEqual([]);

    expect(getLastRequestPath()).toBe("/api/skin-journal?from=2026-06-01");
    expect(getLastRequestPath()).not.toContain("to=");
    expect(getLastRequestPath()).not.toContain("limit=");
  });

  it("creates journals through POST /api/skin-journal and reads data.skinJournal", async () => {
    const skinJournal = createJournal();
    const input: CreateSkinJournalClientInput = {
      localDate: "2026-05-22",
      timezone: "Asia/Ho_Chi_Minh",
      productsUsed: ["product_123"],
      observations: ["Dry cheeks"],
      symptoms: ["dryness"],
      sleepHours: 7,
      stressLevel: "medium",
      notes: "No treatment today.",
    };
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { skinJournal },
        error: null,
      }),
    );

    await expect(createSkinJournal(input)).resolves.toEqual(skinJournal);
    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/skin-journal",
      expect.objectContaining({
        method: "POST",
      }),
    );
    expect(getLastRequestBody()).toEqual(input);
  });

  it("updates journals through PATCH /api/skin-journal/${id} and reads data.skinJournal", async () => {
    const skinJournal = createJournal({ notes: "Updated note." });
    const input: UpdateSkinJournalClientInput = {
      timezone: "Asia/Ho_Chi_Minh",
      productsUsed: ["product_123"],
      observations: ["Less dry"],
      symptoms: ["dryness"],
      notes: "Updated note.",
    };
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { skinJournal },
        error: null,
      }),
    );

    await expect(updateSkinJournal("journal-1", input)).resolves.toEqual(
      skinJournal,
    );
    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/skin-journal/journal-1",
      expect.objectContaining({
        method: "PATCH",
      }),
    );
    expect(getLastRequestBody()).not.toHaveProperty("localDate");
  });

  it("deletes journals through DELETE /api/skin-journal/${id} and reads data.deleted", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse({
        data: { deleted: true },
        error: null,
      }),
    );

    await expect(deleteSkinJournal("journal-1")).resolves.toBe(true);
    expect(mockedFetch).toHaveBeenCalledWith(
      "/api/skin-journal/journal-1",
      expect.objectContaining({
        method: "DELETE",
      }),
    );
  });

  it("maps duplicate localDate conflict to a friendly error", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse(
        {
          data: null,
          error: {
            code: "CONFLICT",
            message: "Skin journal entry already exists for this localDate.",
          },
        },
        409,
      ),
    );

    await expect(
      createSkinJournal({
        localDate: "2026-05-22",
        timezone: "Asia/Ho_Chi_Minh",
        productsUsed: [],
        observations: [],
        symptoms: [],
      }),
    ).rejects.toMatchObject({
      code: "CONFLICT",
      message: "You already have a journal entry for this date.",
      status: 409,
    });
  });

  it("does not expose raw backend errors", async () => {
    mockedFetch.mockResolvedValue(
      jsonResponse(
        {
          data: null,
          error: {
            code: "INTERNAL_ERROR",
            message: "E11000 duplicate key raw database error",
          },
        },
        500,
      ),
    );

    await expect(listSkinJournals()).rejects.toThrow(
      "Unable to update Skin Journal. Please try again.",
    );
  });

  it("maps fetch failures to a safe client error", async () => {
    mockedFetch.mockRejectedValue(new Error("network stack trace"));

    await expect(listSkinJournals()).rejects.toMatchObject({
      code: "INTERNAL_ERROR",
      message: "Unable to update Skin Journal. Please try again.",
    });
  });

  it("sanitizes create and update payloads to allowed fields only", () => {
    const unsafeCreateInput = {
      localDate: "2026-05-22",
      timezone: "Asia/Ho_Chi_Minh",
      productsUsed: ["product_123"],
      observations: ["Dry cheeks"],
      symptoms: ["dryness"],
      sleepHours: 7,
      stressLevel: "medium",
      notes: "No treatment today.",
      userId: "other-user",
      _id: "mongo-id",
      id: "journal-1",
      createdAt: "2026-05-22T00:00:00.000Z",
      updatedAt: "2026-05-22T00:00:00.000Z",
      imageUrl: "https://example.test/private.jpg",
      imageStorageKey: "private-key",
      imageVisibility: "private",
      photoUrls: ["https://example.test/private.jpg"],
      providerMetadata: {},
    } as unknown as CreateSkinJournalClientInput;
    const unsafeUpdateInput = {
      ...unsafeCreateInput,
    } as unknown as UpdateSkinJournalClientInput;

    const createPayload = sanitizeCreateSkinJournalPayload(unsafeCreateInput);
    const updatePayload = sanitizeUpdateSkinJournalPayload(unsafeUpdateInput);

    for (const payload of [createPayload, updatePayload]) {
      expect(payload).toMatchObject({
        timezone: "Asia/Ho_Chi_Minh",
        productsUsed: ["product_123"],
        observations: ["Dry cheeks"],
        symptoms: ["dryness"],
        sleepHours: 7,
        stressLevel: "medium",
        notes: "No treatment today.",
      });

      for (const forbiddenField of [
        "userId",
        "_id",
        "id",
        "createdAt",
        "updatedAt",
        "imageUrl",
        "imageStorageKey",
        "imageVisibility",
        "photoUrls",
        "providerMetadata",
      ]) {
        expect(payload).not.toHaveProperty(forbiddenField);
      }
    }
    expect(updatePayload).not.toHaveProperty("localDate");
  });

  it("throws SkinJournalClientError for invalid response envelopes", async () => {
    mockedFetch.mockResolvedValue(jsonResponse({ data: null, error: null }));

    await expect(listSkinJournals()).rejects.toBeInstanceOf(
      SkinJournalClientError,
    );
  });
});
