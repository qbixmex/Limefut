'use client';

import type { FC, ChangeEvent } from 'react';
import { useRef } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';
import { slugify } from '@/lib/utils';

export const TitleField: FC = () => {
  const { control, setValue } = useFormContext();
  const isPermalinkEdited = useRef(false);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('title', event.target.value, { shouldValidate: true });
    if (!isPermalinkEdited.current) {
      setValue('permalink', slugify(event.target.value), { shouldValidate: true });
    }
  };

  return (
    <Controller
      name="title"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Título <span className="text-amber-500">*</span>
          </FieldLabel>
          <Input
            {...field}
            value={field.value ?? ''}
            onChange={handleTitleChange}
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
