import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("@/infrastructure/ai", () => ({
  getAIProvider: vi.fn(),
}));

vi.mock("@/modules/routines/routine.repository", () => ({
  findRoutineByIdAndUserId: vi.fn(),
}));

vi.mock("@/modules/skin-profile/skin-profile.repository", () => ({
  findSkinProfileByUserId: vi.fn(),
}));

vi.mock("@/modules/ai-analysis/routine-analysis.repository", () => ({
  createRoutineAnalysisForUser: vi.fn(),
  listRoutineAnalysesByRoutineIdAndUserId: vi.fn(),
}));

import {
  analyzeRoutineForCurrentUser,
  listRoutineAnalysesForCurrentUser,
} from "@/modules/ai-analysis/analyze-routine.use-case";
import { getAIProvider } from "@/infrastructure/ai";
import type {
  AIProvider,
  AIProviderRoutineAnalysisResult,
} from "@/infrastructure/ai";
import {
  AIProviderConfigurationError,
  AIProviderResponseError,
} from "@/infrastructure/ai/ai-provider.errors";
import {
  createRoutineAnalysisForUser,
  listRoutineAnalysesByRoutineIdAndUserId,
} from "@/modules/ai-analysis/routine-analysis.repository";
import {
  ROUTINE_ANALYSIS_FALLBACK_MODEL_NAME,
  ROUTINE_ANALYSIS_FALLBACK_MODEL_PROVIDER,
  ROUTINE_ANALYSIS_FALLBACK_PROMPT_VERSION,
  ROUTINE_ANALYSIS_PROVIDER_PROMPT_VERSION,
  type CreateRoutineAnalysisInput,
  type RoutineAnalysis,
} from "@/modules/ai-analysis/routine-analysis.types";
import { findRoutineByIdAndUserId } from "@/modules/routines/routine.repository";
import type { Routine } from "@/modules/routines/routine.types";
import { findSkinProfileByUserId } from "@/modules/skin-profile/skin-profile.repository";
import type { SkinProfile } from "@/modules/skin-profile/skin-profile.types";

const mockedFindRoutineByIdAndUserId = vi.mocked(findRoutineByIdAndUserId);
const mockedFindSkinProfileByUserId = vi.mocked(findSkinProfileByUserId);
const mockedGetAIProvider = vi.mocked(getAIProvider);
const mockedCreateRoutineAnalysisForUser = vi.mocked(
  createRoutineAnalysisForUser,
);
const mockedListRoutineAnalysesByRoutineIdAndUserId = vi.mocked(
  listRoutineAnalysesByRoutineIdAndUserId,
);

const userId = "auth-user-id";
const otherUserId = "other-user-id";
const routineId = "665000000000000000000240";
const analysisId = "665000000000000000000241";
const skinProfileId = "665000000000000000000242";
const fixedDate = new Date("2026-05-15T00:00:00.000Z");
const providerGeneratedAt = "2026-05-15T00:00:00.000Z";
const mockedAnalyzeRoutine = vi.fn<AIProvider["analyzeRoutine"]>();
const mockedExplainIngredient = vi.fn<AIProvider["explainIngredient"]>();
const mockedClassifySafety = vi.fn<AIProvider["classifySafety"]>();
const mockedProvider: AIProvider = {
  analyzeRoutine: mockedAnalyzeRoutine,
  explainIngredient: mockedExplainIngredient,
  classifySafety: mockedClassifySafety,
};

function createRoutine(overrides: Partial<Routine> = {}): Routine {
  return {
    _id: new ObjectId(routineId),
    userId,
    name: "Routine buoi sang",
    timeOfDay: "morning",
    steps: [
      {
        stepId: "step-1",
        customProductName: "Sua rua mat",
        category: "cleanser",
        order: 1,
        frequency: "daily",
      },
    ],
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

function createHighRiskRoutine(): Routine {
  return createRoutine({
    name: "Routine active buoi toi",
    timeOfDay: "evening",
    steps: [
      {
        stepId: "step-1",
        customProductName: "Retinol serum",
        category: "treatment",
        order: 1,
        frequency: "daily",
        keyActivesSnapshot: ["retinol"],
      },
      {
        stepId: "step-2",
        customProductName: "AHA exfoliant",
        category: "treatment",
        order: 2,
        frequency: "weekly_1_2",
        keyActivesSnapshot: ["AHA"],
      },
    ],
  });
}

function createLowRiskRoutine(): Routine {
  return createRoutine({
    name: "Routine chong nang co ban",
    timeOfDay: "morning",
    steps: [
      {
        stepId: "step-1",
        customProductName: "Kem chong nang",
        category: "sunscreen",
        order: 1,
        frequency: "daily",
      },
    ],
  });
}

function createSkinProfile(
  overrides: Partial<SkinProfile> = {},
): SkinProfile {
  return {
    _id: new ObjectId(skinProfileId),
    userId,
    skinType: "sensitive",
    concerns: ["redness"],
    sensitivityLevel: "high",
    budgetRange: "300k_700k",
    experienceLevel: "beginner",
    avoidIngredients: [],
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

function createProviderRoutineAnalysisResult(
  overrides: Partial<AIProviderRoutineAnalysisResult> = {},
): AIProviderRoutineAnalysisResult {
  return {
    summary: "Provider educational summary.",
    overallRiskLevel: "medium",
    warnings: ["Provider warning."],
    recommendations: ["Provider recommendation."],
    educationalNotes: ["Provider internal educational note."],
    providerMetadata: {
      provider: "mock",
      model: "mock-ai-provider",
      generatedAt: providerGeneratedAt,
      isMock: true,
    },
    ...overrides,
  };
}

function createStoredAnalysis(
  input: CreateRoutineAnalysisInput,
): RoutineAnalysis {
  return {
    _id: new ObjectId(analysisId),
    userId,
    ...input,
    createdAt: fixedDate,
  };
}

function getPersistedInput(): CreateRoutineAnalysisInput {
  const call = mockedCreateRoutineAnalysisForUser.mock.calls[0];

  if (!call) {
    throw new Error("Expected routine analysis to be persisted.");
  }

  return call[1];
}

describe("AnalyzeRoutine use case", () => {
  beforeEach(() => {
    mockedGetAIProvider.mockReset();
    mockedAnalyzeRoutine.mockReset();
    mockedExplainIngredient.mockReset();
    mockedClassifySafety.mockReset();
    mockedFindRoutineByIdAndUserId.mockReset();
    mockedFindSkinProfileByUserId.mockReset();
    mockedCreateRoutineAnalysisForUser.mockReset();
    mockedListRoutineAnalysesByRoutineIdAndUserId.mockReset();
    mockedGetAIProvider.mockReturnValue(mockedProvider);
    mockedAnalyzeRoutine.mockResolvedValue(createProviderRoutineAnalysisResult());
    mockedCreateRoutineAnalysisForUser.mockImplementation(
      async (currentUserId, input) => ({
        ...createStoredAnalysis(input),
        userId: currentUserId,
      }),
    );
  });

  it("loads routine by routineId and userId before analysis", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);

    await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    expect(mockedFindRoutineByIdAndUserId).toHaveBeenCalledWith(
      routineId,
      userId,
    );
  });

  it("returns null for missing routines", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(null);

    await expect(
      analyzeRoutineForCurrentUser({
        routineId,
        currentUserId: userId,
      }),
    ).resolves.toBeNull();

    expect(mockedFindSkinProfileByUserId).not.toHaveBeenCalled();
    expect(mockedGetAIProvider).not.toHaveBeenCalled();
    expect(mockedAnalyzeRoutine).not.toHaveBeenCalled();
    expect(mockedCreateRoutineAnalysisForUser).not.toHaveBeenCalled();
  });

  it("returns null for not-owned routines through the same not-found path", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(null);

    await expect(
      analyzeRoutineForCurrentUser({
        routineId,
        currentUserId: otherUserId,
      }),
    ).resolves.toBeNull();

    expect(mockedFindRoutineByIdAndUserId).toHaveBeenCalledWith(
      routineId,
      otherUserId,
    );
    expect(mockedGetAIProvider).not.toHaveBeenCalled();
    expect(mockedCreateRoutineAnalysisForUser).not.toHaveBeenCalled();
  });

  it("runs routine analysis without a Skin Profile", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);

    const dto = await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    expect(dto?.riskLevel).toBe("medium");
    expect(dto?.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "MISSING_SUNSCREEN_AM",
        }),
      ]),
    );
    expect(mockedFindSkinProfileByUserId).toHaveBeenCalledWith(userId);
  });

  it("passes Skin Profile context to the deterministic safety engine", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(
      createRoutine({
        steps: Array.from({ length: 8 }, (_, index) => ({
          stepId: `step-${index + 1}`,
          customProductName: `Step ${index + 1}`,
          category: index === 7 ? "sunscreen" : "serum",
          order: index + 1,
          frequency: "daily",
        })),
      }),
    );
    mockedFindSkinProfileByUserId.mockResolvedValue(createSkinProfile());

    await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    const persistedInput = mockedCreateRoutineAnalysisForUser.mock.calls[0]?.[1];
    expect(
      persistedInput?.ruleResults.find(
        (rule) => rule.code === "TOO_MANY_STEPS_BEGINNER",
      ),
    ).toMatchObject({
      triggered: true,
    });
  });

  it("uses the validated provider path and persists mapped provider output without leaking provider metadata", async () => {
    const routine = createRoutine({
      steps: [
        {
          stepId: "step-1",
          productNameSnapshot: "Sua rua mat diu nhe",
          category: "cleanser",
          order: 1,
          frequency: "daily",
          keyActivesSnapshot: ["glycerin"],
          ingredientTextSnapshot: "glycerin, panthenol",
          instructions: "Massage gently.",
        },
      ],
    });
    mockedFindRoutineByIdAndUserId.mockResolvedValue(routine);
    mockedFindSkinProfileByUserId.mockResolvedValue(createSkinProfile());

    const dto = await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });
    const persistedInput = getPersistedInput();
    const persistedAiResultJson = JSON.stringify(persistedInput.aiResult);
    const dtoJson = JSON.stringify(dto);

    expect(mockedGetAIProvider).toHaveBeenCalledTimes(1);
    expect(mockedAnalyzeRoutine).toHaveBeenCalledWith({
      routineId,
      routineName: routine.name,
      timeOfDay: "morning",
      locale: "vi-VN",
      skinProfile: {
        skinType: "sensitive",
        sensitivityLevel: "high",
        concerns: ["redness"],
        experienceLevel: "beginner",
      },
      steps: [
        {
          stepOrder: 1,
          productName: "Sua rua mat diu nhe",
          productCategory: "cleanser",
          ingredients: ["glycerin", "glycerin, panthenol"],
          instructions: "Massage gently.",
        },
      ],
    });
    expect(persistedInput).toMatchObject({
      aiStatus: "provider_used",
      modelProvider: "mock",
      modelName: "mock-ai-provider",
      promptVersion: ROUTINE_ANALYSIS_PROVIDER_PROMPT_VERSION,
    });
    expect(persistedInput.aiResult).toMatchObject({
      riskLevel: "medium",
      summary: "Provider educational summary.",
      warnings: expect.arrayContaining([
        expect.objectContaining({
          code: "MISSING_SUNSCREEN_AM",
        }),
        expect.objectContaining({
          code: "AI_PROVIDER_WARNING",
          message: "Provider warning.",
        }),
      ]),
      suggestions: expect.arrayContaining([
        expect.objectContaining({
          title: "AI recommendation",
          description: "Provider recommendation.",
        }),
      ]),
    });
    expect(persistedAiResultJson).not.toContain("providerMetadata");
    expect(persistedAiResultJson).not.toContain("educationalNotes");
    expect(dtoJson).not.toContain("providerMetadata");
    expect(dtoJson).not.toContain("educationalNotes");
  });

  it("stores all rule results including non-triggered rules", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);

    await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    const persistedInput = mockedCreateRoutineAnalysisForUser.mock.calls[0]?.[1];
    expect(persistedInput?.ruleResults).toHaveLength(7);
    expect(
      persistedInput?.ruleResults.some((rule) => rule.triggered === false),
    ).toBe(true);
  });

  it("returns public guidance and does not expose internal ruleResults", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);

    const dto = await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });
    const serializedDto = JSON.stringify(dto);

    expect(dto?.warnings.map((warning) => warning.code)).toEqual([
      "MISSING_SUNSCREEN_AM",
      "AI_PROVIDER_WARNING",
    ]);
    expect(serializedDto).not.toContain("ruleResults");
  });

  it("persists provider-backed model metadata on provider success", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);

    await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    const persistedInput = mockedCreateRoutineAnalysisForUser.mock.calls[0]?.[1];
    expect(persistedInput).toMatchObject({
      riskLevel: "medium",
      aiStatus: "provider_used",
      modelProvider: "mock",
      modelName: "mock-ai-provider",
      promptVersion: ROUTINE_ANALYSIS_PROVIDER_PROMPT_VERSION,
    });
  });

  it("falls back when provider construction fails and returns a public DTO", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);
    mockedGetAIProvider.mockImplementation(() => {
      throw new AIProviderConfigurationError(
        "OpenAI provider is not implemented yet.",
      );
    });

    const dto = await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });
    const persistedInput = getPersistedInput();

    expect(mockedAnalyzeRoutine).not.toHaveBeenCalled();
    expect(persistedInput).toMatchObject({
      riskLevel: "medium",
      aiStatus: "fallback_used",
      modelProvider: ROUTINE_ANALYSIS_FALLBACK_MODEL_PROVIDER,
      modelName: ROUTINE_ANALYSIS_FALLBACK_MODEL_NAME,
      promptVersion: ROUTINE_ANALYSIS_FALLBACK_PROMPT_VERSION,
    });
    expect(dto).toMatchObject({
      riskLevel: "medium",
      warnings: [
        expect.objectContaining({
          code: "MISSING_SUNSCREEN_AM",
        }),
      ],
    });
  });

  it("falls back when provider validation fails", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);
    mockedAnalyzeRoutine.mockRejectedValue(
      new AIProviderResponseError("Invalid routine analysis output."),
    );

    await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    expect(getPersistedInput()).toMatchObject({
      aiStatus: "fallback_used",
      modelProvider: ROUTINE_ANALYSIS_FALLBACK_MODEL_PROVIDER,
      modelName: ROUTINE_ANALYSIS_FALLBACK_MODEL_NAME,
      promptVersion: ROUTINE_ANALYSIS_FALLBACK_PROMPT_VERSION,
    });
  });

  it("falls back when provider analysis throws an unexpected error without exposing the error", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);
    mockedAnalyzeRoutine.mockRejectedValue(new Error("Provider exploded."));

    const dto = await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });
    const dtoJson = JSON.stringify(dto);

    expect(getPersistedInput()).toMatchObject({
      aiStatus: "fallback_used",
    });
    expect(dtoJson).not.toContain("Provider exploded");
    expect(dtoJson).not.toContain("stack");
  });

  it("keeps high deterministic safety risk when provider reports low risk", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createHighRiskRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);
    mockedAnalyzeRoutine.mockResolvedValue(
      createProviderRoutineAnalysisResult({
        overallRiskLevel: "low",
      }),
    );

    await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    const persistedInput = getPersistedInput();
    expect(persistedInput).toMatchObject({
      riskLevel: "high",
      aiStatus: "provider_used",
    });
    expect(persistedInput.aiResult.riskLevel).toBe("high");
  });

  it("keeps medium deterministic safety risk when provider reports low risk", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);
    mockedAnalyzeRoutine.mockResolvedValue(
      createProviderRoutineAnalysisResult({
        overallRiskLevel: "low",
      }),
    );

    await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    const persistedInput = getPersistedInput();
    expect(persistedInput).toMatchObject({
      riskLevel: "medium",
      aiStatus: "provider_used",
    });
    expect(persistedInput.aiResult.riskLevel).toBe("medium");
  });

  it("raises final risk when provider reports higher risk than deterministic safety", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createLowRiskRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);
    mockedAnalyzeRoutine.mockResolvedValue(
      createProviderRoutineAnalysisResult({
        overallRiskLevel: "high",
      }),
    );

    await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    const persistedInput = getPersistedInput();
    expect(persistedInput).toMatchObject({
      riskLevel: "high",
      aiStatus: "provider_used",
    });
    expect(persistedInput.aiResult.riskLevel).toBe("high");
    expect(persistedInput.aiResult.shouldSeeProfessional).toBe(true);
  });

  it("preserves deterministic safety warnings and suggestions on provider success", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);

    await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    const persistedInput = getPersistedInput();
    expect(persistedInput.aiResult.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "MISSING_SUNSCREEN_AM",
        }),
        expect.objectContaining({
          code: "AI_PROVIDER_WARNING",
          message: "Provider warning.",
        }),
      ]),
    );
    expect(persistedInput.aiResult.suggestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Them buoc chong nang",
        }),
        expect.objectContaining({
          title: "AI recommendation",
          description: "Provider recommendation.",
        }),
      ]),
    );
  });

  it("does not swallow repository persistence errors as provider fallback", async () => {
    const persistenceError = new Error("Routine analysis insert failed.");
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);
    mockedCreateRoutineAnalysisForUser.mockRejectedValue(persistenceError);

    await expect(
      analyzeRoutineForCurrentUser({
        routineId,
        currentUserId: userId,
      }),
    ).rejects.toThrow(persistenceError);

    expect(mockedAnalyzeRoutine).toHaveBeenCalledTimes(1);
    expect(mockedCreateRoutineAnalysisForUser).toHaveBeenCalledTimes(1);
  });

  it("stores a stable routine snapshot", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);

    await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    const persistedInput = mockedCreateRoutineAnalysisForUser.mock.calls[0]?.[1];
    expect(persistedInput?.routineSnapshot).toMatchObject({
      name: "Routine buoi sang",
      timeOfDay: "morning",
      steps: [
        expect.objectContaining({
          stepId: "step-1",
          customProductName: "Sua rua mat",
        }),
      ],
    });
  });

  it("returns analysis history scoped by userId and routineId", async () => {
    const routine = createRoutine();
    mockedFindRoutineByIdAndUserId.mockResolvedValue(routine);
    mockedListRoutineAnalysesByRoutineIdAndUserId.mockResolvedValue([
      createStoredAnalysis({
        routineId: routine._id,
        routineSnapshot: {
          name: routine.name,
          timeOfDay: routine.timeOfDay,
          steps: routine.steps,
        },
        riskLevel: "low",
        ruleResults: [],
        aiResult: {
          riskLevel: "low",
          summary: "No warnings.",
          warnings: [],
          suggestions: [],
          shouldSeeProfessional: false,
          disclaimer: "Educational only.",
        },
        aiStatus: "fallback_used",
        modelProvider: ROUTINE_ANALYSIS_FALLBACK_MODEL_PROVIDER,
        modelName: ROUTINE_ANALYSIS_FALLBACK_MODEL_NAME,
        promptVersion: ROUTINE_ANALYSIS_FALLBACK_PROMPT_VERSION,
      }),
    ]);

    const history = await listRoutineAnalysesForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    expect(mockedFindRoutineByIdAndUserId).toHaveBeenCalledWith(
      routineId,
      userId,
    );
    expect(mockedListRoutineAnalysesByRoutineIdAndUserId).toHaveBeenCalledWith(
      routineId,
      userId,
    );
    expect(history?.analyses).toHaveLength(1);
  });

  it("returns empty analysis history when no analyses exist", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedListRoutineAnalysesByRoutineIdAndUserId.mockResolvedValue([]);

    await expect(
      listRoutineAnalysesForCurrentUser({
        routineId,
        currentUserId: userId,
      }),
    ).resolves.toEqual({
      analyses: [],
    });
  });
});
