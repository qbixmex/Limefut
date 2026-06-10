'use client';

import type { FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Controller, useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';

export const RemarksTextAreaField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="remarks"
      control={control}
      render={({ field, fieldState }) => (
        <Field id="mi-campo" className="h-full">
          <FieldLabel>
            Comentarios <span className="text-gray-500">(optional)</span>
          </FieldLabel>
          <Textarea
            {...field}
            aria-invalid={fieldState.invalid}
            rows={5}
            className="flex-1 resize-none"
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
