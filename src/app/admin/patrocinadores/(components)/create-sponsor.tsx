'use client';

import type { FC } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';

export const CreateSponsor: FC = () => {
  const params = useSearchParams();
  const tournamentId = params.get('torneo');
  const baseURL = ROUTES.ADMIN_SPONSORS_CREATE;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={!tournamentId ? baseURL : `${baseURL}?torneo=${tournamentId}`}
          className={buttonVariants({ variant: 'outline-primary', size: 'icon' })}
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
