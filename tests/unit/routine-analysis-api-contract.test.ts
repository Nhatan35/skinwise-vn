import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/ai-analysis/analyze-routine.use-case", () => ({
  analyzeRoutineForCurrentUser: vi.fn(),
  listRoutineAnalysesForCurrentUser: vi.fn(),
}));

import * as analyzeRoute from "@/app/api/routines/[id]/analyze/route";
import * as analysesRoute from "@/app/api/routines/[id]/analyses/route";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import {
  analyzeRoutineForCurrentUser,
  listRoutineAnalysesForCurrentUser,
} from "@/modules/ai-analysis/analyze-routine.use-case";
import type { RoutineAnalysisDto } from "@/modules/ai-analysis/routine-analysis.dto";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedAnalyzeRoutineForCurrentUser = vi.mocked(
  analyzeRoutineForCurrentUser,
);
const mockedListRoutineAnalysesForCurrentUser = vi.mocked(
  listRoutineAnalysesForCurrentUser,
);

const projectRoot = process.cwd();
const userId = "auth-user-id";
const routineId = "665000000000000000000250";
const analysisId = "665000000000000000000251";
const createdAt = "2026-05-15T00:00:00.000Z";

const analysisDto = {
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
  createdAt,
} as const satisfies RoutineAnalysisDto;

function routeContext(id: string) {
  return {
    params: Promise.resolve({ id }),
  };
}

function jsonRequest(url: string, method: string, body: unknown) {
  return new Request(url, {
    method,
    body: JSON.stringify(body),
  });
}

async function readJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

function mockAuthenticatedUser() {
  mockedGetCurrentUser.mockResolvedValue({
    id: userId,
    email: "an@example.com",
    name: "An",
  });
}

describe("Routine Analysis API contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedAnalyzeRoutineForCurrentUser.mockReset();
    mockedListRoutineAnalysesForCurrentUser.mockReset();
  });

  it("adds POST analyze and GET analyses routes", () => {
    expect(analyzeRoute.runtime).toBe("nodejs");
    expect(analysesRoute.runtime).toBe("nodejs");
    expect(analyzeRoute.POST).toBeTypeOf("function");
    expect(analysesRoute.GET).toBeTypeOf("function");
    expect(
      existsSync(
        join(projectRoot, "src/app/api/routines/[id]/analyze/route.ts"),
      ),
    ).toBe(true);
    expect(
      existsSync(
        join(projectRoot, "src/app/api/routines/[id]/analyses/route.ts"),
      ),
    ).toBe(true);
  });

  it("requires authentication for both analysis routes", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const responses = [
      await analyzeRoute.POST(
        new Request(`http://localhost/api/routines/${routineId}/analyze`, {
          method: "POST",
        }),
        routeContext(routineId),
      ),
      await analysesRoute.GET(
        new Request(`http://localhost/api/routines/${routineId}/analyses`),
        routeContext(routineId),
      ),
    ];

    for (const response of responses) {
      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "UNAUTHORIZED",
        },
      });
      expect(response.status).toBe(401);
    }
    expect(mockedAnalyzeRoutineForCurrentUser).not.toHaveBeenCalled();
    expect(mockedListRoutineAnalysesForCurrentUser).not.toHaveBeenCalled();
  });

  it("analyzes a routine without requiring a client body", async () => {
    mockAuthenticatedUser();
    mockedAnalyzeRoutineForCurrentUser.mockResolvedValue(analysisDto);

    const response = await analyzeRoute.POST(
      new Request(`http://localhost/api/routines/${routineId}/analyze`, {
        method: "POST",
      }),
      routeContext(routineId),
    );
    const body = await readJson(response);

    expect(response.status).toBe(201);
    expect(body).toEqual({
      data: analysisDto,
      error: null,
    });
    expect(mockedAnalyzeRoutineForCurrentUser).toHaveBeenCalledWith({
      routineId,
      currentUserId: userId,
    });
  });

  it("rejects non-empty analyze request bodies and client-owned analysis fields", async () => {
    mockAuthenticatedUser();

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
      const response = await analyzeRoute.POST(
        jsonRequest(`http://localhost/api/routines/${routineId}/analyze`, "POST", {
          [field]: "client",
        }),
        routeContext(routineId),
      );

      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
      expect(response.status).toBe(400);
    }
    expect(mockedAnalyzeRoutineForCurrentUser).not.toHaveBeenCalled();
  });

  it("returns NOT_FOUND for missing or not-owned routines", async () => {
    mockAuthenticatedUser();
    mockedAnalyzeRoutineForCurrentUser.mockResolvedValue(null);
    mockedListRoutineAnalysesForCurrentUser.mockResolvedValue(null);

    const analyzeResponse = await analyzeRoute.POST(
      new Request(`http://localhost/api/routines/${routineId}/analyze`, {
        method: "POST",
      }),
      routeContext(routineId),
    );
    const historyResponse = await analysesRoute.GET(
      new Request(`http://localhost/api/routines/${routineId}/analyses`),
      routeContext(routineId),
    );

    for (const response of [analyzeResponse, historyResponse]) {
      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "NOT_FOUND",
        },
      });
      expect(response.status).toBe(404);
    }
  });

  it("returns analysis history scoped by routine route id", async () => {
    mockAuthenticatedUser();
    mockedListRoutineAnalysesForCurrentUser.mockResolvedValue({
      analyses: [analysisDto],
    });

    const response = await analysesRoute.GET(
      new Request(`http://localhost/api/routines/${routineId}/analyses`),
      routeContext(routineId),
    );

    await expect(readJson(response)).resolves.toEqual({
      data: {
        analyses: [analysisDto],
      },
      error: null,
    });
    expect(response.status).toBe(200);
    expect(mockedListRoutineAnalysesForCurrentUser).toHaveBeenCalledWith({
      routineId,
      currentUserId: userId,
    });
  });

  it("returns an empty analysis history array", async () => {
    mockAuthenticatedUser();
    mockedListRoutineAnalysesForCurrentUser.mockResolvedValue({
      analyses: [],
    });

    const response = await analysesRoute.GET(
      new Request(`http://localhost/api/routines/${routineId}/analyses`),
      routeContext(routineId),
    );

    await expect(readJson(response)).resolves.toEqual({
      data: {
        analyses: [],
      },
      error: null,
    });
    expect(response.status).toBe(200);
  });

  it("does not expose internal ruleResults, MongoDB ids, or userId", async () => {
    mockAuthenticatedUser();
    mockedAnalyzeRoutineForCurrentUser.mockResolvedValue(analysisDto);

    const response = await analyzeRoute.POST(
      new Request(`http://localhost/api/routines/${routineId}/analyze`, {
        method: "POST",
      }),
      routeContext(routineId),
    );
    const serializedBody = JSON.stringify(await readJson(response));

    expect(serializedBody).toContain("analysisId");
    expect(serializedBody).not.toContain("_id");
    expect(serializedBody).not.toContain("ObjectId");
    expect(serializedBody).not.toContain("userId");
    expect(serializedBody).not.toContain("ruleResults");
  });

  it("keeps Routine Analysis API scope small", () => {
    const implementedFiles = [
      "src/app/api/routines/[id]/analyze/route.ts",
      "src/app/api/routines/[id]/analyses/route.ts",
      "src/modules/ai-analysis/routine-analysis.types.ts",
      "src/modules/ai-analysis/routine-analysis.schema.ts",
      "src/modules/ai-analysis/routine-analysis.dto.ts",
      "src/modules/ai-analysis/routine-analysis.mapper.ts",
      "src/modules/ai-analysis/routine-analysis.repository.ts",
      "src/modules/ai-analysis/analyze-routine.use-case.ts",
      "src/modules/ai-analysis/index.ts",
    ];
    const combinedSource = implementedFiles
      .map((filePath) => readFileSync(join(projectRoot, filePath), "utf8"))
      .join("\n");

    for (const forbiddenScope of [
      "openai",
      "OpenAI",
      "LLM",
      "@/infrastructure/ai",
      "@/modules/products",
      "@/modules/ingredients",
      "@/modules/journals",
      "@/modules/routine-logs",
      "@/modules/dashboard",
      "components/",
      "rateLimit",
      "rate-limit",
      "RATE_LIMITED",
      "fetch(",
      "skinScore",
      "image upload",
      "medical diagnosis",
    ]) {
      expect(combinedSource).not.toContain(forbiddenScope);
    }
  });

  it("documents rate limiting as a follow-up instead of adding a local system", () => {
    const changeLog = readFileSync(
      join(projectRoot, "docs/ai-coding/05-ai-change-log.md"),
      "utf8",
    );

    expect(changeLog).toContain("Rate limiting remains a known follow-up");
    expect(changeLog).toContain("no existing rate-limit utility");
  });
});
