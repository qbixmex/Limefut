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

export const AlignmentField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="dataAlignment"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Alineación</FieldLabel>
          <Select
            value={field.value ?? ''}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger
              className="w-full"
              aria-invalid={fieldState.invalid}
              aria-label="Alineación"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Alineada a la izquierda</SelectItem>
              <SelectItem value="center">Alineada al centro</SelectItem>
              <SelectItem value="right">Alineada a la derecha</SelectItem>
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
