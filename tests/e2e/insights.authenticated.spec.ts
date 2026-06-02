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

    await page.goto("/insights");

    expect((await insightsResponsePromise).ok()).toBe(true);
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
    await expect(page.getByText("không phải chẩn đoán y khoa")).toBeVisible();
  });
});
