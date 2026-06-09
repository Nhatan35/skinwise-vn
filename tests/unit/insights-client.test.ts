import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  getDefaultInsightsRange,
  getInsightSummary,
  getInsights,
} from "@/modules/insights/insights.client";
import type { InsightSummaryDto } from "@/modules/insights/insight-summary.dto";
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

const insightSummaryDto: InsightSummaryDto = {
  hasEnoughData: true,
  insufficientDataReasons: [],
  routineConsistency: {
    periodDays: 7,
    completedDays: 5,
    partialDays: 1,
    missingDays: 1,
    noRoutineConfigured: false,
    summaryText: "Bạn đã hoàn thành routine trong 5/7 ngày gần đây.",
    helperText:
      "Đây chỉ là mẫu theo dõi cá nhân để xem lại thói quen, không phải kết luận về thay đổi trên da.",
    calculationMeta: {
      periodDays: 7,
      dataSourceLabel: "Routine logs from your account only",
      calculationLabel:
        "Completed days, partial days, and no-log days were counted from your routine tracking records.",
      safetyText:
        "This only shows your tracking consistency. It does not indicate skin improvement or skin decline.",
    },
  },
  symptomFrequency: {
    periodDays: 30,
    topSymptoms: [
      {
        label: "dryness",
        count: 4,
      },
    ],
    summaryText:
      "khô da là triệu chứng được ghi nhiều nhất trong 30 ngày gần đây.",
    helperText:
      "Nội dung này chỉ phản ánh những gì bạn đã ghi trong nhật ký và không xác nhận tình trạng da.",
    calculationMeta: {
      periodDays: 30,
      dataSourceLabel: "Symptoms recorded in your journal entries",
      calculationLabel:
        "Repeated symptom labels were counted and sorted by frequency.",
      safetyText:
        "This only reflects what you recorded. It does not confirm a skin condition.",
    },
  },
  stressReflection: {
    periodDays: 30,
    highStressCount: 3,
    mediumStressCount: 4,
    lowStressCount: 2,
    summaryText: "Bạn đã ghi nhận mức căng thẳng cao trong 3 ngày nhật ký.",
    helperText:
      "Bạn có thể tiếp tục quan sát stress và ghi chú da cùng nhau, nhưng không nên xem đây là kết luận nguyên nhân.",
    calculationMeta: {
      periodDays: 30,
      dataSourceLabel: "Stress levels recorded in your journal entries",
      calculationLabel: "Low, medium, and high stress labels were counted.",
      safetyText:
        "This does not identify stress as a cause of any skin change. It only summarizes your recorded notes.",
    },
  },
  productMentionPattern: {
    periodDays: 30,
    topProducts: [
      {
        name: "Gentle Cleanser",
        brand: "Example",
        count: 3,
      },
    ],
    summaryText: "Gentle Cleanser xuất hiện trong 3 mục nhật ký.",
    helperText:
      "Hãy xem lại ghi chú của chính bạn trước khi thay đổi routine. Nội dung này không xác nhận hiệu quả, tác hại hoặc nguyên nhân từ sản phẩm.",
    calculationMeta: {
      periodDays: 30,
      dataSourceLabel: "Products mentioned in your journal entries",
      calculationLabel: "Product names appearing in journal entries were counted.",
      safetyText:
        "This does not confirm that a product helped or harmed your skin.",
    },
  },
  trackingQualityChecklist: {
    routinePeriodDays: 7,
    journalPeriodDays: 30,
    checklistItems: [
      {
        key: "routine_logs",
        label: "Routine logs in the last 7 days",
        status: "available",
        count: 5,
        periodDays: 7,
        helperText: "You have routine logs available for recent review.",
      },
      {
        key: "journal_entries",
        label: "Journal entries in the last 30 days",
        status: "limited",
        count: 3,
        periodDays: 30,
        helperText:
          "A few journal entries are available. More entries may make future review clearer.",
      },
      {
        key: "symptom_notes",
        label: "Symptom notes in the last 30 days",
        status: "limited",
        count: 2,
        periodDays: 30,
        helperText: "Some symptom notes are available for personal reflection.",
      },
      {
        key: "stress_notes",
        label: "Stress notes in the last 30 days",
        status: "available",
        count: 5,
        periodDays: 30,
        helperText: "You have stress notes available for recent review.",
      },
      {
        key: "product_mentions",
        label: "Product mentions in the last 30 days",
        status: "not_enough_data",
        count: 0,
        periodDays: 30,
        helperText:
          "No product mentions were found in recent journal entries.",
      },
    ],
    summaryText:
      "Your recent tracking data is available in some areas and limited in others.",
    safetyNote:
      "This checklist only reflects tracking data availability. It is not a skin score or medical assessment.",
  },
  safetyNote:
    "Các thẻ này chỉ dựa trên dữ liệu bạn đã tự ghi lại, không phải kết luận y khoa, không phải chẩn đoán và không xác nhận nguyên nhân.",
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

  it("fetches the strict personal insight summary endpoint with an explicit to date", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        data: {
          summary: insightSummaryDto,
        },
        error: null,
      }),
    );

    await expect(getInsightSummary({ to: "2026-06-07" })).resolves.toEqual(
      insightSummaryDto,
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/insights/summary?to=2026-06-07",
      {
        headers: {
          Accept: "application/json",
        },
        method: "GET",
      },
    );
  });

  it("fetches the personal insight summary endpoint without a query when no to date is provided", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({
        data: {
          summary: insightSummaryDto,
        },
        error: null,
      }),
    );

    await getInsightSummary();

    expect(fetchMock).toHaveBeenCalledWith("/api/insights/summary", {
      headers: {
        Accept: "application/json",
      },
      method: "GET",
    });
  });
});
