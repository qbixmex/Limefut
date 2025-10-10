'use client';

import { FC } from "react";
import { LogIn } from "lucide-react";

import Link from "next/link";
import "./styles.css";
import { SignOut } from "@/shared/components/signOut";
import { usePathname } from 'next/navigation';
import type { Session } from "next-auth";

type Props = { session: Session | null };

export const SignInOut: FC<Props> = ({ session }) => {
  const pathname = usePathname();

  if (pathname === '/login') return null;

  return (
    <>
      {
        (session && session.user)
          ? <SignOut />
          : (
            <Link href="/login" title="Ingresar">
              <LogIn className="icon" />
            </Link>
          )
      }
    </>
  );
};

export default SignInOut;
