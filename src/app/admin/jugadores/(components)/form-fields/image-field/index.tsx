import { type FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';

export const ImageField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="image"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Imagen <span className="text-gray-500">(opcional)</span>
          </FieldLabel>
          <Input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              field.onChange(file);
            }}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
