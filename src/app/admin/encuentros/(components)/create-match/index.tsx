'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { buttonVariants } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';
import Link from 'next/link';

export const CreateMatch = () => {
  const searchParams = useSearchParams();

  const params = new URLSearchParams();
  const tournament = searchParams.get('tournament');
  const category = searchParams.get('category');

  if (tournament) params.set('tournament', tournament);
  if (category) params.set('category', category);

  const queryString = params.toString();
  const href = queryString
    ? `${ROUTES.ADMIN_MATCHES_CREATE}?${queryString}`
    : ROUTES.ADMIN_MATCHES_CREATE;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
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
        <span>crear</span>
      </TooltipContent>
    </Tooltip>
  );
};
