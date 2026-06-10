import type { FC } from 'react';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { buttonVariants } from '@/components/ui/button';
import { PenIcon } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  playoffId: string;
  matchId: string;
}>;

export const EditMatch: FC<Props> = ({ playoffId, matchId }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_PLAYOFFS_MATCHES_EDIT(playoffId, matchId)}
          className={buttonVariants({
            variant: 'outline-warning',
            size: 'icon',
          })}
        >
          <PenIcon />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="top">
        editar
      </TooltipContent>
    </Tooltip>
  );
};
