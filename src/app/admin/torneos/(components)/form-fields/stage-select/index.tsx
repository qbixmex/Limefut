'use client';

import type { FC } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError } from '@/components/ui/field';

export const StageSelect: FC = () => {
  const { control, setValue } = useFormContext();
  const handleValueChange = (value: string) => {
    setValue('stage', value, { shouldValidate: true });
  };

  return (
    <Controller
      name="stage"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <Select
            value={field.value ?? ''}
            onValueChange={handleValueChange}
            aria-invalid={fieldState.invalid}
          >
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="Seleccione una fase" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="playoffs">Liguilla</SelectItem>
                <SelectItem value="finals">Finales</SelectItem>
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
