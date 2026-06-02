import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getDefaultInsightsRange,
  getInsights,
} from "@/modules/insights/insights.client";
import type { InsightsDto } from "@/modules/insights/insights.dto";

const insightsDto: InsightsDto = {
  dateRange: {
    from: "2026-05-02",
    to: "2026-05-31",
    totalDays: 30,
  },
  routineConsistency: {
    totalRoutineSlots: 30,
    completedRoutineSlots: 15,
    partialRoutineSlots: 3,
    skippedRoutineSlots: 2,
    notLoggedRoutineSlots: 10,
    completionRate: 50,
    maintainedDays: 8,
    currentStreak: 2,
    bestStreak: 4,
  },
  journalActivity: {
    totalEntries: 3,
    activeJournalDays: 3,
    mostCommonSymptoms: [],
  },
  productUsage: {
    mostUsedProducts: [],
  },
  calendarDays: [],
  nextActions: [],
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
    },
    status,
  });
}

describe("Insights client", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("builds the default latest 30-day browser-local date range", () => {
    expect(getDefaultInsightsRange(new Date(2026, 4, 31, 8))).toEqual({
      from: "2026-05-02",
      to: "2026-05-31",
    });
  });

  it("sends explicit from/to query parameters and parses the success envelope", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        data: {
          insights: insightsDto,
        },
        error: null,
      }),
    );

    await expect(
      getInsights({
        from: "2026-05-01",
        to: "2026-05-31",
      }),
    ).resolves.toEqual(insightsDto);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/insights?from=2026-05-01&to=2026-05-31",
      {
        headers: {
          Accept: "application/json",
        },
        method: "GET",
      },
    );
  });

  it("falls back to a complete default range when params are omitted or incomplete", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 4, 31, 8));
    fetchMock.mockResolvedValue(
      jsonResponse({
        data: {
          insights: insightsDto,
        },
        error: null,
      }),
    );

    await getInsights({
      from: "2026-05-01",
    });

    const requestedUrl = fetchMock.mock.calls[0]?.[0];

    expect(requestedUrl).toBe("/api/insights?from=2026-05-02&to=2026-05-31");
    expect(String(requestedUrl)).not.toContain("undefined");
  });

  it("maps API validation errors to a client error with status and code", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          data: null,
          error: {
            code: "VALIDATION_ERROR",
            message: "Query parameters are invalid.",
            details: {},
          },
        },
        400,
      ),
    );

    await expect(
      getInsights({
        from: "2026-05-31",
        to: "2026-05-01",
      }),
    ).rejects.toMatchObject({
      name: "InsightsClientError",
      code: "VALIDATION_ERROR",
      status: 400,
      message: "Giai đoạn Insights đã chọn không hợp lệ.",
    });
  });

  it("uses the safe generic error when fetch or response parsing fails", async () => {
    fetchMock.mockRejectedValueOnce(new Error("Network secret."));

    await expect(getInsights()).rejects.toMatchObject({
      name: "InsightsClientError",
      message: expect.stringContaining("Chưa thể tải Insights"),
    });
  });
});
