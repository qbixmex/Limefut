'use client';

import type { FC } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';

export const CreateBanner: FC = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={ROUTES.ADMIN_BANNERS_CREATE}
          aria-label="Crear banner"
          className={
            buttonVariants({ variant: 'outline-primary', size: 'icon' })
          }
        >
          <Plus
            role="img"
            aria-label="Icono de crear"
            strokeWidth={3}
          />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        <span>crear</span>
      </TooltipContent>
    </Tooltip>
  );
};
