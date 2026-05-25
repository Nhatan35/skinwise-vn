import { defineConfig, devices } from "playwright/test";

const baseURL = "http://localhost:3000";

const safeE2EEnv: Record<string, string> = {
  APP_ENV: "production",
  APP_BASE_URL: baseURL,
  AUTH_URL: baseURL,
  AUTH_SECRET: "ci-placeholder-secret-minimum-32-characters-only",
  AUTH_GOOGLE_ID: "placeholder-google-client-id",
  AUTH_GOOGLE_SECRET: "placeholder-google-client-secret",
  MONGODB_URI: "mongodb://127.0.0.1:27017/skinwise-e2e-check",
  AI_PROVIDER: "mock",
  AI_API_KEY: "",
  AI_MODEL: "",
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
  timeout: 30_000,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    env: {
      ...currentProcessEnv(),
      ...safeE2EEnv,
    },
    reuseExistingServer: true,
    timeout: 120_000,
    url: baseURL,
  },
});
