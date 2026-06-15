import { getCurrentUser } from "@/modules/auth/get-current-user";
import {
  AuthenticationRequiredError,
  type CurrentUser,
} from "@/modules/auth/types";
import { findAppUserProfileByUserId } from "@/modules/users/app-user-profile.repository";
import type { AppUserProfile } from "@/modules/users/app-user-profile.types";

export class AdminPermissionRequiredError extends Error {
  constructor() {
    super("Admin permission required.");
    this.name = "AdminPermissionRequiredError";
  }
}

export type AdminUser = {
  currentUser: CurrentUser;
  profile: AppUserProfile;
};

export async function requireAdminUser(): Promise<AdminUser> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new AuthenticationRequiredError();
  }

  const profile = await findAppUserProfileByUserId(currentUser.id);

  if (profile?.role !== "ADMIN") {
    throw new AdminPermissionRequiredError();
  }

  return {
    currentUser,
    profile,
  };
}
