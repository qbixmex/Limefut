'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';
import Link from 'next/link';

export const CreatePlayoff = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_PLAYOFFS_CREATE}
          className={
            buttonVariants({
              variant: 'outline-primary',
              size: 'icon',
            })
          }
          aria-label="Crear encuentro"
        >
          <Plus strokeWidth={3} aria-hidden="true" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        crear
      </TooltipContent>
    </Tooltip>
  );
};
