import type { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FlipHorizontal2 } from 'lucide-react';

type Props = Readonly<{ flipCallback: () => void }>;

export const InvertTeams: FC<Props> = ({ flipCallback }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline-primary"
          type="button"
          onClick={flipCallback}
          role="button"
          aria-label="Invertir equipos"
        >
          <FlipHorizontal2 />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">
        <span>Invertir Equipos</span>
      </TooltipContent>
    </Tooltip>
  );
};
