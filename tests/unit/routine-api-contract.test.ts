import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { ObjectId } from "mongodb";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/routines/routine.use-case", () => ({
  createRoutineForCurrentUser: vi.fn(),
  deleteRoutineForUser: vi.fn(),
  getRoutineForUser: vi.fn(),
  listRoutinesForUser: vi.fn(),
  updateRoutineForUser: vi.fn(),
}));

import * as routinesRoute from "@/app/api/routines/route";
import * as routineByIdRoute from "@/app/api/routines/[id]/route";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import {
  createRoutineForCurrentUser,
  deleteRoutineForUser,
  getRoutineForUser,
  listRoutinesForUser,
  updateRoutineForUser,
} from "@/modules/routines/routine.use-case";
import type { Routine } from "@/modules/routines/routine.types";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedCreateRoutineForCurrentUser = vi.mocked(
  createRoutineForCurrentUser,
);
const mockedDeleteRoutineForUser = vi.mocked(deleteRoutineForUser);
const mockedGetRoutineForUser = vi.mocked(getRoutineForUser);
const mockedListRoutinesForUser = vi.mocked(listRoutinesForUser);
const mockedUpdateRoutineForUser = vi.mocked(updateRoutineForUser);

const authUserId = "auth-user-id";
const otherUserId = "other-user-id";
const routineId = "665000000000000000000130";
const fixedDate = new Date("2026-05-14T00:00:00.000Z");

const validRequestBody = {
  name: "Routine buoi sang",
  timeOfDay: "morning",
  steps: [
    {
      customProductName: "Sua rua mat diu nhe",
      category: "cleanser",
      order: 1,
      frequency: "daily",
      instructions: "Massage nhe trong 30 giay.",
    },
  ],
};

function createRoutine(overrides: Partial<Routine> = {}): Routine {
  return {
    _id: new ObjectId(routineId),
    userId: authUserId,
    name: "Routine buoi sang",
    timeOfDay: "morning",
    steps: [
      {
        stepId: "server-step-id",
        customProductName: "Sua rua mat diu nhe",
        category: "cleanser",
        order: 1,
        frequency: "daily",
        instructions: "Massage nhe trong 30 giay.",
      },
    ],
    createdAt: fixedDate,
    updatedAt: fixedDate,
    ...overrides,
  };
}

function jsonRequest(url: string, method: string, body: unknown) {
  return new Request(url, {
    method,
    body: JSON.stringify(body),
  });
}

function routeContext(id: string) {
  return {
    params: Promise.resolve({ id }),
  };
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

describe("/api/routines contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedCreateRoutineForCurrentUser.mockReset();
    mockedDeleteRoutineForUser.mockReset();
    mockedGetRoutineForUser.mockReset();
    mockedListRoutinesForUser.mockReset();
    mockedUpdateRoutineForUser.mockReset();
  });

  it("uses the Node.js runtime and exports the expected handlers", () => {
    expect(routinesRoute.runtime).toBe("nodejs");
    expect(routineByIdRoute.runtime).toBe("nodejs");
    expect(routinesRoute.GET).toBeTypeOf("function");
    expect(routinesRoute.POST).toBeTypeOf("function");
    expect(routineByIdRoute.GET).toBeTypeOf("function");
    expect(routineByIdRoute.PATCH).toBeTypeOf("function");
    expect(routineByIdRoute.DELETE).toBeTypeOf("function");
  });

  it("requires authentication for all routine endpoints", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const responses = [
      await routinesRoute.GET(),
      await routinesRoute.POST(
        jsonRequest("http://localhost/api/routines", "POST", validRequestBody),
      ),
      await routineByIdRoute.GET(
        new Request(`http://localhost/api/routines/${routineId}`),
        routeContext(routineId),
      ),
      await routineByIdRoute.PATCH(
        jsonRequest(`http://localhost/api/routines/${routineId}`, "PATCH", {
          name: "Routine toi",
        }),
        routeContext(routineId),
      ),
      await routineByIdRoute.DELETE(
        new Request(`http://localhost/api/routines/${routineId}`),
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
    expect(mockedListRoutinesForUser).not.toHaveBeenCalled();
    expect(mockedCreateRoutineForCurrentUser).not.toHaveBeenCalled();
    expect(mockedGetRoutineForUser).not.toHaveBeenCalled();
    expect(mockedUpdateRoutineForUser).not.toHaveBeenCalled();
    expect(mockedDeleteRoutineForUser).not.toHaveBeenCalled();
  });

  it("returns current user routines array", async () => {
    mockAuthenticatedUser();
    mockedListRoutinesForUser.mockResolvedValue([createRoutine()]);

    const response = await routinesRoute.GET();
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: {
        routines: [
          {
            id: routineId,
            name: "Routine buoi sang",
            timeOfDay: "morning",
            steps: [
              {
                stepId: "server-step-id",
                customProductName: "Sua rua mat diu nhe",
                category: "cleanser",
                order: 1,
                frequency: "daily",
                instructions: "Massage nhe trong 30 giay.",
              },
            ],
            createdAt: fixedDate.toISOString(),
            updatedAt: fixedDate.toISOString(),
          },
        ],
      },
      error: null,
    });
    expect(mockedListRoutinesForUser).toHaveBeenCalledWith(authUserId);
  });

  it("returns an empty array when the current user has no routines", async () => {
    mockAuthenticatedUser();
    mockedListRoutinesForUser.mockResolvedValue([]);

    const response = await routinesRoute.GET();

    await expect(readJson(response)).resolves.toEqual({
      data: {
        routines: [],
      },
      error: null,
    });
    expect(response.status).toBe(200);
  });

  it("creates a routine for the authenticated user and returns status 201", async () => {
    mockAuthenticatedUser();
    mockedCreateRoutineForCurrentUser.mockResolvedValue(createRoutine());

    const response = await routinesRoute.POST(
      jsonRequest("http://localhost/api/routines", "POST", validRequestBody),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(201);
    expect(body).toEqual({
      data: {
        routine: {
          id: routineId,
          name: "Routine buoi sang",
          timeOfDay: "morning",
          steps: [
            {
              stepId: "server-step-id",
              customProductName: "Sua rua mat diu nhe",
              category: "cleanser",
              order: 1,
              frequency: "daily",
              instructions: "Massage nhe trong 30 giay.",
            },
          ],
          createdAt: fixedDate.toISOString(),
          updatedAt: fixedDate.toISOString(),
        },
      },
      error: null,
    });
    expect(serializedBody).not.toContain("_id");
    expect(serializedBody).not.toContain("ObjectId");
    expect(serializedBody).not.toContain("userId");
    expect(mockedCreateRoutineForCurrentUser).toHaveBeenCalledWith(
      authUserId,
      validRequestBody,
    );
  });

  it("rejects invalid create payloads and forbidden create fields", async () => {
    mockAuthenticatedUser();

    const invalidBodies = [
      { ...validRequestBody, name: "" },
      { ...validRequestBody, userId: otherUserId },
      { ...validRequestBody, id: routineId },
      { ...validRequestBody, _id: routineId },
      { ...validRequestBody, createdAt: fixedDate.toISOString() },
      { ...validRequestBody, updatedAt: fixedDate.toISOString() },
      {
        ...validRequestBody,
        steps: [{ ...validRequestBody.steps[0], stepId: "client-step-id" }],
      },
      {
        ...validRequestBody,
        steps: [
          {
            ...validRequestBody.steps[0],
            productNameSnapshot: "Client snapshot",
          },
        ],
      },
    ];

    for (const invalidBody of invalidBodies) {
      const response = await routinesRoute.POST(
        jsonRequest("http://localhost/api/routines", "POST", invalidBody),
      );

      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
      expect(response.status).toBe(400);
    }
    expect(mockedCreateRoutineForCurrentUser).not.toHaveBeenCalled();
  });

  it("returns one owned routine by id", async () => {
    mockAuthenticatedUser();
    mockedGetRoutineForUser.mockResolvedValue(createRoutine());

    const response = await routineByIdRoute.GET(
      new Request(`http://localhost/api/routines/${routineId}`),
      routeContext(routineId),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: {
        routine: {
          id: routineId,
        },
      },
      error: null,
    });
    expect(response.status).toBe(200);
    expect(mockedGetRoutineForUser).toHaveBeenCalledWith(
      routineId,
      authUserId,
    );
  });

  it("returns NOT_FOUND for invalid, missing, or not-owned routine ids", async () => {
    mockAuthenticatedUser();
    mockedGetRoutineForUser.mockResolvedValue(null);
    mockedUpdateRoutineForUser.mockResolvedValue(null);
    mockedDeleteRoutineForUser.mockResolvedValue(null);

    const getResponse = await routineByIdRoute.GET(
      new Request("http://localhost/api/routines/not-a-routine-id"),
      routeContext("not-a-routine-id"),
    );
    const patchResponse = await routineByIdRoute.PATCH(
      jsonRequest("http://localhost/api/routines/not-a-routine-id", "PATCH", {
        name: "Routine toi",
      }),
      routeContext("not-a-routine-id"),
    );
    const deleteResponse = await routineByIdRoute.DELETE(
      new Request("http://localhost/api/routines/not-a-routine-id"),
      routeContext("not-a-routine-id"),
    );

    for (const response of [getResponse, patchResponse, deleteResponse]) {
      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "NOT_FOUND",
        },
      });
      expect(response.status).toBe(404);
    }
  });

  it("updates an owned routine through PATCH", async () => {
    mockAuthenticatedUser();
    mockedUpdateRoutineForUser.mockResolvedValue(
      createRoutine({ name: "Routine toi" }),
    );

    const response = await routineByIdRoute.PATCH(
      jsonRequest(`http://localhost/api/routines/${routineId}`, "PATCH", {
        name: "Routine toi",
      }),
      routeContext(routineId),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: {
        routine: {
          id: routineId,
          name: "Routine toi",
        },
      },
      error: null,
    });
    expect(response.status).toBe(200);
    expect(mockedUpdateRoutineForUser).toHaveBeenCalledWith(
      routineId,
      authUserId,
      {
        name: "Routine toi",
      },
    );
  });

  it("rejects invalid patch payloads and forbidden patch fields", async () => {
    mockAuthenticatedUser();

    const invalidBodies = [
      {},
      { userId: otherUserId },
      { id: routineId },
      { _id: routineId },
      { createdAt: fixedDate.toISOString() },
      { updatedAt: fixedDate.toISOString() },
      { stepId: "client-step-id" },
      {
        steps: [{ ...validRequestBody.steps[0], stepId: "client-step-id" }],
      },
      {
        steps: [
          {
            ...validRequestBody.steps[0],
            productNameSnapshot: "Client snapshot",
          },
        ],
      },
      {
        steps: [
          {
            ...validRequestBody.steps[0],
            brandSnapshot: "Client snapshot",
          },
        ],
      },
      {
        steps: [
          {
            ...validRequestBody.steps[0],
            keyActivesSnapshot: ["Client active"],
          },
        ],
      },
      {
        steps: [
          {
            ...validRequestBody.steps[0],
            ingredientTextSnapshot: "Client ingredients",
          },
        ],
      },
    ];

    for (const invalidBody of invalidBodies) {
      const response = await routineByIdRoute.PATCH(
        jsonRequest(
          `http://localhost/api/routines/${routineId}`,
          "PATCH",
          invalidBody,
        ),
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
    expect(mockedUpdateRoutineForUser).not.toHaveBeenCalled();
  });

  it("deletes an owned routine", async () => {
    mockAuthenticatedUser();
    mockedDeleteRoutineForUser.mockResolvedValue(createRoutine());

    const response = await routineByIdRoute.DELETE(
      new Request(`http://localhost/api/routines/${routineId}`),
      routeContext(routineId),
    );

    await expect(readJson(response)).resolves.toEqual({
      data: {
        deleted: true,
      },
      error: null,
    });
    expect(response.status).toBe(200);
    expect(mockedDeleteRoutineForUser).toHaveBeenCalledWith(
      routineId,
      authUserId,
    );
  });

  it("returns generic INTERNAL_ERROR without leaking raw errors", async () => {
    mockAuthenticatedUser();
    mockedListRoutinesForUser.mockRejectedValue(
      new Error(
        "MongoServerError MONGODB_URI=mongodb+srv://secret AUTH_SECRET=secret token session stack",
      ),
    );

    const response = await routinesRoute.GET();
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

describe("Routine API scope guard", () => {
  it("does not add out-of-scope routine UI routes", () => {
    const projectRoot = process.cwd();

    expect(
      existsSync(join(projectRoot, "src/app/(dashboard)/routines/page.tsx")),
    ).toBe(true);
    expect(
      existsSync(join(projectRoot, "src/app/(dashboard)/routines/new")),
    ).toBe(false);
    expect(
      existsSync(join(projectRoot, "src/app/(dashboard)/routines/[id]")),
    ).toBe(false);
    expect(
      existsSync(
        join(projectRoot, "src/app/(dashboard)/routines/[id]/analysis"),
      ),
    ).toBe(false);
    expect(existsSync(join(projectRoot, "src/app/routines"))).toBe(
      false,
    );
  });

  it("does not import out-of-scope modules into the routine foundation", () => {
    const projectRoot = process.cwd();
    const implementedFiles = [
      "src/app/api/routines/route.ts",
      "src/app/api/routines/[id]/route.ts",
      "src/modules/routines/routine.types.ts",
      "src/modules/routines/routine.schema.ts",
      "src/modules/routines/routine.dto.ts",
      "src/modules/routines/routine.mapper.ts",
      "src/modules/routines/routine.repository.ts",
      "src/modules/routines/routine.use-case.ts",
    ];
    const combinedSource = implementedFiles
      .map((filePath) => readFileSync(join(projectRoot, filePath), "utf8"))
      .join("\n");

    for (const forbiddenScope of [
      "@/modules/products",
      "@/modules/ingredients",
      "@/modules/ai-analysis",
      "@/modules/journals",
      "@/modules/routine-logs",
      "@/modules/dashboard",
      "AIProvider",
      "routine analysis",
      "skinScore",
      "medical diagnosis",
      "image upload",
    ]) {
      expect(combinedSource).not.toContain(forbiddenScope);
    }
  });
});
