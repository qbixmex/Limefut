'use client';

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import type { FC } from 'react';
import { useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

type Props = Readonly<{
  categories: CATEGORY_TYPE[];
}>;

type CATEGORY_TYPE = {
  id: string;
  name: string;
};

export const CategoriesFormSelect: FC<Props> = ({ categories }) => {
  const { control, setValue } = useFormContext();
  const categoriesIds: string[] = useWatch({ name: 'categoriesIds' });
  const anchorRef = useComboboxAnchor();

  const selectedCategories = useMemo(() => {
    if (categoriesIds.length === 0) return [];
    const categoriesMap = new Map(categories.map(c => [c.id, c]));
    return categoriesIds
      .map(id => categoriesMap.get(id))
      .filter((category): category is CATEGORY_TYPE => !!category);
  }, [categoriesIds, categories]);

  return (
    <div ref={anchorRef} className="w-full">
      <Controller
        name="categoriesIds"
        control={control}
        render={({ fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Categorías ({selectedCategories.length})</FieldLabel>
            <Combobox
              multiple
              items={categories}
              itemToStringValue={(field) => field.name}
              value={selectedCategories}
              onValueChange={(selectedCategory) => {
                const newIds = new Set<string>(selectedCategory.map(({ id }) => id));
                const currentSet = new Set<string>(categoriesIds ?? []);
                const removedCategories = categoriesIds.filter(id => !newIds.has(id));
                const addedCategories = selectedCategory
                  .filter(category => !currentSet.has(category.id))
                  .map(category => category.id);
                let updatedCategories = [...categoriesIds];
                if (removedCategories.length > 0) {
                  updatedCategories = updatedCategories.filter(id => !removedCategories.includes(id));
                }
                if (addedCategories.length > 0) updatedCategories.push(...addedCategories);
                setValue('categoriesIds', updatedCategories);
              }}
            >
              <ComboboxChips className="w-full">
                <ComboboxValue>
                  {(values) => (
                    <>
                      {values.map((field: CATEGORY_TYPE) => (
                        <ComboboxChip key={field.id}>
                          {field.name}
                        </ComboboxChip>
                      ))}
                    </>
                  )}
                </ComboboxValue>
                <ComboboxChipsInput placeholder="Buscar categoría" />
                <ComboboxContent anchor={anchorRef}>
                  <ComboboxEmpty>No se encontró la categoría</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.id} value={item}>
                        {item.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </ComboboxChips>
            </Combobox>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
    </div>
  );
};
