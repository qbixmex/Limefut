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
import { MATCH_MODE } from '@/shared/enums/match-mode.enum';
import { getMatchMode } from '@/lib/utils';
import { SelectGroup } from '@radix-ui/react-select';

export const MatchModeSelectField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="mode"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Modo</FieldLabel>
          <Select
            value={field.value ?? ''}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              className="w-full min-w-30"
              aria-invalid={fieldState.invalid}
            >
              <SelectValue placeholder="Seleccione tipo de partido" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value={MATCH_MODE.LEAGUE}>
                  {getMatchMode(MATCH_MODE.LEAGUE)}
                </SelectItem>
                <SelectItem value={MATCH_MODE.FRIENDLY}>
                  {getMatchMode(MATCH_MODE.FRIENDLY)}
                </SelectItem>
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
