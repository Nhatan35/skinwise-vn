export type AuthEnvironment = {
  APP_ENV?: string;
  AUTH_GOOGLE_ID?: string;
  AUTH_GOOGLE_SECRET?: string;
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
