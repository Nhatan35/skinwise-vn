import type { Session } from "next-auth";

import { auth } from "@/auth";
import {
  AuthenticationRequiredError,
  type CurrentUser,
} from "@/modules/auth/types";

function stringOrUndefined(value: string | null | undefined) {
  return value ?? undefined;
}

export function mapSessionToCurrentUser(session: Session | null): CurrentUser | null {
  if (!session?.user?.id) {
    return null;
  }

  return {
    id: session.user.id,
    email: stringOrUndefined(session.user.email),
    name: stringOrUndefined(session.user.name),
    image: stringOrUndefined(session.user.image),
  };
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  return mapSessionToCurrentUser(await auth());
}

export async function requireCurrentUser(): Promise<CurrentUser> {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    throw new AuthenticationRequiredError();
  }

  return currentUser;
}
