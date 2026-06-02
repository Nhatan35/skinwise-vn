import { expect, test, type Page } from "@playwright/test";

import { loginAsE2EUser } from "./helpers/auth";
import { ensureSkinProfileViaApi } from "./helpers/core-journey";

function waitForProductsResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        url.pathname === "/api/products" &&
        response.request().method() === "GET"
      );
    },
    { timeout: 15_000 },
  );
}

function waitForProductDetailMatchResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        /^\/api\/products\/[a-f\d]{24}\/match$/i.test(url.pathname) &&
        response.request().method() === "GET"
      );
    },
    { timeout: 15_000 },
  );
}

test.describe("SkinWise VN authenticated products", () => {
  test("authenticated user can browse products and open product detail", async ({
    page,
  }) => {
    await loginAsE2EUser(page);
    await ensureSkinProfileViaApi(page);

    const productsResponsePromise = waitForProductsResponse(page);

    await page.goto("/products");

    const productsResponse = await productsResponsePromise;

    expect(productsResponse.ok()).toBe(true);

    await expect(page).not.toHaveURL(/\/api\/auth\/signin/);

    const firstDetailLink = page.locator('a[href^="/products/"]').first();

    await expect(firstDetailLink).toBeVisible({ timeout: 15_000 });
    const productDetailMatchResponsePromise =
      waitForProductDetailMatchResponse(page);
    await firstDetailLink.click();

    await expect(page).toHaveURL(/\/products\/[a-f\d]{24}$/i, {
      timeout: 15_000,
    });
    expect((await productDetailMatchResponsePromise).ok()).toBe(true);

    await expect(page).not.toHaveURL(/\/api\/auth\/signin/);
    await expect(page.locator("#product-detail-personalized-match")).toBeVisible();

    const personalizedMatchSection = page.getByTestId(
      "product-match-explanation-card",
    );

    await expect(personalizedMatchSection).toBeVisible();
    await expect(
      personalizedMatchSection.getByTestId("product-match-explanation-summary"),
    ).toBeVisible();
    await expect(
      personalizedMatchSection.getByTestId("product-match-reasons"),
    ).toBeVisible();
    await expect(
      personalizedMatchSection.getByTestId("product-match-cautions"),
    ).toBeVisible();
    await expect(
      personalizedMatchSection.getByTestId("product-match-ingredient-highlights"),
    ).toBeVisible();

    const productInformationCard = page.getByRole("article");

    await expect(productInformationCard).toBeVisible();
  });
});
