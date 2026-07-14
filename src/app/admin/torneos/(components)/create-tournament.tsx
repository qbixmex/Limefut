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
        >
          <Plus
            strokeWidth={3}
            role="img"
            aria-label="Crear torneo"
          />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        Crear torneo
      </TooltipContent>
    </Tooltip>
  );
};
