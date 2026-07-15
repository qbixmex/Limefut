import type { FC } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/shared/constants/routes';

type Props = Readonly<{
  paramsPromise: Promise<{
    id: string;
  }>;
  side?: 'top' | 'right' | 'bottom' | 'left'
}>;

export const EditTournament: FC<Props> = async ({ paramsPromise, side = 'top' }) => {
  const tournamentId = (await paramsPromise).id;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_TOURNAMENTS_EDIT(tournamentId)}
          className={buttonVariants({
            variant: 'outline-warning',
            size: 'icon',
          })}
          aria-label="Editar torneo"
        >
          <Pencil role="img" aria-label='Icono de lápiz' />
        </Link>
      </TooltipTrigger>
      <TooltipContent side={side}>
        editar
      </TooltipContent>
    </Tooltip>
  );
};
