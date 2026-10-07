'use client';

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
            <FieldLabel htmlFor="active">
              {field.value ? 'Activo' : 'No activo'}
            </FieldLabel>
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
