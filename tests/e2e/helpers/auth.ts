import { expect, type Page } from "@playwright/test";

import { E2E_ADMIN_USER_EMAIL, E2E_USER_EMAIL } from "./test-data";

type CsrfResponse = {
  csrfToken?: string;
};

type SessionResponse = {
  user?: {
    email?: string | null;
  };
};

async function loginWithE2EProvider(
  page: Page,
  providerId: "e2e-admin-test" | "e2e-test",
  expectedEmail: string,
) {
  const csrfResponse = await page.request.get("/api/auth/csrf");

  expect(csrfResponse.ok()).toBe(true);

  const csrf = (await csrfResponse.json()) as CsrfResponse;

  expect(csrf.csrfToken).toBeTruthy();

  const signInResponse = await page.request.post(
    `/api/auth/callback/${providerId}`,
    {
      form: {
        callbackUrl: "/dashboard",
        csrfToken: csrf.csrfToken ?? "",
        json: "true",
      },
    },
  );

  expect(signInResponse.status()).toBeLessThan(400);

  await expect
    .poll(async () => {
      const sessionResponse = await page.request.get("/api/auth/session");

      if (!sessionResponse.ok()) {
        return null;
      }

      const session = (await sessionResponse.json()) as SessionResponse;

      return session.user?.email ?? null;
    })
    .toBe(expectedEmail);
}

export async function loginAsE2EUser(page: Page) {
  await loginWithE2EProvider(page, "e2e-test", E2E_USER_EMAIL);

  await page.goto("/dashboard");

  await expect(page).not.toHaveURL(/\/api\/auth\/signin/);
  await expect(
    page.getByRole("heading", { name: "Không gian theo dõi skincare" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "SkinWise overview" }),
  ).toBeVisible();
}

export async function loginAsE2EAdmin(page: Page) {
  await loginWithE2EProvider(page, "e2e-admin-test", E2E_ADMIN_USER_EMAIL);
}
