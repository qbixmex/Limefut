import type { FC } from 'react';
import { Field, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { Controller, useFormContext } from 'react-hook-form';

export const ActiveField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="active"
      control={control}
      render={({ field }) => (
        <Field className="w-auto">
          <div className="flex items-center gap-3">
            <Switch
              id="active"
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
            />
            <FieldLabel htmlFor="active">
              {field.value ? 'Activo' : 'Desactivado'}
            </FieldLabel>
          </div>
        </Field>
      )}
    />
  );
};
