import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/journals/skin-journal.repository", () => {
  class SkinJournalConflictError extends Error {
    constructor(message = "SkinJournal entry already exists for this localDate.") {
      super(message);
      this.name = "SkinJournalConflictError";
    }
  }

  return {
    createSkinJournalEntry: vi.fn(),
    deleteSkinJournalEntryByIdForUser: vi.fn(),
    findSkinJournalEntriesByUserId: vi.fn(),
    SkinJournalConflictError,
    updateSkinJournalEntryByIdForUser: vi.fn(),
  };
});

import { createSkinJournalForUser } from "@/modules/journals/create-skin-journal.use-case";
import { deleteSkinJournalForUser } from "@/modules/journals/delete-skin-journal.use-case";
import { listSkinJournalsForUser } from "@/modules/journals/list-skin-journal.use-case";
import {
  createSkinJournalEntry,
  deleteSkinJournalEntryByIdForUser,
  findSkinJournalEntriesByUserId,
  SkinJournalConflictError,
  updateSkinJournalEntryByIdForUser,
} from "@/modules/journals/skin-journal.repository";
import type { SkinJournal } from "@/modules/journals/skin-journal.types";
import { updateSkinJournalForUser } from "@/modules/journals/update-skin-journal.use-case";

const mockedCreateSkinJournalEntry = vi.mocked(createSkinJournalEntry);
const mockedDeleteSkinJournalEntryByIdForUser = vi.mocked(
  deleteSkinJournalEntryByIdForUser,
);
const mockedFindSkinJournalEntriesByUserId = vi.mocked(
  findSkinJournalEntriesByUserId,
);
const mockedUpdateSkinJournalEntryByIdForUser = vi.mocked(
  updateSkinJournalEntryByIdForUser,
);

const userId = "auth-user-id";
const otherUserId = "other-user-id";
const skinJournalId = "665000000000000000000701";
const fixedDate = new Date("2026-05-12T00:00:00.000Z");

function createSkinJournal(overrides: Partial<SkinJournal> = {}): SkinJournal {
  return {
    _id: new ObjectId(skinJournalId),
    userId,
    localDate: "2026-05-12",
    timezone: "Asia/Ho_Chi_Minh",
    productsUsed: ["product_123"],
    observations: ["Dry cheeks."],
    symptoms: ["dryness"],
    sleepHours: 7,
    stressLevel: "medium",
    notes: "No treatment today.",
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

describe("SkinJournal use cases", () => {
  beforeEach(() => {
    mockedCreateSkinJournalEntry.mockReset();
    mockedDeleteSkinJournalEntryByIdForUser.mockReset();
    mockedFindSkinJournalEntriesByUserId.mockReset();
    mockedUpdateSkinJournalEntryByIdForUser.mockReset();
  });

  it("creates a SkinJournal DTO for the authenticated user", async () => {
    mockedCreateSkinJournalEntry.mockResolvedValue(createSkinJournal());

    await expect(
      createSkinJournalForUser(userId, {
        localDate: "2026-05-12",
        timezone: "Asia/Ho_Chi_Minh",
        productsUsed: ["product_123"],
        observations: ["Dry cheeks."],
        symptoms: ["dryness"],
        sleepHours: 7,
        stressLevel: "medium",
        notes: " No treatment today. ",
      }),
    ).resolves.toEqual({
      id: skinJournalId,
      localDate: "2026-05-12",
      timezone: "Asia/Ho_Chi_Minh",
      productsUsed: ["product_123"],
      observations: ["Dry cheeks."],
      symptoms: ["dryness"],
      sleepHours: 7,
      stressLevel: "medium",
      notes: "No treatment today.",
      createdAt: fixedDate.toISOString(),
      updatedAt: fixedDate.toISOString(),
    });

    expect(mockedCreateSkinJournalEntry).toHaveBeenCalledWith(userId, {
      localDate: "2026-05-12",
      timezone: "Asia/Ho_Chi_Minh",
      productsUsed: ["product_123"],
      observations: ["Dry cheeks."],
      symptoms: ["dryness"],
      sleepHours: 7,
      stressLevel: "medium",
      notes: "No treatment today.",
    });
  });

  it("propagates safe duplicate localDate conflict errors", async () => {
    mockedCreateSkinJournalEntry.mockRejectedValue(
      new SkinJournalConflictError(),
    );

    await expect(
      createSkinJournalForUser(userId, {
        localDate: "2026-05-12",
        timezone: "Asia/Ho_Chi_Minh",
        productsUsed: [],
        observations: [],
        symptoms: [],
      }),
    ).rejects.toBeInstanceOf(SkinJournalConflictError);
  });

  it("lists SkinJournal DTOs for only the authenticated user", async () => {
    mockedFindSkinJournalEntriesByUserId.mockResolvedValue([createSkinJournal()]);

    await expect(
      listSkinJournalsForUser(userId, {
        from: "2026-05-01",
        to: "2026-05-31",
        limit: 20,
      }),
    ).resolves.toEqual([
      expect.objectContaining({
        id: skinJournalId,
        localDate: "2026-05-12",
      }),
    ]);
    expect(mockedFindSkinJournalEntriesByUserId).toHaveBeenCalledWith(userId, {
      from: "2026-05-01",
      to: "2026-05-31",
      limit: 20,
    });
  });

  it("updates only the authenticated user's entry and maps to DTO", async () => {
    mockedUpdateSkinJournalEntryByIdForUser.mockResolvedValue(
      createSkinJournal({ notes: "Updated note." }),
    );

    await expect(
      updateSkinJournalForUser(skinJournalId, userId, {
        notes: " Updated note. ",
      }),
    ).resolves.toMatchObject({
      id: skinJournalId,
      notes: "Updated note.",
    });

    expect(mockedUpdateSkinJournalEntryByIdForUser).toHaveBeenCalledWith(
      skinJournalId,
      userId,
      {
        notes: "Updated note.",
      },
    );
  });

  it("returns null when updating a missing or not-owned entry", async () => {
    mockedUpdateSkinJournalEntryByIdForUser.mockResolvedValue(null);

    await expect(
      updateSkinJournalForUser(skinJournalId, otherUserId, {
        notes: "Updated note.",
      }),
    ).resolves.toBeNull();

    expect(mockedUpdateSkinJournalEntryByIdForUser).toHaveBeenCalledWith(
      skinJournalId,
      otherUserId,
      {
        notes: "Updated note.",
      },
    );
  });

  it("deletes only the authenticated user's entry", async () => {
    mockedDeleteSkinJournalEntryByIdForUser.mockResolvedValue(createSkinJournal());

    await expect(
      deleteSkinJournalForUser(skinJournalId, userId),
    ).resolves.toBe(true);
    expect(mockedDeleteSkinJournalEntryByIdForUser).toHaveBeenCalledWith(
      skinJournalId,
      userId,
    );
  });

  it("returns false when deleting a missing or not-owned entry", async () => {
    mockedDeleteSkinJournalEntryByIdForUser.mockResolvedValue(null);

    await expect(
      deleteSkinJournalForUser(skinJournalId, otherUserId),
    ).resolves.toBe(false);
    expect(mockedDeleteSkinJournalEntryByIdForUser).toHaveBeenCalledWith(
      skinJournalId,
      otherUserId,
    );
  });
});
