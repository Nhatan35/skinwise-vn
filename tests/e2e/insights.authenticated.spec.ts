import { expect, test, type Page } from "@playwright/test";

import { loginAsE2EUser } from "./helpers/auth";
import {
  createRoutineViaApi,
  createSkinJournalViaApi,
  getBrowserLocalDate,
  getBrowserTimezone,
  markRoutineCompletedViaApi,
} from "./helpers/core-journey";

function waitForInsightsResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return url.pathname === "/api/insights" && response.request().method() === "GET";
    },
    { timeout: 15_000 },
  );
}

function waitForInsightSummaryResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        url.pathname === "/api/insights/summary" &&
        response.request().method() === "GET"
      );
    },
    { timeout: 15_000 },
  );
}

async function expectNoHarmfulInsightClaims(page: Page) {
  const pageText = (await page.locator("body").innerText()).toLowerCase();

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
    expect(pageText).not.toContain(harmfulPhrase);
  }
}

const routineCalculationMeta = {
  periodDays: 7,
  dataSourceLabel: "Routine logs from your account only",
  calculationLabel:
    "Completed days, partial days, and no-log days were counted from your routine tracking records.",
  safetyText:
    "This only shows your tracking consistency. It does not indicate skin improvement or skin decline.",
};

const symptomCalculationMeta = {
  periodDays: 30,
  dataSourceLabel: "Symptoms recorded in your journal entries",
  calculationLabel: "Repeated symptom labels were counted and sorted by frequency.",
  safetyText:
    "This only reflects what you recorded. It does not confirm a skin condition.",
};

const stressCalculationMeta = {
  periodDays: 30,
  dataSourceLabel: "Stress levels recorded in your journal entries",
  calculationLabel: "Low, medium, and high stress labels were counted.",
  safetyText:
    "This does not identify stress as a cause of any skin change. It only summarizes your recorded notes.",
};

const productCalculationMeta = {
  periodDays: 30,
  dataSourceLabel: "Products mentioned in your journal entries",
  calculationLabel: "Product names appearing in journal entries were counted.",
  safetyText: "This does not confirm that a product helped or harmed your skin.",
};

const insufficientTrackingQualityChecklist = {
  routinePeriodDays: 7,
  journalPeriodDays: 30,
  checklistItems: [
    {
      key: "routine_logs",
      label: "Routine logs in the last 7 days",
      status: "not_enough_data",
      count: 0,
      periodDays: 7,
      helperText: "No routine logs were found in the last 7 days.",
    },
    {
      key: "journal_entries",
      label: "Journal entries in the last 30 days",
      status: "not_enough_data",
      count: 0,
      periodDays: 30,
      helperText: "No journal entries were found in the last 30 days.",
    },
    {
      key: "symptom_notes",
      label: "Symptom notes in the last 30 days",
      status: "not_enough_data",
      count: 0,
      periodDays: 30,
      helperText: "No symptom notes were found in recent journal entries.",
    },
    {
      key: "stress_notes",
      label: "Stress notes in the last 30 days",
      status: "not_enough_data",
      count: 0,
      periodDays: 30,
      helperText: "No stress notes were found in recent journal entries.",
    },
    {
      key: "product_mentions",
      label: "Product mentions in the last 30 days",
      status: "not_enough_data",
      count: 0,
      periodDays: 30,
      helperText: "No product mentions were found in recent journal entries.",
    },
  ],
  summaryText:
    "Your recent tracking data is still limited. Continue logging routines or journal entries to build a clearer personal record.",
  safetyNote:
    "This checklist only reflects tracking data availability. It is not a skin score or medical assessment.",
};

test.describe("SkinWise VN authenticated insights", () => {
  test("authenticated user can review Skin Progress Insights", async ({ page }) => {
    await loginAsE2EUser(page);

    const routine = await createRoutineViaApi(page, {
      name: "E2E Insights Routine",
      customProductName: "E2E Gentle Cleanser",
    });
    const localDate = await getBrowserLocalDate(page);
    const timezone = await getBrowserTimezone(page);

    await markRoutineCompletedViaApi(page, routine, { localDate, timezone });
    await createSkinJournalViaApi(page, {
      localDate,
      notes: "E2E insights journal note",
      observations: ["E2E insights observation"],
      timezone,
    });

    const insightsResponsePromise = waitForInsightsResponse(page);
    const insightSummaryResponsePromise = waitForInsightSummaryResponse(page);

    await page.goto("/insights");

    expect((await insightsResponsePromise).ok()).toBe(true);
    expect((await insightSummaryResponsePromise).ok()).toBe(true);
    await expect(
      page.getByRole("heading", { name: "Insights tiến trình chăm sóc da" }),
    ).toBeVisible();
    await expect(page.getByText("Tỷ lệ hoàn thành routine")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("Lịch độ đều đặn routine")).toBeVisible();
    await expect(page.getByText("Xu hướng nhật ký da")).toBeVisible();
    await expect(page.getByText("Sản phẩm xuất hiện trong nhật ký")).toBeVisible();
    await expect(page.getByText("Gợi ý tiếp theo")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Personal Insight Review" }),
    ).toBeVisible();
    await expect(page.getByText("Routine Consistency")).toBeVisible();
    await expect(page.getByText("Journal Symptom Frequency")).toBeVisible();
    await expect(page.getByText("Stress Reflection")).toBeVisible();
    await expect(page.getByText("Product Mention Pattern")).toBeVisible();
    await expect(page.getByText("How this was calculated").first()).toBeVisible();
    await expect(page.getByText("Tracking Quality Checklist")).toBeVisible();
    await expect(page.getByText("Routine logs in the last 7 days")).toBeVisible();
    await expect(page.getByText("Journal entries in the last 30 days")).toBeVisible();
    await expect(page.getByText("Symptom notes in the last 30 days")).toBeVisible();
    await expect(page.getByText("Stress notes in the last 30 days")).toBeVisible();
    await expect(page.getByText("Product mentions in the last 30 days")).toBeVisible();
    await expect(
      page.getByText(/Available|Limited|Not enough data|Not configured/).first(),
    ).toBeVisible();
    await expect(page.getByText("not a skin score").first()).toBeVisible();
    await expect(page.getByText("không phải chẩn đoán y khoa").first()).toBeVisible();
    await expectNoHarmfulInsightClaims(page);
  });

  test("Personal Insight Review shows the insufficient-data empty state safely", async ({
    page,
  }) => {
    await loginAsE2EUser(page);
    await page.route("**/api/insights/summary**", async (route) => {
      await route.fulfill({
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            summary: {
              hasEnoughData: false,
              insufficientDataReasons: [
                "No routine logs were found for the last 7 days.",
                "No recent journal entries were found.",
              ],
              routineConsistency: {
                periodDays: 7,
                completedDays: 0,
                partialDays: 0,
                missingDays: 7,
                noRoutineConfigured: false,
                summaryText: "Bạn đã hoàn thành routine trong 0/7 ngày gần đây.",
                helperText:
                  "Đây chỉ là mẫu theo dõi cá nhân để xem lại thói quen, không phải kết luận về thay đổi trên da.",
                calculationMeta: routineCalculationMeta,
              },
              symptomFrequency: {
                periodDays: 30,
                topSymptoms: [],
                summaryText: "Chưa có ghi chú triệu chứng gần đây.",
                helperText:
                  "Hãy thêm nhật ký da để xem tần suất triệu chứng tại đây.",
                calculationMeta: symptomCalculationMeta,
              },
              stressReflection: {
                periodDays: 30,
                highStressCount: 0,
                mediumStressCount: 0,
                lowStressCount: 0,
                summaryText: "Chưa có ghi chú mức độ stress gần đây.",
                helperText: "Hãy thêm nhật ký để xem thẻ tự quan sát này.",
                calculationMeta: stressCalculationMeta,
              },
              productMentionPattern: {
                periodDays: 30,
                topProducts: [],
                summaryText:
                  "Chưa tìm thấy sản phẩm nào được nhắc đến trong nhật ký gần đây.",
                helperText:
                  "Khi bạn ghi sản phẩm đã dùng trong nhật ký, phần này sẽ tóm tắt tần suất xuất hiện.",
                calculationMeta: productCalculationMeta,
              },
              trackingQualityChecklist: insufficientTrackingQualityChecklist,
              safetyNote:
                "Các thẻ này chỉ dựa trên dữ liệu bạn đã tự ghi lại, không phải kết luận y khoa, không phải chẩn đoán và không xác nhận nguyên nhân.",
            },
          },
          error: null,
        }),
        status: 200,
      });
    });

    const insightsResponsePromise = waitForInsightsResponse(page);
    const insightSummaryResponsePromise = waitForInsightSummaryResponse(page);

    await page.goto("/insights");

    expect((await insightsResponsePromise).ok()).toBe(true);
    expect((await insightSummaryResponsePromise).ok()).toBe(true);
    await expect(
      page.getByRole("heading", { name: "Personal Insight Review" }),
    ).toBeVisible();
    await expect(
      page.getByText("Chưa đủ dữ liệu cho phần tự quan sát cá nhân"),
    ).toBeVisible();
    await expect(page.getByText("Chưa có ghi chú triệu chứng gần đây.")).toBeVisible();
    await expect(page.getByText("Chưa có ghi chú mức độ stress gần đây.")).toBeVisible();
    await expect(
      page.getByText("Chưa tìm thấy sản phẩm nào được nhắc đến trong nhật ký gần đây."),
    ).toBeVisible();
    await expect(page.getByText("Tracking Quality Checklist")).toBeVisible();
    await expect(page.getByText("Not enough data").first()).toBeVisible();
    await expect(page.getByText("not a skin score").first()).toBeVisible();
    await expect(page.getByText("How this was calculated").first()).toBeVisible();
    await expectNoHarmfulInsightClaims(page);
  });
});
