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
      page.getByRole("heading", { name: "Skin Progress Insights" }),
    ).toBeVisible();
    await expect(page.getByText("Routine completion rate")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("Routine consistency calendar")).toBeVisible();
    await expect(page.getByText("Top symptoms")).toBeVisible();
    await expect(page.getByText("Product usage in journal")).toBeVisible();
    await expect(page.getByText("Next actions")).toBeVisible();
    await expect(page.getByText("This page summarizes your self-tracked data")).toBeVisible();
  });
});
