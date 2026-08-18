'use client';

import type { FC } from 'react';
import { LogIn } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { AuthNav } from './AuthNav';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import './styles.css';
import { ROUTES } from '@/shared/constants/routes';

type Props = {
  authenticatedUser: {
    id: string;
    name: string;
    username: string | undefined;
    email: string;
    emailVerified: boolean;
    roles: string[] | undefined;
    image: string | undefined;
  } | undefined;
};

export const SignInOut: FC<Props> = ({ authenticatedUser }) => {
  const pathname = usePathname();

  if (pathname === ROUTES.AUTH_LOGIN) return null;

  return (
    <>
      {
        (authenticatedUser)
          ? <AuthNav user={authenticatedUser} />
          : (
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={ROUTES.AUTH_LOGIN}
                  role="link"
                  aria-label="Acceder con credenciales"
                >
                  <LogIn
                    className="stroke-green-50"
                    size={22}
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </a>
              </TooltipTrigger>
              <TooltipContent side="left">
                <span>Ingresar</span>
              </TooltipContent>
            </Tooltip>
          )
      }
    </>
  );
};
