export const E2E_BASE_URL = "http://127.0.0.1:3000";
export const E2E_ADMIN_USER_ID = "e2e-admin";
export const E2E_ADMIN_USER_EMAIL = "e2e-admin@skinwise.test";
export const E2E_ADMIN_USER_NAME = "SkinWise E2E Admin";
export const E2E_USER_ID = "e2e-user";
export const E2E_MONGODB_URI =
  "mongodb://127.0.0.1:27017/skinwise-e2e-check";
export const E2E_USER_EMAIL = "e2e-user@skinwise.test";
export const E2E_USER_NAME = "SkinWise E2E User";

export const ADMIN_SMOKE_PRODUCT = {
  brand: "SkinWise Smoke",
  name: "Admin Smoke Pending Review Gel",
} as const;

export const ADMIN_CREATE_EDIT_SMOKE_PRODUCT = {
  brand: "SkinWise Admin Lite",
  editedBrand: "SkinWise Admin Lite Edited",
  editedName: "Admin Create Edit Smoke Product Edited",
  name: "Admin Create Edit Smoke Product",
} as const;

export const ADMIN_CREATE_EDIT_SMOKE_INGREDIENT = {
  editedName: "Admin Smoke Ingredient Edited",
  name: "Admin Smoke Ingredient",
} as const;

export const SKIN_PROFILE_TEST_DATA = {
  avoidIngredients: "e2e-fragrance-marker\nalcohol denat",
  budgetRange: "300k_700k",
  concern: "acne",
  experienceLevel: "beginner",
  sensitivityLevel: "medium",
  skinType: "combination",
} as const;
