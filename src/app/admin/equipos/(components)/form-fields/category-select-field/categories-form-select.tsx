'use client';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = Readonly<{
  categories: CATEGORY_TYPE[];
}>;

type CATEGORY_TYPE = {
  id: string;
  name: string;
};

export const CategoriesFormSelect: FC<Props> = ({ categories }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="categoryId"
      render={(({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Categoría <span className="text-orange-500">*</span>
          </FieldLabel>
          <Select
            value={field.value ?? ''}
            onValueChange={field.onChange}
            aria-invalid={fieldState.invalid}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione una categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories.map(({ id, name }) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      ))}
    />
  );
};
