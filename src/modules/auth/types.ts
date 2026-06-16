export type AuthEnvironment = {
  APP_ENV?: string;
  AUTH_GOOGLE_ID?: string;
  AUTH_GOOGLE_SECRET?: string;
  E2E_TEST_AUTH: boolean;
  E2E_TEST_ADMIN_EMAIL: string;
  E2E_TEST_ADMIN_NAME: string;
  E2E_TEST_USER_EMAIL: string;
  E2E_TEST_USER_NAME: string;
  MONGODB_URI?: string;
};

export type CurrentUser = {
  id: string;
  email?: string;
  name?: string;
  image?: string;
};

export class AuthenticationRequiredError extends Error {
  constructor() {
    super("Authentication required.");
    this.name = "AuthenticationRequiredError";
  }
}
