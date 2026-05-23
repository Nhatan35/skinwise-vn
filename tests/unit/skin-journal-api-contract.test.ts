import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/journals/create-skin-journal.use-case", () => {
  class SkinJournalConflictError extends Error {
    constructor(message = "SkinJournal entry already exists for this localDate.") {
      super(message);
      this.name = "SkinJournalConflictError";
    }
  }

  return {
    createSkinJournalForUser: vi.fn(),
    SkinJournalConflictError,
  };
});

vi.mock("@/modules/journals/list-skin-journal.use-case", () => ({
  listSkinJournalsForUser: vi.fn(),
}));

vi.mock("@/modules/journals/update-skin-journal.use-case", () => ({
  updateSkinJournalForUser: vi.fn(),
}));

vi.mock("@/modules/journals/delete-skin-journal.use-case", () => ({
  deleteSkinJournalForUser: vi.fn(),
}));

import * as skinJournalRoute from "@/app/api/skin-journal/route";
import * as skinJournalByIdRoute from "@/app/api/skin-journal/[id]/route";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import {
  createSkinJournalForUser,
  SkinJournalConflictError,
} from "@/modules/journals/create-skin-journal.use-case";
import { deleteSkinJournalForUser } from "@/modules/journals/delete-skin-journal.use-case";
import { listSkinJournalsForUser } from "@/modules/journals/list-skin-journal.use-case";
import type { SkinJournalDto } from "@/modules/journals/skin-journal.dto";
import { updateSkinJournalForUser } from "@/modules/journals/update-skin-journal.use-case";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedCreateSkinJournalForUser = vi.mocked(createSkinJournalForUser);
const mockedDeleteSkinJournalForUser = vi.mocked(deleteSkinJournalForUser);
const mockedListSkinJournalsForUser = vi.mocked(listSkinJournalsForUser);
const mockedUpdateSkinJournalForUser = vi.mocked(updateSkinJournalForUser);

const authUserId = "auth-user-id";
const otherUserId = "other-user-id";
const skinJournalId = "665000000000000000000801";
const fixedDate = new Date("2026-05-12T00:00:00.000Z").toISOString();

const skinJournalDto: SkinJournalDto = {
  id: skinJournalId,
  localDate: "2026-05-12",
  timezone: "Asia/Ho_Chi_Minh",
  productsUsed: ["product_123"],
  observations: ["Dry cheeks."],
  symptoms: ["dryness"],
  sleepHours: 7,
  stressLevel: "medium",
  notes: "No treatment today.",
  createdAt: fixedDate,
  updatedAt: fixedDate,
};

const validPostBody = {
  localDate: "2026-05-12",
  timezone: "Asia/Ho_Chi_Minh",
  productsUsed: ["product_123"],
  observations: ["Dry cheeks."],
  symptoms: ["dryness"],
  sleepHours: 7,
  stressLevel: "medium",
  notes: "No treatment today.",
};

function jsonRequest(url: string, method: string, body: unknown) {
  return new Request(url, {
    method,
    body: JSON.stringify(body),
  });
}

function invalidJsonRequest(url: string, method: string) {
  return new Request(url, {
    method,
    body: "{",
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

describe("/api/skin-journal contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedCreateSkinJournalForUser.mockReset();
    mockedDeleteSkinJournalForUser.mockReset();
    mockedListSkinJournalsForUser.mockReset();
    mockedUpdateSkinJournalForUser.mockReset();
  });

  it("uses the Node.js runtime and exports expected handlers", () => {
    expect(skinJournalRoute.runtime).toBe("nodejs");
    expect(skinJournalByIdRoute.runtime).toBe("nodejs");
    expect(skinJournalRoute.GET).toBeTypeOf("function");
    expect(skinJournalRoute.POST).toBeTypeOf("function");
    expect(skinJournalByIdRoute.PATCH).toBeTypeOf("function");
    expect(skinJournalByIdRoute.DELETE).toBeTypeOf("function");
  });

  it("requires authentication for all SkinJournal endpoints", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const responses = [
      await skinJournalRoute.GET(new Request("http://localhost/api/skin-journal")),
      await skinJournalRoute.POST(
        jsonRequest("http://localhost/api/skin-journal", "POST", validPostBody),
      ),
      await skinJournalByIdRoute.PATCH(
        jsonRequest(
          `http://localhost/api/skin-journal/${skinJournalId}`,
          "PATCH",
          { notes: "Updated note." },
        ),
        routeContext(skinJournalId),
      ),
      await skinJournalByIdRoute.DELETE(
        new Request(`http://localhost/api/skin-journal/${skinJournalId}`),
        routeContext(skinJournalId),
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
    expect(mockedCreateSkinJournalForUser).not.toHaveBeenCalled();
    expect(mockedListSkinJournalsForUser).not.toHaveBeenCalled();
    expect(mockedUpdateSkinJournalForUser).not.toHaveBeenCalled();
    expect(mockedDeleteSkinJournalForUser).not.toHaveBeenCalled();
  });

  it("creates a SkinJournal entry for the authenticated user", async () => {
    mockAuthenticatedUser();
    mockedCreateSkinJournalForUser.mockResolvedValue(skinJournalDto);

    const response = await skinJournalRoute.POST(
      jsonRequest("http://localhost/api/skin-journal", "POST", validPostBody),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(201);
    expect(body).toEqual({
      data: {
        skinJournal: skinJournalDto,
      },
      error: null,
    });
    expect(mockedCreateSkinJournalForUser).toHaveBeenCalledWith(
      authUserId,
      validPostBody,
    );
    expect(serializedBody).not.toContain("userId");
    expect(serializedBody).not.toContain("_id");
    expect(serializedBody).not.toContain("ObjectId");
    expect(serializedBody).not.toContain("imageUrl");
    expect(serializedBody).not.toContain("imageStorageKey");
    expect(serializedBody).not.toContain("imageVisibility");
    expect(serializedBody).not.toContain("photoUrls");
  });

  it("rejects invalid create payloads before calling the use case", async () => {
    mockAuthenticatedUser();

    const invalidBodies = [
      { ...validPostBody, localDate: undefined },
      { ...validPostBody, localDate: "05-12-2026" },
      { ...validPostBody, timezone: undefined },
      { ...validPostBody, timezone: "Invalid/Timezone" },
      { ...validPostBody, sleepHours: -1 },
      { ...validPostBody, sleepHours: 25 },
      { ...validPostBody, unknownField: true },
      { ...validPostBody, imageUrl: "https://example.com/private.jpg" },
      { ...validPostBody, imageStorageKey: "private/key" },
      { ...validPostBody, imageVisibility: "private" },
      { ...validPostBody, photoUrls: ["https://example.com/private.jpg"] },
      { ...validPostBody, mood: "bad" },
    ];

    for (const body of invalidBodies) {
      const response = await skinJournalRoute.POST(
        jsonRequest("http://localhost/api/skin-journal", "POST", body),
      );

      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
      expect(response.status).toBe(400);
    }

    const malformedJsonResponse = await skinJournalRoute.POST(
      invalidJsonRequest("http://localhost/api/skin-journal", "POST"),
    );

    await expect(readJson(malformedJsonResponse)).resolves.toMatchObject({
      data: null,
      error: {
        code: "VALIDATION_ERROR",
      },
    });
    expect(mockedCreateSkinJournalForUser).not.toHaveBeenCalled();
  });

  it("returns CONFLICT for duplicate localDate entries", async () => {
    mockAuthenticatedUser();
    mockedCreateSkinJournalForUser.mockRejectedValue(
      new SkinJournalConflictError(),
    );

    const response = await skinJournalRoute.POST(
      jsonRequest("http://localhost/api/skin-journal", "POST", validPostBody),
    );

    await expect(readJson(response)).resolves.toEqual({
      data: null,
      error: {
        code: "CONFLICT",
        message: "Skin journal entry already exists for this localDate.",
        details: {},
      },
    });
    expect(response.status).toBe(409);
  });

  it("returns current user SkinJournal entries and supports empty results", async () => {
    mockAuthenticatedUser();
    mockedListSkinJournalsForUser.mockResolvedValueOnce([skinJournalDto]);
    mockedListSkinJournalsForUser.mockResolvedValueOnce([]);

    const response = await skinJournalRoute.GET(
      new Request(
        "http://localhost/api/skin-journal?from=2026-05-01&to=2026-05-31&limit=5",
      ),
    );
    const emptyResponse = await skinJournalRoute.GET(
      new Request("http://localhost/api/skin-journal"),
    );

    await expect(readJson(response)).resolves.toEqual({
      data: {
        skinJournals: [skinJournalDto],
      },
      error: null,
    });
    expect(response.status).toBe(200);
    expect(mockedListSkinJournalsForUser).toHaveBeenNthCalledWith(
      1,
      authUserId,
      {
        from: "2026-05-01",
        to: "2026-05-31",
        limit: 5,
      },
    );
    await expect(readJson(emptyResponse)).resolves.toEqual({
      data: {
        skinJournals: [],
      },
      error: null,
    });
    expect(mockedListSkinJournalsForUser).toHaveBeenNthCalledWith(
      2,
      authUserId,
      {
        limit: 20,
      },
    );
  });

  it("rejects invalid list query parameters", async () => {
    mockAuthenticatedUser();

    const invalidRequests = [
      new Request("http://localhost/api/skin-journal?from=05-01-2026"),
      new Request("http://localhost/api/skin-journal?to=05-31-2026"),
      new Request("http://localhost/api/skin-journal?limit=0"),
      new Request("http://localhost/api/skin-journal?limit=51"),
      new Request("http://localhost/api/skin-journal?userId=other-user-id"),
      new Request(
        "http://localhost/api/skin-journal?from=2026-05-31&to=2026-05-01",
      ),
    ];

    for (const request of invalidRequests) {
      const response = await skinJournalRoute.GET(request);

      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
      expect(response.status).toBe(400);
    }
    expect(mockedListSkinJournalsForUser).not.toHaveBeenCalled();
  });

  it("updates an owned SkinJournal entry", async () => {
    mockAuthenticatedUser();
    mockedUpdateSkinJournalForUser.mockResolvedValue({
      ...skinJournalDto,
      notes: "Updated note.",
    });

    const response = await skinJournalByIdRoute.PATCH(
      jsonRequest(
        `http://localhost/api/skin-journal/${skinJournalId}`,
        "PATCH",
        {
          timezone: "Asia/Ho_Chi_Minh",
          productsUsed: ["product_123"],
          observations: ["Dry cheeks."],
          symptoms: ["dryness"],
          sleepHours: 7,
          stressLevel: "medium",
          notes: "Updated note.",
        },
      ),
      routeContext(skinJournalId),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: {
        skinJournal: {
          id: skinJournalId,
          notes: "Updated note.",
        },
      },
      error: null,
    });
    expect(response.status).toBe(200);
    expect(mockedUpdateSkinJournalForUser).toHaveBeenCalledWith(
      skinJournalId,
      authUserId,
      {
        timezone: "Asia/Ho_Chi_Minh",
        productsUsed: ["product_123"],
        observations: ["Dry cheeks."],
        symptoms: ["dryness"],
        sleepHours: 7,
        stressLevel: "medium",
        notes: "Updated note.",
      },
    );
  });

  it("rejects invalid patch bodies before calling the use case", async () => {
    mockAuthenticatedUser();

    const invalidBodies = [
      {},
      { localDate: "2026-05-13" },
      { imageUrl: "https://example.com/private.jpg" },
      { photoUrls: ["https://example.com/private.jpg"] },
      { sleepHours: 25 },
      { userId: otherUserId },
    ];

    for (const body of invalidBodies) {
      const response = await skinJournalByIdRoute.PATCH(
        jsonRequest(
          `http://localhost/api/skin-journal/${skinJournalId}`,
          "PATCH",
          body,
        ),
        routeContext(skinJournalId),
      );

      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
      expect(response.status).toBe(400);
    }

    const malformedJsonResponse = await skinJournalByIdRoute.PATCH(
      invalidJsonRequest(
        `http://localhost/api/skin-journal/${skinJournalId}`,
        "PATCH",
      ),
      routeContext(skinJournalId),
    );

    await expect(readJson(malformedJsonResponse)).resolves.toMatchObject({
      data: null,
      error: {
        code: "VALIDATION_ERROR",
      },
    });
    expect(mockedUpdateSkinJournalForUser).not.toHaveBeenCalled();
  });

  it("returns NOT_FOUND for invalid, missing, or not-owned update ids", async () => {
    mockAuthenticatedUser();
    mockedUpdateSkinJournalForUser.mockResolvedValue(null);

    const response = await skinJournalByIdRoute.PATCH(
      jsonRequest("http://localhost/api/skin-journal/not-an-object-id", "PATCH", {
        notes: "Updated note.",
      }),
      routeContext("not-an-object-id"),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "NOT_FOUND",
      },
    });
    expect(response.status).toBe(404);
    expect(mockedUpdateSkinJournalForUser).toHaveBeenCalledWith(
      "not-an-object-id",
      authUserId,
      {
        notes: "Updated note.",
      },
    );
  });

  it("deletes an owned SkinJournal entry", async () => {
    mockAuthenticatedUser();
    mockedDeleteSkinJournalForUser.mockResolvedValue(true);

    const response = await skinJournalByIdRoute.DELETE(
      new Request(`http://localhost/api/skin-journal/${skinJournalId}`),
      routeContext(skinJournalId),
    );

    await expect(readJson(response)).resolves.toEqual({
      data: {
        deleted: true,
      },
      error: null,
    });
    expect(response.status).toBe(200);
    expect(mockedDeleteSkinJournalForUser).toHaveBeenCalledWith(
      skinJournalId,
      authUserId,
    );
  });

  it("returns NOT_FOUND for invalid, missing, or not-owned delete ids", async () => {
    mockAuthenticatedUser();
    mockedDeleteSkinJournalForUser.mockResolvedValue(false);

    const response = await skinJournalByIdRoute.DELETE(
      new Request("http://localhost/api/skin-journal/not-an-object-id"),
      routeContext("not-an-object-id"),
    );

    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "NOT_FOUND",
      },
    });
    expect(response.status).toBe(404);
    expect(mockedDeleteSkinJournalForUser).toHaveBeenCalledWith(
      "not-an-object-id",
      authUserId,
    );
  });

  it("returns generic INTERNAL_ERROR without leaking raw errors", async () => {
    mockAuthenticatedUser();
    mockedListSkinJournalsForUser.mockRejectedValue(
      new Error(
        "MongoServerError E11000 MONGODB_URI=mongodb+srv://secret AUTH_SECRET=secret token session stack",
      ),
    );

    const response = await skinJournalRoute.GET(
      new Request("http://localhost/api/skin-journal"),
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
    expect(serializedBody).not.toContain("E11000");
    expect(serializedBody).not.toContain("MONGODB_URI");
    expect(serializedBody).not.toContain("AUTH_SECRET");
    expect(serializedBody).not.toContain("token");
    expect(serializedBody).not.toContain("session");
    expect(serializedBody).not.toContain("stack");
  });
});
