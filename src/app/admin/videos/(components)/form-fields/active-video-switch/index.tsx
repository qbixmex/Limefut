'use client';

import type { FC } from 'react';
import { Field, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { Controller, useFormContext } from 'react-hook-form';

export const ActiveVideoSwitch: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="active"
      control={control}
      render={({ field }) => (
        <Field className="w-auto">
          <FieldLabel htmlFor="active">
            {field.value ? 'Activo' : 'No activo'}
          </FieldLabel>
          <Switch
            id="active"
            checked={field.value ?? false}
            onCheckedChange={field.onChange}
          />
        </Field>
      )}
    />
  );
};
