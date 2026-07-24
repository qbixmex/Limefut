import type { FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';

export const PhoneField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="phone"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Teléfono <span className="text-gray-500">(opcional)</span>
          </FieldLabel>
          <Input
            {...field}
            value={field.value ?? ''}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
