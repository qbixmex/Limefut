'use client';

import type { FC } from 'react';
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
        >
          <Plus strokeWidth={3} />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>crear</p>
      </TooltipContent>
    </Tooltip>
  );
};
