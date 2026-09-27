'use client';

import type { FC } from 'react';
import { useEffect, useRef } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

export const ImageField: FC = () => {
  const { control } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const image = useWatch({ control, name: 'image' });

  useEffect(() => {
    if (!image && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [image]);

  return (
    <Controller
      control={control}
      name="image"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Imagen <span className="text-gray-500">(opcional)</span>
          </FieldLabel>
          <Input
            ref={fileInputRef}
            type="file"
            value={undefined}
            onChange={(e) => {
              const file = e.target.files?.[0];
              field.onChange(file);
            }}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
