import { expect, test, type Page } from "@playwright/test";

import { loginAsE2EUser } from "./helpers/auth";

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

test.describe("SkinWise VN authenticated products", () => {
  test("authenticated user can browse products and open product detail", async ({
    page,
  }) => {
    await loginAsE2EUser(page);

    const productsResponsePromise = waitForProductsResponse(page);

    await page.goto("/products");

    const productsResponse = await productsResponsePromise;

    expect(productsResponse.ok()).toBe(true);

    await expect(page).not.toHaveURL(/\/api\/auth\/signin/);
    await expect(
      page.getByRole("heading", { name: "Sản phẩm skincare" }),
    ).toBeVisible();
    await expect(
      page.getByText("Catalogue tham khảo", { exact: true }),
    ).toBeVisible();

    const firstDetailLink = page
      .getByRole("link", { name: "Xem chi tiết" })
      .first();

    await expect(firstDetailLink).toBeVisible({ timeout: 15_000 });
    await firstDetailLink.click();

    await expect(page).toHaveURL(/\/products\/[a-f\d]{24}$/i, {
      timeout: 15_000,
    });

    await expect(page).not.toHaveURL(/\/api\/auth\/signin/);
    await expect(
      page.getByText("Educational product details", { exact: true }),
    ).toBeVisible();

    const productInformationCard = page.getByRole("article").filter({
      hasText: "Product information",
    });

    await expect(productInformationCard).toBeVisible();
    await expect(
      productInformationCard.getByText("Product information", {
        exact: true,
      }),
    ).toBeVisible();
    await expect(
      productInformationCard.getByText("Ingredients", { exact: true }),
    ).toBeVisible();
  });
});