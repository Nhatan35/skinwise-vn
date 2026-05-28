import { expect, test, type Page } from "@playwright/test";

import { loginAsE2EUser } from "./helpers/auth";
import {
  createRoutineViaApi,
  getBrowserLocalDate,
  getBrowserTimezone,
  markRoutineCompletedViaApi,
} from "./helpers/core-journey";

function waitForRoutineLogsResponse(page: Page, method: string) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return url.pathname === "/api/routine-logs" && response.request().method() === method;
    },
    { timeout: 15_000 },
  );
}

function waitForTodayPageData(page: Page) {
  return Promise.all([
    page.waitForResponse(
      (response) => {
        const url = new URL(response.url());

        return url.pathname === "/api/routines" && response.request().method() === "GET";
      },
      { timeout: 15_000 },
    ),
    page.waitForResponse(
      (response) => {
        const url = new URL(response.url());

        return url.pathname === "/api/routine-logs" && response.request().method() === "GET";
      },
      { timeout: 15_000 },
    ),
  ]);
}

function waitForRoutineLogDeleteResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        /^\/api\/routine-logs\/[a-f\d]{24}$/i.test(url.pathname) &&
        response.request().method() === "DELETE"
      );
    },
    { timeout: 15_000 },
  );
}

test.describe("SkinWise VN authenticated today routine log", () => {
  test("authenticated user can mark a routine as completed for today", async ({ page }) => {
    await loginAsE2EUser(page);

    const routine = await createRoutineViaApi(page, {
      name: "E2E Today Completed Routine",
      customProductName: "E2E Gentle Cleanser",
    });

    const todayDataPromise = waitForTodayPageData(page);

    await page.goto("/routine-logs/today");

    const [routinesResponse, routineLogsResponse] = await todayDataPromise;

    expect(routinesResponse.ok()).toBe(true);
    expect(routineLogsResponse.ok()).toBe(true);

    await expect(page.getByTestId("today-routine-checklist")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByText("Ngày hôm nay")).toBeVisible();
    await expect(page.getByText("Múi giờ")).toBeVisible();

    const routineCard = page
      .getByTestId("today-routine-card")
      .filter({ hasText: routine.name })
      .first();

    await expect(routineCard).toBeVisible({ timeout: 15_000 });
    await expect(routineCard.getByTestId("today-routine-status-badge")).toContainText(
      "Chưa ghi nhận",
    );

    const saveLogResponsePromise = waitForRoutineLogsResponse(page, "PUT");

    await routineCard.getByTestId("routine-log-completed-button").click();

    expect((await saveLogResponsePromise).ok()).toBe(true);
    await expect(routineCard.getByTestId("today-routine-status-badge")).toContainText(
      "Hoàn thành",
      { timeout: 15_000 },
    );
    await expect(page.getByTestId("today-progress-summary")).toContainText("Hoàn thành");
  });

  test("authenticated user can delete today's routine log", async ({ page }) => {
    await loginAsE2EUser(page);

    const routine = await createRoutineViaApi(page, {
      name: "E2E Today Delete Log Routine",
      customProductName: "E2E Gentle Cleanser",
    });
    const localDate = await getBrowserLocalDate(page);
    const timezone = await getBrowserTimezone(page);

    await markRoutineCompletedViaApi(page, routine, { localDate, timezone });

    const todayDataPromise = waitForTodayPageData(page);

    await page.goto("/routine-logs/today");

    const [routinesResponse, routineLogsResponse] = await todayDataPromise;

    expect(routinesResponse.ok()).toBe(true);
    expect(routineLogsResponse.ok()).toBe(true);

    const routineCard = page
      .getByTestId("today-routine-card")
      .filter({ hasText: routine.name })
      .first();

    await expect(routineCard).toBeVisible({ timeout: 15_000 });
    await expect(routineCard.getByTestId("today-routine-status-badge")).toContainText(
      "Hoàn thành",
    );

    page.once("dialog", (dialog) => dialog.accept());

    const deleteResponsePromise = waitForRoutineLogDeleteResponse(page);

    await routineCard.getByTestId("routine-log-delete-button").click();

    expect((await deleteResponsePromise).ok()).toBe(true);
    await expect(routineCard.getByTestId("today-routine-status-badge")).toContainText(
      "Chưa ghi nhận",
      { timeout: 15_000 },
    );
    await expect(routineCard.getByTestId("routine-log-delete-button")).toHaveCount(0);
  });
});
