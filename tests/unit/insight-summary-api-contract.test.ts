import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/modules/auth/get-current-user", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/modules/insights/insight-summary.use-case", () => ({
  getInsightSummaryForUser: vi.fn(),
}));

import * as insightSummaryRoute from "@/app/api/insights/summary/route";
import { getCurrentUser } from "@/modules/auth/get-current-user";
import type { InsightSummaryDto } from "@/modules/insights/insight-summary.dto";
import { getInsightSummaryForUser } from "@/modules/insights/insight-summary.use-case";

const mockedGetCurrentUser = vi.mocked(getCurrentUser);
const mockedGetInsightSummaryForUser = vi.mocked(getInsightSummaryForUser);

const authUserId = "auth-user-id";

const forbiddenFields = [
  "_id",
  "id",
  "userId",
  "routineId",
  "journalId",
  "productId",
  "session",
  "token",
  "accessToken",
  "refreshToken",
  "providerAccountId",
  "emailVerified",
  "password",
  "rawDocument",
  "createdBy",
  "updatedBy",
];

const summaryDto: InsightSummaryDto = {
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
  },
  stressReflection: {
    periodDays: 30,
    highStressCount: 3,
    mediumStressCount: 4,
    lowStressCount: 2,
    summaryText: "Bạn đã ghi nhận mức căng thẳng cao trong 3 ngày nhật ký.",
    helperText:
      "Bạn có thể tiếp tục quan sát stress và ghi chú da cùng nhau, nhưng không nên xem đây là kết luận nguyên nhân.",
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
  },
  safetyNote:
    "Các thẻ này chỉ dựa trên dữ liệu bạn đã tự ghi lại, không phải kết luận y khoa, không phải chẩn đoán và không xác nhận nguyên nhân.",
};

async function readJson(response: Response) {
  return response.json() as Promise<Record<string, unknown>>;
}

function collectForbiddenKeys(value: unknown, path = "$"): string[] {
  if (!value || typeof value !== "object") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      collectForbiddenKeys(item, `${path}[${index}]`),
    );
  }

  return Object.entries(value as Record<string, unknown>).flatMap(
    ([key, nestedValue]) => {
      const currentPath = `${path}.${key}`;
      const currentMatch = forbiddenFields.includes(key) ? [currentPath] : [];

      return [
        ...currentMatch,
        ...collectForbiddenKeys(nestedValue, currentPath),
      ];
    },
  );
}

function mockAuthenticatedUser() {
  mockedGetCurrentUser.mockResolvedValue({
    id: authUserId,
    email: "an@example.com",
    name: "An",
  });
}

describe("/api/insights/summary contract", () => {
  beforeEach(() => {
    mockedGetCurrentUser.mockReset();
    mockedGetInsightSummaryForUser.mockReset();
    mockedGetInsightSummaryForUser.mockResolvedValue(summaryDto);
  });

  it("uses the Node.js runtime and exports only a GET handler", () => {
    expect(insightSummaryRoute.runtime).toBe("nodejs");
    expect(insightSummaryRoute.GET).toBeTypeOf("function");
    expect((insightSummaryRoute as Record<string, unknown>).POST).toBeUndefined();
    expect((insightSummaryRoute as Record<string, unknown>).DELETE).toBeUndefined();
  });

  it("requires authenticated user access", async () => {
    mockedGetCurrentUser.mockResolvedValue(null);

    const response = await insightSummaryRoute.GET(
      new Request("http://localhost/api/insights/summary"),
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
    expect(mockedGetInsightSummaryForUser).not.toHaveBeenCalled();
  });

  it("returns only the current user's count-based summary", async () => {
    mockAuthenticatedUser();

    const response = await insightSummaryRoute.GET(
      new Request("http://localhost/api/insights/summary?to=2026-06-07"),
    );
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body).toEqual({
      data: {
        summary: summaryDto,
      },
      error: null,
    });
    expect(mockedGetInsightSummaryForUser).toHaveBeenCalledWith(authUserId, {
      to: "2026-06-07",
    });
  });

  it("does not expose forbidden identifiers or auth/session/provider fields at any nested level", async () => {
    mockAuthenticatedUser();

    const response = await insightSummaryRoute.GET(
      new Request("http://localhost/api/insights/summary?to=2026-06-07"),
    );
    const body = await readJson(response);
    const serializedBody = JSON.stringify(body);

    expect(response.status).toBe(200);
    expect(collectForbiddenKeys(body)).toEqual([]);
    for (const forbiddenField of forbiddenFields) {
      expect(serializedBody).not.toContain(`"${forbiddenField}"`);
    }
  });

  it("does not return product identifiers in nested product arrays", async () => {
    mockAuthenticatedUser();

    const response = await insightSummaryRoute.GET(
      new Request("http://localhost/api/insights/summary"),
    );
    const body = await readJson(response);
    const summary = (body.data as { summary: InsightSummaryDto }).summary;

    expect(summary.productMentionPattern.topProducts).toEqual([
      {
        name: "Gentle Cleanser",
        brand: "Example",
        count: 3,
      },
    ]);
    expect(summary.productMentionPattern.topProducts[0]).not.toHaveProperty(
      "productId",
    );
    expect(summary.productMentionPattern.topProducts[0]).not.toHaveProperty("id");
  });

  it("returns safe summary text without harmful claims", async () => {
    mockAuthenticatedUser();

    const response = await insightSummaryRoute.GET(
      new Request("http://localhost/api/insights/summary"),
    );
    const serializedBody = JSON.stringify(await readJson(response)).toLowerCase();

    for (const harmfulPhrase of [
      "caused your acne",
      "this product caused",
      "you have acne because",
      "confirmed condition",
      "you should use this treatment",
      "your skin score is",
      "diagnosed with",
      "cure your",
      "this confirms acne",
      "this confirms irritation",
      "this product is harmful",
      "this product is effective",
      "stress caused",
      "routine caused",
      "skipping your routine caused",
      "improved your skin",
      "made your skin worse",
    ]) {
      expect(serializedBody).not.toContain(harmfulPhrase);
    }
    expect(serializedBody).toContain("không phải chẩn đoán");
  });

  it("handles insufficient data safely", async () => {
    mockAuthenticatedUser();
    mockedGetInsightSummaryForUser.mockResolvedValue({
      ...summaryDto,
      hasEnoughData: false,
      insufficientDataReasons: [
        "No routine logs were found for the last 7 days.",
        "No recent journal entries were found.",
      ],
      routineConsistency: {
        ...summaryDto.routineConsistency,
        completedDays: 0,
        partialDays: 0,
        missingDays: 7,
      },
      symptomFrequency: {
        ...summaryDto.symptomFrequency,
        topSymptoms: [],
        summaryText: "Chưa có ghi chú triệu chứng gần đây.",
      },
    });

    const response = await insightSummaryRoute.GET(
      new Request("http://localhost/api/insights/summary"),
    );
    const body = await readJson(response);

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      data: {
        summary: {
          hasEnoughData: false,
          insufficientDataReasons: [
            "No routine logs were found for the last 7 days.",
            "No recent journal entries were found.",
          ],
        },
      },
      error: null,
    });
  });

  it("rejects invalid to parameters and unrelated query keys safely", async () => {
    mockAuthenticatedUser();

    for (const url of [
      "http://localhost/api/insights/summary?to=2026-02-31",
      "http://localhost/api/insights/summary?to=30-06-2026",
      "http://localhost/api/insights/summary?to=2026-13-01",
      "http://localhost/api/insights/summary?from=2026-06-01&to=2026-06-07",
      "http://localhost/api/insights/summary?to=2026-06-07&userId=other-user-id",
    ]) {
      const response = await insightSummaryRoute.GET(new Request(url));

      expect(response.status).toBe(400);
      await expect(readJson(response)).resolves.toMatchObject({
        data: null,
        error: {
          code: "VALIDATION_ERROR",
        },
      });
    }

    expect(mockedGetInsightSummaryForUser).not.toHaveBeenCalled();
  });

  it("returns a generic internal error without leaking raw documents or secrets", async () => {
    mockAuthenticatedUser();
    mockedGetInsightSummaryForUser.mockRejectedValue(
      new Error("MongoServerError MONGODB_URI=mongodb+srv://secret rawDocument"),
    );

    const response = await insightSummaryRoute.GET(
      new Request("http://localhost/api/insights/summary"),
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
    expect(serializedBody).not.toContain("rawDocument");
  });
});
