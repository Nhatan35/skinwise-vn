import { expect, test, type Page } from "@playwright/test";

import { loginAsE2EUser } from "./helpers/auth";

const deterministicProductName = "Niacinamide 5% Serum";

type ProductsApiResponse = {
  data?: {
    items?: Array<{
      id: string;
      name: string;
    }>;
  } | null;
  error?: unknown;
};

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

function waitForProductDetailResponse(page: Page, productId: string) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        url.pathname === `/api/products/${productId}` &&
        response.request().method() === "GET"
      );
    },
    { timeout: 15_000 },
  );
}

function waitForSavedProductsResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        url.pathname === "/api/saved-products" &&
        response.request().method() === "GET"
      );
    },
    { timeout: 15_000 },
  );
}

function waitForSaveProductResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        url.pathname === "/api/saved-products" &&
        response.request().method() === "POST"
      );
    },
    { timeout: 15_000 },
  );
}

function waitForRemoveSavedProductResponse(page: Page, productId: string) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        url.pathname === `/api/saved-products/${productId}` &&
        response.request().method() === "DELETE"
      );
    },
    { timeout: 15_000 },
  );
}

async function getSeededProduct(page: Page) {
  const response = await page.request.get(
    `/api/products?q=${encodeURIComponent(deterministicProductName)}&limit=50`,
  );

  expect(response.ok()).toBe(true);

  const body = (await response.json()) as ProductsApiResponse;
  const product = body.data?.items?.find(
    (item) => item.name === deterministicProductName,
  );

  expect(product).toBeTruthy();

  if (!product) {
    throw new Error(`${deterministicProductName} seed product was not found.`);
  }

  return product;
}

async function getSeededProducts(page: Page, minimumCount: number) {
  const response = await page.request.get("/api/products?limit=50");

  expect(response.ok()).toBe(true);

  const body = (await response.json()) as ProductsApiResponse;
  const products = body.data?.items ?? [];

  expect(products.length).toBeGreaterThanOrEqual(minimumCount);

  return products.slice(0, minimumCount);
}

async function removeSavedProductIfPresent(page: Page, productId: string) {
  const response = await page.request.delete(`/api/saved-products/${productId}`);

  expect(response.status()).toBeLessThan(500);
}

async function saveProductForTest(page: Page, productId: string) {
  const response = await page.request.post("/api/saved-products", {
    data: { productId },
  });

  expect(response.ok()).toBe(true);
}

test.describe("SkinWise VN authenticated saved products", () => {
  test("authenticated user can save, view, and remove a product", async ({
    page,
  }) => {
    await loginAsE2EUser(page);

    const product = await getSeededProduct(page);
    const cleanupResponse = await page.request.delete(
      `/api/saved-products/${product.id}`,
    );

    expect(cleanupResponse.status()).toBeLessThan(500);

    const productsResponsePromise = waitForProductsResponse(page);

    await page.goto("/products");

    expect((await productsResponsePromise).ok()).toBe(true);
    await expect(
      page.getByRole("heading", { name: "Sản phẩm skincare" }),
    ).toBeVisible();

    const searchResponsePromise = waitForProductsResponse(page);

    await page.getByLabel("Tìm kiếm").fill(deterministicProductName);
    await page.getByRole("button", { name: "Tìm sản phẩm" }).click();

    expect((await searchResponsePromise).ok()).toBe(true);

    const productCard = page
      .getByTestId("product-card")
      .filter({ hasText: deterministicProductName })
      .first();

    await expect(productCard).toBeVisible({ timeout: 15_000 });

    const saveResponsePromise = waitForSaveProductResponse(page);

    await productCard.getByTestId("save-product-button").click();

    expect((await saveResponsePromise).ok()).toBe(true);

    const savedListResponsePromise = waitForSavedProductsResponse(page);

    await page.goto("/saved-products");

    expect((await savedListResponsePromise).ok()).toBe(true);
    await expect(
      page.getByRole("heading", { name: "Sản phẩm đã lưu", exact: true }),
    ).toBeVisible();

    const savedCard = page
      .getByTestId("saved-product-card")
      .filter({ hasText: deterministicProductName })
      .first();

    await expect(savedCard).toBeVisible({ timeout: 15_000 });

    const detailResponsePromise = waitForProductDetailResponse(page, product.id);
    const detailSavedStateResponsePromise = waitForSavedProductsResponse(page);

    await savedCard.getByRole("link", { name: "Xem chi tiết" }).click();

    expect((await detailResponsePromise).ok()).toBe(true);
    expect((await detailSavedStateResponsePromise).ok()).toBe(true);
    await expect(page).toHaveURL(new RegExp(`/products/${product.id}$`), {
      timeout: 15_000,
    });
    await expect(
      page.getByText(deterministicProductName, { exact: true }),
    ).toBeVisible();
    const removeSavedProductButton = page
      .getByTestId("remove-saved-product-button")
      .first();

    await expect(removeSavedProductButton).toBeVisible();

    const removeResponsePromise = waitForRemoveSavedProductResponse(
      page,
      product.id,
    );

    await removeSavedProductButton.click();

    expect((await removeResponsePromise).ok()).toBe(true);

    const savedListAfterRemovalResponsePromise =
      waitForSavedProductsResponse(page);

    await page.goto("/saved-products");

    expect((await savedListAfterRemovalResponsePromise).ok()).toBe(true);
    await expect(
      page
        .getByTestId("saved-product-card")
        .filter({ hasText: deterministicProductName }),
    ).toHaveCount(0);
  });

  test("authenticated user can compare and clear two saved products", async ({
    page,
  }) => {
    await loginAsE2EUser(page);

    const products = await getSeededProducts(page, 2);

    try {
      for (const product of products) {
        await removeSavedProductIfPresent(page, product.id);
        await saveProductForTest(page, product.id);
      }

      const savedListResponsePromise = waitForSavedProductsResponse(page);

      await page.goto("/saved-products");

      expect((await savedListResponsePromise).ok()).toBe(true);
      await expect(
        page.getByRole("heading", { name: "Sản phẩm đã lưu", exact: true }),
      ).toBeVisible();

      for (const product of products) {
        const savedCard = page
          .getByTestId("saved-product-card")
          .filter({ hasText: product.name })
          .first();

        await expect(savedCard).toBeVisible({ timeout: 15_000 });
        await savedCard.getByTestId("saved-product-comparison-toggle").click();
      }

      await expect(
        page.getByTestId("saved-products-comparison-panel"),
      ).toBeVisible();
      await expect(
        page.getByText("So sánh sản phẩm đã lưu", { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText(
          "Thông tin chỉ mang tính giáo dục, không thay thế tư vấn y khoa.",
        ),
      ).toBeVisible();

      await page.getByTestId("clear-saved-products-comparison").click();

      await expect(
        page.getByTestId("saved-products-comparison-panel"),
      ).toHaveCount(0);
    } finally {
      for (const product of products) {
        await removeSavedProductIfPresent(page, product.id);
      }
    }
  });
});
