'use client';

import type { FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Controller, useFormContext } from 'react-hook-form';
import { ROUND } from '@/shared/enums';
import { getPlayoffRound } from '@/lib/utils';

export const RoundSelectField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="round"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>Ronda</FieldLabel>
          <Select
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              className="w-full"
              aria-invalid={fieldState.invalid}
            >
              <SelectValue placeholder="Seleccione ronda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ROUND.QUARTER_FINAL}>
                {getPlayoffRound(ROUND.QUARTER_FINAL)}
              </SelectItem>
              <SelectItem value={ROUND.SEMI_FINAL}>
                {getPlayoffRound(ROUND.SEMI_FINAL)}
              </SelectItem>
              <SelectItem value={ROUND.FINAL}>
                {getPlayoffRound(ROUND.FINAL)}
              </SelectItem>
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
