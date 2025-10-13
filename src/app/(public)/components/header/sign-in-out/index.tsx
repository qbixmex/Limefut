'use client';

import { FC } from "react";
import { LogIn } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import "./styles.css";
import { usePathname } from 'next/navigation';
import { AuthNav } from "./AuthNav";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = { session: Session | null };

export const SignInOut: FC<Props> = ({ session }) => {
  const pathname = usePathname();

  if (pathname === '/login') return null;

  return (
    <>
      {(session?.user)
        ? <AuthNav user={session?.user} />
        : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/login">
                <LogIn className="icon" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Ingresar</p>
            </TooltipContent>
          </Tooltip>
        )}
    </>
  );
};

export default SignInOut;
