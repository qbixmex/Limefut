'use client';

import type { FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

export const UrlField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="url"
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>
            URL <span className="text-amber-500">*</span>
          </FieldLabel>
          <Input
            {...field}
            value={field.value ?? ''}
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
