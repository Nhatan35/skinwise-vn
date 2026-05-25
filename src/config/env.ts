import "server-only";

import { z } from "zod";

const DEFAULT_LOCAL_URL = "http://localhost:3000";
const DEFAULT_E2E_TEST_USER_EMAIL = "e2e-user@skinwise.test";
const DEFAULT_E2E_TEST_USER_NAME = "SkinWise E2E User";
const APP_ENV_VALUES = ["development", "test", "production"] as const;
const AI_PROVIDER_VALUES = ["openai", "gemini", "mock"] as const;

const appEnvSet = new Set<string>(APP_ENV_VALUES);

const featureFlagSchema = z
  .union([z.literal("true"), z.literal("false")])
  .optional()
  .transform((value) => value === "true");

const e2eTestAuthSchema = z
  .string()
  .optional()
  .transform((value) => value === "true");

const urlSchema = z.string().url();

const mongodbUriSchema = z
  .string()
  .refine(
    (value) =>
      value.startsWith("mongodb://") || value.startsWith("mongodb+srv://"),
    "MONGODB_URI must start with mongodb:// or mongodb+srv://",
  )
  .optional();

const envSchema = z
  .object({
    APP_ENV: z.enum(APP_ENV_VALUES),
    APP_BASE_URL: urlSchema.default(DEFAULT_LOCAL_URL),
    MONGODB_URI: mongodbUriSchema,
    AUTH_SECRET: z.string().optional(),
    AUTH_URL: urlSchema.optional(),
    AUTH_GOOGLE_ID: z.string().optional(),
    AUTH_GOOGLE_SECRET: z.string().optional(),
    AI_PROVIDER: z.enum(AI_PROVIDER_VALUES).optional(),
    AI_API_KEY: z.string().optional(),
    AI_MODEL: z.string().optional(),
    E2E_TEST_AUTH: e2eTestAuthSchema,
    E2E_TEST_USER_EMAIL: z
      .string()
      .email()
      .default(DEFAULT_E2E_TEST_USER_EMAIL),
    E2E_TEST_USER_NAME: z.string().min(1).default(DEFAULT_E2E_TEST_USER_NAME),
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
    FEATURE_AI_ROUTINE_ANALYSIS: featureFlagSchema,
    FEATURE_INGREDIENT_EXPLANATION: featureFlagSchema,
    FEATURE_IMAGE_UPLOAD: featureFlagSchema,
    FEATURE_NOTIFICATIONS: featureFlagSchema,
    FEATURE_MARKETPLACE: featureFlagSchema,
    FEATURE_SKIN_SCORE: featureFlagSchema,
  })
  .superRefine((value, context) => {
    if (value.E2E_TEST_AUTH && value.APP_ENV !== "test") {
      context.addIssue({
        code: "custom",
        message: "E2E_TEST_AUTH can only be enabled when APP_ENV is test.",
        path: ["E2E_TEST_AUTH"],
      });
    }

    if (value.APP_ENV === "production") {
      requireField(context, value.MONGODB_URI, "MONGODB_URI");
      requireField(context, value.AUTH_SECRET, "AUTH_SECRET");
      requireField(context, value.AUTH_URL, "AUTH_URL");
    }

    if (
      value.FEATURE_AI_ROUTINE_ANALYSIS ||
      value.FEATURE_INGREDIENT_EXPLANATION
    ) {
      requireField(context, value.AI_PROVIDER, "AI_PROVIDER");
      requireField(context, value.AI_API_KEY, "AI_API_KEY");
      requireField(context, value.AI_MODEL, "AI_MODEL");
    }

    if (value.FEATURE_IMAGE_UPLOAD) {
      requireField(
        context,
        value.CLOUDINARY_CLOUD_NAME,
        "CLOUDINARY_CLOUD_NAME",
      );
      requireField(context, value.CLOUDINARY_API_KEY, "CLOUDINARY_API_KEY");
      requireField(
        context,
        value.CLOUDINARY_API_SECRET,
        "CLOUDINARY_API_SECRET",
      );
    }
  });

export type Env = z.infer<typeof envSchema> & {
  AUTH_URL: string;
};

function requireField(
  context: z.RefinementCtx,
  value: string | undefined,
  path: string,
) {
  if (!value) {
    context.addIssue({
      code: "custom",
      message: `${path} is required`,
      path: [path],
    });
  }
}

function normalizeValue(value: string | undefined) {
  return value === "" ? undefined : value;
}

function resolveAppEnv(source: NodeJS.ProcessEnv) {
  const explicitAppEnv = normalizeValue(source.APP_ENV);

  if (explicitAppEnv) {
    return explicitAppEnv;
  }

  const nodeEnv = normalizeValue(source.NODE_ENV);

  if (nodeEnv && appEnvSet.has(nodeEnv)) {
    return nodeEnv;
  }

  return "development";
}

function normalizeEnvSource(source: NodeJS.ProcessEnv) {
  const normalized: Record<string, string | undefined> = {};

  for (const [key, value] of Object.entries(source)) {
    normalized[key] = normalizeValue(value);
  }

  normalized.APP_ENV = resolveAppEnv(source);

  return normalized;
}

export function parseEnv(source: NodeJS.ProcessEnv): Env {
  const parsed = envSchema.parse(normalizeEnvSource(source));

  return {
    ...parsed,
    AUTH_URL: parsed.AUTH_URL ?? DEFAULT_LOCAL_URL,
  };
}

export function getEnv(): Env {
  return parseEnv(process.env);
}
