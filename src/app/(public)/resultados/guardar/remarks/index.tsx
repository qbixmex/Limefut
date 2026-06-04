'use client';

import { Textarea } from '@/components/ui/textarea';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Controller, useFormContext } from 'react-hook-form';

export const Remarks = () => {
  const { control } = useFormContext();

  return (
    <section className="mb-10">
      <Controller
        name="remarks"
        control={control}
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel htmlFor={field.name}>
              Comentarios <span className="text-gray-400 dark:text-gray-600">(opcional)</span>
            </FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              rows={5}
              placeholder="¿ Hubo algún incidente ó detalle a mencionar ?"
              className="h-auto max-h-25 resize-none"
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
    </section>
  );
};
