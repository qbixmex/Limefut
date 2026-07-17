'use client';

import type { FC } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';

export const CreateTeam: FC = () => {
  const searchParams = useSearchParams();

  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={
            (searchParams.has('tournament') && searchParams.has('category'))
              ? (ROUTES.ADMIN_TEAM_CREATE +
                  `?tournament=${searchParams.get('tournament')}` +
                  `&category=${searchParams.get('category')}`
                )
              : ROUTES.ADMIN_TEAM_CREATE
          }
          className={
            buttonVariants({
              variant: 'outline-primary',
              size: 'icon',
            })
          }
        >
          <Plus strokeWidth={3} />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>crear</p>
      </TooltipContent>
    </Tooltip>
  );
};
