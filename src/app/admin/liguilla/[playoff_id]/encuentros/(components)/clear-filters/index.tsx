'use client';

import { Button } from '@/components/ui/button';
import { FunnelX } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { usePathname, useRouter } from 'next/navigation';

export const ClearFilters = () => {
  const router = useRouter();
  const pathname = usePathname();

  const onClearFilters = () => {
    const params = new URLSearchParams();
    for (const key of params.keys()) {
      params.delete(key);
    }
    router.replace(pathname);
    router.refresh();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline-info" size="icon"
          onClick={onClearFilters}
          aria-label="Borrar filtros"
        >
          <FunnelX aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        Borrar Filtros
      </TooltipContent>
    </Tooltip>
  );
};
