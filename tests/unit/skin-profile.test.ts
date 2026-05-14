import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

vi.mock("server-only", () => ({}));

const collectionMock = {
  findOne: vi.fn(),
  findOneAndUpdate: vi.fn(),
  findOneAndDelete: vi.fn(),
};

vi.mock("@/infrastructure/database/collections", () => ({
  getSkinProfilesCollection: vi.fn(() => collectionMock),
}));

import { toSkinProfileDto } from "@/modules/skin-profile/skin-profile.mapper";
import {
  createSkinProfileSchema,
  type CreateSkinProfileInput,
  updateSkinProfileSchema,
} from "@/modules/skin-profile/skin-profile.schema";
import {
  createOrReplaceSkinProfileForUser,
  deleteSkinProfileByUserId,
  findSkinProfileByUserId,
  updateSkinProfileByUserId,
} from "@/modules/skin-profile/skin-profile.repository";
import type { SkinProfile } from "@/modules/skin-profile/skin-profile.types";

const fixedNow = new Date("2026-05-14T00:00:00.000Z");
const authUserId = "auth-user-id";

const validCreateInput = {
  skinType: "oily",
  concerns: ["acne", "oiliness"],
  sensitivityLevel: "medium",
  budgetRange: "300k_700k",
  experienceLevel: "beginner",
  avoidIngredients: ["fragrance"],
} as const satisfies CreateSkinProfileInput;

function createProfile(overrides: Partial<SkinProfile> = {}): SkinProfile {
  return {
    _id: new ObjectId("665000000000000000000010"),
    userId: authUserId,
    skinType: "oily",
    concerns: ["acne", "oiliness"],
    sensitivityLevel: "medium",
    budgetRange: "300k_700k",
    experienceLevel: "beginner",
    avoidIngredients: ["fragrance"],
    createdAt: fixedNow,
    updatedAt: fixedNow,
    ...overrides,
  };
}

describe("SkinProfile schemas", () => {
  it("validates create input and defaults avoidIngredients to an empty array", () => {
    expect(
      createSkinProfileSchema.parse({
        skinType: "oily",
        concerns: ["acne"],
        sensitivityLevel: "medium",
        budgetRange: "300k_700k",
        experienceLevel: "beginner",
      }),
    ).toEqual({
      skinType: "oily",
      concerns: ["acne"],
      sensitivityLevel: "medium",
      budgetRange: "300k_700k",
      experienceLevel: "beginner",
      avoidIngredients: [],
    });
  });

  it("rejects create input missing required fields", () => {
    expect(() => createSkinProfileSchema.parse({})).toThrow(ZodError);
  });

  it("rejects empty concerns on create", () => {
    expect(() =>
      createSkinProfileSchema.parse({
        ...validCreateInput,
        concerns: [],
      }),
    ).toThrow(ZodError);
  });

  it("rejects client-owned userId and unknown fields", () => {
    expect(() =>
      createSkinProfileSchema.parse({
        ...validCreateInput,
        userId: "other-user-id",
      }),
    ).toThrow(ZodError);
  });

  it("rejects client-owned id fields on create", () => {
    expect(() =>
      createSkinProfileSchema.parse({
        ...validCreateInput,
        id: "profile-id",
      }),
    ).toThrow(ZodError);

    expect(() =>
      createSkinProfileSchema.parse({
        ...validCreateInput,
        _id: "profile-id",
      }),
    ).toThrow(ZodError);
  });

  it("rejects onboardingCompleted in create input", () => {
    expect(() =>
      createSkinProfileSchema.parse({
        ...validCreateInput,
        onboardingCompleted: true,
      }),
    ).toThrow(ZodError);
  });

  it("rejects more than 30 avoid ingredients", () => {
    expect(() =>
      createSkinProfileSchema.parse({
        ...validCreateInput,
        avoidIngredients: Array.from({ length: 31 }, (_, index) => `item-${index}`),
      }),
    ).toThrow(ZodError);
  });

  it("validates partial update input", () => {
    expect(
      updateSkinProfileSchema.parse({
        sensitivityLevel: "high",
      }),
    ).toEqual({
      sensitivityLevel: "high",
    });
  });

  it("rejects empty update bodies", () => {
    expect(() => updateSkinProfileSchema.parse({})).toThrow(ZodError);
  });

  it("rejects userId in update input", () => {
    expect(() =>
      updateSkinProfileSchema.parse({
        skinType: "dry",
        userId: "other-user-id",
      }),
    ).toThrow(ZodError);
  });

  it("rejects client-owned id fields on update", () => {
    expect(() =>
      updateSkinProfileSchema.parse({
        id: "profile-id",
      }),
    ).toThrow(ZodError);

    expect(() =>
      updateSkinProfileSchema.parse({
        _id: "profile-id",
      }),
    ).toThrow(ZodError);
  });

  it("rejects onboardingCompleted in update input", () => {
    expect(() =>
      updateSkinProfileSchema.parse({
        onboardingCompleted: true,
      }),
    ).toThrow(ZodError);
  });
});

describe("SkinProfile mapper", () => {
  it("maps a database document to an API-safe DTO", () => {
    expect(toSkinProfileDto(createProfile())).toEqual({
      id: "665000000000000000000010",
      skinType: "oily",
      concerns: ["acne", "oiliness"],
      sensitivityLevel: "medium",
      budgetRange: "300k_700k",
      experienceLevel: "beginner",
      avoidIngredients: ["fragrance"],
      createdAt: fixedNow.toISOString(),
      updatedAt: fixedNow.toISOString(),
    });
  });

  it("does not expose MongoDB internals or userId", () => {
    const dto = toSkinProfileDto(createProfile()) as Record<string, unknown>;

    expect(dto).not.toHaveProperty("_id");
    expect(dto).not.toHaveProperty("ObjectId");
    expect(dto).not.toHaveProperty("userId");
    expect(dto.createdAt).toBeTypeOf("string");
    expect(dto.updatedAt).toBeTypeOf("string");
  });
});

describe("SkinProfile repository", () => {
  beforeEach(() => {
    collectionMock.findOne.mockReset();
    collectionMock.findOneAndUpdate.mockReset();
    collectionMock.findOneAndDelete.mockReset();
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);
  });

  it("finds a profile by userId", async () => {
    const profile = createProfile();
    collectionMock.findOne.mockResolvedValue(profile);

    await expect(findSkinProfileByUserId(authUserId)).resolves.toBe(profile);
    expect(collectionMock.findOne).toHaveBeenCalledWith({ userId: authUserId });
  });

  it("creates or replaces a profile with atomic upsert filtered by userId", async () => {
    const profile = createProfile();
    collectionMock.findOneAndUpdate.mockResolvedValue(profile);

    await expect(
      createOrReplaceSkinProfileForUser(authUserId, validCreateInput),
    ).resolves.toBe(profile);

    expect(collectionMock.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: authUserId },
      {
        $set: {
          ...validCreateInput,
          updatedAt: fixedNow,
        },
        $setOnInsert: {
          userId: authUserId,
          createdAt: fixedNow,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      },
    );
  });

  it("does not set createdAt outside $setOnInsert on replace", async () => {
    collectionMock.findOneAndUpdate.mockResolvedValue(createProfile());

    await createOrReplaceSkinProfileForUser(authUserId, validCreateInput);

    const update = collectionMock.findOneAndUpdate.mock.calls[0]?.[1] as Record<
      string,
      Record<string, unknown>
    >;

    expect(update.$set).not.toHaveProperty("createdAt");
    expect(update.$setOnInsert).toHaveProperty("createdAt", fixedNow);
  });

  it("updates a profile by userId without upsert", async () => {
    const profile = createProfile({ sensitivityLevel: "high" });
    collectionMock.findOneAndUpdate.mockResolvedValue(profile);

    await expect(
      updateSkinProfileByUserId(authUserId, { sensitivityLevel: "high" }),
    ).resolves.toBe(profile);

    expect(collectionMock.findOneAndUpdate).toHaveBeenCalledWith(
      { userId: authUserId },
      {
        $set: {
          sensitivityLevel: "high",
          updatedAt: fixedNow,
        },
      },
      {
        returnDocument: "after",
      },
    );
  });

  it("deletes a profile by userId", async () => {
    const profile = createProfile();
    collectionMock.findOneAndDelete.mockResolvedValue(profile);

    await expect(deleteSkinProfileByUserId(authUserId)).resolves.toBe(profile);
    expect(collectionMock.findOneAndDelete).toHaveBeenCalledWith({
      userId: authUserId,
    });
  });
});
