import { describe, expect, it, beforeEach, vi } from "vitest";
import { ZodError } from "zod";

vi.mock("server-only", () => ({}));

vi.mock("@/infrastructure/ai", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/infrastructure/ai")>();

  return {
    ...actual,
    getAIProvider: vi.fn(),
  };
});

import {
  getAIProvider,
  ValidatedAIProvider,
  type AIProvider,
  type AIProviderIngredientExplanationInput,
  type AIProviderIngredientExplanationResult,
  type AIProviderMetadata,
  type AIProviderRoutineAnalysisResult,
  type AIProviderSafetyClassifierResult,
} from "@/infrastructure/ai";
import { toIngredientExplanationDtoFromProvider } from "@/modules/ingredients/ingredient-explanation.mapper";
import { parseIngredientExplanationRequestText } from "@/modules/ingredients/ingredient-explanation.schema";
import { explainIngredient } from "@/modules/ingredients/explain-ingredient.use-case";

const mockedGetAIProvider = vi.mocked(getAIProvider);

function buildMetadata(): AIProviderMetadata {
  return {
    provider: "mock",
    model: "mock-ai-provider",
    generatedAt: "2026-01-01T00:00:00.000Z",
    isMock: true,
  };
}

function buildProviderOutput(
  overrides: Partial<AIProviderIngredientExplanationResult> = {},
): AIProviderIngredientExplanationResult {
  return {
    ingredientName: "niacinamide",
    shortExplanation: "Niacinamide is explained in simple skincare terms.",
    benefits: ["Supports cosmetic ingredient education."],
    cautions: ["Tolerance can vary."],
    suitableFor: ["oily skin"],
    notSuitableFor: ["known sensitivity"],
    educationalNotes: ["Hidden educational provider note."],
    providerMetadata: buildMetadata(),
    ...overrides,
  };
}

function buildMapperThrowingProviderOutput(): AIProviderIngredientExplanationResult {
  const output = buildProviderOutput();

  Object.defineProperty(output, "benefits", {
    get() {
      throw new Error("secret mapper error stack providerMetadata");
    },
  });

  return output;
}

class StaticAIProvider implements AIProvider {
  lastIngredientInput: AIProviderIngredientExplanationInput | null = null;

  constructor(
    private readonly ingredientResult:
      | AIProviderIngredientExplanationResult
      | Error,
  ) {}

  async analyzeRoutine(): Promise<AIProviderRoutineAnalysisResult> {
    throw new Error("Routine analysis is not used in this test.");
  }

  async explainIngredient(
    input: AIProviderIngredientExplanationInput,
  ): Promise<AIProviderIngredientExplanationResult> {
    this.lastIngredientInput = input;

    if (this.ingredientResult instanceof Error) {
      throw this.ingredientResult;
    }

    return this.ingredientResult;
  }

  async classifySafety(): Promise<AIProviderSafetyClassifierResult> {
    throw new Error("Safety classification is not used in this test.");
  }
}

class MalformedIngredientProvider extends StaticAIProvider {
  constructor() {
    super(buildProviderOutput());
  }

  override async explainIngredient(
    input: AIProviderIngredientExplanationInput,
  ): Promise<AIProviderIngredientExplanationResult> {
    this.lastIngredientInput = input;

    return {
      ...buildProviderOutput(),
      shortExplanation: "",
    } as unknown as AIProviderIngredientExplanationResult;
  }
}

describe("Ingredient explanation schema", () => {
  it("parses and trims valid request input", () => {
    expect(
      parseIngredientExplanationRequestText(
        JSON.stringify({
          ingredientName: " niacinamide ",
          skinType: "oily",
          concerns: ["acne", "redness"],
        }),
      ),
    ).toEqual({
      ingredientName: "niacinamide",
      skinType: "oily",
      concerns: ["acne", "redness"],
    });
  });

  it("rejects invalid request input instead of using fallback", () => {
    for (const body of [
      {},
      { ingredientName: "" },
      { ingredientName: "   " },
      { ingredientName: 123 },
      { ingredientName: "niacinamide", skinType: "very_oily" },
      { ingredientName: "niacinamide", concerns: ["diagnosis"] },
      {
        ingredientName: "niacinamide",
        concerns: [
          "acne",
          "oiliness",
          "dryness",
          "redness",
          "dark_spots",
          "texture",
          "barrier_support",
          "unknown",
          "acne",
        ],
      },
      { ingredientName: "niacinamide", providerMetadata: "client-owned" },
    ]) {
      expect(() =>
        parseIngredientExplanationRequestText(JSON.stringify(body)),
      ).toThrow(ZodError);
    }
  });

  it("rejects malformed JSON", () => {
    expect(() => parseIngredientExplanationRequestText("{")).toThrow(ZodError);
  });
});

describe("Ingredient explanation mapper", () => {
  it("maps provider output to the public DTO without provider-only fields", () => {
    const dto = toIngredientExplanationDtoFromProvider(buildProviderOutput());
    const serializedDto = JSON.stringify(dto);

    expect(dto).toEqual({
      ingredientName: "niacinamide",
      simpleExplanation: "Niacinamide is explained in simple skincare terms.",
      commonUses: ["Supports cosmetic ingredient education."],
      suitableFor: ["oily skin"],
      cautions: ["Tolerance can vary."],
      avoidWith: ["known sensitivity"],
      beginnerAdvice: "Introduce gradually and follow product instructions.",
      disclaimer:
        "Thông tin này chỉ mang tính giáo dục về mỹ phẩm và không thay thế tư vấn y tế.",
      source: "ai",
    });
    expect(serializedDto).not.toContain("providerMetadata");
    expect(serializedDto).not.toContain("educationalNotes");
    expect(serializedDto).not.toContain("providerFailureReason");
  });
});

describe("explainIngredient use case", () => {
  beforeEach(() => {
    mockedGetAIProvider.mockReset();
  });

  it("returns an AI explanation when provider output is valid", async () => {
    const provider = new StaticAIProvider(buildProviderOutput());
    mockedGetAIProvider.mockReturnValue(provider);

    const explanation = await explainIngredient({
      ingredientName: " niacinamide ",
      skinType: "oily",
      concerns: ["acne"],
    });

    expect(explanation.source).toBe("ai");
    expect(explanation.ingredientName).toBe("niacinamide");
    expect(provider.lastIngredientInput).toEqual({
      ingredientName: "niacinamide",
      skinType: "oily",
      concerns: ["acne"],
      locale: "vi-VN",
    });
  });

  it("returns deterministic fallback when provider throws", async () => {
    mockedGetAIProvider.mockReturnValue(
      new StaticAIProvider(
        new Error("secret provider error stack OpenAI providerMetadata"),
      ),
    );

    const explanation = await explainIngredient({
      ingredientName: "niacinamide",
    });
    const serializedExplanation = JSON.stringify(explanation);

    expect(explanation).toEqual({
      ingredientName: "niacinamide",
      simpleExplanation:
        "This ingredient may have skincare-related uses, but more context is needed.",
      commonUses: [],
      suitableFor: [],
      cautions: [
        "Patch test before regular use.",
        "Stop using if irritation occurs.",
      ],
      avoidWith: ["You have known sensitivity to this ingredient."],
      beginnerAdvice: "Introduce gradually and follow product instructions.",
      disclaimer:
        "Thông tin này chỉ mang tính giáo dục về mỹ phẩm và không thay thế tư vấn y tế.",
      source: "fallback",
    });
    expect(serializedExplanation).not.toContain("secret provider error");
    expect(serializedExplanation).not.toContain("stack");
    expect(serializedExplanation).not.toContain("OpenAI");
    expect(serializedExplanation).not.toContain("providerMetadata");
  });

  it("returns deterministic fallback when validated provider rejects malformed output", async () => {
    mockedGetAIProvider.mockReturnValue(
      new ValidatedAIProvider(new MalformedIngredientProvider()),
    );

    const explanation = await explainIngredient({
      ingredientName: "niacinamide",
    });
    const serializedExplanation = JSON.stringify(explanation);

    expect(explanation.source).toBe("fallback");
    expect(explanation.ingredientName).toBe("niacinamide");
    expect(serializedExplanation).not.toContain(
      "Invalid ingredient explanation AI output",
    );
    expect(serializedExplanation).not.toContain("shortExplanation");
  });

  it("returns deterministic fallback when provider construction fails", async () => {
    mockedGetAIProvider.mockImplementation(() => {
      throw new Error("Gemini configuration secret");
    });

    const explanation = await explainIngredient({
      ingredientName: "glycerin",
    });

    expect(explanation.source).toBe("fallback");
    expect(JSON.stringify(explanation)).not.toContain("Gemini");
  });

  it("returns deterministic fallback when provider-to-public mapping fails", async () => {
    mockedGetAIProvider.mockReturnValue(
      new StaticAIProvider(buildMapperThrowingProviderOutput()),
    );

    const explanation = await explainIngredient({
      ingredientName: "niacinamide",
    });
    const serializedExplanation = JSON.stringify(explanation);

    expect(explanation.source).toBe("fallback");
    expect(explanation.ingredientName).toBe("niacinamide");
    expect(serializedExplanation).not.toContain("secret mapper error");
    expect(serializedExplanation).not.toContain("stack");
    expect(serializedExplanation).not.toContain("providerMetadata");
  });
});
