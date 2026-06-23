import { expect, test, type Page } from "@playwright/test";

import { loginAsE2EAdmin, loginAsE2EUser } from "./helpers/auth";
import { ADMIN_CREATE_EDIT_SMOKE_INGREDIENT } from "./helpers/test-data";

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

type IngredientDto = {
  id: string;
  inciName: string;
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

function adminIngredientsResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        url.pathname === "/api/admin/ingredients" &&
        response.request().method() === "GET"
      );
    },
    { timeout: 15_000 },
  );
}

function adminIngredientCreateResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        url.pathname === "/api/admin/ingredients" &&
        response.request().method() === "POST"
      );
    },
    { timeout: 15_000 },
  );
}

function adminIngredientPatchResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        /^\/api\/admin\/ingredients\/[a-f\d]{24}$/i.test(url.pathname) &&
        response.request().method() === "PATCH"
      );
    },
    { timeout: 15_000 },
  );
}

function ingredientExplanationResponse(page: Page) {
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

async function chooseSelectOption(
  page: Page,
  triggerTestId: string,
  optionTestId: string,
) {
  await page.getByTestId(triggerTestId).click();
  await page.getByTestId(optionTestId).click();
}

async function getAdminIngredients(page: Page, query = "") {
  const response = await page.request.get(`/api/admin/ingredients${query}`);

  expect(response.status()).toBe(200);

  const body = (await response.json()) as ApiEnvelope<{
    items: IngredientDto[];
  }>;

  expect(body.error).toBeNull();

  return body.data?.items ?? [];
}

async function getAdminIngredientByName(page: Page, inciName: string) {
  const ingredients = await getAdminIngredients(
    page,
    `?q=${encodeURIComponent(inciName)}&limit=50`,
  );
  const ingredient = ingredients.find((item) => item.inciName === inciName);

  expect(ingredient).toBeDefined();

  return ingredient as IngredientDto;
}

async function getUserFacingIngredients(page: Page, query: string) {
  const response = await page.request.get(
    `/api/ingredients?q=${encodeURIComponent(query)}&limit=50`,
  );

  expect(response.status()).toBe(200);

  const body = (await response.json()) as ApiEnvelope<{
    items: IngredientDto[];
  }>;

  expect(body.error).toBeNull();

  return body.data?.items ?? [];
}

async function fillAdminIngredientLiteForm(page: Page) {
  await page
    .locator("#admin-ingredient-inci-name")
    .fill(ADMIN_CREATE_EDIT_SMOKE_INGREDIENT.name);
  await chooseSelectOption(
    page,
    "admin-ingredient-evidence-level-select",
    "admin-ingredient-evidence-level-option-moderate",
  );
  await page.locator("#admin-ingredient-aliases").fill("Admin Smoke Alias");
  await page.locator("#admin-ingredient-functions").fill("barrier_support");
  await page
    .locator("#admin-ingredient-common-uses")
    .fill("admin ingredient smoke testing");
  await page
    .locator("#admin-ingredient-suitable-for")
    .fill("demo ingredient library management");
  await page
    .locator("#admin-ingredient-caution-for")
    .fill("very sensitive skin");
  await page
    .locator("#admin-ingredient-avoid-with")
    .fill("known sensitivity");
  await page.locator("#admin-ingredient-source-refs").fill("manual-curation");
}

async function submitAdminIngredientSearch(page: Page, query: string) {
  const responsePromise = adminIngredientsResponse(page);

  await page.getByLabel("Tìm kiếm thành phần").fill(query);
  await page.getByRole("button", { name: "Tìm thành phần admin" }).click();

  const response = await responsePromise;

  expect(response.ok()).toBe(true);
}

test.describe("Admin ingredient management smoke", () => {
  test("unauthenticated users are redirected without seeing admin ingredient data", async ({
    page,
  }) => {
    const criticalResponses: string[] = [];

    page.on("response", (response) => {
      if (response.status() >= 500) {
        criticalResponses.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto("/admin/ingredients");

    await expect(page).toHaveURL((url) => {
      const callbackUrl = url.searchParams.get("callbackUrl") ?? "";

      return (
        url.pathname === "/api/auth/signin" &&
        callbackUrl.includes("/admin/ingredients")
      );
    });
    await expect(page.getByText("Quản lý thành phần")).not.toBeVisible();
    expect(criticalResponses).toEqual([]);
  });

  test("non-admin users cannot view admin ingredient data", async ({ page }) => {
    await loginAsE2EUser(page);

    await page.goto("/admin/ingredients");

    await expect(page.getByText("Cần quyền truy cập admin")).toBeVisible();
    await expect(
      page.getByText("Dữ liệu quản lý thành phần không hiển thị"),
    ).toBeVisible();

    const adminApiResponse = await page.request.get("/api/admin/ingredients");

    expect(adminApiResponse.status()).toBe(403);
  });

  test("admin can create and edit lite ingredients while user-facing library still works", async ({
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
        (url.pathname.startsWith("/api/admin/ingredients") ||
          url.pathname.startsWith("/api/ingredients") ||
          url.pathname === "/admin/ingredients")
      ) {
        criticalResponses.push(`${response.status()} ${url.pathname}`);
      }
    });

    await loginAsE2EAdmin(page);

    const listResponsePromise = adminIngredientsResponse(page);

    await page.goto("/admin/ingredients");

    expect((await listResponsePromise).ok()).toBe(true);
    await expect(
      page.getByRole("heading", { name: "Quản lý thành phần" }),
    ).toBeVisible();

    await submitAdminIngredientSearch(page, "Niacinamide");
    await expect(page.getByText("Niacinamide").first()).toBeVisible();

    await page.getByRole("button", { name: "Tạo thành phần" }).click();
    await expect(page.getByTestId("admin-ingredient-form")).toBeVisible();
    await expect(
      page
        .getByTestId("admin-ingredient-form-panel")
        .getByText("Tạo thành phần"),
    ).toBeVisible();

    await fillAdminIngredientLiteForm(page);

    const createResponsePromise = adminIngredientCreateResponse(page);

    await page.getByRole("button", { name: "Lưu thành phần" }).click();
    expect((await createResponsePromise).ok()).toBe(true);
    await expect(page.getByText("Tạo thành phần thành công")).toBeVisible();
    await expect(
      page.getByText(ADMIN_CREATE_EDIT_SMOKE_INGREDIENT.name),
    ).toBeVisible();

    await getAdminIngredientByName(
      page,
      ADMIN_CREATE_EDIT_SMOKE_INGREDIENT.name,
    );

    const createdRow = page
      .getByTestId("admin-ingredient-row")
      .filter({ hasText: ADMIN_CREATE_EDIT_SMOKE_INGREDIENT.name });

    await createdRow
      .getByRole("button", {
        name: `Chỉnh sửa ${ADMIN_CREATE_EDIT_SMOKE_INGREDIENT.name}`,
      })
      .click();
    await expect(page.getByText("Chỉnh sửa thành phần")).toBeVisible();
    await page
      .locator("#admin-ingredient-inci-name")
      .fill(ADMIN_CREATE_EDIT_SMOKE_INGREDIENT.editedName);
    await page
      .locator("#admin-ingredient-common-uses")
      .fill("updated admin ingredient smoke testing");

    const updateResponsePromise = adminIngredientPatchResponse(page);

    await page.getByRole("button", { name: "Lưu thành phần" }).click();
    expect((await updateResponsePromise).ok()).toBe(true);
    await expect(page.getByText("Cập nhật thành phần thành công")).toBeVisible();
    await expect(
      page.getByText(ADMIN_CREATE_EDIT_SMOKE_INGREDIENT.editedName),
    ).toBeVisible();

    await getAdminIngredientByName(
      page,
      ADMIN_CREATE_EDIT_SMOKE_INGREDIENT.editedName,
    );

    const userFacingIngredients = await getUserFacingIngredients(
      page,
      ADMIN_CREATE_EDIT_SMOKE_INGREDIENT.editedName,
    );

    expect(
      userFacingIngredients.some(
        (item) =>
          item.inciName === ADMIN_CREATE_EDIT_SMOKE_INGREDIENT.editedName,
      ),
    ).toBe(true);

    await page.goto("/ingredients");
    const ingredientSearchInput = page.getByTestId("ingredient-search");
    await ingredientSearchInput.fill(ADMIN_CREATE_EDIT_SMOKE_INGREDIENT.editedName);

    const userSearchResponsePromise = page.waitForResponse(
      (response) => {
        const url = new URL(response.url());

        return (
          url.pathname === "/api/ingredients" &&
          response.request().method() === "GET"
        );
      },
      { timeout: 15_000 },
    );

    await ingredientSearchInput.press("Enter");
    expect((await userSearchResponsePromise).ok()).toBe(true);

    const userFacingCard = page
      .getByTestId("ingredient-card")
      .filter({ hasText: ADMIN_CREATE_EDIT_SMOKE_INGREDIENT.editedName })
      .first();

    await expect(userFacingCard).toBeVisible({ timeout: 15_000 });

    await userFacingCard.locator('a[href^="/ingredients/"]').first().click();
    await expect(page).toHaveURL(/\/ingredients\/[a-f\d]{24}$/i, {
      timeout: 15_000,
    });
    await expect(
      page.getByRole("heading", {
        name: ADMIN_CREATE_EDIT_SMOKE_INGREDIENT.editedName,
      }),
    ).toBeVisible();

    const explanationResponsePromise = ingredientExplanationResponse(page);

    await page
      .getByTestId("ingredient-explanation-panel")
      .getByRole("button")
      .click();
    expect((await explanationResponsePromise).ok()).toBe(true);

    const bodyText = await page.locator("body").innerText();

    for (const pattern of secretExposurePatterns) {
      expect(bodyText).not.toContain(pattern);
    }
    expect(consoleErrors).toEqual([]);
    expect(criticalResponses).toEqual([]);
  });
});
