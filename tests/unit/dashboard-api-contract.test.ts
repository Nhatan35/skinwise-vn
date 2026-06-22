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
  routineCoverage: {
    hasRoutines: false,
    totalRoutines: 0,
    hasMorningRoutine: false,
    hasEveningRoutine: false,
    hasMorningSunscreen: false,
    hasMoisturizer: false,
    summary:
      "Bắt đầu với một routine đơn giản rồi kiểm tra lại theo thói quen sử dụng.",
    coverageItems: [
      {
        id: "routine-created",
        label: "Routine đã được tạo",
        status: "missing",
        description: "Bạn chưa có routine nào để xem lại.",
      },
    ],
    cautionItems: [],
    nextAction: {
      label: "Tạo routine đầu tiên",
      description: "Bắt đầu với một routine đơn giản.",
      actionType: "create-routine",
      href: "/routines",
    },
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
  profileCompletion: {
    percentage: 0,
    completedFields: 0,
    totalFields: 5,
    missingFields: [
      "skinType",
      "concerns",
      "sensitivityLevel",
      "budgetRange",
      "experienceLevel",
    ],
  },
  savedProducts: { count: 0 },
  savedProductTags: {
    totalSavedProducts: 0,
    taggedProductCount: 0,
    untaggedProductCount: 0,
    topTags: [],
  },
  savedProductDecisionQueue: {
    totalSavedProducts: 0,
    consideringCount: 0,
    testingCount: 0,
    pausedCount: 0,
    keptCount: 0,
    unsetDecisionStatusCount: 0,
    withoutPlannedRoutineSlotCount: 0,
    withoutPersonalNoteCount: 0,
    reviewNeededCount: 0,
    nextAction: {
      label: "Xem lại sản phẩm đã lưu",
      description: "Lưu sản phẩm để bắt đầu xây dựng hàng chờ xem lại.",
      href: "/saved-products",
    },
  },
  routineConsistency: {
    completedDays: 0,
    totalDays: 7,
    rate: 0,
    label: "needs_attention",
    windowDays: 7,
    maintainedDays: 0,
    currentStreak: 0,
    hasRecentLogs: false,
    level: "not_started",
    message: "Bạn chưa có dữ liệu routine trong 7 ngày gần đây.",
    nextAction: "Bắt đầu ghi nhận routine hôm nay.",
  },
  journalTrend: {
    recentEntries: 1,
    status: "not_enough_data",
    windowDays: 14,
    entriesWithSymptomsCount: 0,
    mostCommonSymptomCount: 0,
    hasEnoughData: false,
    message: "Cần thêm nhật ký để xem xu hướng rõ hơn.",
    nextAction: "Hãy ghi nhật ký da thêm vài lần trong tuần này.",
    disclaimer:
      "Thông tin này chỉ giúp theo dõi cá nhân và không thay thế tư vấn chuyên môn.",
  },
  nextActions: [
    {
      label: "Hoàn thiện hồ sơ da",
      href: "/onboarding/skin-profile",
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
    expect(serializedBody).toContain("profileCompletion");
    expect(serializedBody).toContain("savedProducts");
    expect(serializedBody).toContain("savedProductTags");
    expect(serializedBody).toContain("savedProductDecisionQueue");
    expect(serializedBody).toContain("totalSavedProducts");
    expect(serializedBody).toContain("taggedProductCount");
    expect(serializedBody).toContain("untaggedProductCount");
    expect(serializedBody).toContain("topTags");
    expect(serializedBody).toContain("consideringCount");
    expect(serializedBody).toContain("testingCount");
    expect(serializedBody).toContain("pausedCount");
    expect(serializedBody).toContain("keptCount");
    expect(serializedBody).toContain("unsetDecisionStatusCount");
    expect(serializedBody).toContain("withoutPlannedRoutineSlotCount");
    expect(serializedBody).toContain("withoutPersonalNoteCount");
    expect(serializedBody).toContain("reviewNeededCount");
    expect(serializedBody).toContain("label");
    expect(serializedBody).toContain("description");
    expect(serializedBody).toContain("href");
    expect(serializedBody).toContain("routineConsistency");
    expect(serializedBody).toContain("routineCoverage");
    expect(serializedBody).toContain("coverageItems");
    expect(serializedBody).toContain("cautionItems");
    expect(serializedBody).toContain("nextAction");
    expect(serializedBody).toContain("journalTrend");
    expect(serializedBody).toContain("maintainedDays");
    expect(serializedBody).toContain("mostCommonSymptomCount");
    expect(serializedBody).not.toContain("userId");
    expect(serializedBody).not.toContain("_id");
    expect(serializedBody).not.toContain("ObjectId");
    expect(serializedBody).not.toContain("recommendationScore");
    expect(serializedBody).not.toContain("productScore");
    expect(serializedBody).not.toContain("skinScore");
    expect(serializedBody).not.toContain("severityScore");
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
