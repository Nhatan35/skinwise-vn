import { expect, test, type Page } from "@playwright/test";

import { loginAsE2EAdmin, loginAsE2EUser } from "./helpers/auth";
import {
  ADMIN_CREATE_EDIT_SMOKE_PRODUCT,
  ADMIN_SMOKE_PRODUCT,
} from "./helpers/test-data";

type ApiEnvelope<TData> =
  | {
      data: TData;
      error: null;
    }
  | {
      data: null;
      error: {
        code: string;
        message: string;
      };
    };

type ProductDto = {
  id: string;
  brand: string;
  name: string;
  verificationStatus: "reviewed" | "unverified" | "verified";
};

const secretExposurePatterns = [
  "AUTH_SECRET",
  "AUTH_GOOGLE_SECRET",
  "CLOUDINARY_API_SECRET",
  "MONGODB_URI",
  "mongodb://",
  "mongodb+srv://",
  "sessionToken",
] as const;

function adminProductsResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        url.pathname === "/api/admin/products" &&
        response.request().method() === "GET"
      );
    },
    { timeout: 15_000 },
  );
}

function adminProductPatchResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        /^\/api\/admin\/products\/[a-f\d]{24}\/verification-status$/i.test(
          url.pathname,
        ) && response.request().method() === "PATCH"
      );
    },
    { timeout: 15_000 },
  );
}

function adminProductCreateResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        url.pathname === "/api/admin/products" &&
        response.request().method() === "POST"
      );
    },
    { timeout: 15_000 },
  );
}

function adminProductContentPatchResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        /^\/api\/admin\/products\/[a-f\d]{24}$/i.test(url.pathname) &&
        response.request().method() === "PATCH"
      );
    },
    { timeout: 15_000 },
  );
}

async function getAdminProducts(page: Page, query = "") {
  const response = await page.request.get(`/api/admin/products${query}`);

  expect(response.status()).toBe(200);

  const body = (await response.json()) as ApiEnvelope<{ items: ProductDto[] }>;

  expect(body.error).toBeNull();

  return body.data?.items ?? [];
}

async function getSmokeProduct(page: Page) {
  const products = await getAdminProducts(
    page,
    `?q=${encodeURIComponent(ADMIN_SMOKE_PRODUCT.name)}`,
  );
  const product = products.find(
    (item) =>
      item.brand === ADMIN_SMOKE_PRODUCT.brand &&
      item.name === ADMIN_SMOKE_PRODUCT.name,
  );

  expect(product).toBeDefined();

  return product as ProductDto;
}

async function getAdminProductByName(page: Page, name: string) {
  const products = await getAdminProducts(
    page,
    `?q=${encodeURIComponent(name)}`,
  );
  const product = products.find((item) => item.name === name);

  expect(product).toBeDefined();

  return product as ProductDto;
}

async function getPublicProducts(page: Page, query: string) {
  const response = await page.request.get(
    `/api/products?q=${encodeURIComponent(query)}&limit=50`,
  );

  expect(response.status()).toBe(200);

  const body = (await response.json()) as ApiEnvelope<{ items: ProductDto[] }>;

  expect(body.error).toBeNull();

  return body.data?.items ?? [];
}

async function chooseSelectOption(
  page: Page,
  triggerTestId: string,
  optionTestId: string,
) {
  await page.getByTestId(triggerTestId).click();
  await page.getByTestId(optionTestId).click();
}

async function fillAdminProductLiteForm(page: Page) {
  await page.locator("#admin-product-name").fill(ADMIN_CREATE_EDIT_SMOKE_PRODUCT.name);
  await page
    .locator("#admin-product-brand")
    .fill(ADMIN_CREATE_EDIT_SMOKE_PRODUCT.brand);
  await chooseSelectOption(
    page,
    "admin-product-category-select",
    "admin-product-category-option-serum",
  );
  await chooseSelectOption(
    page,
    "admin-product-price-range-select",
    "admin-product-price-range-option-budget",
  );
  await page
    .locator("#admin-product-ingredients-text")
    .fill("Water\nGlycerin\nPanthenol");
  await page.locator("#admin-product-key-actives").fill("Panthenol");
  await page.locator("#admin-product-tags").fill("admin-lite-smoke");
  await page
    .locator("#admin-product-warnings")
    .fill("Smoke-test product only.");
  await page
    .locator("#admin-product-suitable-for")
    .fill("admin create edit smoke testing");
  await page
    .locator("#admin-product-not-recommended-for")
    .fill("public users before review");
  await page.getByTestId("admin-product-skin-type-sensitive").check();
  await page.getByTestId("admin-product-concern-barrier_support").check();
}

async function submitSearch(page: Page, query: string) {
  const responsePromise = adminProductsResponse(page);

  await page.getByLabel("Search products").fill(query);
  await page.getByRole("button", { name: "Search admin products" }).click();

  const response = await responsePromise;

  expect(response.ok()).toBe(true);
}

test.describe("Admin product review smoke", () => {
  test("unauthenticated users are redirected cleanly without seeing admin data", async ({
    page,
  }) => {
    const criticalResponses: string[] = [];

    page.on("response", (response) => {
      if (response.status() >= 500) {
        criticalResponses.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto("/admin/products");

    await expect(page).toHaveURL((url) => {
      const callbackUrl = url.searchParams.get("callbackUrl") ?? "";

      return (
        url.pathname === "/api/auth/signin" &&
        callbackUrl.includes("/admin/products")
      );
    });
    await expect(page.getByText("Admin Product Review")).not.toBeVisible();
    expect(criticalResponses).toEqual([]);
  });

  test("non-admin users cannot view admin product data", async ({ page }) => {
    await loginAsE2EUser(page);

    await page.goto("/admin/products");

    await expect(page.getByText("Admin access required")).toBeVisible();
    await expect(
      page.getByText(
        "Product review data is not shown for this account.",
      ),
    ).toBeVisible();
    await expect(page.getByText(ADMIN_SMOKE_PRODUCT.name)).not.toBeVisible();

    const adminApiResponse = await page.request.get("/api/admin/products");

    expect(adminApiResponse.status()).toBe(403);
  });

  test("admin can review, filter, update, revert, and keep public visibility safe", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const criticalResponses: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => {
      consoleErrors.push(error.message);
    });
    page.on("response", (response) => {
      const url = new URL(response.url());

      if (
        response.status() >= 500 &&
        (url.pathname.startsWith("/api/admin/products") ||
          url.pathname.startsWith("/api/products") ||
          url.pathname === "/admin/products")
      ) {
        criticalResponses.push(`${response.status()} ${url.pathname}`);
      }
    });

    await loginAsE2EAdmin(page);

    const listResponsePromise = adminProductsResponse(page);

    await page.goto("/admin/products");

    expect((await listResponsePromise).ok()).toBe(true);
    await expect(
      page.getByRole("heading", { name: "Admin Product Review" }),
    ).toBeVisible();
    await expect(page.getByTestId("admin-product-review-list")).toBeVisible();
    const smokeRow = page
      .getByTestId("admin-product-review-row")
      .filter({ hasText: ADMIN_SMOKE_PRODUCT.name });

    await expect(smokeRow).toBeVisible();
    await expect(smokeRow.getByText("Pending review").first()).toBeVisible();
    await expect(page.getByText("Loading admin product review queue")).toHaveCount(
      0,
    );

    const initialProduct = await getSmokeProduct(page);

    expect(initialProduct.verificationStatus).toBe("unverified");

    await submitSearch(page, ADMIN_SMOKE_PRODUCT.name);
    await expect(page.getByText(ADMIN_SMOKE_PRODUCT.name)).toBeVisible();

    await submitSearch(page, "no-admin-smoke-product-should-match");
    await expect(
      page.getByText("No products match this review filter"),
    ).toBeVisible();

    const clearResponsePromise = adminProductsResponse(page);

    await page.getByRole("button", { name: "Clear admin product filters" }).click();
    expect((await clearResponsePromise).ok()).toBe(true);

    await chooseSelectOption(
      page,
      "admin-product-status-filter-select",
      "admin-product-status-filter-option-unverified",
    );

    const filterResponsePromise = adminProductsResponse(page);

    await page.getByRole("button", { name: "Search admin products" }).click();
    expect((await filterResponsePromise).ok()).toBe(true);
    await expect(page.getByText(ADMIN_SMOKE_PRODUCT.name)).toBeVisible();

    const product = await getSmokeProduct(page);
    const updateTriggerTestId = `admin-product-status-select-${product.id}`;
    const reviewedOptionTestId = `admin-product-status-option-${product.id}-reviewed`;
    const unverifiedOptionTestId = `admin-product-status-option-${product.id}-unverified`;

    try {
      const updateResponsePromise = adminProductPatchResponse(page);

      await chooseSelectOption(page, updateTriggerTestId, reviewedOptionTestId);

      expect((await updateResponsePromise).ok()).toBe(true);
      await expect(page.getByText("Status updated")).toBeVisible();
      await expect(page.getByText(`${ADMIN_SMOKE_PRODUCT.name} is now Reviewed.`)).toBeVisible();

      const updatedProduct = await getSmokeProduct(page);

      expect(updatedProduct.verificationStatus).toBe("reviewed");

      const revertResponsePromise = adminProductPatchResponse(page);

      await chooseSelectOption(page, updateTriggerTestId, unverifiedOptionTestId);

      expect((await revertResponsePromise).ok()).toBe(true);
      await expect(
        page.getByText(`${ADMIN_SMOKE_PRODUCT.name} is now Pending review.`),
      ).toBeVisible();
    } finally {
      const finalProduct = await getSmokeProduct(page);

      if (finalProduct.verificationStatus !== "unverified") {
        const response = await page.request.patch(
          `/api/admin/products/${finalProduct.id}/verification-status`,
          {
            data: {
              verificationStatus: "unverified",
            },
          },
        );

        expect(response.ok()).toBe(true);
      }
    }

    const finalProduct = await getSmokeProduct(page);

    expect(finalProduct.verificationStatus).toBe("unverified");

    const publicProductsResponse = await page.request.get("/api/products?limit=50");

    expect(publicProductsResponse.status()).toBe(200);

    const publicProductsBody =
      (await publicProductsResponse.json()) as ApiEnvelope<{
        items: ProductDto[];
      }>;
    const publicProducts = publicProductsBody.data?.items ?? [];

    expect(publicProducts.some((item) => item.name === ADMIN_SMOKE_PRODUCT.name)).toBe(
      false,
    );
    expect(publicProducts.every((item) => item.verificationStatus !== "unverified")).toBe(
      true,
    );

    const bodyText = await page.locator("body").innerText();

    for (const pattern of secretExposurePatterns) {
      expect(bodyText).not.toContain(pattern);
    }
    expect(consoleErrors).toEqual([]);
    expect(criticalResponses).toEqual([]);
  });

  test("admin can create and edit lite products while public visibility follows review status", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const criticalResponses: string[] = [];

    page.on("console", (message) => {
      if (message.type() === "error") {
        consoleErrors.push(message.text());
      }
    });
    page.on("pageerror", (error) => {
      consoleErrors.push(error.message);
    });
    page.on("response", (response) => {
      const url = new URL(response.url());

      if (
        response.status() >= 500 &&
        (url.pathname.startsWith("/api/admin/products") ||
          url.pathname.startsWith("/api/products") ||
          url.pathname === "/admin/products")
      ) {
        criticalResponses.push(`${response.status()} ${url.pathname}`);
      }
    });

    await loginAsE2EAdmin(page);

    const listResponsePromise = adminProductsResponse(page);

    await page.goto("/admin/products");

    expect((await listResponsePromise).ok()).toBe(true);
    await page.getByRole("button", { name: "Create Product" }).click();
    await expect(page.getByTestId("admin-product-form")).toBeVisible();
    await expect(
      page.getByTestId("admin-product-form-panel").getByText("Tạo sản phẩm"),
    ).toBeVisible();

    await fillAdminProductLiteForm(page);

    const createResponsePromise = adminProductCreateResponse(page);

    await page.getByRole("button", { name: "Lưu sản phẩm" }).click();
    expect((await createResponsePromise).ok()).toBe(true);
    await expect(page.getByText("Tạo sản phẩm thành công")).toBeVisible();
    await expect(page.getByText(ADMIN_CREATE_EDIT_SMOKE_PRODUCT.name)).toBeVisible();

    const createdProduct = await getAdminProductByName(
      page,
      ADMIN_CREATE_EDIT_SMOKE_PRODUCT.name,
    );

    expect(createdProduct.verificationStatus).toBe("unverified");

    const hiddenPublicProducts = await getPublicProducts(
      page,
      ADMIN_CREATE_EDIT_SMOKE_PRODUCT.name,
    );

    expect(
      hiddenPublicProducts.some(
        (item) => item.name === ADMIN_CREATE_EDIT_SMOKE_PRODUCT.name,
      ),
    ).toBe(false);

    const createdRow = page
      .getByTestId("admin-product-review-row")
      .filter({ hasText: ADMIN_CREATE_EDIT_SMOKE_PRODUCT.name });

    await createdRow
      .getByRole("button", {
        name: `Edit ${ADMIN_CREATE_EDIT_SMOKE_PRODUCT.name}`,
      })
      .click();
    await expect(page.getByText("Chỉnh sửa sản phẩm")).toBeVisible();
    await page
      .locator("#admin-product-name")
      .fill(ADMIN_CREATE_EDIT_SMOKE_PRODUCT.editedName);
    await page
      .locator("#admin-product-brand")
      .fill(ADMIN_CREATE_EDIT_SMOKE_PRODUCT.editedBrand);

    const updateResponsePromise = adminProductContentPatchResponse(page);

    await page.getByRole("button", { name: "Lưu sản phẩm" }).click();
    expect((await updateResponsePromise).ok()).toBe(true);
    await expect(page.getByText("Cập nhật sản phẩm thành công")).toBeVisible();
    await expect(
      page.getByText(ADMIN_CREATE_EDIT_SMOKE_PRODUCT.editedName),
    ).toBeVisible();

    const editedProduct = await getAdminProductByName(
      page,
      ADMIN_CREATE_EDIT_SMOKE_PRODUCT.editedName,
    );
    const reviewedOptionTestId = `admin-product-status-option-${editedProduct.id}-reviewed`;
    const statusTriggerTestId = `admin-product-status-select-${editedProduct.id}`;

    try {
      const statusResponsePromise = adminProductPatchResponse(page);

      await chooseSelectOption(page, statusTriggerTestId, reviewedOptionTestId);
      expect((await statusResponsePromise).ok()).toBe(true);
      await expect(page.getByText("Status updated")).toBeVisible();

      const publicProducts = await getPublicProducts(
        page,
        ADMIN_CREATE_EDIT_SMOKE_PRODUCT.editedName,
      );

      expect(
        publicProducts.some(
          (item) => item.name === ADMIN_CREATE_EDIT_SMOKE_PRODUCT.editedName,
        ),
      ).toBe(true);
      expect(
        publicProducts.every(
          (item) => item.verificationStatus !== "unverified",
        ),
      ).toBe(true);
    } finally {
      const response = await page.request.patch(
        `/api/admin/products/${editedProduct.id}/verification-status`,
        {
          data: {
            verificationStatus: "unverified",
          },
        },
      );

      expect(response.ok()).toBe(true);
    }

    const bodyText = await page.locator("body").innerText();

    for (const pattern of secretExposurePatterns) {
      expect(bodyText).not.toContain(pattern);
    }
    expect(consoleErrors).toEqual([]);
    expect(criticalResponses).toEqual([]);
  });
});
