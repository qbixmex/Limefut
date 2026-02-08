'use client';

import type { FC } from "react";
import { LogIn } from "lucide-react";
import type { Session } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { AuthNav } from "./AuthNav";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import "./styles.css";

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
                <LogIn
                  className="stroke-green-50"
                  size={22}
                  strokeWidth={1.5}
                />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <span>Ingresar</span>
            </TooltipContent>
          </Tooltip>
        )}
    </>
  );
};

export default SignInOut;
