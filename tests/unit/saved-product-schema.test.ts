import { describe, expect, it } from "vitest";

import { updateSavedProductMetadataBodySchema } from "@/modules/saved-products/saved-product.schema";

describe("saved product metadata schema", () => {
  it.each(["considering", "testing", "paused", "kept"] as const)(
    "accepts decisionStatus %s",
    (decisionStatus) => {
      expect(
        updateSavedProductMetadataBodySchema.parse({ decisionStatus }),
      ).toEqual({ decisionStatus });
    },
  );

  it("rejects an invalid decisionStatus", () => {
    expect(() =>
      updateSavedProductMetadataBodySchema.parse({
        decisionStatus: "recommended",
      }),
    ).toThrow();
  });

  it.each(["morning", "evening", "either", "not_sure"] as const)(
    "accepts plannedRoutineSlot %s",
    (plannedRoutineSlot) => {
      expect(
        updateSavedProductMetadataBodySchema.parse({ plannedRoutineSlot }),
      ).toEqual({ plannedRoutineSlot });
    },
  );

  it("rejects an invalid plannedRoutineSlot", () => {
    expect(() =>
      updateSavedProductMetadataBodySchema.parse({
        plannedRoutineSlot: "weekly",
      }),
    ).toThrow();
  });

  it("trims personalNote and accepts up to 1000 characters", () => {
    const note = "a".repeat(1000);

    expect(
      updateSavedProductMetadataBodySchema.parse({
        personalNote: `  ${note}  `,
      }),
    ).toEqual({ personalNote: note });
  });

  it("accepts an empty trimmed personalNote for clearing", () => {
    expect(
      updateSavedProductMetadataBodySchema.parse({
        personalNote: "   ",
      }),
    ).toEqual({ personalNote: "" });
  });

  it("rejects personalNote over 1000 characters", () => {
    expect(() =>
      updateSavedProductMetadataBodySchema.parse({
        personalNote: "a".repeat(1001),
      }),
    ).toThrow();
  });

  it("accepts trimmed user-owned tags", () => {
    expect(
      updateSavedProductMetadataBodySchema.parse({
        tags: ["  To buy  ", "Patch test"],
      }),
    ).toEqual({ tags: ["To buy", "Patch test"] });
  });

  it.each([
    [[""]],
    [["To buy", "to buy"]],
    [["not allowed!"]],
    [["a".repeat(31)]],
    [["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]],
  ])("rejects invalid tags %s", (tags) => {
    expect(() =>
      updateSavedProductMetadataBodySchema.parse({ tags }),
    ).toThrow();
  });

  it.each([
    "unknown",
    "id",
    "_id",
    "userId",
    "productId",
    "createdAt",
    "updatedAt",
    "product",
    "owner",
    "ownership",
  ])("rejects unsupported or internal field %s", (field) => {
    expect(() =>
      updateSavedProductMetadataBodySchema.parse({
        [field]: "not-allowed",
      }),
    ).toThrow();
  });

  it("rejects an empty body", () => {
    expect(() => updateSavedProductMetadataBodySchema.parse({})).toThrow();
  });
});
