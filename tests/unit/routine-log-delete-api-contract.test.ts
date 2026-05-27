import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/routine-logs/routine-log.use-case", () => ({
  deleteRoutineLogForUser: vi.fn(),
}));

import * as routineLogDeleteRoute from "@/app/api/routine-logs/[id]/route";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import { deleteRoutineLogForUser } from "@/modules/routine-logs/routine-log.use-case";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedDeleteRoutineLogForUser = vi.mocked(deleteRoutineLogForUser);

const authUserId = "auth-user-id";
const otherUserId = "other-user-id";
const routineLogId = "665000000000000000000471";

function deleteRequest(id: string, body?: unknown) {
  return new Request(`http://localhost/api/routine-logs/${id}`, {
    method: "DELETE",
    ...(body
      ? {
          body: JSON.stringify(body),
        }
      : {}),
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

describe("DELETE /api/routine-logs/[id] contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedDeleteRoutineLogForUser.mockReset();
  });

  it("uses the Node.js runtime and exports only DELETE", () => {
    expect(routineLogDeleteRoute.runtime).toBe("nodejs");
    expect(routineLogDeleteRoute.DELETE).toBeTypeOf("function");
    expect((routineLogDeleteRoute as Record<string, unknown>).GET).toBeUndefined();
    expect((routineLogDeleteRoute as Record<string, unknown>).PUT).toBeUndefined();
    expect((routineLogDeleteRoute as Record<string, unknown>).POST).toBeUndefined();
  });

  it("rejects unauthenticated delete requests without calling the delete use-case", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const response = await routineLogDeleteRoute.DELETE(
      deleteRequest(routineLogId),
      routeContext(routineLogId),
    );

    await expect(readJson(response)).resolves.toEqual({
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be signed in to access this resource.",
        details: {},
      },
    });
    expect(response.status).toBe(401);
    expect(mockedDeleteRoutineLogForUser).not.toHaveBeenCalled();
  });

  it("deletes the current user's own routine log and ignores client-submitted userId", async () => {
    mockAuthenticatedUser();
    mockedDeleteRoutineLogForUser.mockResolvedValue(true);

    const response = await routineLogDeleteRoute.DELETE(
      deleteRequest(routineLogId, { userId: otherUserId }),
      routeContext(routineLogId),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: {
        deleted: true,
      },
      error: null,
    });
    expect(mockedDeleteRoutineLogForUser).toHaveBeenCalledWith(
      authUserId,
      routineLogId,
    );
    expect(mockedDeleteRoutineLogForUser).not.toHaveBeenCalledWith(
      otherUserId,
      routineLogId,
    );
    expect(serializedBody).not.toContain(otherUserId);
    expect(serializedBody).not.toContain("userId");
  });

  it("returns NOT_FOUND when the routine log is missing or not owned by the current user", async () => {
    mockAuthenticatedUser();
    mockedDeleteRoutineLogForUser.mockResolvedValue(false);

    const response = await routineLogDeleteRoute.DELETE(
      deleteRequest(routineLogId),
      routeContext(routineLogId),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(404);
    expect(body).toEqual({
      data: null,
      error: {
        code: "NOT_FOUND",
        message: "Routine log was not found.",
        details: {},
      },
    });
    expect(mockedDeleteRoutineLogForUser).toHaveBeenCalledWith(
      authUserId,
      routineLogId,
    );
    expect(serializedBody).not.toContain(otherUserId);
    expect(serializedBody).not.toContain("belongs to another user");
  });

  it("handles invalid ids safely without exposing raw database errors", async () => {
    const invalidRoutineLogId = "invalid-id";
    mockAuthenticatedUser();
    mockedDeleteRoutineLogForUser.mockResolvedValue(false);

    const response = await routineLogDeleteRoute.DELETE(
      deleteRequest(invalidRoutineLogId),
      routeContext(invalidRoutineLogId),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(404);
    expect(body).toEqual({
      data: null,
      error: {
        code: "NOT_FOUND",
        message: "Routine log was not found.",
        details: {},
      },
    });
    expect(mockedDeleteRoutineLogForUser).toHaveBeenCalledWith(
      authUserId,
      invalidRoutineLogId,
    );
    expect(serializedBody).not.toContain("BSONError");
    expect(serializedBody).not.toContain("ObjectId");
    expect(serializedBody).not.toContain("stack");
  });

  it("returns generic INTERNAL_ERROR without leaking raw error details", async () => {
    mockAuthenticatedUser();
    mockedDeleteRoutineLogForUser.mockRejectedValue(
      new Error("MongoServerError MONGODB_URI=secret token session stack"),
    );

    const response = await routineLogDeleteRoute.DELETE(
      deleteRequest(routineLogId),
      routeContext(routineLogId),
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
    expect(serializedBody).not.toContain("secret");
    expect(serializedBody).not.toContain("token");
    expect(serializedBody).not.toContain("session");
    expect(serializedBody).not.toContain("stack");
  });
});
