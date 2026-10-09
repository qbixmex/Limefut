'use client';

import type { FC, ChangeEvent } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { slugify } from '@/lib/utils';

type Props = Readonly<{ isPermalinkEdited: boolean }>;

export const TitleField: FC<Props> = ({ isPermalinkEdited }) => {
  const { control, setValue } = useFormContext();

  const handleTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('title', event.target.value, { shouldValidate: true });
    if (!isPermalinkEdited) {
      setValue('permalink', slugify(event.target.value), { shouldValidate: true });
    }
  };

  return (
    <Controller
      control={control}
      name="title"
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>Título de la Página</FieldLabel>
          <Input
            {...field}
            value={field.value ?? ''}
            onChange={handleTitle}
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
