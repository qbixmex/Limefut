'use client';

import type { FC } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export const DateSelector: FC = () => {
  const searchParams = useSearchParams();
  const sortDate = searchParams.get('sortMatchDate');
  const pathname = usePathname();
  const router = useRouter();

  const setDate = (sort: 'asc' | 'desc') => {
    const params = new URLSearchParams(searchParams);
    params.set('sortMatchDate', sort);
    router.push(`${pathname}?${params}`);
  };

  return (
    <Select
      onValueChange={setDate}
      value={sortDate ?? ''}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Fecha" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="asc">Recientes</SelectItem>
        <SelectItem value="desc">Antiguos</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default DateSelector;
