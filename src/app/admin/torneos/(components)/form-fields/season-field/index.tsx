'use client';

import type { ChangeEvent, FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';

export const SeasonField: FC = () => {
  const { control, setValue } = useFormContext();

  const handleSeasonChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('season', event.target.value, { shouldValidate: true });
  };

  return (
    <Controller
      name="season"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Temporada <span className="text-gray-500">(opcional)</span>
          </FieldLabel>
          <Input
            {...field}
            value={field.value ?? ''}
            onChange={handleSeasonChange}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
