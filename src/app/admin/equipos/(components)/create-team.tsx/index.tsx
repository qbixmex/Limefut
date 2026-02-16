'use client';

import type { FC } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export const CreateTeam: FC = () => {
  const params = useSearchParams();
  const tournamentId = params.get('torneo');
  const baseURL = '/admin/equipos/crear';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link href={!tournamentId ? baseURL : `${baseURL}?torneo=${tournamentId}`}>
          <Button variant="outline-primary" size="icon">
            <Plus strokeWidth={3} />
          </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>crear</p>
      </TooltipContent>
    </Tooltip>
  );
};
