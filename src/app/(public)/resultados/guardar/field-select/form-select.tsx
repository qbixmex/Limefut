'use client';

import type { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import type { FIELD_TYPE } from '../../(actions)/fetchPublicFieldsAction';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox';

type Props = Readonly<{ fields: FIELD_TYPE[] }>;

export const FieldFormSelect: FC<Props> = ({ fields }) => {
  const { control } = useFormContext();

  const onFilterResults = (item: FIELD_TYPE, query: string) => {
    return item.name
      .trim()
      .toLowerCase()
      .includes(query.toLowerCase());
  };

  return (
    <Controller
      name="field"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>
            Cancha <span className="text-amber-500">*</span>
          </FieldLabel>
          <Combobox
            items={fields}
            filter={onFilterResults}
            value={fields.find(f => f.id === field.value) ?? null}
            onValueChange={(item) => field.onChange(item?.id ?? null)}
            itemToStringLabel={(item: FIELD_TYPE) => item.name}
            itemToStringValue={(item: FIELD_TYPE) => item.id}
            isItemEqualToValue={(itemValue, value) => itemValue.id === value.id}
          >
            <ComboboxInput placeholder="Seleccione una cancha" showClear />
            <ComboboxContent>
              <ComboboxEmpty>No se encontró la cancha.</ComboboxEmpty>
              <ComboboxList>
                {(item: FIELD_TYPE) => (
                  <ComboboxItem key={item.id} value={item}>
                    {item.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
