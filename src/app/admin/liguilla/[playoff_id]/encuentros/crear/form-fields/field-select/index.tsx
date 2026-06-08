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
import { Controller, useFormContext } from 'react-hook-form';
import type { FIELD_TYPE } from '../../../(actions)/fetch-fields.action';

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
          <Select
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              className="w-full"
              aria-invalid={fieldState.invalid}
            >
              <SelectValue placeholder="Seleccione cancha" />
            </SelectTrigger>
            <SelectContent>
              {fields.map(({ id, name }) => (
                <SelectItem key={id} value={id}>{name}</SelectItem>
              ))}
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
