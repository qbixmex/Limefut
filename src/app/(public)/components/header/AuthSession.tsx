import { auth } from "@/auth";
import { SignInOut } from "./sign-in-out";

export const AuthSession = async () => {
  const session = await auth();

  return (
    <SignInOut session={session} />
  );
};
