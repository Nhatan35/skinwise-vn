import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/insights/insights.use-case", () => ({
  getInsightsForUser: vi.fn(),
}));

import * as insightsRoute from "@/app/api/insights/route";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import type { InsightsDto } from "@/modules/insights/insights.dto";
import { getInsightsForUser } from "@/modules/insights/insights.use-case";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedGetInsightsForUser = vi.mocked(getInsightsForUser);

const authUserId = "auth-user-id";

const insightsDto: InsightsDto = {
  dateRange: {
    from: "2026-05-02",
    to: "2026-05-31",
    totalDays: 30,
  },
  routineConsistency: {
    totalRoutineSlots: 60,
    completedRoutineSlots: 30,
    partialRoutineSlots: 5,
    skippedRoutineSlots: 5,
    notLoggedRoutineSlots: 20,
    completionRate: 50,
    maintainedDays: 10,
    currentStreak: 2,
    bestStreak: 4,
  },
  journalActivity: {
    totalEntries: 3,
    activeJournalDays: 3,
    mostCommonSymptoms: [
      {
        symptom: "dryness",
        count: 2,
      },
    ],
  },
  productUsage: {
    mostUsedProducts: [
      {
        productId: "665000000000000000000401",
        name: "Gentle Cleanser",
        brand: "Example",
        count: 2,
      },
    ],
  },
  calendarDays: [
    {
      localDate: "2026-05-31",
      routineSummary: {
        totalRoutines: 2,
        completed: 2,
        partial: 0,
        skipped: 0,
        notLogged: 0,
        dayStatus: "completed",
      },
      hasJournalEntry: true,
      symptoms: ["dryness"],
    },
  ],
  nextActions: [],
};

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

describe("/api/insights contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedGetInsightsForUser.mockReset();
    mockedGetInsightsForUser.mockResolvedValue(insightsDto);
  });

  it("uses the Node.js runtime and exports a GET handler", () => {
    expect(insightsRoute.runtime).toBe("nodejs");
    expect(insightsRoute.GET).toBeTypeOf("function");
  });

  it("requires authentication", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const response = await insightsRoute.GET(
      new Request("http://localhost/api/insights"),
    );

    expect(response.status).toBe(401);
    await expect(readJson(response)).resolves.toEqual({
      data: null,
      error: {
        code: "UNAUTHORIZED",
        message: "You must be signed in to access this resource.",
        details: {},
      },
    });
    expect(mockedGetInsightsForUser).not.toHaveBeenCalled();
  });

  it("returns the current user's insights with the default date range input", async () => {
    mockAuthenticatedUser();

    const response = await insightsRoute.GET(
      new Request("http://localhost/api/insights"),
    );

    expect(response.status).toBe(200);
    await expect(readJson(response)).resolves.toEqual({
      data: {
        insights: insightsDto,
      },
      error: null,
    });
    expect(mockedGetInsightsForUser).toHaveBeenCalledWith(authUserId, {});
  });

  it("passes a valid explicit from/to query to the use case", async () => {
    mockAuthenticatedUser();

    const response = await insightsRoute.GET(
      new Request(
        "http://localhost/api/insights?from=2026-05-01&to=2026-05-31",
      ),
    );

    expect(response.status).toBe(200);
    expect(mockedGetInsightsForUser).toHaveBeenCalledWith(authUserId, {
      from: "2026-05-01",
      to: "2026-05-31",
    });
  });

  it("rejects invalid query parameters before calling the use case", async () => {
    mockAuthenticatedUser();

    const invalidUrls = [
      "http://localhost/api/insights?from=2026-05-01",
      "http://localhost/api/insights?to=2026-05-31",
      "http://localhost/api/insights?from=30-05-2026&to=2026-05-31",
      "http://localhost/api/insights?from=2026-02-31&to=2026-03-01",
      "http://localhost/api/insights?from=2026-05-01&to=2026-13-01",
      "http://localhost/api/insights?from=2026-05-31&to=2026-05-01",
      "http://localhost/api/insights?from=2026-01-01&to=2026-04-01",
      "http://localhost/api/insights?from=2026-05-01&to=2026-05-31&userId=other-user-id",
    ];

    for (const url of invalidUrls) {
      const response = await insightsRoute.GET(new Request(url));

      expect(response.status).toBe(400);
      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
    }
    expect(mockedGetInsightsForUser).not.toHaveBeenCalled();
  });

  it("returns a generic internal error without leaking raw errors", async () => {
    mockAuthenticatedUser();
    mockedGetInsightsForUser.mockRejectedValue(
      new Error("MONGODB_URI=mongodb+srv://secret AUTH_SECRET=secret stack"),
    );

    const response = await insightsRoute.GET(
      new Request("http://localhost/api/insights"),
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
    expect(serializedBody).not.toContain("MONGODB_URI");
    expect(serializedBody).not.toContain("AUTH_SECRET");
    expect(serializedBody).not.toContain("stack");
  });
});
