'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ROUTES } from '@/shared/constants/routes';

export const CreateMatch = () => {
  const route = useRouter();
  const searchParams = useSearchParams();

  const handleNavigateCreate = () => {
    const params = new URLSearchParams(searchParams);

    const queryString = params.toString();

    route.push(
      queryString
        ? ROUTES.ADMIN_MATCHES_CREATE + '?' + queryString
        : ROUTES.ADMIN_MATCHES_CREATE,
    );
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline-primary"
          size="icon"
          onClick={handleNavigateCreate}
        >
          <Plus strokeWidth={3} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <span>crear</span>
      </TooltipContent>
    </Tooltip>
  );
};
