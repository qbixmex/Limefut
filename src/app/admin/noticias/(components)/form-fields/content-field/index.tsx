'use client';

import type { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { MdEditorField } from '@/app/admin/paginas/(components)/md-editor-field';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

export const ContentField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="content"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Contenido <span className="text-amber-500">*</span>
          </FieldLabel>
          <MdEditorField
            markdownString={field.value}
            setContent={(value) => field.onChange(value)}
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
