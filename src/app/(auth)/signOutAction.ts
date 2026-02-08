'use server';

import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const signOutAction = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });

  return {
    message: "¡ Has cerrado sesión correctamente 👍 !",
  };
};
