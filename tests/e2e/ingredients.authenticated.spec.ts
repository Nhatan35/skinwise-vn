import { expect, test, type Page } from "@playwright/test";

import { loginAsE2EUser } from "./helpers/auth";

function waitForIngredientsResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        url.pathname === "/api/ingredients" &&
        response.request().method() === "GET"
      );
    },
    { timeout: 15_000 },
  );
}

function waitForIngredientDetailResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        /^\/api\/ingredients\/[a-f\d]{24}$/i.test(url.pathname) &&
        response.request().method() === "GET"
      );
    },
    { timeout: 15_000 },
  );
}

function waitForIngredientExplanationResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        url.pathname === "/api/ingredients/explain" &&
        response.request().method() === "POST"
      );
    },
    { timeout: 15_000 },
  );
}

test.describe("SkinWise VN authenticated ingredients", () => {
  test("authenticated user can browse, search, open, and explain an ingredient", async ({
    page,
  }) => {
    await loginAsE2EUser(page);

    const ingredientsResponsePromise = waitForIngredientsResponse(page);

    await page.goto("/ingredients");

    const ingredientsResponse = await ingredientsResponsePromise;

    expect(ingredientsResponse.ok()).toBe(true);

    await expect(page).not.toHaveURL(/\/api\/auth\/signin/);
    await expect(
      page.getByRole("heading", { name: "Thành phần chăm sóc da" }),
    ).toBeVisible();
    await expect(page.getByTestId("ingredient-card").first()).toBeVisible({
      timeout: 15_000,
    });

    const searchResponsePromise = waitForIngredientsResponse(page);

    await page.getByTestId("ingredient-search").fill("Niacinamide");
    await page.getByRole("button", { name: "Tìm thành phần" }).click();

    const searchResponse = await searchResponsePromise;

    expect(searchResponse.ok()).toBe(true);

    const niacinamideCard = page
      .getByTestId("ingredient-card")
      .filter({ hasText: "Niacinamide" })
      .first();

    await expect(niacinamideCard).toBeVisible({ timeout: 15_000 });

    const detailResponsePromise = waitForIngredientDetailResponse(page);

    await niacinamideCard.getByRole("link", { name: "Xem chi tiết" }).click();

    const detailResponse = await detailResponsePromise;

    expect(detailResponse.ok()).toBe(true);

    await expect(page).toHaveURL(/\/ingredients\/[a-f\d]{24}$/i, {
      timeout: 15_000,
    });
    await expect(
      page.getByText("Thông tin thành phần tham khảo", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Niacinamide" }),
    ).toBeVisible();

    const explanationResponsePromise =
      waitForIngredientExplanationResponse(page);

    await page
      .getByRole("button", { name: "Giải thích thành phần này" })
      .click();

    const explanationResponse = await explanationResponsePromise;

    expect(explanationResponse.ok()).toBeTruthy();
    await expect(page.getByText("Giải thích ngắn gọn")).toBeVisible();
    await expect(
      page
        .getByText("AI", { exact: true })
        .or(page.getByText("Phản hồi dự phòng", { exact: true }))
        .first(),
    ).toBeVisible();
  });
});
