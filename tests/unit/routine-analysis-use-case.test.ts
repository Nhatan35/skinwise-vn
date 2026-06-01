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

vi.mock(
  "@/modules/ai-analysis/ai-provider-routine-analysis.mapper",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("@/modules/ai-analysis/ai-provider-routine-analysis.mapper")
      >();

    return {
      ...actual,
      mapAIProviderRoutineAnalysisToRoutineAnalysisResult: vi.fn(
        actual.mapAIProviderRoutineAnalysisToRoutineAnalysisResult,
      ),
    };
  },
);

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
import { mapAIProviderRoutineAnalysisToRoutineAnalysisResult } from "@/modules/ai-analysis/ai-provider-routine-analysis.mapper";
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
const mockedMapAIProviderRoutineAnalysisToRoutineAnalysisResult = vi.mocked(
  mapAIProviderRoutineAnalysisToRoutineAnalysisResult,
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

function mockProviderUnavailable() {
  mockedGetAIProvider.mockImplementation(() => {
    throw new AIProviderConfigurationError(
      "OpenAI provider is not implemented yet.",
    );
  });
}

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
    mockedMapAIProviderRoutineAnalysisToRoutineAnalysisResult.mockClear();
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
    expect(persistedInput).not.toHaveProperty("providerFailureReason");
    expect(persistedInput.aiResult).toMatchObject({
      riskLevel: "medium",
      summary: "Provider educational summary.",
      positiveFindings: expect.arrayContaining(["Có bước làm sạch."]),
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
          title: "Gợi ý tham khảo",
          description: "Provider recommendation.",
        }),
      ]),
    });
    expect(persistedAiResultJson).not.toContain("providerMetadata");
    expect(persistedAiResultJson).not.toContain("educationalNotes");
    expect(dto?.positiveFindings).toEqual(
      expect.arrayContaining(["Có bước làm sạch."]),
    );
    expect(dtoJson).not.toContain("providerMetadata");
    expect(dtoJson).not.toContain("educationalNotes");
    expect(dtoJson).not.toContain("providerFailureReason");
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
    expect(persistedInput).not.toHaveProperty("providerFailureReason");
  });

  it("falls back when provider construction fails and returns a public DTO", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);
    mockProviderUnavailable();

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
      providerFailureReason: "provider_configuration_error",
    });
    expect(dto).toMatchObject({
      riskLevel: "medium",
      positiveFindings: ["Có bước làm sạch."],
      warnings: [
        expect.objectContaining({
          code: "MISSING_SUNSCREEN_AM",
        }),
      ],
      suggestions: expect.arrayContaining([
        expect.objectContaining({
          priority: "must_fix",
          title: "Cân nhắc thêm chống nắng cho routine buổi sáng",
        }),
        expect.objectContaining({
          priority: "optional",
          title: "Theo dõi phản ứng da trong Journal",
        }),
      ]),
    });
    expect(JSON.stringify(dto)).toContain("dữ liệu hiện có");
    expect(JSON.stringify(dto)).not.toContain("đảm bảo an toàn");
    expect(JSON.stringify(dto)).not.toContain("hiệu quả 100%");
    expect(dto).not.toHaveProperty("providerFailureReason");
    expect(JSON.stringify(dto)).not.toContain(
      "OpenAI provider is not implemented yet.",
    );
  });

  it("returns actionable fallback copy for routines with treatment", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(
      createRoutine({
        name: "Routine treatment buoi toi",
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
        ],
      }),
    );
    mockedFindSkinProfileByUserId.mockResolvedValue(null);
    mockProviderUnavailable();

    const dto = await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    expect(dto?.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "MISSING_MOISTURIZER",
          reason: expect.stringContaining("dưỡng ẩm"),
        }),
      ]),
    );
    expect(dto?.suggestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          description: expect.stringContaining("Dưỡng ẩm"),
          priority: "should_fix",
          title: "Cân nhắc thêm bước dưỡng ẩm",
        }),
        expect.objectContaining({
          description: expect.stringContaining("1–2 lần/tuần"),
          priority: "should_fix",
          title: "Bắt đầu treatment với tần suất thấp",
        }),
      ]),
    );
    expect(JSON.stringify(dto?.suggestions)).not.toContain(
      '"priority":"medium"',
    );
  });

  it("returns actionable fallback copy for routines with multiple actives", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(
      createRoutine({
        name: "Routine nhieu active",
        timeOfDay: "evening",
        steps: [
          {
            stepId: "step-1",
            customProductName: "Retinol serum",
            category: "serum",
            order: 1,
            frequency: "daily",
            keyActivesSnapshot: ["retinol"],
          },
          {
            stepId: "step-2",
            customProductName: "BHA exfoliant",
            category: "treatment",
            order: 2,
            frequency: "weekly_1_2",
            keyActivesSnapshot: ["BHA"],
          },
          {
            stepId: "step-3",
            customProductName: "BPO treatment",
            category: "treatment",
            order: 3,
            frequency: "weekly_1_2",
            keyActivesSnapshot: ["benzoyl peroxide"],
          },
          {
            stepId: "step-4",
            customProductName: "Basic moisturizer",
            category: "moisturizer",
            order: 4,
            frequency: "daily",
          },
        ],
      }),
    );
    mockedFindSkinProfileByUserId.mockResolvedValue(null);
    mockProviderUnavailable();

    const dto = await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    expect(dto?.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: "TOO_MANY_ACTIVES",
          reason: expect.stringContaining("phản ứng da"),
        }),
      ]),
    );
    expect(dto?.suggestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          priority: "must_fix",
          title: "Giảm số active dùng cùng lúc",
        }),
        expect.objectContaining({
          priority: "should_fix",
          title: "Bắt đầu treatment với tần suất thấp",
        }),
      ]),
    );
    expect(
      dto?.suggestions.filter(
        (suggestion) =>
          suggestion.title === "Bắt đầu treatment với tần suất thấp",
      ),
    ).toHaveLength(1);
  });

  it("keeps simple balanced morning routines free of unnecessary must-fix actions", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(
      createRoutine({
        name: "Routine buoi sang can bang",
        timeOfDay: "morning",
        steps: [
          {
            stepId: "step-1",
            customProductName: "Gentle cleanser",
            category: "cleanser",
            order: 1,
            frequency: "daily",
          },
          {
            stepId: "step-2",
            customProductName: "Basic moisturizer",
            category: "moisturizer",
            order: 2,
            frequency: "daily",
          },
          {
            stepId: "step-3",
            customProductName: "Daily sunscreen",
            category: "sunscreen",
            order: 3,
            frequency: "daily",
          },
        ],
      }),
    );
    mockedFindSkinProfileByUserId.mockResolvedValue(null);
    mockProviderUnavailable();

    const dto = await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    expect(dto?.riskLevel).toBe("low");
    expect(dto?.warnings).toEqual([]);
    expect(dto?.positiveFindings).toEqual(
      expect.arrayContaining([
        "Có bước làm sạch.",
        "Có bước dưỡng ẩm.",
        "Có chống nắng cho routine buổi sáng.",
        "Routine có nền tảng cơ bản với làm sạch và dưỡng ẩm.",
        "Routine có số bước tương đối dễ theo dõi.",
        "Routine buổi sáng có cấu trúc cơ bản khá đầy đủ.",
      ]),
    );
    expect(dto?.summary).toContain("dữ liệu routine hiện có");
    expect(
      dto?.suggestions.some((suggestion) => suggestion.priority === "must_fix"),
    ).toBe(false);
  });

  it("returns evening routine positive findings for cleanser and moisturizer", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(
      createRoutine({
        name: "Routine buoi toi co ban",
        timeOfDay: "evening",
        steps: [
          {
            stepId: "step-1",
            customProductName: "Gentle cleanser",
            category: "cleanser",
            order: 1,
            frequency: "daily",
          },
          {
            stepId: "step-2",
            customProductName: "Basic moisturizer",
            category: "moisturizer",
            order: 2,
            frequency: "daily",
          },
        ],
      }),
    );
    mockedFindSkinProfileByUserId.mockResolvedValue(null);
    mockProviderUnavailable();

    const dto = await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    expect(dto?.positiveFindings).toEqual(
      expect.arrayContaining([
        "Có bước làm sạch.",
        "Có bước dưỡng ẩm.",
        "Routine có nền tảng cơ bản với làm sạch và dưỡng ẩm.",
        "Routine có số bước tương đối dễ theo dõi.",
        "Routine buổi tối có nền tảng cơ bản để theo dõi đều đặn.",
      ]),
    );
  });

  it("handles empty evening routines without crashing", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(
      createRoutine({
        name: "Routine rong",
        timeOfDay: "evening",
        steps: [],
      }),
    );
    mockedFindSkinProfileByUserId.mockResolvedValue(null);
    mockProviderUnavailable();

    const dto = await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    expect(dto).toMatchObject({
      riskLevel: "low",
      positiveFindings: [],
      warnings: [],
      shouldSeeProfessional: false,
    });
    expect(dto?.summary).toContain("Routine hiện chưa có cảnh báo lớn");
    expect(dto?.disclaimer).toContain("không thay thế tư vấn y tế");
    expect(dto?.suggestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          priority: "optional",
          title: "Theo dõi phản ứng da trong Journal",
        }),
      ]),
    );
  });

  it("falls back when provider validation fails", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);
    mockedAnalyzeRoutine.mockRejectedValue(
      new AIProviderResponseError("Invalid routine analysis output."),
    );

    const dto = await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    expect(getPersistedInput()).toMatchObject({
      aiStatus: "fallback_used",
      modelProvider: ROUTINE_ANALYSIS_FALLBACK_MODEL_PROVIDER,
      modelName: ROUTINE_ANALYSIS_FALLBACK_MODEL_NAME,
      promptVersion: ROUTINE_ANALYSIS_FALLBACK_PROMPT_VERSION,
      providerFailureReason: "provider_response_error",
    });
    expect(dto).not.toHaveProperty("providerFailureReason");
    expect(JSON.stringify(dto)).not.toContain(
      "Invalid routine analysis output.",
    );
  });

  it("falls back when provider output mapping fails", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);
    mockedMapAIProviderRoutineAnalysisToRoutineAnalysisResult.mockImplementationOnce(
      () => {
        throw new Error("secret mapping failure");
      },
    );

    const dto = await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });
    const dtoJson = JSON.stringify(dto);

    expect(mockedAnalyzeRoutine).toHaveBeenCalledTimes(1);
    expect(getPersistedInput()).toMatchObject({
      aiStatus: "fallback_used",
      providerFailureReason: "provider_mapping_error",
    });
    expect(dtoJson).not.toContain("secret mapping failure");
    expect(dtoJson).not.toContain("providerFailureReason");
    expect(dtoJson).not.toContain("stack");
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
      providerFailureReason: "provider_unexpected_error",
    });
    expect(dtoJson).not.toContain("Provider exploded");
    expect(dtoJson).not.toContain("providerFailureReason");
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
    expect(persistedInput.aiResult.positiveFindings).toEqual([
      "Có bước làm sạch.",
    ]);
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
          priority: "must_fix",
          title: "Cân nhắc thêm chống nắng cho routine buổi sáng",
        }),
        expect.objectContaining({
          title: "Gợi ý tham khảo",
          description: "Provider recommendation.",
        }),
        expect.objectContaining({
          priority: "optional",
          title: "Theo dõi phản ứng da trong Journal",
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
    expect(getPersistedInput()).not.toHaveProperty("providerFailureReason");
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
          positiveFindings: [],
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
