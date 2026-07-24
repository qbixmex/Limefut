'use client';

import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { ROUTES } from '@/shared/constants/routes';
import { Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export const CreatePlayer = () => {
  const searchParams = useSearchParams();
  const tournament = searchParams.get('tournament');
  const category = searchParams.get('category');
  const route = useRouter();

  if (!tournament || !category) return null;

  const handleNavigate = () => {
    const params = new URLSearchParams();

    params.set('tournament', tournament);
    params.set('category', category);

    route.push(`${ROUTES.ADMIN_PLAYERS_CREATE}?${params}`);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleNavigate}
          variant="outline-primary"
          size="icon"
          aria-label="Crear jugador"
        >
          <Plus role="img" aria-label="Icono de crear" strokeWidth={3} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <span>crear jugador</span>
      </TooltipContent>
    </Tooltip>
  );
};
