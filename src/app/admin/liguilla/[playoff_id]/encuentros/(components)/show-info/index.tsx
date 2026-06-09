import type { FC } from 'react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { buttonVariants } from '@/components/ui/button';
import { InfoIcon } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  playoffId: string;
  matchId: string;
}>;

export const ShowInfo: FC<Props> = ({ playoffId, matchId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_PLAYOFFS_MATCHES_SHOW(playoffId, matchId)}
          className={buttonVariants({
            variant: 'outline-info',
            size: 'icon',
          })}
        >
          <InfoIcon />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        detalles
      </TooltipContent>
    </Tooltip>
  );
};
