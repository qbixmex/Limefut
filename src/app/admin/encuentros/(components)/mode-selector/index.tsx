'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MATCH_MODE, type MATCH_MODE_TYPE } from '@/shared/enums';
import { getMatchMode } from '@/lib/utils';
import { X } from 'lucide-react';

const CLEAR_FILTER = 'clear';
const ALL_MODES = 'all';

type Filter = MATCH_MODE_TYPE | typeof CLEAR_FILTER | typeof ALL_MODES;

export const ModeSelector = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const setMode = (filter: Filter) => {
    if (filter === CLEAR_FILTER || filter === ALL_MODES) {
      params.delete('mode');
    } else {
      params.set('mode', filter);
    }

    router.push(`${pathname}${(params.size > 0) ? ('?' + params) : ''}`);
  };

  return (
    <Select
      onValueChange={setMode}
      value={mode ?? ''}
    >
      <SelectTrigger
        className="w-full"
        aria-label="Filtrar por modalidad"
      >
        <SelectValue placeholder="Modalidad" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_MODES}>todas</SelectItem>
        {params.has('mode') && (
          <SelectItem value={CLEAR_FILTER}>borrar filtro <X /></SelectItem>
        )}
        <SelectItem value={MATCH_MODE.LEAGUE}>
          {getMatchMode(MATCH_MODE.LEAGUE)}
        </SelectItem>
        <SelectItem value={MATCH_MODE.FRIENDLY}>
          {getMatchMode(MATCH_MODE.FRIENDLY)}
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ModeSelector;
