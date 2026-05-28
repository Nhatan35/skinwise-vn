import { expect, test, type Page } from "@playwright/test";

import { loginAsE2EUser } from "./helpers/auth";

function waitForCurrentUserResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return url.pathname === "/api/me" && response.request().method() === "GET";
    },
    { timeout: 15_000 },
  );
}

function waitForAccountDeletionRequestResponse(page: Page) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      return (
        url.pathname === "/api/account/deletion-request" &&
        response.request().method() === "POST"
      );
    },
    { timeout: 15_000 },
  );
}

test.describe("SkinWise VN authenticated settings", () => {
  test("authenticated user can view Settings/Data Control page", async ({ page }) => {
    await loginAsE2EUser(page);

    const currentUserResponsePromise = waitForCurrentUserResponse(page);

    await page.goto("/settings");

    expect((await currentUserResponsePromise).ok()).toBe(true);
    await expect(
      page.getByRole("heading", { name: "Settings & Data Control" }),
    ).toBeVisible();
    await expect(page.getByTestId("settings-data-control-center")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId("settings-account-overview")).toBeVisible();

    const expectedCards = [
      ["settings-data-card-skin-profile", /\/skin-profile$/],
      ["settings-data-card-routines", /\/routines$/],
      ["settings-data-card-today-log", /\/routine-logs\/today$/],
      ["settings-data-card-journal", /\/journal$/],
      ["settings-data-card-saved-products", /\/saved-products$/],
    ] as const;

    for (const [testId, hrefPattern] of expectedCards) {
      const card = page.getByTestId(testId);

      await expect(card).toBeVisible();
      await expect(card.getByRole("link")).toHaveAttribute("href", hrefPattern);
    }

    await expect(page.getByTestId("settings-data-control-center")).not.toContainText(
      /AUTH_SECRET|access_token|refresh_token/i,
    );
  });

  test("authenticated user can request account deletion", async ({ page }) => {
    await loginAsE2EUser(page);

    const currentUserResponsePromise = waitForCurrentUserResponse(page);

    await page.goto("/settings");

    expect((await currentUserResponsePromise).ok()).toBe(true);
    await expect(page.getByTestId("account-deletion-request-status")).toContainText(
      "Chưa yêu cầu",
      { timeout: 15_000 },
    );

    await page.getByTestId("account-deletion-confirm-checkbox").check();

    const deletionRequestResponsePromise = waitForAccountDeletionRequestResponse(page);

    await page.getByTestId("account-deletion-request-button").click();

    expect((await deletionRequestResponsePromise).ok()).toBe(true);
    await expect(page.getByText("Yêu cầu xóa tài khoản đã được ghi nhận.")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId("account-deletion-request-status")).toContainText(
      "Đã yêu cầu",
    );
    await expect(page).not.toHaveURL(/\/api\/auth\/signin/);
  });
});
