'use client';

import { Button } from '@/components/ui/button';
import { FunnelX } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export const ClearFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tournamentId = searchParams.get('torneo');

  const onClearFilters = () => {
    const params = new URLSearchParams();
    if (tournamentId) params.set('torneo', tournamentId.toString());
    router.replace(`${pathname}?${params}`);
    router.refresh();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline-info" size="icon"
          onClick={onClearFilters}
        >
          <FunnelX />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">Borrar Filtros</TooltipContent>
    </Tooltip>
  );
};

export default ClearFilters;
