'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';

export const CreateMatch = () => {
  const searchParams = useSearchParams();

  const getURL = () => {
    const params = new URLSearchParams(searchParams);

    const queryString = params.toString();

    return queryString
      ? ROUTES.ADMIN_MATCHES_CREATE + '?' + queryString
      : ROUTES.ADMIN_MATCHES_CREATE;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={getURL()}>
          <Button variant="outline-primary" size="icon">
            <Plus strokeWidth={3} />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        <span>crear</span>
      </TooltipContent>
    </Tooltip>
  );
};
