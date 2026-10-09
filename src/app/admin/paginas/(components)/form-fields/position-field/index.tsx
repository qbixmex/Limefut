import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';

export const PositionField = () => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="position"
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel htmlFor="position">Posición</FieldLabel>
          <Input
            id="position"
            type="number"
            min={1}
            {...field}
            value={
              typeof field.value === 'number' && Number.isNaN(field.value)
                ? ''
                : field.value ?? '0'
            }
            onChange={(e) => field.onChange(parseInt(e.target.value))}
            className="w-20"
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
