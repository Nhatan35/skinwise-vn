import { describe, expect, it } from "vitest";

import type {
  AIRiskLevel,
  AIProviderMetadata,
  AIProviderRoutineAnalysisResult,
} from "@/infrastructure/ai/ai-provider";
import { mapAIProviderRoutineAnalysisToRoutineAnalysisResult } from "@/modules/ai-analysis/ai-provider-routine-analysis.mapper";
import { ROUTINE_ANALYSIS_EDUCATIONAL_DISCLAIMER } from "@/modules/ai-analysis/routine-analysis.constants";

function buildProviderMetadata(): AIProviderMetadata {
  return {
    provider: "mock",
    model: "mock-ai-provider",
    generatedAt: "2026-01-01T00:00:00.000Z",
    isMock: true,
  };
}

function buildProviderRoutineAnalysisResult(
  overrides: Partial<AIProviderRoutineAnalysisResult> = {},
): AIProviderRoutineAnalysisResult {
  return {
    summary: "Validated provider summary.",
    overallRiskLevel: "medium",
    warnings: ["Provider warning one.", "Provider warning two."],
    recommendations: [
      "Use fewer strong active ingredients at one time.",
      "Track skin response before adding another product.",
    ],
    educationalNotes: ["Internal provider note for educational context."],
    providerMetadata: buildProviderMetadata(),
    ...overrides,
  };
}

describe("mapAIProviderRoutineAnalysisToRoutineAnalysisResult", () => {
  it("maps provider overallRiskLevel to product-facing riskLevel", () => {
    const mappedResult = mapAIProviderRoutineAnalysisToRoutineAnalysisResult(
      buildProviderRoutineAnalysisResult({ overallRiskLevel: "high" }),
    );

    expect(mappedResult.riskLevel).toBe("high");
  });

  it("maps provider summary to product-facing summary", () => {
    const mappedResult = mapAIProviderRoutineAnalysisToRoutineAnalysisResult(
      buildProviderRoutineAnalysisResult({
        summary: "Provider generated a safe educational summary.",
      }),
    );

    expect(mappedResult.summary).toBe(
      "Provider generated a safe educational summary.",
    );
  });

  it("maps provider warnings to structured product-facing warnings", () => {
    const mappedResult = mapAIProviderRoutineAnalysisToRoutineAnalysisResult(
      buildProviderRoutineAnalysisResult({
        overallRiskLevel: "medium",
        warnings: ["Avoid combining too many strong actives."],
      }),
    );

    expect(mappedResult.warnings).toEqual([
      {
        code: "AI_PROVIDER_WARNING",
        severity: "medium",
        message: "Avoid combining too many strong actives.",
        reason:
          "This warning was generated from validated AI provider output and should be reviewed as educational guidance.",
      },
    ]);
  });

  it("handles empty provider warnings safely", () => {
    const mappedResult = mapAIProviderRoutineAnalysisToRoutineAnalysisResult(
      buildProviderRoutineAnalysisResult({ warnings: [] }),
    );

    expect(mappedResult.warnings).toEqual([]);
  });

  it("maps provider recommendations to product-facing suggestions", () => {
    const mappedResult = mapAIProviderRoutineAnalysisToRoutineAnalysisResult(
      buildProviderRoutineAnalysisResult({
        overallRiskLevel: "medium",
        recommendations: ["Simplify the routine before adding treatment steps."],
      }),
    );

    expect(mappedResult.suggestions).toEqual([
      {
        title: "AI recommendation",
        description: "Simplify the routine before adding treatment steps.",
        priority: "should_fix",
      },
    ]);
  });

  it("maps suggestion priority deterministically from provider risk", () => {
    const cases = [
      { riskLevel: "high", expectedPriority: "must_fix" },
      { riskLevel: "medium", expectedPriority: "should_fix" },
      { riskLevel: "low", expectedPriority: "optional" },
    ] as const satisfies readonly {
      riskLevel: AIRiskLevel;
      expectedPriority: "must_fix" | "should_fix" | "optional";
    }[];

    for (const { riskLevel, expectedPriority } of cases) {
      const mappedResult = mapAIProviderRoutineAnalysisToRoutineAnalysisResult(
        buildProviderRoutineAnalysisResult({ overallRiskLevel: riskLevel }),
      );

      expect(mappedResult.suggestions[0]?.priority).toBe(expectedPriority);
    }
  });

  it("handles empty provider recommendations safely", () => {
    const mappedResult = mapAIProviderRoutineAnalysisToRoutineAnalysisResult(
      buildProviderRoutineAnalysisResult({ recommendations: [] }),
    );

    expect(mappedResult.suggestions).toEqual([]);
  });

  it("does not expose provider educationalNotes", () => {
    const mappedResult = mapAIProviderRoutineAnalysisToRoutineAnalysisResult(
      buildProviderRoutineAnalysisResult(),
    );

    expect(mappedResult).not.toHaveProperty("educationalNotes");
  });

  it("does not expose providerMetadata", () => {
    const mappedResult = mapAIProviderRoutineAnalysisToRoutineAnalysisResult(
      buildProviderRoutineAnalysisResult(),
    );

    expect(mappedResult).not.toHaveProperty("providerMetadata");
  });

  it("includes the shared educational disclaimer", () => {
    const mappedResult = mapAIProviderRoutineAnalysisToRoutineAnalysisResult(
      buildProviderRoutineAnalysisResult(),
    );

    expect(mappedResult.disclaimer).toBe(
      ROUTINE_ANALYSIS_EDUCATIONAL_DISCLAIMER,
    );
  });

  it("sets shouldSeeProfessional only for high risk", () => {
    expect(
      mapAIProviderRoutineAnalysisToRoutineAnalysisResult(
        buildProviderRoutineAnalysisResult({ overallRiskLevel: "high" }),
      ).shouldSeeProfessional,
    ).toBe(true);
    expect(
      mapAIProviderRoutineAnalysisToRoutineAnalysisResult(
        buildProviderRoutineAnalysisResult({ overallRiskLevel: "medium" }),
      ).shouldSeeProfessional,
    ).toBe(false);
    expect(
      mapAIProviderRoutineAnalysisToRoutineAnalysisResult(
        buildProviderRoutineAnalysisResult({ overallRiskLevel: "low" }),
      ).shouldSeeProfessional,
    ).toBe(false);
  });

  it("does not mutate the provider input object", () => {
    const providerResult = buildProviderRoutineAnalysisResult();
    const originalSerializedResult = JSON.stringify(providerResult);

    mapAIProviderRoutineAnalysisToRoutineAnalysisResult(providerResult);

    expect(JSON.stringify(providerResult)).toBe(originalSerializedResult);
  });
});
