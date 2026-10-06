"use server";

import { signOut as authSignOut, signIn as authSignIn } from "@/auth";

export async function signIn(
  provider: string,
  options?: { redirectTo?: string },
) {
  await authSignIn(provider, options);
}

export async function signOut(options?: { redirectTo?: string }) {
  await authSignOut(options);
}
