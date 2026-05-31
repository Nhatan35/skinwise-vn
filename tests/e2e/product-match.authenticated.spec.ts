import { expect, test, type Page } from "@playwright/test";

import { loginAsE2EUser } from "./helpers/auth";
import { ensureSkinProfileViaApi } from "./helpers/core-journey";

const savedProductsSpecProductName = "Niacinamide 5% Serum";

type ProductMatchApiResponse = {
  data?: {
    items?: Array<{
      product: {
        id: string;
        name: string;
      };
    }>;
    skinProfileExists?: boolean;
  } | null;
  error?: unknown;
};

function waitForProductMatchResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        url.pathname === "/api/product-match" &&
        response.request().method() === "GET"
      );
    },
    { timeout: 15_000 },
  );
}

async function expectSignInRedirect(page: Page, protectedPath: string) {
  await expect(page).toHaveURL((url) => {
    const callbackUrl = url.searchParams.get("callbackUrl") ?? "";

    return (
      url.pathname === "/api/auth/signin" &&
      callbackUrl.includes(protectedPath)
    );
  });
}

async function getFirstMatchedProduct(page: Page) {
  const response = await page.request.get("/api/product-match?limit=12");

  expect(response.ok()).toBe(true);

  const body = (await response.json()) as ProductMatchApiResponse;
  const product =
    body.data?.items?.find(
      (item) => item.product.name !== savedProductsSpecProductName,
    )?.product ?? body.data?.items?.[0]?.product;

  expect(body.data?.skinProfileExists).toBe(true);
  expect(product).toBeTruthy();

  if (!product) {
    throw new Error("No Product Match candidate was returned by test data.");
  }

  return product;
}

test.describe("SkinWise VN Product Match", () => {
  test("unauthenticated users are redirected away from Product Match", async ({
    page,
  }) => {
    await page.goto("/product-match");

    await expectSignInRedirect(page, "/product-match");
  });

  test("authenticated user can review, save, and open a product match", async ({
    page,
  }) => {
    await loginAsE2EUser(page);
    await ensureSkinProfileViaApi(page);

    const product = await getFirstMatchedProduct(page);
    const cleanupResponse = await page.request.delete(
      `/api/saved-products/${product.id}`,
    );

    expect(cleanupResponse.status()).toBeLessThan(500);

    const productMatchResponsePromise = waitForProductMatchResponse(page);

    await page.goto("/product-match");

    expect((await productMatchResponsePromise).ok()).toBe(true);
    await expect(
      page.getByRole("heading", { name: "Product Match" }),
    ).toBeVisible();

    const productCard = page
      .getByTestId("product-match-card")
      .filter({ hasText: product.name })
      .first();

    await expect(productCard).toBeVisible({ timeout: 15_000 });
    await expect(productCard.getByTestId("product-match-score")).toBeVisible();
    await expect(productCard.getByTestId("product-match-level")).toBeVisible();
    await expect(productCard.getByTestId("product-match-reasons")).toBeVisible();
    await expect(productCard.getByTestId("product-match-cautions")).toBeVisible();

    const saveResponsePromise = page.waitForResponse(
      (response) => {
        const url = new URL(response.url());

        return (
          url.pathname === "/api/saved-products" &&
          response.request().method() === "POST"
        );
      },
      { timeout: 15_000 },
    );

    await productCard.getByTestId("save-product-button").click();

    expect((await saveResponsePromise).ok()).toBe(true);
    await expect(
      productCard.getByTestId("remove-saved-product-button"),
    ).toBeVisible();

    await productCard.getByTestId("product-match-view-details-link").click();

    await expect(page).toHaveURL(new RegExp(`/products/${product.id}$`), {
      timeout: 15_000,
    });
    await expect(page.getByText(product.name, { exact: true })).toBeVisible();
  });
});
