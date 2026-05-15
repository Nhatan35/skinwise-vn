import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

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
import {
  createRoutineAnalysisForUser,
  listRoutineAnalysesByRoutineIdAndUserId,
} from "@/modules/ai-analysis/routine-analysis.repository";
import {
  ROUTINE_ANALYSIS_FALLBACK_MODEL_NAME,
  ROUTINE_ANALYSIS_FALLBACK_MODEL_PROVIDER,
  ROUTINE_ANALYSIS_FALLBACK_PROMPT_VERSION,
  type CreateRoutineAnalysisInput,
  type RoutineAnalysis,
} from "@/modules/ai-analysis/routine-analysis.types";
import { findRoutineByIdAndUserId } from "@/modules/routines/routine.repository";
import type { Routine } from "@/modules/routines/routine.types";
import { findSkinProfileByUserId } from "@/modules/skin-profile/skin-profile.repository";
import type { SkinProfile } from "@/modules/skin-profile/skin-profile.types";

const mockedFindRoutineByIdAndUserId = vi.mocked(findRoutineByIdAndUserId);
const mockedFindSkinProfileByUserId = vi.mocked(findSkinProfileByUserId);
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

describe("AnalyzeRoutine use case", () => {
  beforeEach(() => {
    mockedFindRoutineByIdAndUserId.mockReset();
    mockedFindSkinProfileByUserId.mockReset();
    mockedCreateRoutineAnalysisForUser.mockReset();
    mockedListRoutineAnalysesByRoutineIdAndUserId.mockReset();
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
  });

  it("runs deterministic analysis without a Skin Profile", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);

    const dto = await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    expect(dto).toMatchObject({
      riskLevel: "medium",
      warnings: [
        expect.objectContaining({
          code: "MISSING_SUNSCREEN_AM",
        }),
      ],
    });
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

  it("returns triggered warnings only and does not expose internal ruleResults", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);

    const dto = await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });
    const serializedDto = JSON.stringify(dto);

    expect(dto?.warnings.map((warning) => warning.code)).toEqual([
      "MISSING_SUNSCREEN_AM",
    ]);
    expect(serializedDto).not.toContain("ruleResults");
  });

  it("derives riskLevel and deterministic fallback metadata server-side", async () => {
    mockedFindRoutineByIdAndUserId.mockResolvedValue(createRoutine());
    mockedFindSkinProfileByUserId.mockResolvedValue(null);

    await analyzeRoutineForCurrentUser({
      routineId,
      currentUserId: userId,
    });

    const persistedInput = mockedCreateRoutineAnalysisForUser.mock.calls[0]?.[1];
    expect(persistedInput).toMatchObject({
      riskLevel: "medium",
      aiStatus: "fallback_used",
      modelProvider: ROUTINE_ANALYSIS_FALLBACK_MODEL_PROVIDER,
      modelName: ROUTINE_ANALYSIS_FALLBACK_MODEL_NAME,
      promptVersion: ROUTINE_ANALYSIS_FALLBACK_PROMPT_VERSION,
    });
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
