import { expect, test, type Page } from "@playwright/test";

import { loginAsE2EUser } from "./helpers/auth";
import {
  createRoutineViaApi,
  createSkinJournalViaApi,
  ensureSkinProfileViaApi,
  getBrowserLocalDate,
  getBrowserTimezone,
  markRoutineCompletedViaApi,
  runRoutineAnalysisViaApi,
} from "./helpers/core-journey";

function waitForDashboardResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return url.pathname === "/api/dashboard" && response.request().method() === "GET";
    },
    { timeout: 15_000 },
  );
}

test.describe("SkinWise VN authenticated dashboard summary", () => {
  test("dashboard reflects user-owned activity from the core journey", async ({ page }) => {
    await loginAsE2EUser(page);

    await ensureSkinProfileViaApi(page);

    const routine = await createRoutineViaApi(page, {
      name: "E2E Dashboard Reflection Routine",
      customProductName: "E2E Gentle Cleanser",
      instructions: "Use gently for dashboard reflection.",
    });
    const localDate = await getBrowserLocalDate(page);
    const timezone = await getBrowserTimezone(page);

    await markRoutineCompletedViaApi(page, routine, { localDate, timezone });
    await createSkinJournalViaApi(page, {
      localDate: "2099-01-31",
      notes: "E2E dashboard reflection journal note",
      observations: ["E2E dashboard reflection observation"],
      timezone,
    });
    await runRoutineAnalysisViaApi(page, routine.id);

    const dashboardResponsePromise = waitForDashboardResponse(page);

    await page.goto("/dashboard");

    expect((await dashboardResponsePromise).ok()).toBe(true);
    await expect(page.getByRole("heading", { name: "SkinWise overview" })).toBeVisible();
    await expect(page.getByTestId("dashboard-skin-profile-card")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId("dashboard-routine-progress-card")).toBeVisible();
    await expect(page.getByTestId("dashboard-routine-summary-card")).toBeVisible();
    await expect(
      page.getByTestId("dashboard-routine-coverage-summary-card"),
    ).toBeVisible();
    await expect(page.getByText("Tổng quan routine")).toBeVisible();
    await expect(
      page.getByTestId("dashboard-saved-product-tags-summary-card"),
    ).toBeVisible();
    await expect(
      page.getByTestId("dashboard-saved-product-decision-queue-card"),
    ).toBeVisible();
    await expect(
      page.getByText("Phân loại sản phẩm đã lưu", { exact: true }),
    ).toBeVisible();
    await expect(page.getByTestId("dashboard-latest-journal-card")).toBeVisible();
    await expect(page.getByTestId("dashboard-latest-analysis-card")).toBeVisible();
    await expect(page.getByTestId("dashboard-onboarding-progress-card")).toBeVisible();
    await expect(page.getByTestId("dashboard-routine-progress-card")).toContainText(
      "Hoàn thành",
    );
    await expect(page.getByTestId("dashboard-latest-analysis-card")).toContainText(
      routine.name,
    );
    await expect(page.getByTestId("dashboard-latest-journal-card")).toContainText(
      "E2E dashboard reflection observation",
    );
  });
});
