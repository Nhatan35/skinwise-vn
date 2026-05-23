import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/dashboard/dashboard.use-case", () => ({
  getDashboardForUser: vi.fn(),
}));

import * as dashboardRoute from "@/app/api/dashboard/route";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import type { DashboardDto } from "@/modules/dashboard/dashboard.dto";
import { getDashboardForUser } from "@/modules/dashboard/dashboard.use-case";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedGetDashboardForUser = vi.mocked(getDashboardForUser);

const authUserId = "auth-user-id";

const dashboardDto: DashboardDto = {
  skinProfile: {
    exists: false,
  },
  routines: {
    total: 0,
    morning: 0,
    evening: 0,
    hasAnyRoutine: false,
  },
  todayRoutineLogs: {
    localDate: "2026-05-17",
    totalRoutines: 0,
    completed: 0,
    partial: 0,
    skipped: 0,
    notLogged: 0,
    completionRate: 0,
  },
  latestRoutineAnalysis: {
    exists: false,
  },
  latestJournal: {
    exists: true,
    id: "journal-1",
    localDate: "2026-05-17",
    observations: ["Skin felt comfortable."],
    symptoms: [],
    productsUsedCount: 2,
    notesPreview: "Short private note.",
    createdAt: "2026-05-17T00:00:00.000Z",
    updatedAt: "2026-05-17T00:00:00.000Z",
  },
  nextActions: [
    {
      label: "Hoàn thiện hồ sơ da",
      href: "/skin-profile",
      priority: "high",
    },
  ],
};

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

describe("/api/dashboard contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedGetDashboardForUser.mockReset();
  });

  it("uses Node.js runtime and exports GET only", () => {
    expect(dashboardRoute.runtime).toBe("nodejs");
    expect(dashboardRoute.GET).toBeTypeOf("function");
    expect(dashboardRoute).not.toHaveProperty("POST");
    expect(dashboardRoute).not.toHaveProperty("PUT");
  });

  it("requires authentication", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const response = await dashboardRoute.GET(
      new Request("http://localhost/api/dashboard?localDate=2026-05-17"),
    );

    expect(response.status).toBe(401);
    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "UNAUTHORIZED",
      },
    });
    expect(mockedGetDashboardForUser).not.toHaveBeenCalled();
  });

  it("rejects missing or invalid localDate", async () => {
    mockAuthenticatedUser();

    const missingResponse = await dashboardRoute.GET(
      new Request("http://localhost/api/dashboard"),
    );
    const invalidResponse = await dashboardRoute.GET(
      new Request("http://localhost/api/dashboard?localDate=05-17-2026"),
    );

    for (const response of [missingResponse, invalidResponse]) {
      expect(response.status).toBe(400);
      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
    }
    expect(mockedGetDashboardForUser).not.toHaveBeenCalled();
  });

  it("rejects userId query instead of accepting client-owned user context", async () => {
    mockAuthenticatedUser();

    const response = await dashboardRoute.GET(
      new Request(
        "http://localhost/api/dashboard?localDate=2026-05-17&userId=other-user",
      ),
    );

    expect(response.status).toBe(400);
    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "VALIDATION_ERROR",
      },
    });
    expect(mockedGetDashboardForUser).not.toHaveBeenCalled();
  });

  it("returns current user's dashboard with the canonical response shape", async () => {
    mockAuthenticatedUser();
    mockedGetDashboardForUser.mockResolvedValue(dashboardDto);

    const response = await dashboardRoute.GET(
      new Request("http://localhost/api/dashboard?localDate=2026-05-17"),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: {
        dashboard: dashboardDto,
      },
      error: null,
    });
    expect(mockedGetDashboardForUser).toHaveBeenCalledWith(authUserId, {
      localDate: "2026-05-17",
    });
    expect(serializedBody).toContain("latestJournal");
    expect(serializedBody).not.toContain("userId");
    expect(serializedBody).not.toContain("_id");
    expect(serializedBody).not.toContain("ObjectId");
  });

  it("returns INTERNAL_ERROR for unexpected failures", async () => {
    mockAuthenticatedUser();
    mockedGetDashboardForUser.mockRejectedValue(new Error("database down"));

    const response = await dashboardRoute.GET(
      new Request("http://localhost/api/dashboard?localDate=2026-05-17"),
    );

    expect(response.status).toBe(500);
    await expect(readJson(response)).resolves.toMatchObject({
      data: null,
      error: {
        code: "INTERNAL_ERROR",
      },
    });
  });
});
