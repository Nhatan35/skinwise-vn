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
      dataSourceLabel: "Routine log trong tài khoản của bạn",
      calculationLabel:
        "Đếm số ngày hoàn thành, một phần và chưa có log từ ghi nhận routine.",
      safetyText:
        "Thông tin này chỉ cho thấy mức độ ghi nhận thói quen, không kết luận da tốt hơn hay xấu đi.",
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
      dataSourceLabel: "Dấu hiệu hoặc cảm nhận trong journal của bạn",
      calculationLabel:
        "Các nhãn được ghi lặp lại được đếm và sắp xếp theo tần suất.",
      safetyText:
        "Thông tin này chỉ phản ánh những gì bạn đã ghi, không xác nhận tình trạng da.",
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
      dataSourceLabel: "Mức stress được ghi trong journal",
      calculationLabel: "Đếm số lần bạn chọn mức stress thấp, vừa hoặc cao.",
      safetyText:
        "Thông tin này không xác định stress là nguyên nhân của thay đổi trên da; chỉ tóm tắt ghi chú đã nhập.",
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
      dataSourceLabel: "Sản phẩm được nhắc trong journal",
      calculationLabel:
        "Đếm số lần tên sản phẩm xuất hiện trong các mục journal gần đây.",
      safetyText:
        "Thông tin này không xác nhận sản phẩm có lợi hay gây khó chịu cho da.",
    },
  },
  trackingQualityChecklist: {
    routinePeriodDays: 7,
    journalPeriodDays: 30,
    checklistItems: [
      {
        key: "routine_logs",
        label: "Routine log trong 7 ngày gần đây",
        status: "available",
        count: 5,
        periodDays: 7,
        helperText: "Bạn đã có routine log gần đây để xem lại.",
      },
      {
        key: "journal_entries",
        label: "Journal trong 30 ngày gần đây",
        status: "limited",
        count: 3,
        periodDays: 30,
        helperText:
          "Đã có một vài journal. Thêm ghi nhận sẽ giúp phần xem lại rõ hơn.",
      },
      {
        key: "symptom_notes",
        label: "Ghi nhận dấu hiệu trong 30 ngày gần đây",
        status: "limited",
        count: 2,
        periodDays: 30,
        helperText: "Đã có một số ghi nhận dấu hiệu để tự quan sát.",
      },
      {
        key: "stress_notes",
        label: "Ghi nhận stress trong 30 ngày gần đây",
        status: "available",
        count: 5,
        periodDays: 30,
        helperText: "Bạn đã có ghi nhận stress để xem lại.",
      },
      {
        key: "product_mentions",
        label: "Sản phẩm được nhắc trong 30 ngày gần đây",
        status: "not_enough_data",
        count: 0,
        periodDays: 30,
        helperText:
          "Chưa tìm thấy sản phẩm được nhắc trong journal gần đây.",
      },
    ],
    summaryText:
      "Một số mục đã có dữ liệu, một số mục vẫn cần thêm ghi nhận.",
    safetyNote:
      "Checklist này chỉ phản ánh mức độ có dữ liệu theo dõi, không phải đánh giá làn da hay tư vấn chuyên môn.",
  },
  safetyNote:
    "Các thẻ này chỉ dựa trên dữ liệu bạn đã tự ghi lại, không thay thế tư vấn chuyên môn và không xác nhận nguyên nhân.",
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
