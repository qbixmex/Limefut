'use client';

import type { FC } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Category } from './form-types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type Props = Readonly<{ categories: Category[] }>;

export const CategorySelectField: FC<Props> = ({ categories }) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const router = useRouter();

  const setCategorySearchParam = (permalink: string) => {
    params.set('category', permalink);
    router.replace(`${pathname}?${params}`);
  };

  return (
    <FormField
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Categoría</FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={(permalink) => {
                setCategorySearchParam(permalink);
                field.onChange(permalink);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleccione una categoría" />
              </SelectTrigger>
              <SelectContent>
                {(categories.length > 0) ? (
                  categories.map(({ id, name, permalink }) => (
                    <SelectItem key={id} value={permalink}>{name}</SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="none">
                    Aún no hay categorías disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
