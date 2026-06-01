import { expect, test, type Page } from "@playwright/test";

import { loginAsE2EUser } from "./helpers/auth";
import { createRoutineViaApi } from "./helpers/core-journey";

function waitForRoutinesResponse(page: Page, method: string) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        url.pathname === "/api/routines" &&
        response.request().method() === method
      );
    },
    { timeout: 15_000 },
  );
}

function waitForRoutineAnalysisResponse(page: Page, routineId: string) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        url.pathname === `/api/routines/${routineId}/analyze` &&
        response.request().method() === "POST"
      );
    },
    { timeout: 15_000 },
  );
}

async function chooseSelectOption(
  page: Page,
  selectTestId: string,
  optionTestId: string,
) {
  await page.getByTestId(selectTestId).click();
  await page.getByTestId(optionTestId).click();
}

test.describe("SkinWise VN authenticated routines", () => {
  test("authenticated user can create a routine", async ({ page }) => {
    await loginAsE2EUser(page);

    const loadResponsePromise = waitForRoutinesResponse(page, "GET");

    await page.goto("/routines");

    expect((await loadResponsePromise).ok()).toBe(true);
    await expect(page).not.toHaveURL(/\/api\/auth\/signin/);
    await expect(
      page.getByRole("heading", { name: "Xây dựng routine chăm sóc da" }),
    ).toBeVisible();

    await page.getByTestId("routine-create-button").first().click();
    await expect(page.getByTestId("routine-form")).toBeVisible();

    await page.getByTestId("routine-name-input").fill("E2E Morning Routine");

    await chooseSelectOption(
      page,
      "routine-time-of-day-select",
      "routine-time-of-day-option-morning",
    );

    await chooseSelectOption(
      page,
      "step-category-0-select",
      "step-category-0-option-cleanser",
    );

    await chooseSelectOption(
      page,
      "step-frequency-0-select",
      "step-frequency-0-option-daily",
    );

    await page
      .getByTestId("routine-step-product-input")
      .fill("E2E Gentle Cleanser");

    await page
      .getByTestId("routine-step-instructions-input")
      .fill("Use gently in the morning.");

    const createResponsePromise = waitForRoutinesResponse(page, "POST");

    await page.getByTestId("routine-save-button").click();

    expect((await createResponsePromise).ok()).toBe(true);

    const routineCard = page
      .getByTestId("routine-card")
      .filter({ hasText: "E2E Morning Routine" })
      .first();

    await expect(routineCard).toBeVisible({ timeout: 15_000 });
    await expect(routineCard.getByText("E2E Gentle Cleanser")).toBeVisible();
  });

  test("authenticated user can run routine analysis", async ({ page }) => {
    const duplicateKeyWarnings: string[] = [];

    page.on("console", (message) => {
      const text = message.text();

      if (
        (message.type() === "warning" || message.type() === "error") &&
        text.includes("Encountered two children with the same key") &&
        text.includes("Gợi ý tham khảo")
      ) {
        duplicateKeyWarnings.push(text);
      }
    });

    await loginAsE2EUser(page);

    const routine = await createRoutineViaApi(page, {
      name: "E2E Analysis Routine",
      customProductName: "E2E Gentle Cleanser",
      instructions: "Use gently before sunscreen.",
    });

    const loadResponsePromise = waitForRoutinesResponse(page, "GET");

    await page.goto("/routines");

    expect((await loadResponsePromise).ok()).toBe(true);

    const routineCard = page
      .getByTestId("routine-card")
      .filter({ hasText: routine.name })
      .first();

    await expect(routineCard).toBeVisible({ timeout: 15_000 });

    const analysisResponsePromise = waitForRoutineAnalysisResponse(
      page,
      routine.id,
    );

    await routineCard.getByTestId("routine-analyze-button").click();

    expect((await analysisResponsePromise).ok()).toBe(true);

    const latestAnalysisResult = routineCard
      .getByTestId("routine-analysis-result")
      .first();

    await expect(latestAnalysisResult).toBeVisible({ timeout: 15_000 });

    await expect(
      routineCard.getByText("Kết quả kiểm tra mới nhất"),
    ).toBeVisible();
    await expect(latestAnalysisResult.getByText("Điểm ổn")).toBeVisible();
    await expect(latestAnalysisResult.getByText("Cần lưu ý")).toBeVisible();
    await expect(
      latestAnalysisResult.getByText("Gợi ý chỉnh sửa"),
    ).toBeVisible();
    await expect(
      latestAnalysisResult.getByText("Thông tin tham khảo"),
    ).toBeVisible();

    expect(duplicateKeyWarnings).toEqual([]);
  });
});
