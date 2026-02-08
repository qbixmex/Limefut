import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  customSessionClient,
} from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_SITE_URL ?? '',
  plugins: [
    inferAdditionalFields<typeof auth>(),
    customSessionClient<typeof auth>(),
  ],
});

export type Session = typeof authClient.$Infer.Session;

export const {
  signIn,
  signUp,
  signOut,
  resetPassword,
  useSession,
} = authClient;
