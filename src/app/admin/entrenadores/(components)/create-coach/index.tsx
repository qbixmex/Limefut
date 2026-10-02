import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';

export const CreateCoach = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_COACHES_CREATE}
          aria-label="Ir a crear entrenador"
          className={
            buttonVariants({
              variant: 'outline-primary',
              size: 'icon',
            })
          }
        >
          <Plus aria-hidden="true" strokeWidth={3} />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        <span>crear</span>
      </TooltipContent>
    </Tooltip>
  );
};
