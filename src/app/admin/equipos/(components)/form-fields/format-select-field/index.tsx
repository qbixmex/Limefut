'use client';

import type { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const FormatSelectField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="format"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Formato <span className="text-orange-500">*</span>
          </FieldLabel>
          <Select
            value={field.value ?? undefined}
            onValueChange={field.onChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione formato" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="11">11 vs 11</SelectItem>
                <SelectItem value="9">9 vs 9</SelectItem>
                <SelectItem value="7">7 vs 7</SelectItem>
                <SelectItem value="5">5 vs 5</SelectItem>
              </SelectGroup>
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
