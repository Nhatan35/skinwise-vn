import type { CurrentUser } from "@/modules/auth/types";
import type {
  AppUserProfile,
  MeUserDto,
} from "@/modules/users/app-user-profile.types";

export function toMeUserDto(
  currentUser: CurrentUser,
  profile: AppUserProfile,
): MeUserDto {
  const accountDeletionRequestedAt = profile.accountDeletionRequestedAt;

  return {
    id: currentUser.id,
    email: currentUser.email,
    name: currentUser.name,
    role: profile.role,
    onboardingCompleted: profile.onboardingCompleted,
    ...(accountDeletionRequestedAt
      ? { accountDeletionRequestedAt: accountDeletionRequestedAt.toISOString() }
      : {}),
    accountDeletionRequestStatus: accountDeletionRequestedAt
      ? "requested"
      : "not_requested",
  };
}
