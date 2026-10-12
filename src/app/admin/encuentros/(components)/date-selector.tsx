'use client';

import type { FC } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { X } from 'lucide-react';

type Props = Readonly<{ label: 'date' | 'hour' }>;

export const DateSelector: FC<Props> = ({ label }) => {
  const searchParams = useSearchParams();
  const sortDate = searchParams.get('sort-match-date');
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const setDate = (filter: 'asc' | 'desc' | 'clear') => {
    if (filter === 'clear') params.delete('sort-match-date');
    else params.set('sort-match-date', filter);
    router.push(`${pathname}?${params}`);
  };

  const getPlaceholderLabel = (label: string) => {
    switch (label) {
      case 'date':
        return 'Fecha';
      case 'hour':
        return 'Hora';
      default:
        return 'Ordenar';
    }
  };

  return (
    <Select
      onValueChange={setDate}
      value={sortDate ?? ''}
    >
      <SelectTrigger
        className="w-full"
        aria-label={`Ordenar por ${label === 'hour' ? 'hora' : 'fecha'}`}
      >
        <SelectValue placeholder={getPlaceholderLabel(label)} />
      </SelectTrigger>
      <SelectContent>
        {params.has('sort-match-date') && (
          <SelectItem value="clear">borrar filtro <X /></SelectItem>
        )}
        <SelectItem value="asc">ascendente</SelectItem>
        <SelectItem value="desc">descendente</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DateSelector;
