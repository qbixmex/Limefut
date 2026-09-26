import type { FC } from 'react';
import { Field, FieldLabel } from '@/components/ui/field';
import { Controller, useFormContext } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';

export const UserActiveSwitch: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="isActive"
      control={control}
      render={({ field }) => (
        <Field>
          <div className="flex items-center justify-end gap-3">
            <FieldLabel htmlFor="active">Activo</FieldLabel>
            <Switch
              id="active"
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
            />
          </div>
        </Field>
      )}
    />
  );
};
