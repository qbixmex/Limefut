'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';
import Link from 'next/link';

export const CreateMatch = () => {
  const searchParams = useSearchParams();

  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href={
            (searchParams.has('tournament') && searchParams.has('category'))
              ? (ROUTES.ADMIN_PLAYOFFS +
                `?tournament=${searchParams.get('tournament')}` +
                `&category=${searchParams.get('category')}`
              )
              : ROUTES.ADMIN_PLAYOFFS_CREATE
          }
          className={
            buttonVariants({
              variant: 'outline-primary',
              size: 'icon',
            })
          }
        >
          <Plus strokeWidth={3} />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        <span>crear</span>
      </TooltipContent>
    </Tooltip>
  );
};
