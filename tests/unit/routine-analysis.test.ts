import { ObjectId } from "mongodb";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

vi.mock("server-only", () => ({}));

const toArrayMock = vi.fn();
const sortMock = vi.fn(() => ({ toArray: toArrayMock }));
const collectionMock = {
  insertOne: vi.fn(),
  find: vi.fn(() => ({ sort: sortMock })),
};

vi.mock("@/infrastructure/database/collections", () => ({
  getRoutineAnalysesCollection: vi.fn(() => collectionMock),
}));

import {
  createRoutineAnalysisForUser,
  listRoutineAnalysesByRoutineIdAndUserId,
} from "@/modules/ai-analysis/routine-analysis.repository";
import { parseAnalyzeRoutineRequestText } from "@/modules/ai-analysis/routine-analysis.schema";
import {
  toRoutineAnalysisDto,
  toRoutineAnalysisHistoryDto,
} from "@/modules/ai-analysis/routine-analysis.mapper";
import {
  ROUTINE_ANALYSIS_FALLBACK_MODEL_NAME,
  ROUTINE_ANALYSIS_FALLBACK_MODEL_PROVIDER,
  ROUTINE_ANALYSIS_FALLBACK_PROMPT_VERSION,
  type CreateRoutineAnalysisInput,
  type RoutineAnalysis,
} from "@/modules/ai-analysis/routine-analysis.types";

const userId = "auth-user-id";
const routineId = "665000000000000000000230";
const analysisId = "665000000000000000000231";
const fixedNow = new Date("2026-05-15T00:00:00.000Z");

const createAnalysisInput = {
  routineId: new ObjectId(routineId),
  routineSnapshot: {
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
  },
  riskLevel: "medium",
  ruleResults: [
    {
      code: "MISSING_SUNSCREEN_AM",
      severity: "medium",
      message: "Missing sunscreen",
      triggered: true,
    },
    {
      code: "TOO_MANY_ACTIVES",
      severity: "high",
      message: "Too many actives",
      triggered: false,
    },
  ],
  aiResult: {
    riskLevel: "medium",
    summary: "Routine has warnings.",
    warnings: [
      {
        code: "MISSING_SUNSCREEN_AM",
        severity: "medium",
        message: "Missing sunscreen",
        reason: "Morning routines need sunscreen.",
      },
    ],
    suggestions: [
      {
        title: "Add sunscreen",
        description: "Use sunscreen in the morning.",
        priority: "should_fix",
      },
    ],
    shouldSeeProfessional: false,
    disclaimer: "Educational only.",
  },
  aiStatus: "fallback_used",
  modelProvider: ROUTINE_ANALYSIS_FALLBACK_MODEL_PROVIDER,
  modelName: ROUTINE_ANALYSIS_FALLBACK_MODEL_NAME,
  promptVersion: ROUTINE_ANALYSIS_FALLBACK_PROMPT_VERSION,
} as const satisfies CreateRoutineAnalysisInput;

function createAnalysis(
  overrides: Partial<RoutineAnalysis> = {},
): RoutineAnalysis {
  return {
    _id: new ObjectId(analysisId),
    userId,
    ...createAnalysisInput,
    createdAt: fixedNow,
    ...overrides,
  };
}

describe("RoutineAnalysis request schema", () => {
  it("allows missing and empty analyze request bodies", () => {
    expect(parseAnalyzeRoutineRequestText("")).toEqual({});
    expect(parseAnalyzeRoutineRequestText("{}")).toEqual({});
  });

  it("rejects client-owned analyze fields", () => {
    for (const field of [
      "userId",
      "routineId",
      "riskLevel",
      "ruleResults",
      "warnings",
      "aiResult",
      "modelProvider",
      "modelName",
      "promptVersion",
      "createdAt",
    ]) {
      expect(() =>
        parseAnalyzeRoutineRequestText(JSON.stringify({ [field]: "client" })),
      ).toThrow(ZodError);
    }
  });
});

describe("RoutineAnalysis repository", () => {
  beforeEach(() => {
    collectionMock.insertOne.mockReset();
    collectionMock.find.mockReset();
    sortMock.mockReset();
    toArrayMock.mockReset();
    collectionMock.find.mockReturnValue({ sort: sortMock });
    sortMock.mockReturnValue({ toArray: toArrayMock });
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("creates a RoutineAnalysis for the authenticated user", async () => {
    collectionMock.insertOne.mockResolvedValue({
      insertedId: new ObjectId(analysisId),
    });

    await expect(
      createRoutineAnalysisForUser(userId, createAnalysisInput),
    ).resolves.toEqual(createAnalysis());

    expect(collectionMock.insertOne).toHaveBeenCalledWith({
      ...createAnalysisInput,
      userId,
      createdAt: fixedNow,
    });
  });

  it("persists an internal provider failure reason when present", async () => {
    const inputWithProviderFailureReason = {
      ...createAnalysisInput,
      providerFailureReason: "provider_response_error",
    } as const satisfies CreateRoutineAnalysisInput;
    collectionMock.insertOne.mockResolvedValue({
      insertedId: new ObjectId(analysisId),
    });

    await expect(
      createRoutineAnalysisForUser(userId, inputWithProviderFailureReason),
    ).resolves.toEqual(
      createAnalysis({
        providerFailureReason: "provider_response_error",
      }),
    );

    expect(collectionMock.insertOne).toHaveBeenCalledWith({
      ...inputWithProviderFailureReason,
      userId,
      createdAt: fixedNow,
    });
  });

  it("lists analysis history scoped by userId and routineId newest first", async () => {
    const analysis = createAnalysis();
    toArrayMock.mockResolvedValue([analysis]);

    await expect(
      listRoutineAnalysesByRoutineIdAndUserId(routineId, userId),
    ).resolves.toEqual([analysis]);

    const findCalls = collectionMock.find.mock.calls as unknown as Array<
      [
        {
          routineId?: ObjectId;
          userId?: string;
        },
      ]
    >;
    const filter = findCalls[0]?.[0];
    expect(filter.routineId?.toString()).toBe(routineId);
    expect(filter.userId).toBe(userId);
    expect(sortMock).toHaveBeenCalledWith({ createdAt: -1 });
  });

  it("returns an empty list for invalid routine ids without querying", async () => {
    await expect(
      listRoutineAnalysesByRoutineIdAndUserId("not-a-routine-id", userId),
    ).resolves.toEqual([]);

    expect(collectionMock.find).not.toHaveBeenCalled();
  });
});

describe("RoutineAnalysis mapper", () => {
  it("maps analysis documents to public DTOs without MongoDB internals", () => {
    const dto = toRoutineAnalysisDto(createAnalysis()) as Record<string, unknown>;
    const serializedDto = JSON.stringify(dto);

    expect(dto).toEqual({
      analysisId,
      routineId,
      riskLevel: "medium",
      summary: "Routine has warnings.",
      warnings: [
        {
          code: "MISSING_SUNSCREEN_AM",
          severity: "medium",
          message: "Missing sunscreen",
          reason: "Morning routines need sunscreen.",
        },
      ],
      suggestions: [
        {
          title: "Add sunscreen",
          description: "Use sunscreen in the morning.",
          priority: "should_fix",
        },
      ],
      shouldSeeProfessional: false,
      disclaimer: "Educational only.",
      createdAt: fixedNow.toISOString(),
    });
    expect(dto).not.toHaveProperty("_id");
    expect(dto).not.toHaveProperty("userId");
    expect(dto).not.toHaveProperty("ruleResults");
    expect(dto).not.toHaveProperty("providerFailureReason");
    expect(serializedDto).not.toContain("ObjectId");
  });

  it("maps history DTOs as newest-first DTO lists from repository order", () => {
    expect(toRoutineAnalysisHistoryDto([createAnalysis()])).toEqual({
      analyses: [toRoutineAnalysisDto(createAnalysis())],
    });
  });
});
