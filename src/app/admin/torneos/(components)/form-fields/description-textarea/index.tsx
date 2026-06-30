'use client';

import type { ChangeEvent, FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Controller, useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';

export const DescriptionTextArea: FC = () => {
  const { control, setValue } = useFormContext();

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue('description', event.target.value, { shouldValidate: true });
  };

  return (
    <Controller
      name="description"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="description">
            Descripción <span className="text-gray-500">(opcional)</span>
          </FieldLabel>
          <Textarea
            {...field}
            id="description"
            value={field.value ?? ''}
            onChange={handleDescriptionChange}
            className="min-h-20 resize-none"
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
