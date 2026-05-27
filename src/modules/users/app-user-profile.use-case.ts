import { requestAccountDeletionForUser as requestAccountDeletionProfileForUser } from "@/modules/users/app-user-profile.repository";
import type { AppUserProfile } from "@/modules/users/app-user-profile.types";

export async function requestAccountDeletionForUser(
  userId: string,
): Promise<AppUserProfile> {
  return requestAccountDeletionProfileForUser(userId);
}
