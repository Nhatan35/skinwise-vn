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
              },
              symptomFrequency: {
                periodDays: 30,
                topSymptoms: [],
                summaryText: "Chưa có ghi chú triệu chứng gần đây.",
                helperText:
                  "Hãy thêm nhật ký da để xem tần suất triệu chứng tại đây.",
              },
              stressReflection: {
                periodDays: 30,
                highStressCount: 0,
                mediumStressCount: 0,
                lowStressCount: 0,
                summaryText: "Chưa có ghi chú mức độ stress gần đây.",
                helperText: "Hãy thêm nhật ký để xem thẻ tự quan sát này.",
              },
              productMentionPattern: {
                periodDays: 30,
                topProducts: [],
                summaryText:
                  "Chưa tìm thấy sản phẩm nào được nhắc đến trong nhật ký gần đây.",
                helperText:
                  "Khi bạn ghi sản phẩm đã dùng trong nhật ký, phần này sẽ tóm tắt tần suất xuất hiện.",
              },
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
    await expectNoHarmfulInsightClaims(page);
  });
});
