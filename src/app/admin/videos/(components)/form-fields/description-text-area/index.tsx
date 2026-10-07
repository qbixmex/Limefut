'use client';

import type { FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Controller, useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';

export const DescriptionTextArea: FC = () => {
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
            cols={2}
            {...field}
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
