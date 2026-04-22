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
  const route = useRouter();

  const handleNavigate = () => {
    const params = new URLSearchParams(searchParams);
    route.push(`${ROUTES.ADMIN_PLAYERS_EDIT(playerId)}?${params}`);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline-warning" size="icon"
          onClick={handleNavigate}
        >
          <Pencil />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>editar</p>
      </TooltipContent>
    </Tooltip>
  );
};
