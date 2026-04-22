'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export const CreatePlayerButton = () => {
  const searchParams = useSearchParams();
  const route = useRouter();

  if (!searchParams.has('torneo')) return;

  const handleNavigate = () => {
    const params = new URLSearchParams(searchParams);
    route.push(`${ROUTES.ADMIN_PLAYERS_CREATE}?${params}`);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleNavigate}
          variant="outline-primary"
          size="icon"
        >
          <Plus strokeWidth={3} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>crear</p>
      </TooltipContent>
    </Tooltip>
  );
};
