import type { FC } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

type Props = Readonly<{ weeks: number[] }>;

export const WeeksSelector: FC<Props> = ({ weeks }) => {
  const searchParams = useSearchParams();
  const sortWeek = searchParams.get('sort-week');
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const setWeek = (filter: 'asc' | 'desc' | 'clear') => {
    if (filter === 'clear') params.delete('sort-week');
    else params.set('sort-week', filter);
    router.push(`${pathname}?${params}`);
  };

  return (
    <Select
      onValueChange={setWeek}
      value={sortWeek ?? ''}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Jornada" />
      </SelectTrigger>
      <SelectContent>
        {params.has('sort-week') && (
          <SelectItem value="clear">borrar filtro <X /></SelectItem>
        )}
        <SelectItem value="asc">ascendente</SelectItem>
        <SelectItem value="desc">descendente</SelectItem>
        {
          (weeks.length > 0) && weeks.map((week) => (
            <SelectItem key={week} value={`${week}`}>
              jornada {week}
            </SelectItem>
          ))
        }
      </SelectContent>
    </Select>
  );
};
