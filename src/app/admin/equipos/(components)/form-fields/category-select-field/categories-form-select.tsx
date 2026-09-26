'use client';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
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

  const filterCategories = (category: CATEGORY_TYPE, query: string) =>
    category.name.trim().toLowerCase().includes(query.toLowerCase());

  return (
    <Controller
      control={control}
      name="categoryId"
      render={(({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Categoría <span className="text-orange-500">*</span>
          </FieldLabel>
          <Combobox
            items={categories}
            filter={filterCategories}
            value={categories.find(category => category.id === field.value) ?? null}
            onValueChange={(category) => field.onChange(category?.id ?? '')}
            itemToStringLabel={(category: CATEGORY_TYPE) => category.name}
            itemToStringValue={(category: CATEGORY_TYPE) => category.id}
            isItemEqualToValue={(itemValue, value) => itemValue.id === value.id}
          >
            <ComboboxInput
              placeholder="Buscar categoría"
              aria-invalid={fieldState.invalid}
            />
            <ComboboxContent>
              <ComboboxEmpty>No se encontró la categoría</ComboboxEmpty>
              <ComboboxList>
                {(category: CATEGORY_TYPE) => (
                  <ComboboxItem key={category.id} value={category}>
                    {category.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      ))}
    />
  );
};
