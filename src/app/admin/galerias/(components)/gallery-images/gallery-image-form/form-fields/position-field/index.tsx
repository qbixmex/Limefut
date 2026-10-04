import type { ChangeEvent, FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export const PositionField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="position"
      control={control}
      render={({ field, fieldState }) => (
        <Field orientation="horizontal" data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="position">Posición</FieldLabel>
          <Input
            {...field}
            id="position"
            type="number"
            min={0}
            value={
              typeof field.value === 'number' && Number.isNaN(field.value)
                ? ''
                : field.value ?? 0
            }
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              field.onChange(parseInt(event.target.value));
            }}
            className="w-20"
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
