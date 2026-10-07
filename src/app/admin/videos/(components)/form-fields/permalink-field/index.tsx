'use client';

import type { FC, ChangeEvent } from 'react';
import { useRef } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';

export const PermalinkField: FC = () => {
  const { control, setValue } = useFormContext();
  const isPermalinkEdited = useRef(false);

  const handlePermalinkChange = (event: ChangeEvent<HTMLInputElement>) => {
    isPermalinkEdited.current = true;
    setValue('permalink', event.target.value, { shouldValidate: true });
  };

  return (
    <Controller
      name="permalink"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Enlace Permanente <span className="text-amber-500">*</span>
          </FieldLabel>
          <Input
            {...field}
            value={field.value ?? ''}
            onChange={handlePermalinkChange}
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
