import { defineConfig, devices } from "@playwright/test";

import {
  E2E_ADMIN_USER_EMAIL,
  E2E_ADMIN_USER_NAME,
  E2E_BASE_URL,
  E2E_MONGODB_URI,
  E2E_USER_EMAIL,
  E2E_USER_NAME,
} from "./tests/e2e/helpers/test-data";

const baseURL = E2E_BASE_URL;

const safeE2EEnv: Record<string, string> = {
  APP_ENV: "test",
  APP_BASE_URL: baseURL,
  AUTH_URL: baseURL,
  AUTH_SECRET: "test-auth-secret-for-playwright-only-minimum-32-characters",
  AUTH_GOOGLE_ID: "test-google-id",
  AUTH_GOOGLE_SECRET: "test-google-secret",
  MONGODB_URI: E2E_MONGODB_URI,
  AI_PROVIDER: "mock",
  AI_API_KEY: "",
  AI_MODEL: "",
  E2E_TEST_AUTH: "true",
  E2E_TEST_ADMIN_EMAIL: E2E_ADMIN_USER_EMAIL,
  E2E_TEST_ADMIN_NAME: E2E_ADMIN_USER_NAME,
  E2E_TEST_USER_EMAIL: E2E_USER_EMAIL,
  E2E_TEST_USER_NAME: E2E_USER_NAME,
  CLOUDINARY_CLOUD_NAME: "",
  CLOUDINARY_API_KEY: "",
  CLOUDINARY_API_SECRET: "",
  FEATURE_AI_ROUTINE_ANALYSIS: "false",
  FEATURE_INGREDIENT_EXPLANATION: "false",
  FEATURE_IMAGE_UPLOAD: "false",
  FEATURE_NOTIFICATIONS: "false",
  FEATURE_MARKETPLACE: "false",
  FEATURE_SKIN_SCORE: "false",
  NEXT_TELEMETRY_DISABLED: "1",
};

function currentProcessEnv(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(process.env).filter((entry): entry is [string, string] => {
      return typeof entry[1] === "string";
    }),
  );
}

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  timeout: 30_000,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
          ? {
              launchOptions: {
                executablePath:
                  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH,
              },
            }
          : {}),
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    env: {
      ...currentProcessEnv(),
      ...safeE2EEnv,
    },
    reuseExistingServer: false,
    timeout: 120_000,
    url: baseURL,
  },
});
