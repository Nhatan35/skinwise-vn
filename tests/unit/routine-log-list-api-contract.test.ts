import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/routine-logs/routine-log.use-case", () => {
  class RoutineLogValidationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "RoutineLogValidationError";
    }
  }

  return {
    getRoutineLogsForDate: vi.fn(),
    getRoutineLogsForDateRange: vi.fn(),
    RoutineLogValidationError,
    upsertRoutineLogForUser: vi.fn(),
  };
});

import * as routineLogsRoute from "@/app/api/routine-logs/route";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import {
  getRoutineLogsForDate,
  getRoutineLogsForDateRange,
  upsertRoutineLogForUser,
} from "@/modules/routine-logs/routine-log.use-case";
import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedGetRoutineLogsForDate = vi.mocked(getRoutineLogsForDate);
const mockedGetRoutineLogsForDateRange = vi.mocked(
  getRoutineLogsForDateRange,
);
const mockedUpsertRoutineLogForUser = vi.mocked(upsertRoutineLogForUser);

const authUserId = "auth-user-id";

function createRoutineLogDto(
  overrides: Partial<RoutineLogDto> = {},
): RoutineLogDto {
  return {
    id: "665000000000000000000501",
    routineId: "665000000000000000000502",
    localDate: "2026-05-17",
    timezone: "Asia/Ho_Chi_Minh",
    status: "completed",
    completedStepIds: ["step-1"],
    createdAt: "2026-05-17T00:00:00.000Z",
    updatedAt: "2026-05-17T00:00:00.000Z",
    ...overrides,
  };
}

function getRequest(query = "") {
  return new Request(`http://localhost/api/routine-logs${query}`);
}

async function readJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

function mockAuthenticatedUser() {
  mockedGetCurrentUser.mockResolvedValue({
    id: authUserId,
    email: "an@example.com",
    name: "An",
  });
}

describe("/api/routine-logs list contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedGetRoutineLogsForDate.mockReset();
    mockedGetRoutineLogsForDateRange.mockReset();
    mockedUpsertRoutineLogForUser.mockReset();
  });

  it("uses the Node.js runtime and exports the expected handlers", () => {
    expect(routineLogsRoute.runtime).toBe("nodejs");
    expect(routineLogsRoute.GET).toBeTypeOf("function");
    expect(routineLogsRoute.PUT).toBeTypeOf("function");
  });

  it("requires authentication before listing routine logs", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const response = await routineLogsRoute.GET(
      getRequest("?localDate=2026-05-17"),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "UNAUTHORIZED",
      },
    });
    expect(response.status).toBe(401);
    expect(mockedGetRoutineLogsForDate).not.toHaveBeenCalled();
    expect(mockedGetRoutineLogsForDateRange).not.toHaveBeenCalled();
  });

  it("keeps localDate query behavior backward-compatible", async () => {
    const routineLog = createRoutineLogDto();
    mockAuthenticatedUser();
    mockedGetRoutineLogsForDate.mockResolvedValue([routineLog]);

    const response = await routineLogsRoute.GET(
      getRequest("?localDate=2026-05-17"),
    );

    await expect(readJson(response)).resolves.toEqual({
      data: {
        routineLogs: [routineLog],
      },
      error: null,
    });
    expect(response.status).toBe(200);
    expect(mockedGetRoutineLogsForDate).toHaveBeenCalledWith(
      authUserId,
      "2026-05-17",
    );
    expect(mockedGetRoutineLogsForDateRange).not.toHaveBeenCalled();
  });

  it("supports a bounded from/to query for weekly review data", async () => {
    const routineLog = createRoutineLogDto({
      localDate: "2026-05-11",
      status: "partial",
    });
    mockAuthenticatedUser();
    mockedGetRoutineLogsForDateRange.mockResolvedValue([routineLog]);

    const response = await routineLogsRoute.GET(
      getRequest("?from=2026-05-11&to=2026-05-17"),
    );

    await expect(readJson(response)).resolves.toEqual({
      data: {
        routineLogs: [routineLog],
      },
      error: null,
    });
    expect(response.status).toBe(200);
    expect(mockedGetRoutineLogsForDateRange).toHaveBeenCalledWith(
      authUserId,
      "2026-05-11",
      "2026-05-17",
    );
    expect(mockedGetRoutineLogsForDate).not.toHaveBeenCalled();
  });

  it("rejects invalid routine log list query modes", async () => {
    mockAuthenticatedUser();

    for (const query of [
      "?localDate=2026-05-17&from=2026-05-11&to=2026-05-17",
      "?from=2026-05-11",
      "?to=2026-05-17",
      "?from=2026-05-18&to=2026-05-17",
      "?from=2026-05-10&to=2026-05-17",
      "?from=2026/05/11&to=2026-05-17",
      "?localDate=2026-05-17&unknown=field",
    ]) {
      const response = await routineLogsRoute.GET(getRequest(query));

      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
      expect(response.status).toBe(400);
    }

    expect(mockedGetRoutineLogsForDate).not.toHaveBeenCalled();
    expect(mockedGetRoutineLogsForDateRange).not.toHaveBeenCalled();
  });

  it("returns a generic internal error without leaking raw details", async () => {
    mockAuthenticatedUser();
    mockedGetRoutineLogsForDateRange.mockRejectedValue(
      new Error("MongoServerError MONGODB_URI token stack"),
    );

    const response = await routineLogsRoute.GET(
      getRequest("?from=2026-05-11&to=2026-05-17"),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(500);
    expect(body).toEqual({
      data: null,
      error: {
        code: "INTERNAL_ERROR",
        message: "Something went wrong.",
        details: {},
      },
    });
    expect(serializedBody).not.toContain("MongoServerError");
    expect(serializedBody).not.toContain("MONGODB_URI");
    expect(serializedBody).not.toContain("token");
    expect(serializedBody).not.toContain("stack");
  });
});
