import type { FC } from 'react';
import { Field, FieldLabel } from '@/components/ui/field';
import { Switch } from '@/components/ui/switch';
import { Controller, useFormContext } from 'react-hook-form';

export const ShowDataField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="showData"
      control={control}
      render={({ field }) => (
        <Field className="w-auto">
          <div className="inline-flex items-center gap-3">
            <FieldLabel htmlFor="showData">
              Información {field.value ? 'Visible' : 'Oculta'}
            </FieldLabel>
            <Switch
              id="showData"
              checked={field.value ?? false}
              onCheckedChange={field.onChange}
            />
          </div>
        </Field>
      )}
    />
  );
};
