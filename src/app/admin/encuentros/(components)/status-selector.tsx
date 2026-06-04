'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { MATCH_STATUS, type MATCH_STATUS_TYPE } from '~/src/shared/enums';
import { X } from 'lucide-react';

export const StatusSelector = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const setStatus = (filter: MATCH_STATUS_TYPE | 'clear') => {
    if (filter === 'clear') params.delete('status');
    else params.set('status', filter);
    router.push(`${pathname}?${params}`);
  };

  return (
    <Select
      onValueChange={setStatus}
      value={status ?? ''}
    >
      <SelectTrigger>
        <SelectValue placeholder="Estado" />
      </SelectTrigger>
      <SelectContent>
        {params.has('status') && (
          <SelectItem value="clear">borrar filtro <X /></SelectItem>
        )}
        <SelectItem value={MATCH_STATUS.IN_REVIEW}>En Revisión</SelectItem>
        <SelectItem value={MATCH_STATUS.SCHEDULED}>Programado</SelectItem>
        <SelectItem value={MATCH_STATUS.IN_PROGRESS}>En Progreso</SelectItem>
        <SelectItem value={MATCH_STATUS.POST_POSED}>Pospuesto</SelectItem>
        <SelectItem value={MATCH_STATUS.CANCELED}>Cancelado</SelectItem>
        <SelectItem value={MATCH_STATUS.COMPLETED}>Finalizado</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default StatusSelector;
