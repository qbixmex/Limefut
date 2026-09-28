import type { FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Controller, useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';

export const DescriptionTextArea: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="description"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Descripción <span className="text-gray-500">(opcional)</span>
          </FieldLabel>
          <Textarea
            {...field}
            value={field.value ?? ''}
            className="resize-none"
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
