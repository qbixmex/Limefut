'use client';

import type { FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Controller, useFormContext } from 'react-hook-form';
import type { FIELD_TYPE } from '../../../(actions)/fetch-fields.action';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox';

type Props = Readonly<{ fields: FIELD_TYPE[] }>;

export const FieldSelect: FC<Props> = ({ fields }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name="fieldId"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>Cancha</FieldLabel>
          <Combobox
            items={fields}
            aria-invalid={fieldState.invalid}
            value={fields.find(f => f.id === field.value) ?? null}
            onValueChange={(item) => field.onChange(item?.id ?? null)}
            itemToStringLabel={(item: FIELD_TYPE) => item.name}
            itemToStringValue={(item: FIELD_TYPE) => item.id}
            isItemEqualToValue={(itemValue, value) => itemValue.id === value.id}
          >
            <ComboboxInput placeholder="Seleccione la cancha" />
            <ComboboxContent>
              <ComboboxEmpty>Canchas no disponibles.</ComboboxEmpty>
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
