import { main as seedDemoData } from "./seed";
import {
  E2E_BASE_URL,
  E2E_MONGODB_URI,
  E2E_USER_EMAIL,
  E2E_USER_NAME,
} from "../tests/e2e/helpers/test-data";

function requireUnsetOrExpected(name: string, expected: string) {
  const current = process.env[name];

  if (current && current !== expected) {
    throw new Error(`${name} must be ${expected} for E2E seeding.`);
  }

  process.env[name] = expected;
}

function configureSafeE2EEnvironment() {
  requireUnsetOrExpected("APP_ENV", "test");
  requireUnsetOrExpected("MONGODB_URI", E2E_MONGODB_URI);

  process.env.APP_BASE_URL = E2E_BASE_URL;
  process.env.AUTH_URL = E2E_BASE_URL;
  process.env.AUTH_SECRET =
    "test-auth-secret-for-playwright-only-minimum-32-characters";
  process.env.AUTH_GOOGLE_ID = "test-google-id";
  process.env.AUTH_GOOGLE_SECRET = "test-google-secret";
  process.env.AI_PROVIDER = "mock";
  process.env.AI_API_KEY = "";
  process.env.AI_MODEL = "";
  process.env.E2E_TEST_AUTH = "true";
  process.env.E2E_TEST_USER_EMAIL = E2E_USER_EMAIL;
  process.env.E2E_TEST_USER_NAME = E2E_USER_NAME;
  process.env.CLOUDINARY_CLOUD_NAME = "";
  process.env.CLOUDINARY_API_KEY = "";
  process.env.CLOUDINARY_API_SECRET = "";
  process.env.FEATURE_AI_ROUTINE_ANALYSIS = "false";
  process.env.FEATURE_INGREDIENT_EXPLANATION = "false";
  process.env.FEATURE_IMAGE_UPLOAD = "false";
  process.env.FEATURE_NOTIFICATIONS = "false";
  process.env.FEATURE_MARKETPLACE = "false";
  process.env.FEATURE_SKIN_SCORE = "false";
  process.env.NEXT_TELEMETRY_DISABLED = "1";
}

configureSafeE2EEnvironment();

async function run() {
  try {
    await seedDemoData();
  } catch (error: unknown) {
    console.error("db:seed:e2e failed");
    console.error(error instanceof Error ? error.message : "Unknown error");
    process.exitCode = 1;
  }
}

void run();
