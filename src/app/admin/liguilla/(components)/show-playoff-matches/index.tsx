'use client';

import type { FC } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { PiSoccerBallFill } from 'react-icons/pi';

type Props = Readonly<{ playoffId: string }>;

export const ShowPlayoffMatches: FC<Props> = ({ playoffId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_PLAYOFFS_MATCHES(playoffId)}
          className={buttonVariants({
            variant: 'outline-primary',
            size: 'icon',
          })}
        >
          <PiSoccerBallFill />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">
        mostrar encuentros
      </TooltipContent>
    </Tooltip>
  );
};
