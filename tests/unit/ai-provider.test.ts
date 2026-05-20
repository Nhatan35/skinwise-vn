import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  AIProviderConfigurationError,
  getAIProvider,
  MockAIProvider,
  type AIProviderMetadata,
  type AIProviderRoutineAnalysisInput,
} from "@/infrastructure/ai";

const originalAIProvider = process.env.AI_PROVIDER;
const expectedMockMetadata = {
  provider: "mock",
  model: "mock-ai-provider",
  isMock: true,
  generatedAt: "2026-01-01T00:00:00.000Z",
} as const satisfies AIProviderMetadata;

function restoreAIProviderEnv() {
  if (originalAIProvider === undefined) {
    delete process.env.AI_PROVIDER;
    return;
  }

  process.env.AI_PROVIDER = originalAIProvider;
}

function expectMockProviderMetadata(metadata: AIProviderMetadata) {
  expect(metadata).toEqual(expectedMockMetadata);
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
      productName: "Retinol serum",
      productCategory: "serum",
      ingredients: ["retinol"],
      instructions: "Use a small amount.",
    },
  ],
  skinProfile: {
    skinType: "combination",
    sensitivityLevel: "medium",
    concerns: ["texture"],
    experienceLevel: "beginner",
  },
  locale: "vi-VN",
} as const satisfies AIProviderRoutineAnalysisInput;

describe("getAIProvider", () => {
  afterEach(() => {
    restoreAIProviderEnv();
  });

  it("returns MockAIProvider when AI_PROVIDER is undefined", () => {
    delete process.env.AI_PROVIDER;

    expect(getAIProvider()).toBeInstanceOf(MockAIProvider);
  });

  it("returns MockAIProvider when AI_PROVIDER is empty", () => {
    process.env.AI_PROVIDER = "";

    expect(getAIProvider()).toBeInstanceOf(MockAIProvider);
  });

  it("returns MockAIProvider when AI_PROVIDER is mock", () => {
    process.env.AI_PROVIDER = "mock";

    expect(getAIProvider()).toBeInstanceOf(MockAIProvider);
  });

  it("returns MockAIProvider when AI_PROVIDER has whitespace and casing", () => {
    process.env.AI_PROVIDER = " MOCK ";

    expect(getAIProvider()).toBeInstanceOf(MockAIProvider);
  });

  it("throws AIProviderConfigurationError for OpenAI", () => {
    process.env.AI_PROVIDER = "openai";

    expect(() => getAIProvider()).toThrow(AIProviderConfigurationError);
    expect(() => getAIProvider()).toThrow(
      "OpenAI provider is not implemented yet.",
    );
  });

  it("throws AIProviderConfigurationError for Gemini", () => {
    process.env.AI_PROVIDER = "gemini";

    expect(() => getAIProvider()).toThrow(AIProviderConfigurationError);
    expect(() => getAIProvider()).toThrow(
      "Gemini provider is not implemented yet.",
    );
  });

  it("throws AIProviderConfigurationError for unsupported providers", () => {
    process.env.AI_PROVIDER = "anthropic";

    expect(() => getAIProvider()).toThrow(AIProviderConfigurationError);
    expect(() => getAIProvider()).toThrow(
      "Unsupported AI provider: anthropic.",
    );
  });
});

describe("MockAIProvider", () => {
  const provider = new MockAIProvider();

  it("analyzeRoutine returns a stable deterministic result", async () => {
    await expect(provider.analyzeRoutine(routineInput)).resolves.toEqual({
      summary: 'Mock educational analysis reviewed "Morning routine" with 2 step(s).',
      overallRiskLevel: "medium",
      warnings: [
        "Morning routines usually need sun protection education before adding stronger active ingredients.",
      ],
      recommendations: [
        "Keep the routine simple and introduce new cosmetic products gradually.",
        "Track how the skin feels over time instead of changing many products at once.",
        "Seek professional help for severe, painful, spreading, infected-looking, or persistent symptoms.",
      ],
      educationalNotes: [
        "This mock result is deterministic and intended for development only.",
        "Information is educational skincare guidance, not medical diagnosis or treatment.",
      ],
      providerMetadata: expectedMockMetadata,
    });
  });

  it("explainIngredient returns a stable deterministic result", async () => {
    await expect(
      provider.explainIngredient({
        ingredientName: "Niacinamide",
        skinType: "oily",
        concerns: ["oiliness"],
        locale: "vi-VN",
      }),
    ).resolves.toEqual({
      ingredientName: "Niacinamide",
      shortExplanation:
        "Niacinamide is explained here in a simple educational skincare context by the mock provider.",
      benefits: [
        "Can be reviewed as part of a cosmetic ingredient list.",
        "May help users understand why an ingredient appears in skincare products.",
      ],
      cautions: [
        "Patch response and tolerance can vary by person.",
        "Avoid using ingredient information as a diagnosis or treatment plan.",
      ],
      suitableFor: ["Users with oily skin who want educational context."],
      notSuitableFor: [
        "Users seeking diagnosis, prescription advice, or treatment for a disease.",
      ],
      educationalNotes: [
        "This mock explanation does not call an external AI service.",
        "For severe or persistent symptoms, consult a qualified professional.",
      ],
      providerMetadata: expectedMockMetadata,
    });
  });

  it("classifySafety allows normal skincare educational text", async () => {
    await expect(
      provider.classifySafety({
        text: "Explain what a moisturizer does in a simple skincare routine.",
        contextType: "general",
      }),
    ).resolves.toEqual({
      isAllowed: true,
      category: "skincare_education",
      severity: "low",
      reason:
        "Educational skincare content is allowed when it does not request diagnosis, treatment, prescriptions, or replacement of professional care.",
      providerMetadata: expectedMockMetadata,
    });
  });

  it("classifySafety blocks medical-diagnosis-style text", async () => {
    await expect(
      provider.classifySafety({
        text: "Can you replace dermatologist advice and diagnose my open wound?",
        contextType: "general",
      }),
    ).resolves.toEqual({
      isAllowed: false,
      category: "medical_diagnosis_or_treatment",
      severity: "high",
      reason:
        "SkinWise VN only supports educational skincare information and cannot help with diagnosis, disease treatment, prescriptions, or replacing professional care.",
      providerMetadata: expectedMockMetadata,
    });
  });

  it("returns the fixed mock provider metadata", async () => {
    const routineResult = await provider.analyzeRoutine(routineInput);
    const ingredientResult = await provider.explainIngredient({
      ingredientName: "Glycerin",
    });
    const safetyResult = await provider.classifySafety({
      text: "Explain cleanser basics.",
      contextType: "general",
    });

    expectMockProviderMetadata(routineResult.providerMetadata);
    expectMockProviderMetadata(ingredientResult.providerMetadata);
    expectMockProviderMetadata(safetyResult.providerMetadata);
  });
});
