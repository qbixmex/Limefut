import type { FC } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { InfoIcon } from 'lucide-react';
import Link from 'next/link';

type Props = Readonly<{ playerId: string }>;

export const PlayerDetails: FC<Props> = ({ playerId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_PLAYER(playerId)}
          className={buttonVariants({ variant: 'outline-info', size: 'icon' })}
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
