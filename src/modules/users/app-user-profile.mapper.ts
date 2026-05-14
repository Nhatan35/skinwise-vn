import type { CurrentUser } from "@/modules/auth/types";
import type {
  AppUserProfile,
  MeUserDto,
} from "@/modules/users/app-user-profile.types";

export function toMeUserDto(
  currentUser: CurrentUser,
  profile: AppUserProfile,
): MeUserDto {
  return {
    id: currentUser.id,
    email: currentUser.email,
    name: currentUser.name,
    role: profile.role,
    onboardingCompleted: profile.onboardingCompleted,
  };
}
