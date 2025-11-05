'use client';

import type { FC } from "react";
import { LogIn } from "lucide-react";
import type { Session } from "next-auth";
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
                <LogIn
                  className="stroke-green-50"
                  size={22}
                  strokeWidth={1.5}
                />
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
