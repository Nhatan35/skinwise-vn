import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

vi.mock("server-only", () => ({}));

const toArrayMock = vi.fn();
const limitMock = vi.fn(() => ({ toArray: toArrayMock }));
const sortMock = vi.fn(() => ({ limit: limitMock }));
const collectionMock = {
  insertOne: vi.fn(),
  find: vi.fn((filter?: unknown) => {
    void filter;

    return { sort: sortMock };
  }),
  findOne: vi.fn(),
  findOneAndUpdate: vi.fn(),
  findOneAndDelete: vi.fn(),
};

vi.mock("@/infrastructure/database/collections", () => ({
  getSkinJournalsCollection: vi.fn(() => collectionMock),
}));

import { toSkinJournalDto } from "@/modules/journals/skin-journal.mapper";
import {
  createSkinJournalSchema,
  skinJournalListQuerySchema,
  updateSkinJournalSchema,
} from "@/modules/journals/skin-journal.schema";
import {
  createSkinJournalEntry,
  deleteSkinJournalEntryByIdForUser,
  findSkinJournalEntriesByUserId,
  findSkinJournalEntryByIdForUser,
  findSkinJournalEntryByUserAndLocalDate,
  SkinJournalConflictError,
  updateSkinJournalEntryByIdForUser,
} from "@/modules/journals/skin-journal.repository";
import type { SkinJournal } from "@/modules/journals/skin-journal.types";

const userId = "auth-user-id";
const otherUserId = "other-user-id";
const skinJournalId = "665000000000000000000601";
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

describe("SkinJournal schema", () => {
  it("accepts valid create input and defaults optional arrays", () => {
    expect(
      createSkinJournalSchema.parse({
        localDate: "2026-05-12",
        timezone: " Asia/Ho_Chi_Minh ",
        sleepHours: 7,
        stressLevel: "medium",
        notes: "  No treatment today.  ",
      }),
    ).toEqual({
      localDate: "2026-05-12",
      timezone: "Asia/Ho_Chi_Minh",
      productsUsed: [],
      observations: [],
      symptoms: [],
      sleepHours: 7,
      stressLevel: "medium",
      notes: "No treatment today.",
    });
  });

  it("rejects invalid required fields and ranges", () => {
    expect(() =>
      createSkinJournalSchema.parse({
        timezone: "Asia/Ho_Chi_Minh",
      }),
    ).toThrow(ZodError);
    expect(() =>
      createSkinJournalSchema.parse({
        localDate: "12-05-2026",
        timezone: "Asia/Ho_Chi_Minh",
      }),
    ).toThrow(ZodError);
    expect(() =>
      createSkinJournalSchema.parse({
        localDate: "2026-05-12",
      }),
    ).toThrow(ZodError);
    expect(() =>
      createSkinJournalSchema.parse({
        localDate: "2026-05-12",
        timezone: "Invalid/Timezone",
      }),
    ).toThrow(ZodError);
    expect(() =>
      createSkinJournalSchema.parse({
        localDate: "2026-05-12",
        timezone: "Asia/Ho_Chi_Minh",
        sleepHours: -1,
      }),
    ).toThrow(ZodError);
    expect(() =>
      createSkinJournalSchema.parse({
        localDate: "2026-05-12",
        timezone: "Asia/Ho_Chi_Minh",
        sleepHours: 25,
      }),
    ).toThrow(ZodError);
    expect(() =>
      createSkinJournalSchema.parse({
        localDate: "2026-05-12",
        timezone: "Asia/Ho_Chi_Minh",
        productsUsed: Array.from({ length: 31 }, (_, index) => `product_${index}`),
      }),
    ).toThrow(ZodError);
    expect(() =>
      createSkinJournalSchema.parse({
        localDate: "2026-05-12",
        timezone: "Asia/Ho_Chi_Minh",
        observations: Array.from({ length: 21 }, (_, index) => `note ${index}`),
      }),
    ).toThrow(ZodError);
    expect(() =>
      createSkinJournalSchema.parse({
        localDate: "2026-05-12",
        timezone: "Asia/Ho_Chi_Minh",
        symptoms: ["unknown"],
      }),
    ).toThrow(ZodError);
    expect(() =>
      createSkinJournalSchema.parse({
        localDate: "2026-05-12",
        timezone: "Asia/Ho_Chi_Minh",
        stressLevel: "very-high",
      }),
    ).toThrow(ZodError);
  });

  it("rejects unknown, server-owned, and future image fields", () => {
    const baseInput = {
      localDate: "2026-05-12",
      timezone: "Asia/Ho_Chi_Minh",
    };
    const forbiddenFields = [
      "userId",
      "id",
      "_id",
      "createdAt",
      "updatedAt",
      "localDateUtc",
      "imageUrl",
      "imageStorageKey",
      "imageVisibility",
      "photoUrls",
      "mood",
      "skinCondition",
      "acneLevel",
      "rednessLevel",
      "drynessLevel",
      "oilinessLevel",
      "sensitivityLevel",
    ];

    for (const field of forbiddenFields) {
      expect(() =>
        createSkinJournalSchema.parse({
          ...baseInput,
          [field]: "client-value",
        }),
      ).toThrow(ZodError);
    }
  });

  it("validates list query filters and default limit", () => {
    expect(skinJournalListQuerySchema.parse({})).toEqual({ limit: 20 });
    expect(
      skinJournalListQuerySchema.parse({
        from: "2026-05-01",
        to: "2026-05-31",
        limit: "5",
      }),
    ).toEqual({
      from: "2026-05-01",
      to: "2026-05-31",
      limit: 5,
    });

    expect(() =>
      skinJournalListQuerySchema.parse({ from: "05-01-2026" }),
    ).toThrow(ZodError);
    expect(() => skinJournalListQuerySchema.parse({ limit: "51" })).toThrow(
      ZodError,
    );
    expect(() =>
      skinJournalListQuerySchema.parse({
        from: "2026-05-31",
        to: "2026-05-01",
      }),
    ).toThrow(ZodError);
    expect(() => skinJournalListQuerySchema.parse({ userId })).toThrow(ZodError);
  });

  it("accepts valid update fields and rejects localDate or empty updates", () => {
    expect(
      updateSkinJournalSchema.parse({
        timezone: "Asia/Ho_Chi_Minh",
        productsUsed: ["product_123"],
        observations: ["Dry cheeks."],
        symptoms: ["dryness"],
        sleepHours: 7,
        stressLevel: "medium",
        notes: "Updated note.",
      }),
    ).toMatchObject({
      timezone: "Asia/Ho_Chi_Minh",
      symptoms: ["dryness"],
    });

    expect(() => updateSkinJournalSchema.parse({})).toThrow(ZodError);
    expect(() =>
      updateSkinJournalSchema.parse({ localDate: "2026-05-13" }),
    ).toThrow(ZodError);
    for (const field of [
      "imageUrl",
      "imageStorageKey",
      "imageVisibility",
      "photoUrls",
    ]) {
      expect(() =>
        updateSkinJournalSchema.parse({ [field]: "client-value" }),
      ).toThrow(ZodError);
    }
  });
});

describe("SkinJournal mapper", () => {
  it("maps _id to id, serializes dates, and copies arrays", () => {
    const skinJournal = createSkinJournal();
    const dto = toSkinJournalDto(skinJournal);

    expect(dto).toEqual({
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

    dto.productsUsed.push("mutated");
    dto.observations.push("mutated");
    dto.symptoms.push("other");

    expect(skinJournal.productsUsed).toEqual(["product_123"]);
    expect(skinJournal.observations).toEqual(["Dry cheeks."]);
    expect(skinJournal.symptoms).toEqual(["dryness"]);
  });

  it("does not expose userId, _id, raw ObjectId values, or future image fields", () => {
    const dto = toSkinJournalDto({
      ...createSkinJournal(),
      imageUrl: "https://example.com/private.jpg",
      imageStorageKey: "private/key",
      imageVisibility: "private",
      photoUrls: ["https://example.com/private.jpg"],
    } as SkinJournal & Record<string, unknown>) as Record<string, unknown>;
    const serializedDto = JSON.stringify(dto);

    expect(dto).not.toHaveProperty("userId");
    expect(dto).not.toHaveProperty("_id");
    expect(dto).not.toHaveProperty("imageUrl");
    expect(dto).not.toHaveProperty("imageStorageKey");
    expect(dto).not.toHaveProperty("imageVisibility");
    expect(dto).not.toHaveProperty("photoUrls");
    expect(serializedDto).not.toContain("ObjectId");
  });
});

describe("SkinJournal repository", () => {
  beforeEach(() => {
    vi.useRealTimers();
    collectionMock.insertOne.mockReset();
    collectionMock.find.mockReset();
    collectionMock.findOne.mockReset();
    collectionMock.findOneAndUpdate.mockReset();
    collectionMock.findOneAndDelete.mockReset();
    sortMock.mockReset();
    limitMock.mockReset();
    toArrayMock.mockReset();
    collectionMock.find.mockReturnValue({ sort: sortMock });
    sortMock.mockReturnValue({ limit: limitMock });
    limitMock.mockReturnValue({ toArray: toArrayMock });
  });

  it("creates a SkinJournal entry for userId and localDate", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
    collectionMock.insertOne.mockResolvedValue({
      insertedId: new ObjectId(skinJournalId),
    });

    await expect(
      createSkinJournalEntry(userId, {
        localDate: "2026-05-12",
        timezone: "Asia/Ho_Chi_Minh",
        productsUsed: ["product_123"],
        observations: ["Dry cheeks."],
        symptoms: ["dryness"],
        sleepHours: 7,
        stressLevel: "medium",
        notes: "No treatment today.",
      }),
    ).resolves.toMatchObject({
      _id: new ObjectId(skinJournalId),
      userId,
      localDate: "2026-05-12",
    });

    expect(collectionMock.insertOne).toHaveBeenCalledWith({
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
    });
  });

  it("throws a safe conflict error for duplicate userId and localDate", async () => {
    collectionMock.insertOne.mockRejectedValue({ code: 11000 });

    await expect(
      createSkinJournalEntry(userId, {
        localDate: "2026-05-12",
        timezone: "Asia/Ho_Chi_Minh",
        productsUsed: [],
        observations: [],
        symptoms: [],
      }),
    ).rejects.toBeInstanceOf(SkinJournalConflictError);
  });

  it("lists entries by authenticated user and date range newest first", async () => {
    const skinJournal = createSkinJournal();
    toArrayMock.mockResolvedValue([skinJournal]);

    await expect(
      findSkinJournalEntriesByUserId(userId, {
        from: "2026-05-01",
        to: "2026-05-31",
        limit: 10,
      }),
    ).resolves.toEqual([skinJournal]);

    expect(collectionMock.find).toHaveBeenCalledWith({
      userId,
      localDate: {
        $gte: "2026-05-01",
        $lte: "2026-05-31",
      },
    });
    expect(sortMock).toHaveBeenCalledWith({ localDate: -1, createdAt: -1 });
    expect(limitMock).toHaveBeenCalledWith(10);
  });

  it("finds entries only by id and userId", async () => {
    const skinJournal = createSkinJournal();
    collectionMock.findOne.mockResolvedValue(skinJournal);

    await expect(
      findSkinJournalEntryByIdForUser(skinJournalId, userId),
    ).resolves.toBe(skinJournal);
    expect(collectionMock.findOne).toHaveBeenCalledWith({
      _id: new ObjectId(skinJournalId),
      userId,
    });

    collectionMock.findOne.mockClear();
    await expect(
      findSkinJournalEntryByIdForUser("not-an-object-id", userId),
    ).resolves.toBeNull();
    expect(collectionMock.findOne).not.toHaveBeenCalled();
  });

  it("finds duplicate candidates by userId and localDate", async () => {
    const skinJournal = createSkinJournal();
    collectionMock.findOne.mockResolvedValue(skinJournal);

    await expect(
      findSkinJournalEntryByUserAndLocalDate(userId, "2026-05-12"),
    ).resolves.toBe(skinJournal);
    expect(collectionMock.findOne).toHaveBeenCalledWith({
      userId,
      localDate: "2026-05-12",
    });
  });

  it("updates only entries owned by the authenticated user", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedDate);
    const skinJournal = createSkinJournal({
      notes: undefined,
      updatedAt: fixedDate,
    });
    collectionMock.findOneAndUpdate.mockResolvedValue(skinJournal);

    await expect(
      updateSkinJournalEntryByIdForUser(skinJournalId, userId, {
        timezone: "Asia/Ho_Chi_Minh",
        productsUsed: ["product_456"],
        notes: undefined,
      }),
    ).resolves.toBe(skinJournal);

    expect(collectionMock.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: new ObjectId(skinJournalId), userId },
      {
        $set: {
          updatedAt: fixedDate,
          timezone: "Asia/Ho_Chi_Minh",
          productsUsed: ["product_456"],
        },
        $unset: {
          notes: "",
        },
      },
      {
        returnDocument: "after",
      },
    );
  });

  it("returns null for invalid update ids without querying", async () => {
    await expect(
      updateSkinJournalEntryByIdForUser("not-an-object-id", userId, {
        timezone: "Asia/Ho_Chi_Minh",
      }),
    ).resolves.toBeNull();

    expect(collectionMock.findOneAndUpdate).not.toHaveBeenCalled();
  });

  it("deletes only entries owned by the authenticated user", async () => {
    const skinJournal = createSkinJournal({ userId: otherUserId });
    collectionMock.findOneAndDelete.mockResolvedValue(skinJournal);

    await expect(
      deleteSkinJournalEntryByIdForUser(skinJournalId, otherUserId),
    ).resolves.toBe(skinJournal);

    expect(collectionMock.findOneAndDelete).toHaveBeenCalledWith({
      _id: new ObjectId(skinJournalId),
      userId: otherUserId,
    });
  });

  it("returns null for invalid delete ids without querying", async () => {
    await expect(
      deleteSkinJournalEntryByIdForUser("not-an-object-id", userId),
    ).resolves.toBeNull();

    expect(collectionMock.findOneAndDelete).not.toHaveBeenCalled();
  });
});
