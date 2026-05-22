import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  AIProviderResponseError,
  getAIProvider,
  MockAIProvider,
  ValidatedAIProvider,
  type AIProvider,
  type AIProviderIngredientExplanationInput,
  type AIProviderIngredientExplanationResult,
  type AIProviderMetadata,
  type AIProviderRoutineAnalysisInput,
  type AIProviderRoutineAnalysisResult,
  type AIProviderSafetyClassifierInput,
  type AIProviderSafetyClassifierResult,
} from "@/infrastructure/ai";

type RecordingAIProviderOutputs = {
  routine: AIProviderRoutineAnalysisResult;
  ingredient: AIProviderIngredientExplanationResult;
  safety: AIProviderSafetyClassifierResult;
};

class RecordingAIProvider implements AIProvider {
  routineCalls = 0;
  ingredientCalls = 0;
  safetyCalls = 0;
  lastRoutineInput: AIProviderRoutineAnalysisInput | null = null;
  lastIngredientInput: AIProviderIngredientExplanationInput | null = null;
  lastSafetyInput: AIProviderSafetyClassifierInput | null = null;

  constructor(private readonly outputs: RecordingAIProviderOutputs) {}

  async analyzeRoutine(
    input: AIProviderRoutineAnalysisInput,
  ): Promise<AIProviderRoutineAnalysisResult> {
    this.routineCalls += 1;
    this.lastRoutineInput = input;

    return this.outputs.routine;
  }

  async explainIngredient(
    input: AIProviderIngredientExplanationInput,
  ): Promise<AIProviderIngredientExplanationResult> {
    this.ingredientCalls += 1;
    this.lastIngredientInput = input;

    return this.outputs.ingredient;
  }

  async classifySafety(
    input: AIProviderSafetyClassifierInput,
  ): Promise<AIProviderSafetyClassifierResult> {
    this.safetyCalls += 1;
    this.lastSafetyInput = input;

    return this.outputs.safety;
  }
}

const originalAIProvider = process.env.AI_PROVIDER;

function restoreAIProviderEnv() {
  if (originalAIProvider === undefined) {
    delete process.env.AI_PROVIDER;
    return;
  }

  process.env.AI_PROVIDER = originalAIProvider;
}

function buildMetadata(): AIProviderMetadata {
  return {
    provider: "mock",
    model: "mock-ai-provider",
    generatedAt: "2026-01-01T00:00:00.000Z",
    isMock: true,
  };
}

function buildRoutineOutput(): AIProviderRoutineAnalysisResult {
  return {
    summary: "Educational routine analysis summary.",
    overallRiskLevel: "low",
    warnings: ["No major educational warning was detected."],
    recommendations: ["Keep the routine simple."],
    educationalNotes: ["Educational skincare guidance, not medical diagnosis."],
    providerMetadata: buildMetadata(),
  };
}

function buildIngredientOutput(): AIProviderIngredientExplanationResult {
  return {
    ingredientName: "Glycerin",
    shortExplanation: "Glycerin is explained in an educational skincare context.",
    benefits: ["Can help explain a cosmetic ingredient list."],
    cautions: ["Tolerance can vary by person."],
    suitableFor: ["Users who want beginner-friendly skincare education."],
    notSuitableFor: ["Users seeking diagnosis or prescription advice."],
    educationalNotes: ["For persistent symptoms, consult a professional."],
    providerMetadata: buildMetadata(),
  };
}

function buildSafetyOutput(): AIProviderSafetyClassifierResult {
  return {
    isAllowed: true,
    category: "skincare_education",
    reason: "Educational skincare content is allowed.",
    severity: "low",
    providerMetadata: buildMetadata(),
  };
}

function buildOutputs(
  overrides: Partial<RecordingAIProviderOutputs> = {},
): RecordingAIProviderOutputs {
  return {
    routine: buildRoutineOutput(),
    ingredient: buildIngredientOutput(),
    safety: buildSafetyOutput(),
    ...overrides,
  };
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
  ],
  locale: "vi-VN",
} as const satisfies AIProviderRoutineAnalysisInput;

const ingredientInput = {
  ingredientName: "Glycerin",
  skinType: "dry",
  concerns: ["dryness"],
  locale: "vi-VN",
} as const satisfies AIProviderIngredientExplanationInput;

const safetyInput = {
  text: "Explain moisturizer basics.",
  contextType: "general",
} as const satisfies AIProviderSafetyClassifierInput;

describe("ValidatedAIProvider", () => {
  afterEach(() => {
    restoreAIProviderEnv();
  });

  it("returns valid routine analysis output after validation", async () => {
    const expectedOutput = buildRoutineOutput();
    const innerProvider = new RecordingAIProvider(
      buildOutputs({ routine: expectedOutput }),
    );
    const provider = new ValidatedAIProvider(innerProvider);

    await expect(provider.analyzeRoutine(routineInput)).resolves.toEqual(
      expectedOutput,
    );
    expect(innerProvider.routineCalls).toBe(1);
    expect(innerProvider.lastRoutineInput).toBe(routineInput);
    expect(routineInput.steps).toEqual([
      expect.objectContaining({ productName: "Gentle cleanser" }),
    ]);
  });

  it("throws AIProviderResponseError for invalid routine analysis output", async () => {
    const innerProvider = new RecordingAIProvider(
      buildOutputs({
        routine: {
          ...buildRoutineOutput(),
          summary: "",
        },
      }),
    );
    const provider = new ValidatedAIProvider(innerProvider);

    await expect(provider.analyzeRoutine(routineInput)).rejects.toThrow(
      AIProviderResponseError,
    );
    expect(innerProvider.routineCalls).toBe(1);
  });

  it("returns valid ingredient explanation output after validation", async () => {
    const expectedOutput = buildIngredientOutput();
    const innerProvider = new RecordingAIProvider(
      buildOutputs({ ingredient: expectedOutput }),
    );
    const provider = new ValidatedAIProvider(innerProvider);

    await expect(provider.explainIngredient(ingredientInput)).resolves.toEqual(
      expectedOutput,
    );
    expect(innerProvider.ingredientCalls).toBe(1);
    expect(innerProvider.lastIngredientInput).toBe(ingredientInput);
  });

  it("throws AIProviderResponseError for invalid ingredient explanation output", async () => {
    const innerProvider = new RecordingAIProvider(
      buildOutputs({
        ingredient: {
          ...buildIngredientOutput(),
          shortExplanation: "",
        },
      }),
    );
    const provider = new ValidatedAIProvider(innerProvider);

    await expect(provider.explainIngredient(ingredientInput)).rejects.toThrow(
      AIProviderResponseError,
    );
    expect(innerProvider.ingredientCalls).toBe(1);
  });

  it("returns valid safety classifier output after validation", async () => {
    const expectedOutput = buildSafetyOutput();
    const innerProvider = new RecordingAIProvider(
      buildOutputs({ safety: expectedOutput }),
    );
    const provider = new ValidatedAIProvider(innerProvider);

    await expect(provider.classifySafety(safetyInput)).resolves.toEqual(
      expectedOutput,
    );
    expect(innerProvider.safetyCalls).toBe(1);
    expect(innerProvider.lastSafetyInput).toBe(safetyInput);
  });

  it("throws AIProviderResponseError for invalid safety classifier output", async () => {
    const innerProvider = new RecordingAIProvider(
      buildOutputs({
        safety: {
          ...buildSafetyOutput(),
          reason: "",
        },
      }),
    );
    const provider = new ValidatedAIProvider(innerProvider);

    await expect(provider.classifySafety(safetyInput)).rejects.toThrow(
      AIProviderResponseError,
    );
    expect(innerProvider.safetyCalls).toBe(1);
  });

  it("returns ValidatedAIProvider in mock mode", () => {
    process.env.AI_PROVIDER = "mock";

    expect(getAIProvider()).toBeInstanceOf(ValidatedAIProvider);
  });

  it("keeps MockAIProvider compatible through validation", async () => {
    const provider = new ValidatedAIProvider(new MockAIProvider());

    await expect(provider.analyzeRoutine(routineInput)).resolves.toMatchObject({
      providerMetadata: {
        provider: "mock",
        model: "mock-ai-provider",
        isMock: true,
      },
    });
  });
});
