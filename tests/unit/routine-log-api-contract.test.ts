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
    RoutineLogValidationError,
    upsertRoutineLogForUser: vi.fn(),
  };
});

import * as routineLogsRoute from "@/app/api/routine-logs/route";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import {
  getRoutineLogsForDate,
  RoutineLogValidationError,
  upsertRoutineLogForUser,
} from "@/modules/routine-logs/routine-log.use-case";
import type { RoutineLogDto } from "@/modules/routine-logs/routine-log.dto";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedGetRoutineLogsForDate = vi.mocked(getRoutineLogsForDate);
const mockedUpsertRoutineLogForUser = vi.mocked(upsertRoutineLogForUser);

const authUserId = "auth-user-id";
const routineId = "665000000000000000000470";
const routineLogId = "665000000000000000000471";
const fixedDate = new Date("2026-05-17T00:00:00.000Z").toISOString();

const routineLogDto: RoutineLogDto = {
  id: routineLogId,
  routineId,
  localDate: "2026-05-17",
  timezone: "Asia/Ho_Chi_Minh",
  status: "partial",
  completedStepIds: ["step-1"],
  note: "Bo qua kem chong nang.",
  createdAt: fixedDate,
  updatedAt: fixedDate,
};

const validPutBody = {
  routineId,
  localDate: "2026-05-17",
  timezone: "Asia/Ho_Chi_Minh",
  status: "partial",
  completedStepIds: ["step-1"],
  note: "Bo qua kem chong nang.",
};

function jsonRequest(url: string, method: string, body: unknown) {
  return new Request(url, {
    method,
    body: JSON.stringify(body),
  });
}

async function readJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

function mockAuthenticatedUser(userId = authUserId) {
  mockedGetCurrentUser.mockResolvedValue({
    id: userId,
    email: "an@example.com",
    name: "An",
  });
}

describe("/api/routine-logs contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedGetRoutineLogsForDate.mockReset();
    mockedUpsertRoutineLogForUser.mockReset();
  });

  it("uses the Node.js runtime and exports the expected handlers", () => {
    expect(routineLogsRoute.runtime).toBe("nodejs");
    expect(routineLogsRoute.GET).toBeTypeOf("function");
    expect(routineLogsRoute.PUT).toBeTypeOf("function");
    expect(routineLogsRoute).not.toHaveProperty("POST");
  });

  it("requires authentication for RoutineLog endpoints", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const getResponse = await routineLogsRoute.GET(
      new Request("http://localhost/api/routine-logs?localDate=2026-05-17"),
    );
    const putResponse = await routineLogsRoute.PUT(
      jsonRequest("http://localhost/api/routine-logs", "PUT", validPutBody),
    );

    for (const response of [getResponse, putResponse]) {
      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "UNAUTHORIZED",
        },
      });
      expect(response.status).toBe(401);
    }
    expect(mockedGetRoutineLogsForDate).not.toHaveBeenCalled();
    expect(mockedUpsertRoutineLogForUser).not.toHaveBeenCalled();
  });

  it("returns current user logs for the required localDate query", async () => {
    mockAuthenticatedUser();
    mockedGetRoutineLogsForDate.mockResolvedValue([routineLogDto]);

    const response = await routineLogsRoute.GET(
      new Request("http://localhost/api/routine-logs?localDate=2026-05-17"),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: {
        routineLogs: [routineLogDto],
      },
      error: null,
    });
    expect(mockedGetRoutineLogsForDate).toHaveBeenCalledWith(
      authUserId,
      "2026-05-17",
    );
    expect(serializedBody).not.toContain("userId");
    expect(serializedBody).not.toContain("_id");
    expect(serializedBody).not.toContain("ObjectId");
  });

  it("rejects missing or invalid localDate query", async () => {
    mockAuthenticatedUser();

    const missingResponse = await routineLogsRoute.GET(
      new Request("http://localhost/api/routine-logs"),
    );
    const invalidResponse = await routineLogsRoute.GET(
      new Request("http://localhost/api/routine-logs?localDate=05-17-2026"),
    );

    for (const response of [missingResponse, invalidResponse]) {
      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
      expect(response.status).toBe(400);
    }
    expect(mockedGetRoutineLogsForDate).not.toHaveBeenCalled();
  });

  it("upserts one RoutineLog for the authenticated user", async () => {
    mockAuthenticatedUser();
    mockedUpsertRoutineLogForUser.mockResolvedValue(routineLogDto);

    const response = await routineLogsRoute.PUT(
      jsonRequest("http://localhost/api/routine-logs", "PUT", validPutBody),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: {
        routineLog: routineLogDto,
      },
      error: null,
    });
    expect(mockedUpsertRoutineLogForUser).toHaveBeenCalledWith(
      authUserId,
      validPutBody,
    );
    expect(serializedBody).not.toContain("userId");
    expect(serializedBody).not.toContain("_id");
    expect(serializedBody).not.toContain("ObjectId");
  });

  it("rejects client-submitted server-owned or unknown fields", async () => {
    mockAuthenticatedUser();

    const invalidBodies = [
      { ...validPutBody, userId: authUserId },
      { ...validPutBody, id: routineLogId },
      { ...validPutBody, _id: routineLogId },
      { ...validPutBody, createdAt: fixedDate },
      { ...validPutBody, updatedAt: fixedDate },
      { ...validPutBody, skippedStepIds: ["step-2"] },
    ];

    for (const body of invalidBodies) {
      const response = await routineLogsRoute.PUT(
        jsonRequest("http://localhost/api/routine-logs", "PUT", body),
      );

      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
      expect(response.status).toBe(400);
    }
    expect(mockedUpsertRoutineLogForUser).not.toHaveBeenCalled();
  });

  it("returns NOT_FOUND when the target routine is missing or not owned", async () => {
    mockAuthenticatedUser();
    mockedUpsertRoutineLogForUser.mockResolvedValue(null);

    const response = await routineLogsRoute.PUT(
      jsonRequest("http://localhost/api/routine-logs", "PUT", validPutBody),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "NOT_FOUND",
      },
    });
    expect(response.status).toBe(404);
  });

  it("returns VALIDATION_ERROR for invalid completedStepIds", async () => {
    mockAuthenticatedUser();
    mockedUpsertRoutineLogForUser.mockRejectedValue(
      new RoutineLogValidationError("Unknown step id."),
    );

    const response = await routineLogsRoute.PUT(
      jsonRequest("http://localhost/api/routine-logs", "PUT", {
        ...validPutBody,
        completedStepIds: ["missing-step"],
      }),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "VALIDATION_ERROR",
      },
    });
    expect(response.status).toBe(400);
  });

  it("returns generic INTERNAL_ERROR without leaking raw errors", async () => {
    mockAuthenticatedUser();
    mockedGetRoutineLogsForDate.mockRejectedValue(
      new Error(
        "MongoServerError MONGODB_URI=mongodb+srv://secret AUTH_SECRET=secret token session stack",
      ),
    );

    const response = await routineLogsRoute.GET(
      new Request("http://localhost/api/routine-logs?localDate=2026-05-17"),
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
    expect(serializedBody).not.toContain("AUTH_SECRET");
    expect(serializedBody).not.toContain("token");
    expect(serializedBody).not.toContain("session");
    expect(serializedBody).not.toContain("stack");
  });
});
