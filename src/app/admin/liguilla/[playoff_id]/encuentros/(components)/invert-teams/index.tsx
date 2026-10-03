'use client';

import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FlipHorizontal2 } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';

export const InvertTeams: FC = () => {
  const { setValue } = useFormContext();
  const localTeamId = useWatch({ name: 'localTeamId' });
  const visitorTeamId = useWatch({ name: 'visitorTeamId' });

  const handleFlipTeams = () => {
    setValue('localTeamId', visitorTeamId);
    setValue('visitorTeamId', localTeamId);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline-primary"
          type="button"
          onClick={handleFlipTeams}
          aria-label="Invertir equipos"
        >
          <FlipHorizontal2 aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        Invertir Equipos
      </TooltipContent>
    </Tooltip>
  );
};
