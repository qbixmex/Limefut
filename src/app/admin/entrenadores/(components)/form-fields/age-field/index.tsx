import type { FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';

export const AgeField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="age"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="age">
            <span>Edad</span>{' '}
            <span className="text-gray-500">(optional)</span>
          </FieldLabel>
          <Input
            {...field}
            id="age"
            type="number"
            min={0}
            max={100}
            value={field.value ?? ''}
            onChange={(e) => field.onChange(parseInt(e.target.value))}
            className="w-full lg:w-25!"
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
