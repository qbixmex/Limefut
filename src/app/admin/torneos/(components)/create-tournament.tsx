import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { Plus } from 'lucide-react';

export const CreateTournament = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_TOURNAMENTS_CREATE}
          className={buttonVariants({
            variant: 'outline-primary',
            size: 'icon',
          })}
          aria-label="Crear torneo"
        >
          <Plus strokeWidth={3} aria-hidden="true" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        Crear torneo
      </TooltipContent>
    </Tooltip>
  );
};
