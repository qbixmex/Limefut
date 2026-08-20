'use client';

import type { FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Category } from './form-types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Controller, useFormContext } from 'react-hook-form';

type Props = Readonly<{ categories: Category[] }>;

export const CategorySelectField: FC<Props> = ({ categories }) => {
  const { control } = useFormContext();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const router = useRouter();

  const setCategorySearchParam = (permalink: string) => {
    params.set('category', permalink);
    router.replace(`${pathname}?${params}`);
  };

  return (
    <Controller
      name="category"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Categoría</FieldLabel>
          <Select
            value={field.value}
            onValueChange={(permalink) => {
              setCategorySearchParam(permalink);
              field.onChange(permalink);
            }}
          >
            <SelectTrigger className="w-full" aria-invalid={fieldState.invalid}>
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
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
