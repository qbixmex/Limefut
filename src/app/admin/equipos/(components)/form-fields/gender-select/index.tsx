'use client';

import type { FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller, useFormContext } from 'react-hook-form';

export const GenderSelect: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="gender"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Rama <span className="text-orange-500">*</span>
          </FieldLabel>
          <Select
            value={field.value ?? undefined}
            onValueChange={field.onChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione rama" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>
                  Género <span className="text-orange-500">*</span>
                </SelectLabel>
                <SelectContent>
                  <SelectItem value="male">varonil</SelectItem>
                  <SelectItem value="female">femenil</SelectItem>
                </SelectContent>
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
