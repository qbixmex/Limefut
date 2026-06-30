'use client';

import type { ChangeEvent, FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';

export const CountryField: FC = () => {
  const { control, setValue } = useFormContext();

  const handleCountryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('country', event.target.value, { shouldValidate: true });
  };

  return (
    <Controller
      name="country"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            País <span className="text-gray-500">(opcional)</span>
          </FieldLabel>
          <Input
            {...field}
            value={field.value ?? ''}
            onChange={handleCountryChange}
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
