import { expect, test, type Page } from "@playwright/test";

import { loginAsE2EUser } from "./helpers/auth";

const JOURNAL_LOCAL_DATE = "2031-02-01";
const JOURNAL_OBSERVATION = "E2E skin looks calmer today";
const JOURNAL_UPDATED_OBSERVATION = "E2E updated skin journal observation";
const JOURNAL_NOTES = "E2E journal note";
const JOURNAL_UPDATED_NOTES = "E2E updated journal note";

function waitForSkinJournalResponse(page: Page, method: string) {
  return page.waitForResponse(
    (response) => {
      const url = new URL(response.url());

      if (method === "GET") {
        return url.pathname === "/api/skin-journal" && response.request().method() === "GET";
      }

      if (method === "POST") {
        return url.pathname === "/api/skin-journal" && response.request().method() === "POST";
      }

      return (
        /^\/api\/skin-journal\/[a-f\d]{24}$/i.test(url.pathname) &&
        response.request().method() === method
      );
    },
    { timeout: 15_000 },
  );
}

test.describe("SkinWise VN authenticated skin journal", () => {
  test("authenticated user can manage skin journal entry", async ({ page }) => {
    await loginAsE2EUser(page);

    const loadResponsePromise = waitForSkinJournalResponse(page, "GET");

    await page.goto("/journal");

    expect((await loadResponsePromise).ok()).toBe(true);
    await expect(page.getByRole("heading", { name: "Skin Journal" })).toBeVisible();

    await page.getByTestId("skin-journal-new-entry-button").first().click();
    await expect(page.getByTestId("skin-journal-form")).toBeVisible();
    await page.getByTestId("skin-journal-local-date-input").fill(JOURNAL_LOCAL_DATE);
    await page.getByTestId("skin-journal-observations-input").fill(JOURNAL_OBSERVATION);
    await page.getByTestId("skin-journal-notes-input").fill(JOURNAL_NOTES);

    const createResponsePromise = waitForSkinJournalResponse(page, "POST");

    await page.getByTestId("skin-journal-save-button").click();

    expect((await createResponsePromise).ok()).toBe(true);

    const entryCard = page
      .getByTestId("skin-journal-entry-card")
      .filter({ hasText: JOURNAL_LOCAL_DATE })
      .first();

    await expect(entryCard).toBeVisible({ timeout: 15_000 });
    await expect(entryCard.getByText(JOURNAL_OBSERVATION)).toBeVisible();
    await expect(entryCard.getByText(JOURNAL_NOTES)).toBeVisible();

    await entryCard.getByTestId("skin-journal-edit-button").click();
    await expect(page.getByTestId("skin-journal-form")).toBeVisible();
    await page
      .getByTestId("skin-journal-observations-input")
      .fill(JOURNAL_UPDATED_OBSERVATION);
    await page.getByTestId("skin-journal-notes-input").fill(JOURNAL_UPDATED_NOTES);

    const updateResponsePromise = waitForSkinJournalResponse(page, "PATCH");

    await page.getByTestId("skin-journal-save-button").click();

    expect((await updateResponsePromise).ok()).toBe(true);
    await expect(entryCard.getByText(JOURNAL_UPDATED_OBSERVATION)).toBeVisible({
      timeout: 15_000,
    });
    await expect(entryCard.getByText(JOURNAL_UPDATED_NOTES)).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());

    const deleteResponsePromise = waitForSkinJournalResponse(page, "DELETE");

    await entryCard.getByTestId("skin-journal-delete-button").click();

    expect((await deleteResponsePromise).ok()).toBe(true);
    await expect(
      page.getByTestId("skin-journal-entry-card").filter({ hasText: JOURNAL_LOCAL_DATE }),
    ).toHaveCount(0);
  });
});
