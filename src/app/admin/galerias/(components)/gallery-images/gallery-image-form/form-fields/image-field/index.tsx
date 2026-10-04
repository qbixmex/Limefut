import type { ChangeEvent, FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export const ImageField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="image"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="image">Imagen</FieldLabel>
          <Input
            id="image"
            type="file"
            name={field.name}
            ref={field.ref}
            onBlur={field.onBlur}
            aria-invalid={fieldState.invalid}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              field.onChange(event.target.files?.[0]);
            }}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
