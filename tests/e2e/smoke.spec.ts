import { expect, test, type Page } from "@playwright/test";

async function expectSignInRedirect(page: Page, protectedPath: string) {
  await expect(page).toHaveURL((url) => {
    const callbackUrl = url.searchParams.get("callbackUrl") ?? "";

    return (
      url.pathname === "/api/auth/signin" &&
      callbackUrl.includes(protectedPath)
    );
  });
}

test.describe("SkinWise VN smoke", () => {
  test("public home page loads core landing content", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("heading", { name: "SkinWise VN" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Open dashboard" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Browse products" }),
    ).toBeVisible();
    await expect(
      page.getByText("Educational skincare guidance only."),
    ).toBeVisible();
  });

  test("dashboard entry point redirects unauthenticated users to sign in", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "Open dashboard" }).click();

    await expectSignInRedirect(page, "/dashboard");
  });

  test("protected dashboard route redirects unauthenticated users", async ({
    page,
  }) => {
    await page.goto("/dashboard");

    await expectSignInRedirect(page, "/dashboard");
  });

  test("protected product catalogue route redirects unauthenticated users", async ({
    page,
  }) => {
    await page.goto("/products");

    await expectSignInRedirect(page, "/products");
  });

  test("protected ingredient library route redirects unauthenticated users", async ({
    page,
  }) => {
    await page.goto("/ingredients");

    await expectSignInRedirect(page, "/ingredients");
  });

  test("protected routine route redirects unauthenticated users", async ({
    page,
  }) => {
    await page.goto("/routines");

    await expectSignInRedirect(page, "/routines");
  });

  test("protected journal route redirects unauthenticated users", async ({
    page,
  }) => {
    await page.goto("/journal");

    await expectSignInRedirect(page, "/journal");
  });

  test("protected skin profile route redirects unauthenticated users", async ({
    page,
  }) => {
    await page.goto("/skin-profile");

    await expectSignInRedirect(page, "/skin-profile");
  });
});
