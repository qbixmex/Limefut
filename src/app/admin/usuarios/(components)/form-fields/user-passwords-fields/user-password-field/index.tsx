'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Eye, EyeClosed } from 'lucide-react';

type Props = Readonly<{ edit?: boolean }>;

export const UserPasswordField: FC<Props> = ({ edit }) => {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name="password"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            <span>Contraseña</span>{' '}
            {!edit && <span className="text-amber-500">*</span>}
            {edit && <span className="text-gray-500">(opcional)</span>}
          </FieldLabel>
          <div className="relative">
            <Input
              {...field}
              type={showPassword ? 'text' : 'password'}
              value={field.value ?? ''}
              aria-invalid={fieldState.invalid}
            />
            {(field.value as string).length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600 hover:text-gray-400"
              >
                {showPassword ? <Eye size={16} /> : <EyeClosed size={16} />}
              </button>
            )}
          </div>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
