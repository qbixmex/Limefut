import type { FC } from 'react';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';

export const PositionField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="position"
      control={control}
      render={({ field }) => (
        <Field className="w-auto">
          <div className="flex items-center gap-3">
            <FieldLabel htmlFor="position">Posición</FieldLabel>
            <Input
              id="position"
              type="number"
              min={1}
              value={field.value ?? '0'}
              onChange={(e) => field.onChange(parseInt(e.target.value))}
              className="w-20"
            />
          </div>
        </Field>
      )}
    />
  );
};
