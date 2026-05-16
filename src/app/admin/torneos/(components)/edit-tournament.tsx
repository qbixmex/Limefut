import type { FC } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Pencil } from 'lucide-react';
import Link from 'next/link';

type Props = Readonly<{
  tournamentId: string;
  side?: 'top' | 'right' | 'bottom' | 'left'
}>;

export const EditTournament: FC<Props> = ({ tournamentId, side = 'top' }) => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={`/admin/torneos/editar/${tournamentId}`}
          className={buttonVariants({
            variant: 'outline-warning',
            size: 'icon',
          })}
        >
          <Pencil />
        </Link>
      </TooltipTrigger>
      <TooltipContent side={side}>
        <p>editar</p>
      </TooltipContent>
    </Tooltip>
  );
};
