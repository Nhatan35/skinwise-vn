export const E2E_BASE_URL = "http://127.0.0.1:3000";
export const E2E_MONGODB_URI =
  "mongodb://127.0.0.1:27017/skinwise-e2e-check";
export const E2E_USER_EMAIL = "e2e-user@skinwise.test";
export const E2E_USER_NAME = "SkinWise E2E User";

export const SKIN_PROFILE_TEST_DATA = {
  avoidIngredients: "e2e-fragrance-marker\nalcohol denat",
  budgetRange: "300k_700k",
  concern: "acne",
  experienceLevel: "beginner",
  sensitivityLevel: "medium",
  skinType: "combination",
} as const;
