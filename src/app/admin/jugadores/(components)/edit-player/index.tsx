'use client';

import type { FC } from 'react';
import { ROUTES } from '@/shared/constants/routes';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = Readonly<{ playerId: string }>;

export const EditPlayer: FC<Props> = ({ playerId }) => {
  const searchParams = useSearchParams();
  const tournament = searchParams.get('tournament');
  const category = searchParams.get('category');
  const route = useRouter();

  if (!tournament && !category) {
    return null;
  }

  const handleNavigate = () => {
    const params = new URLSearchParams(searchParams);

    // Clear unnecessary params
    params.keys().forEach(key => params.delete(key));

    // Set Tournament and Category params
    params.set('tournament', tournament as string);
    params.set('category', category as string);

    // Redirect to edit player with params
    route.push(`${ROUTES.ADMIN_PLAYERS_EDIT(playerId)}?${params}`);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline-warning" size="icon"
          onClick={handleNavigate}
        >
          <Pencil role="img" aria-label="Icono de lápiz" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <span>editar</span>
      </TooltipContent>
    </Tooltip>
  );
};
