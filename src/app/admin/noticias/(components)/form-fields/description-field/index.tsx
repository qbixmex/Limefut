'use client';

import type { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';

export const DescriptionField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="description"
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>
            Descripción <span className="text-amber-500">*</span>
          </FieldLabel>
          <Textarea
            {...field}
            rows={2}
            value={field.value ?? ''}
            className="resize-none"
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
