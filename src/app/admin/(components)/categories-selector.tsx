'use client';

import type { FC } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { CategoryType } from '../equipos/(actions)';

type Props = Readonly<{ categories: CategoryType[] }>;

export const CategoriesSelector: FC<Props> = ({ categories }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);
  const categoryPermalink = searchParams.get('category');

  const setCategoryParam = (permalink: string) => {
    if (!permalink) return;

    params.set('category', permalink);
    router.push(`${pathname}?${params}`);
  };

  if (!params.has('tournament')) {
    return null;
  }

  return (
    <Select
      value={categoryPermalink ?? ''}
      onValueChange={setCategoryParam}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleccione la categoría" />
      </SelectTrigger>
      <SelectContent>
        {categories.map(({ id, name, permalink }) => (
          <SelectItem key={id} value={permalink}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
