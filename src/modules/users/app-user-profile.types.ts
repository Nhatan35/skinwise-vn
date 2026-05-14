import type { WithId } from "mongodb";

export const APP_USER_ROLES = ["USER", "ADMIN"] as const;

export type AppUserRole = (typeof APP_USER_ROLES)[number];

export type AppUserProfileDocument = {
  userId: string;
  role: AppUserRole;
  onboardingCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type AppUserProfile = WithId<AppUserProfileDocument>;

export type MeUserDto = {
  id: string;
  email?: string;
  name?: string;
  role: AppUserRole;
  onboardingCompleted: boolean;
};

export const DEFAULT_APP_USER_PROFILE = {
  role: "USER",
  onboardingCompleted: false,
} as const satisfies Pick<AppUserProfileDocument, "role" | "onboardingCompleted">;
