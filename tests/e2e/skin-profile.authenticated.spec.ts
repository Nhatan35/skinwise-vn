import { expect, test, type Page } from "@playwright/test";

import { loginAsE2EUser } from "./helpers/auth";
import { SKIN_PROFILE_TEST_DATA } from "./helpers/test-data";

function waitForSkinProfileResponse(page: Page, methods: string[]) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        url.pathname === "/api/skin-profile" &&
        methods.includes(response.request().method())
      );
    },
    { timeout: 15_000 },
  );
}

async function chooseSelectOption(page: Page, fieldId: string, value: string) {
  await page.getByTestId(`${fieldId}-select`).click();
  await page.getByTestId(`${fieldId}-option-${value}`).click();
}

async function fillSkinProfileForm(page: Page, mode: "create" | "edit") {
  const idPrefix = mode === "edit" ? "edit-" : "";
  const concernTestId = mode === "edit" ? "edit-concern-acne" : "concern-acne";
  const avoidIngredientsTestId =
    mode === "edit"
      ? "edit-avoid-ingredients-input"
      : "avoid-ingredients-input";

  await chooseSelectOption(
    page,
    `${idPrefix}skin-type`,
    SKIN_PROFILE_TEST_DATA.skinType,
  );
  await chooseSelectOption(
    page,
    `${idPrefix}sensitivity-level`,
    SKIN_PROFILE_TEST_DATA.sensitivityLevel,
  );
  await chooseSelectOption(
    page,
    `${idPrefix}budget-range`,
    SKIN_PROFILE_TEST_DATA.budgetRange,
  );
  await chooseSelectOption(
    page,
    `${idPrefix}experience-level`,
    SKIN_PROFILE_TEST_DATA.experienceLevel,
  );
  await page.getByTestId(concernTestId).check();
  await page
    .getByTestId(avoidIngredientsTestId)
    .fill(SKIN_PROFILE_TEST_DATA.avoidIngredients);
}

async function saveProfileAndAssert(page: Page) {
  const saveResponsePromise = waitForSkinProfileResponse(page, ["PATCH", "POST"]);

  await page.getByTestId("skin-profile-save-button").click();

  const saveResponse = await saveResponsePromise;

  expect(saveResponse.ok()).toBe(true);

  const reloadResponsePromise = waitForSkinProfileResponse(page, ["GET"]);

  await page.goto("/skin-profile");

  const reloadResponse = await reloadResponsePromise;

  expect(reloadResponse.ok()).toBe(true);
  await expect(page).not.toHaveURL(/\/api\/auth\/signin/);
  await expect(page.getByTestId("skin-profile-current-card")).toBeVisible({
    timeout: 15_000,
  });
  await expect(page.getByText("e2e-fragrance-marker")).toBeVisible();
  await expect(page.getByTestId("skin-profile-detail-skin-type")).toBeVisible();
}

test.describe("SkinWise VN authenticated skin profile", () => {
  test("authenticated user can create or update skin profile", async ({
    page,
  }) => {
    await loginAsE2EUser(page);

    const loadResponsePromise = waitForSkinProfileResponse(page, ["GET"]);

    await page.goto("/skin-profile");

    const loadResponse = await loadResponsePromise;

    expect([200, 404]).toContain(loadResponse.status());
    await expect(page).not.toHaveURL(/\/api\/auth\/signin/);
    await expect(
      page
        .getByTestId("skin-profile-current-card")
        .or(page.getByTestId("skin-profile-empty-state")),
    ).toBeVisible({ timeout: 15_000 });

    if (await page.getByTestId("skin-profile-empty-state").isVisible()) {
      await page.getByTestId("skin-profile-setup-link").click();
      await expect(page).toHaveURL(/\/onboarding\/skin-profile/);
      await expect(page.getByTestId("skin-profile-onboarding-form")).toBeVisible({
        timeout: 15_000,
      });

      await fillSkinProfileForm(page, "create");
    } else {
      await page.getByTestId("skin-profile-edit-button").click();
      await expect(page.getByTestId("skin-profile-edit-form")).toBeVisible({
        timeout: 15_000,
      });

      await fillSkinProfileForm(page, "edit");
    }

    await saveProfileAndAssert(page);
  });
});
