'use client';

import { Fragment, type FC } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';

export const CreateAnnouncement: FC = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={ROUTES.ADMIN_ANNOUNCEMENTS_CREATE}
          className={buttonVariants({ variant: 'outline-primary', size: 'icon' })}
          aria-label="Ir a crear noticia"
        >
          <Plus strokeWidth={3} aria-hidden="true" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        <Fragment>crear</Fragment>
      </TooltipContent>
    </Tooltip>
  );
};
