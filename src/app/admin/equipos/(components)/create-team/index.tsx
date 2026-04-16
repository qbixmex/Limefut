'use client';

import type { FC } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';

export const CreateTeam: FC = () => {
  const params = useSearchParams();
  const tournamentId = params.get('torneo');

  return (
    <Tooltip>
      <TooltipTrigger>
        <Link href={
          !tournamentId
            ? ROUTES.ADMIN_TEAM_CREATE
            : `${ROUTES.ADMIN_TEAM_CREATE}?torneo=${tournamentId}`
          }
          className={
            buttonVariants({ variant: 'outline-primary', size: 'icon' })
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
