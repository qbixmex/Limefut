'use client';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Controller, useFormContext } from 'react-hook-form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PLATFORM } from '@/shared/constants/platforms';

export const PlatformSelectField = () => {
  const { control, formState } = useFormContext();

  return (
    <Controller
      name="platform"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Plataforma <span className="text-amber-500">*</span>
          </FieldLabel>
          <Select
            value={field.value ?? ''}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              className="w-full"
              aria-invalid={!!formState.errors.platform}
            >
              <SelectValue placeholder="Seleccione plataforma" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={PLATFORM.YOUTUBE}>Youtube</SelectItem>
                <SelectItem value={PLATFORM.FACEBOOK}>Facebook</SelectItem>
              </SelectGroup>
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
