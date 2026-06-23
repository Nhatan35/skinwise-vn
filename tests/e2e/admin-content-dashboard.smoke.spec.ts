import { expect, test } from "@playwright/test";

import { loginAsE2EAdmin, loginAsE2EUser } from "./helpers/auth";

const secretExposurePatterns = [
  "AUTH_SECRET",
  "AUTH_GOOGLE_SECRET",
  "CLOUDINARY_API_SECRET",
  "MONGODB_URI",
  "mongodb://",
  "mongodb+srv://",
  "sessionToken",
] as const;

test.describe("Admin content dashboard smoke", () => {
  test("unauthenticated users are redirected without seeing admin dashboard data", async ({
    page,
  }) => {
    const criticalResponses: string[] = [];

    page.on("response", (response) => {
      if (response.status() >= 500) {
        criticalResponses.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto("/admin");

    await expect(page).toHaveURL((url) => {
      const callbackUrl = url.searchParams.get("callbackUrl") ?? "";

      return (
        url.pathname === "/api/auth/signin" && callbackUrl.includes("/admin")
      );
    });
    await expect(page.getByText("Admin Content Dashboard")).not.toBeVisible();
    expect(criticalResponses).toEqual([]);
  });

  test("non-admin users cannot view the admin content dashboard", async ({
    page,
  }) => {
    await loginAsE2EUser(page);

    await page.goto("/admin");

    await expect(page.getByText("Admin access required")).toBeVisible();
    await expect(
      page.getByText("Catalogue summary data is not shown for this account."),
    ).toBeVisible();
    await expect(page.getByText("Admin Content Dashboard")).not.toBeVisible();
  });

  test("admin can open dashboard summaries and navigate to admin content tools", async ({
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
        (url.pathname === "/admin" ||
          url.pathname.startsWith("/admin/") ||
          url.pathname.startsWith("/api/admin/"))
      ) {
        criticalResponses.push(`${response.status()} ${url.pathname}`);
      }
    });

    await loginAsE2EAdmin(page);
    await page.goto("/admin");

    await expect(
      page.getByRole("heading", { name: "Admin Content Dashboard" }),
    ).toBeVisible();
    await expect(page.getByTestId("admin-product-summary-card")).toBeVisible();
    await expect(page.getByTestId("admin-ingredient-summary-card")).toBeVisible();
    await expect(page.getByTestId("admin-products-total")).toBeVisible();
    await expect(page.getByTestId("admin-products-unverified")).toBeVisible();
    await expect(page.getByTestId("admin-products-reviewed")).toBeVisible();
    await expect(page.getByTestId("admin-products-verified")).toBeVisible();
    await expect(page.getByTestId("admin-ingredients-total")).toBeVisible();
    await expect(page.getByTestId("admin-content-boundary-note")).toContainText(
      "Production-ready is not claimed",
    );

    await page.getByRole("link", { name: "Manage products" }).click();
    await expect(page).toHaveURL(/\/admin\/products$/);
    await expect(
      page.getByRole("heading", { name: "Admin Product Review" }),
    ).toBeVisible();

    await page.goto("/admin");
    await page.getByRole("link", { name: "Manage ingredients" }).click();
    await expect(page).toHaveURL(/\/admin\/ingredients$/);
    await expect(page.locator('[data-route="/admin/ingredients"]')).toBeVisible();

    const bodyText = await page.locator("body").innerText();

    for (const pattern of secretExposurePatterns) {
      expect(bodyText).not.toContain(pattern);
    }
    expect(consoleErrors).toEqual([]);
    expect(criticalResponses).toEqual([]);
  });
});
