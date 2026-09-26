'use client';

import type { FC } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select-multiple';
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { Controller, useFormContext } from 'react-hook-form';

type ROLE_TYPE = 'user' | 'admin';

type ROLE_OPTION = {
  value: ROLE_TYPE;
  label: string;
};

const ROLE_OPTIONS: ROLE_OPTION[] = [
  { value: 'user', label: 'Usuario' },
  { value: 'admin', label: 'Administrador' },
];

export const RolesSelectField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="roles"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="roles">
            Roles <span className="text-orange-500">*</span>
          </FieldLabel>
          <Select
            multiple
            items={ROLE_OPTIONS}
            value={(field.value as ROLE_TYPE[] | undefined) ?? []}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger
              id="roles"
              aria-invalid={fieldState.invalid}
              className="w-full"
            >
              <SelectValue placeholder="Seleccione un rol" />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
