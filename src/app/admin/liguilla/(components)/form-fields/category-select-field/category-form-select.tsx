'use client';

import type { FC } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

type Props = Readonly<{ categories: CATEGORY_TYPE[] }>;
type CATEGORY_TYPE = {
  id: string;
  name: string;
  permalink: string;
};

export const CategorySelectField: FC<Props> = ({ categories }) => {
  const { control } = useFormContext();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const setCategorySearchParam = (categoryPermalink: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('category', categoryPermalink);
    router.push(`${pathname}?${params}`);
  };

  return (
    <Controller
      name="category"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>Categoría</FieldLabel>
          <Select
            name={field.name}
            onValueChange={(categoryPermalink) => {
              const category = categories.find(c => c.permalink === categoryPermalink);
              if (category) {
                setCategorySearchParam(category.permalink);
              }
              field.onChange(categoryPermalink);
            }}
          >
            <SelectTrigger
              aria-invalid={fieldState.invalid}
              className="min-w-30"
            >
              <SelectValue placeholder="seleccione torneo" />
            </SelectTrigger>
            <SelectContent>
              {categories.length > 0 ? (
                categories.map(({ id, name, permalink }) => (
                  <SelectItem key={id} value={permalink}>
                    {name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem disabled value='none'>
                  Aún no hay torneos disponibles
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
