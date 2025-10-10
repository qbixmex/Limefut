'use server';

import { signOut } from "@/auth.config";

export const logoutAction = async () => await signOut();
