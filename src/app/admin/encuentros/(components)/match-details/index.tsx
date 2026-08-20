import type { FC } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { InfoIcon } from 'lucide-react';
import Link from 'next/link';

type Props = Readonly<{ matchId: string; }>;

export const MatchDetails: FC<Props> = ({ matchId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_MATCHES_SHOW(matchId)}
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
