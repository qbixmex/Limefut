import type { FC } from 'react';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{ tournamentId: string }>;

export const ShowTournamentDetails: FC<Props> = ({ tournamentId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_TOURNAMENTS_SHOW(tournamentId)}
          className={buttonVariants({
            variant: 'outline-info',
            size: 'icon',
          })}
          aria-label="Mostrar detalles"
        >
          <InfoIcon role="img" aria-label="Icono de detalles" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">
        detalles
      </TooltipContent>
    </Tooltip>
  );
};
