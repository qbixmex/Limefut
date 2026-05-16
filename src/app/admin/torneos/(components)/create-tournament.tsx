import { buttonVariants } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const CreateTournament = () => {
  return (
    <Tooltip>
      <TooltipTrigger>
        <Link
          href="/admin/torneos/crear"
          className={buttonVariants({
            variant: 'outline-primary',
            size: 'icon',
          })}
        >
          <Plus strokeWidth={3} />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="left">crear</TooltipContent>
    </Tooltip>
  );
};
