'use client';

import type { FC } from 'react';
import type { ChangeEvent } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';
import { slugify } from '@/lib/utils';

type Props = Readonly<{
  permalinkChanged: boolean;
  handlePermalinkChanged: (status: boolean) => void;
}>;

export const TitleField: FC<Props> = ({ permalinkChanged, handlePermalinkChanged }) => {
  const { control, setValue } = useFormContext();

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('title', event.target.value, { shouldValidate: true });
    if (!permalinkChanged) {
      setValue('permalink', slugify(event.target.value), { shouldValidate: true });
      handlePermalinkChanged(false);
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

/*
<FormField
  name="title"
  render={({ field }) => (
    <FormItem>
      <FormLabel>
        Título <span className="text-amber-500">*</span>
      </FormLabel>
      <FormControl>
        <Input
          {...field}
          value={field.value ?? ''}
          onChange={handleTitleChange}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
*/
