'use client';

import type { ChangeEvent, FC } from 'react';
import { Field, FieldError } from '@/components/ui/field';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';

type Props = Readonly<{
  setPermalinkEdited: (value: boolean) => void;
}>;

export const PermalinkField: FC<Props> = ({ setPermalinkEdited }) => {
  const { control, setValue } = useFormContext();

  const handlePermalinkChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPermalinkEdited(true);
    setValue('permalink', event.target.value, { shouldValidate: true });
  };

  return (
    <Controller
      control={control}
      name="permalink"
      render={({ field, fieldState }) => (
        <Field>
          <FormLabel>Enlace Permanente</FormLabel>
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
