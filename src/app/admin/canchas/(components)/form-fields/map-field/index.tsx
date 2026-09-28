import type { FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';

export const MapField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="map"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Mapa <span className="text-gray-500">(opcional)</span>
          </FieldLabel>
          <Input
            {...field}
            value={field.value ?? ''}
            onChange={field.onChange}
            placeholder="Ejemplo: https://maps.app.goo.gl/eYugNe5Cay9cFwex9"
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
