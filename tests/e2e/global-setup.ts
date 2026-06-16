import { spawnSync } from "node:child_process";

import {
  E2E_ADMIN_USER_EMAIL,
  E2E_ADMIN_USER_NAME,
  E2E_BASE_URL,
  E2E_MONGODB_URI,
  E2E_USER_EMAIL,
  E2E_USER_NAME,
} from "./helpers/test-data";

const safeE2EEnv = {
  NODE_ENV: "test",
  APP_ENV: "test",
  APP_BASE_URL: E2E_BASE_URL,
  AUTH_URL: E2E_BASE_URL,
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
} satisfies Record<string, string>;

function currentProcessEnv(): Record<string, string> {
  return Object.fromEntries(
    Object.entries(process.env).filter((entry): entry is [string, string] => {
      return typeof entry[1] === "string";
    }),
  );
}

export default function globalSetup() {
  const env: NodeJS.ProcessEnv = {
    ...currentProcessEnv(),
    ...safeE2EEnv,
    NODE_ENV: "test",
  };

  const result = spawnSync(
    process.execPath,
    ["--conditions=react-server", "--import", "tsx", "scripts/seed-e2e.ts"],
    {
      cwd: process.cwd(),
      env,
      stdio: "inherit",
      windowsHide: true,
    },
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      [
        `E2E data seed failed for ${E2E_MONGODB_URI}.`,
        "Start a local MongoDB instance before running npm run test:e2e.",
        "Windows service check: Get-Service *Mongo*",
        "Port check: netstat -ano | findstr :27017",
      ].join("\n"),
    );
  }
}
