import type { FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Controller, useFormContext } from 'react-hook-form';

export const AddressField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="address"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Dirección <span className="text-gray-500">(opcional)</span>
          </FieldLabel>
          <Textarea
            {...field}
            rows={2}
            value={field.value ?? ''}
            onChange={field.onChange}
            className="resize-none"
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
