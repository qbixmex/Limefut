'use client';

import { Button } from '@/components/ui/button';
import { FunnelX } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname, useRouter } from 'next/navigation';

export const ClearFilters = () => {
  const router = useRouter();
  const pathname = usePathname();

  const onClearFilters = () => {
    // Handle to remove all params
    router.replace(pathname);
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