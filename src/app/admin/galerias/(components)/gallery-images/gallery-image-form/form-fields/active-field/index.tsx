import type { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';

export const ActiveField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="active"
      control={control}
      render={({ field }) => (
        <Field orientation="horizontal" className="w-auto">
          <Switch
            id="active"
            checked={field.value ?? false}
            onCheckedChange={field.onChange}
          />
          <FieldLabel htmlFor="active">
            {field.value ? 'Visible' : 'Oculta'}
          </FieldLabel>
        </Field>
      )}
    />
  );
};
