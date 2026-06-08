'use client';

import type { FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Controller, useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';

export const RefereeInputField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="referee"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>
            Arbitro <span className="text-gray-500">(optional)</span>
          </FieldLabel>
          <Input
            {...field}
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
