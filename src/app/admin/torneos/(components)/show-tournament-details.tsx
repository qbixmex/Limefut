import type { FC } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { InfoIcon } from 'lucide-react';
import Link from 'next/link';

type Props = Readonly<{ tournamentId: string }>;

export const ShowTournamentDetails: FC<Props> = ({ tournamentId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_TOURNAMENT(tournamentId)}
          className={buttonVariants({
            variant: 'outline-info',
            size: 'icon',
          })}
        >
          <InfoIcon />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">
        detalles
      </TooltipContent>
    </Tooltip>
  );
};
