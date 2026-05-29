import { expect, test } from "@playwright/test";

import { loginAsE2EUser } from "./helpers/auth";

test.describe("SkinWise VN authenticated smoke", () => {
  test("authenticated user can access dashboard", async ({ page }) => {
    await loginAsE2EUser(page);

    await page.goto("/dashboard");

    await expect(page).not.toHaveURL(/\/api\/auth\/signin/);
    await expect(
      page.getByRole("heading", { name: "Không gian theo dõi skincare" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "SkinWise overview" }),
    ).toBeVisible();
    await expect(page.getByText("SkinWise E2E User")).toBeVisible();
  });
});
