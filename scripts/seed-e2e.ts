import { main as seedDemoData } from "./seed";
import {
  E2E_BASE_URL,
  E2E_MONGODB_URI,
  E2E_USER_EMAIL,
  E2E_USER_ID,
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

function assertSafeE2EResetEnvironment() {
  if (process.env.APP_ENV !== "test") {
    throw new Error("APP_ENV must be test before resetting E2E data.");
  }

  if (process.env.MONGODB_URI !== E2E_MONGODB_URI) {
    throw new Error("MONGODB_URI must match the configured E2E database.");
  }

  const databaseName = new URL(E2E_MONGODB_URI).pathname.replace(/^\//, "");

  if (!databaseName || !databaseName.includes("e2e")) {
    throw new Error("The E2E MongoDB URI must target an E2E/test database.");
  }
}

async function resetDeterministicE2EUserData() {
  assertSafeE2EResetEnvironment();

  const [{ closeMongoClient }, collections] = await Promise.all([
    import("@/infrastructure/database/mongodb"),
    import("@/infrastructure/database/collections"),
  ]);

  try {
    const [
      routinesCollection,
      routineLogsCollection,
      routineAnalysesCollection,
      skinJournalsCollection,
      savedProductsCollection,
      appUserProfilesCollection,
      rateLimitsCollection,
    ] = await Promise.all([
      collections.getRoutinesCollection(),
      collections.getRoutineLogsCollection(),
      collections.getRoutineAnalysesCollection(),
      collections.getSkinJournalsCollection(),
      collections.getSavedProductsCollection(),
      collections.getAppUserProfilesCollection(),
      collections.getRateLimitsCollection(),
    ]);

    await Promise.all([
      routinesCollection.deleteMany({ userId: E2E_USER_ID }),
      routineLogsCollection.deleteMany({ userId: E2E_USER_ID }),
      routineAnalysesCollection.deleteMany({ userId: E2E_USER_ID }),
      skinJournalsCollection.deleteMany({ userId: E2E_USER_ID }),
      savedProductsCollection.deleteMany({ userId: E2E_USER_ID }),
      rateLimitsCollection.deleteMany({ key: `routine_analysis:${E2E_USER_ID}` }),
      appUserProfilesCollection.updateOne(
        { userId: E2E_USER_ID },
        {
          $set: {
            updatedAt: new Date(),
          },
          $unset: {
            accountDeletionRequestedAt: "",
          },
        },
      ),
    ]);

    console.info(`db:seed:e2e reset user-owned data for ${E2E_USER_ID}`);
  } finally {
    await closeMongoClient();
  }
}

configureSafeE2EEnvironment();

async function run() {
  try {
    await resetDeterministicE2EUserData();
    await seedDemoData();
  } catch (error: unknown) {
    console.error("db:seed:e2e failed");
    console.error(error instanceof Error ? error.message : "Unknown error");
    process.exitCode = 1;
  }
}

void run();
