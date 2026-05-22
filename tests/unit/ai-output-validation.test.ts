import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  AIProviderResponseError,
  aiProviderIngredientExplanationResultSchema,
  aiProviderMetadataSchema,
  aiProviderRoutineAnalysisResultSchema,
  aiProviderSafetyClassifierResultSchema,
  MockAIProvider,
  validateIngredientExplanationOutput,
  validateRoutineAnalysisOutput,
  validateSafetyClassifierOutput,
  type AIProviderIngredientExplanationResult,
  type AIProviderMetadata,
  type AIProviderRoutineAnalysisInput,
  type AIProviderRoutineAnalysisResult,
  type AIProviderSafetyClassifierResult,
} from "@/infrastructure/ai";

function buildValidMetadata(): AIProviderMetadata {
  return {
    provider: "mock",
    model: "mock-ai-provider",
    generatedAt: "2026-01-01T00:00:00.000Z",
    isMock: true,
  };
}

function buildValidRoutineAnalysisOutput(): AIProviderRoutineAnalysisResult {
  return {
    summary: "Educational routine analysis summary.",
    overallRiskLevel: "low",
    warnings: ["No major educational warning was detected."],
    recommendations: ["Keep the routine simple and introduce products slowly."],
    educationalNotes: [
      "Information is educational skincare guidance, not medical diagnosis.",
    ],
    providerMetadata: buildValidMetadata(),
  };
}

function buildValidIngredientExplanationOutput(): AIProviderIngredientExplanationResult {
  return {
    ingredientName: "Niacinamide",
    shortExplanation:
      "Niacinamide is described in a simple educational skincare context.",
    benefits: ["May help users understand a cosmetic ingredient list."],
    cautions: ["Tolerance can vary by person."],
    suitableFor: ["Users who want beginner-friendly skincare education."],
    notSuitableFor: ["Users seeking diagnosis or prescription advice."],
    educationalNotes: [
      "For severe or persistent symptoms, consult a qualified professional.",
    ],
    providerMetadata: buildValidMetadata(),
  };
}

function buildValidSafetyClassifierOutput(): AIProviderSafetyClassifierResult {
  return {
    isAllowed: true,
    category: "skincare_education",
    reason:
      "Educational skincare content is allowed when it does not request diagnosis or treatment.",
    severity: "low",
    providerMetadata: buildValidMetadata(),
  };
}

function longText(length: number) {
  return "x".repeat(length);
}

function textItems(count: number, prefix = "Item") {
  return Array.from({ length: count }, (_, index) => `${prefix} ${index + 1}`);
}

function expectAIProviderResponseError(
  action: () => unknown,
  expectedMessage: string,
  expectedPath: string,
) {
  try {
    action();
    throw new Error("Expected validator to throw.");
  } catch (error) {
    expect(error).toBeInstanceOf(AIProviderResponseError);
    expect((error as Error).name).toBe("AIProviderResponseError");
    expect((error as Error).message).toContain(expectedMessage);
    expect((error as Error).message).toMatch(
      new RegExp(`${expectedPath}: .+`),
    );
  }
}

const routineInput = {
  routineId: "routine-1",
  routineName: "Morning routine",
  timeOfDay: "morning",
  steps: [
    {
      stepOrder: 1,
      productName: "Gentle cleanser",
      productCategory: "cleanser",
      ingredients: ["water", "glycerin"],
    },
    {
      stepOrder: 2,
      productName: "Sunscreen",
      productCategory: "sunscreen",
      ingredients: ["zinc oxide"],
    },
  ],
  locale: "vi-VN",
} as const satisfies AIProviderRoutineAnalysisInput;

describe("aiProviderMetadataSchema", () => {
  it("accepts valid provider metadata", () => {
    expect(aiProviderMetadataSchema.safeParse(buildValidMetadata()).success).toBe(
      true,
    );
  });

  it("rejects missing provider", () => {
    const value: Record<string, unknown> = buildValidMetadata();
    delete value.provider;

    expect(aiProviderMetadataSchema.safeParse(value).success).toBe(false);
  });

  it("rejects invalid generatedAt datetime", () => {
    expect(
      aiProviderMetadataSchema.safeParse({
        ...buildValidMetadata(),
        generatedAt: "not-a-date",
      }).success,
    ).toBe(false);
  });

  it("rejects unknown extra fields", () => {
    expect(
      aiProviderMetadataSchema.safeParse({
        ...buildValidMetadata(),
        prompt: "hidden prompt must not be accepted",
      }).success,
    ).toBe(false);
  });
});

describe("aiProviderRoutineAnalysisResultSchema and validator", () => {
  it("accepts valid routine analysis output", () => {
    const value = buildValidRoutineAnalysisOutput();

    expect(aiProviderRoutineAnalysisResultSchema.safeParse(value).success).toBe(
      true,
    );
    expect(validateRoutineAnalysisOutput(value)).toEqual(value);
  });

  it("rejects missing required fields", () => {
    const value: Record<string, unknown> = buildValidRoutineAnalysisOutput();
    delete value.summary;

    expect(aiProviderRoutineAnalysisResultSchema.safeParse(value).success).toBe(
      false,
    );
  });

  it("rejects invalid overallRiskLevel", () => {
    expect(
      aiProviderRoutineAnalysisResultSchema.safeParse({
        ...buildValidRoutineAnalysisOutput(),
        overallRiskLevel: "urgent",
      }).success,
    ).toBe(false);
  });

  it("rejects unknown extra fields", () => {
    expect(
      aiProviderRoutineAnalysisResultSchema.safeParse({
        ...buildValidRoutineAnalysisOutput(),
        disclaimer: "Extra doc-contract field.",
      }).success,
    ).toBe(false);
  });

  it("rejects summary over max length", () => {
    expect(
      aiProviderRoutineAnalysisResultSchema.safeParse({
        ...buildValidRoutineAnalysisOutput(),
        summary: longText(801),
      }).success,
    ).toBe(false);
  });

  it("rejects arrays over max items", () => {
    expect(
      aiProviderRoutineAnalysisResultSchema.safeParse({
        ...buildValidRoutineAnalysisOutput(),
        warnings: textItems(11, "Warning"),
      }).success,
    ).toBe(false);
    expect(
      aiProviderRoutineAnalysisResultSchema.safeParse({
        ...buildValidRoutineAnalysisOutput(),
        recommendations: textItems(11, "Recommendation"),
      }).success,
    ).toBe(false);
    expect(
      aiProviderRoutineAnalysisResultSchema.safeParse({
        ...buildValidRoutineAnalysisOutput(),
        educationalNotes: textItems(11, "Educational note"),
      }).success,
    ).toBe(false);
  });

  it("rejects invalid providerMetadata", () => {
    expect(
      aiProviderRoutineAnalysisResultSchema.safeParse({
        ...buildValidRoutineAnalysisOutput(),
        providerMetadata: {
          ...buildValidMetadata(),
          generatedAt: "not-a-date",
        },
      }).success,
    ).toBe(false);
  });

  it("rejects doc-contract riskLevel instead of overallRiskLevel", () => {
    const value: Record<string, unknown> = buildValidRoutineAnalysisOutput();
    delete value.overallRiskLevel;
    value.riskLevel = "low";

    expect(aiProviderRoutineAnalysisResultSchema.safeParse(value).success).toBe(
      false,
    );
  });

  it("rejects doc-contract suggestions instead of recommendations", () => {
    const value: Record<string, unknown> = buildValidRoutineAnalysisOutput();
    delete value.recommendations;
    value.suggestions = [
      {
        title: "Simplify routine",
        description: "Keep the routine simple.",
        priority: "should_fix",
      },
    ];

    expect(aiProviderRoutineAnalysisResultSchema.safeParse(value).success).toBe(
      false,
    );
  });
});

describe("aiProviderIngredientExplanationResultSchema and validator", () => {
  it("accepts valid ingredient explanation output", () => {
    const value = buildValidIngredientExplanationOutput();

    expect(
      aiProviderIngredientExplanationResultSchema.safeParse(value).success,
    ).toBe(true);
    expect(validateIngredientExplanationOutput(value)).toEqual(value);
  });

  it("rejects missing required fields", () => {
    const value: Record<string, unknown> = buildValidIngredientExplanationOutput();
    delete value.shortExplanation;

    expect(
      aiProviderIngredientExplanationResultSchema.safeParse(value).success,
    ).toBe(false);
  });

  it("rejects unknown extra fields", () => {
    expect(
      aiProviderIngredientExplanationResultSchema.safeParse({
        ...buildValidIngredientExplanationOutput(),
        disclaimer: "Extra doc-contract field.",
      }).success,
    ).toBe(false);
  });

  it("rejects shortExplanation over max length", () => {
    expect(
      aiProviderIngredientExplanationResultSchema.safeParse({
        ...buildValidIngredientExplanationOutput(),
        shortExplanation: longText(801),
      }).success,
    ).toBe(false);
  });

  it("rejects arrays over max items", () => {
    expect(
      aiProviderIngredientExplanationResultSchema.safeParse({
        ...buildValidIngredientExplanationOutput(),
        benefits: textItems(9, "Benefit"),
      }).success,
    ).toBe(false);
    expect(
      aiProviderIngredientExplanationResultSchema.safeParse({
        ...buildValidIngredientExplanationOutput(),
        cautions: textItems(9, "Caution"),
      }).success,
    ).toBe(false);
    expect(
      aiProviderIngredientExplanationResultSchema.safeParse({
        ...buildValidIngredientExplanationOutput(),
        suitableFor: textItems(9, "Suitable for"),
      }).success,
    ).toBe(false);
    expect(
      aiProviderIngredientExplanationResultSchema.safeParse({
        ...buildValidIngredientExplanationOutput(),
        notSuitableFor: textItems(9, "Not suitable for"),
      }).success,
    ).toBe(false);
    expect(
      aiProviderIngredientExplanationResultSchema.safeParse({
        ...buildValidIngredientExplanationOutput(),
        educationalNotes: textItems(9, "Educational note"),
      }).success,
    ).toBe(false);
  });

  it("rejects invalid providerMetadata", () => {
    expect(
      aiProviderIngredientExplanationResultSchema.safeParse({
        ...buildValidIngredientExplanationOutput(),
        providerMetadata: {
          ...buildValidMetadata(),
          generatedAt: "not-a-date",
        },
      }).success,
    ).toBe(false);
  });

  it("rejects doc-contract simpleExplanation instead of shortExplanation", () => {
    const value: Record<string, unknown> = buildValidIngredientExplanationOutput();
    delete value.shortExplanation;
    value.simpleExplanation =
      "This field belongs to the docs contract, not the current provider type.";

    expect(
      aiProviderIngredientExplanationResultSchema.safeParse(value).success,
    ).toBe(false);
  });
});

describe("aiProviderSafetyClassifierResultSchema and validator", () => {
  it("accepts valid safety classifier output", () => {
    const value = buildValidSafetyClassifierOutput();

    expect(aiProviderSafetyClassifierResultSchema.safeParse(value).success).toBe(
      true,
    );
    expect(validateSafetyClassifierOutput(value)).toEqual(value);
  });

  it("rejects missing required fields", () => {
    const value: Record<string, unknown> = buildValidSafetyClassifierOutput();
    delete value.isAllowed;

    expect(aiProviderSafetyClassifierResultSchema.safeParse(value).success).toBe(
      false,
    );
  });

  it("rejects invalid severity", () => {
    expect(
      aiProviderSafetyClassifierResultSchema.safeParse({
        ...buildValidSafetyClassifierOutput(),
        severity: "blocked",
      }).success,
    ).toBe(false);
  });

  it("rejects unknown extra fields", () => {
    expect(
      aiProviderSafetyClassifierResultSchema.safeParse({
        ...buildValidSafetyClassifierOutput(),
        safeResponseType: "normal",
      }).success,
    ).toBe(false);
  });

  it("rejects reason over max length", () => {
    expect(
      aiProviderSafetyClassifierResultSchema.safeParse({
        ...buildValidSafetyClassifierOutput(),
        reason: longText(601),
      }).success,
    ).toBe(false);
  });

  it("rejects invalid providerMetadata", () => {
    expect(
      aiProviderSafetyClassifierResultSchema.safeParse({
        ...buildValidSafetyClassifierOutput(),
        providerMetadata: {
          ...buildValidMetadata(),
          generatedAt: "not-a-date",
        },
      }).success,
    ).toBe(false);
  });

  it("rejects doc-contract shouldBlockAIAnswer instead of isAllowed", () => {
    const value: Record<string, unknown> = buildValidSafetyClassifierOutput();
    delete value.isAllowed;
    value.shouldBlockAIAnswer = false;

    expect(aiProviderSafetyClassifierResultSchema.safeParse(value).success).toBe(
      false,
    );
  });

  it("rejects doc-contract riskLevel instead of severity", () => {
    const value: Record<string, unknown> = buildValidSafetyClassifierOutput();
    delete value.severity;
    value.riskLevel = "low";

    expect(aiProviderSafetyClassifierResultSchema.safeParse(value).success).toBe(
      false,
    );
  });
});

describe("AI output validator errors", () => {
  it("throws AIProviderResponseError for invalid routine analysis output", () => {
    expectAIProviderResponseError(
      () =>
        validateRoutineAnalysisOutput({
          ...buildValidRoutineAnalysisOutput(),
          summary: "",
        }),
      "Invalid routine analysis AI output",
      "summary",
    );
  });

  it("throws AIProviderResponseError for invalid ingredient explanation output", () => {
    expectAIProviderResponseError(
      () =>
        validateIngredientExplanationOutput({
          ...buildValidIngredientExplanationOutput(),
          shortExplanation: "",
        }),
      "Invalid ingredient explanation AI output",
      "shortExplanation",
    );
  });

  it("throws AIProviderResponseError for invalid safety classifier output", () => {
    expectAIProviderResponseError(
      () =>
        validateSafetyClassifierOutput({
          ...buildValidSafetyClassifierOutput(),
          reason: "",
        }),
      "Invalid safety classifier AI output",
      "reason",
    );
  });
});

describe("MockAIProvider output compatibility", () => {
  const provider = new MockAIProvider();

  it("validates MockAIProvider routine analysis output", async () => {
    const result = await provider.analyzeRoutine(routineInput);

    expect(validateRoutineAnalysisOutput(result)).toEqual(result);
  });

  it("validates MockAIProvider ingredient explanation output", async () => {
    const result = await provider.explainIngredient({
      ingredientName: "Glycerin",
      skinType: "dry",
      concerns: ["dryness"],
      locale: "vi-VN",
    });

    expect(validateIngredientExplanationOutput(result)).toEqual(result);
  });

  it("validates MockAIProvider safety classifier output", async () => {
    const result = await provider.classifySafety({
      text: "Explain what a cleanser does.",
      contextType: "general",
    });

    expect(validateSafetyClassifierOutput(result)).toEqual(result);
  });
});
