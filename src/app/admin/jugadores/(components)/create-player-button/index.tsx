'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export const CreatePlayerButton = () => {
  const searchParams = useSearchParams();
  const tournament = searchParams.get('tournament');
  const category = searchParams.get('category');
  const route = useRouter();

  if (!tournament || !category) return;

  const handleNavigate = () => {
    const params = new URLSearchParams();

    // Set Tournament and Category params
    params.set('tournament', tournament);
    params.set('category', category);

    // Redirect to create a player with params
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
        <span>crear jugador</span>
      </TooltipContent>
    </Tooltip>
  );
};
