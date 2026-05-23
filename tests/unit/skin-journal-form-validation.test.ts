import { describe, expect, it, vi } from "vitest";

import {
  buildCreateSkinJournalPayload,
  buildUpdateSkinJournalPayload,
  createBlankSkinJournalFormState,
  getDefaultSkinJournalLocalDate,
  getDefaultSkinJournalTimezone,
  parseListInput,
  skinJournalUpdateClientSchema,
  skinJournalCreateClientSchema,
  type SkinJournalFormState,
  validateCreateSkinJournalForm,
  validateUpdateSkinJournalForm,
} from "@/modules/journals/skin-journal-form.validation";

function createFormState(
  overrides: Partial<SkinJournalFormState> = {},
): SkinJournalFormState {
  return {
    localDate: "2026-05-22",
    timezone: "Asia/Ho_Chi_Minh",
    productsUsedText: "product_123",
    observationsText: "Dry cheeks",
    symptoms: ["dryness"],
    sleepHours: "7",
    stressLevel: "medium",
    notes: "No treatment today.",
    ...overrides,
  };
}

describe("SkinJournal form validation", () => {
  it("formats the default local date from browser date parts", () => {
    expect(getDefaultSkinJournalLocalDate(new Date(2026, 4, 7))).toBe(
      "2026-05-07",
    );
  });

  it("returns browser timezone with UTC fallback", () => {
    const dateTimeFormatSpy = vi.spyOn(Intl, "DateTimeFormat").mockReturnValue({
      resolvedOptions: () => ({ timeZone: "Asia/Ho_Chi_Minh" }),
    } as unknown as Intl.DateTimeFormat);

    expect(getDefaultSkinJournalTimezone()).toBe("Asia/Ho_Chi_Minh");

    dateTimeFormatSpy.mockReturnValue({
      resolvedOptions: () => ({}),
    } as unknown as Intl.DateTimeFormat);
    expect(getDefaultSkinJournalTimezone()).toBe("UTC");
    dateTimeFormatSpy.mockRestore();
  });

  it("parses comma and newline separated text into trimmed values", () => {
    expect(parseListInput(" product_1, product_2\n\nproduct_3 ")).toEqual([
      "product_1",
      "product_2",
      "product_3",
    ]);
  });

  it("builds create payload with only allowed fields", () => {
    const payload = buildCreateSkinJournalPayload(createFormState());

    expect(payload).toEqual({
      localDate: "2026-05-22",
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
  });

  it("builds update payload without localDate or server-owned fields", () => {
    const payload = buildUpdateSkinJournalPayload(createFormState());

    expect(payload).toMatchObject({
      timezone: "Asia/Ho_Chi_Minh",
      productsUsed: ["product_123"],
      observations: ["Dry cheeks"],
      symptoms: ["dryness"],
      sleepHours: 7,
      stressLevel: "medium",
      notes: "No treatment today.",
    });
    expect(payload).not.toHaveProperty("localDate");
    expect(payload).not.toHaveProperty("id");
    expect(payload).not.toHaveProperty("_id");
    expect(payload).not.toHaveProperty("userId");
  });

  it("validates create payloads", () => {
    expect(validateCreateSkinJournalForm(createFormState()).success).toBe(true);
    expect(
      validateCreateSkinJournalForm(createFormState({ localDate: "" })),
    ).toMatchObject({
      errors: {
        localDate: "Choose a date using YYYY-MM-DD.",
      },
      success: false,
    });
    expect(
      validateCreateSkinJournalForm(createFormState({ timezone: "" })),
    ).toMatchObject({
      errors: {
        timezone: "Timezone is required.",
      },
      success: false,
    });
    expect(
      validateCreateSkinJournalForm(
        createFormState({ timezone: "Not/A_Real_Zone" }),
      ),
    ).toMatchObject({
      errors: {
        timezone: "Timezone is required.",
      },
      success: false,
    });
  });

  it("rejects invalid sleepHours, stressLevel, and symptoms", () => {
    expect(
      validateCreateSkinJournalForm(createFormState({ sleepHours: "25" })),
    ).toMatchObject({
      errors: {
        sleepHours: "Sleep hours must be between 0 and 24.",
      },
      success: false,
    });
    expect(
      validateCreateSkinJournalForm(
        createFormState({ stressLevel: "very-high" as never }),
      ),
    ).toMatchObject({
      errors: {
        stressLevel: "Stress level must be low, medium, or high.",
      },
      success: false,
    });
    expect(
      validateCreateSkinJournalForm(
        createFormState({ symptoms: ["unknown"] as never }),
      ),
    ).toMatchObject({
      errors: {
        symptoms: "Choose only supported symptom values.",
      },
      success: false,
    });
  });

  it("rejects product and observation lists over the API limits", () => {
    expect(
      validateCreateSkinJournalForm(
        createFormState({
          productsUsedText: Array.from(
            { length: 31 },
            (_, index) => `product_${index}`,
          ).join("\n"),
        }),
      ),
    ).toMatchObject({
      errors: {
        productsUsedText: "Products used can include at most 30 items.",
      },
      success: false,
    });
    expect(
      validateCreateSkinJournalForm(
        createFormState({
          observationsText: Array.from(
            { length: 21 },
            (_, index) => `Observation ${index}`,
          ).join("\n"),
        }),
      ),
    ).toMatchObject({
      errors: {
        observationsText: "Observations can include at most 20 items.",
      },
      success: false,
    });
  });

  it("validates update payloads and rejects localDate updates", () => {
    expect(validateUpdateSkinJournalForm(createFormState()).success).toBe(true);
    expect(skinJournalUpdateClientSchema.safeParse({}).success).toBe(false);
    expect(
      skinJournalUpdateClientSchema.safeParse({
        ...buildUpdateSkinJournalPayload(createFormState()),
        localDate: "2026-05-23",
      }).success,
    ).toBe(false);
  });

  it("rejects notes over 3000 characters", () => {
    expect(
      skinJournalCreateClientSchema.safeParse({
        ...buildCreateSkinJournalPayload(createFormState()),
        notes: "a".repeat(3001),
      }).success,
    ).toBe(false);
  });

  it("creates a blank form state with default arrays represented as text fields", () => {
    const formState = createBlankSkinJournalFormState();

    expect(formState.productsUsedText).toBe("");
    expect(formState.observationsText).toBe("");
    expect(formState.symptoms).toEqual([]);
    expect(formState.stressLevel).toBe("");
  });
});
