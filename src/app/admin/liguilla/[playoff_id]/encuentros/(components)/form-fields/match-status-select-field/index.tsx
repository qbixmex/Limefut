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
import { MATCH_STATUS } from '@/shared/enums';
import { getStatusTranslation } from '@/lib/utils';

export const MatchStatusSelectField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="status"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>Estado</FieldLabel>
          <Select
            value={field.value ?? ''}
            onValueChange={field.onChange}
          >
            <SelectTrigger
              className="w-full"
              aria-invalid={fieldState.invalid}
            >
              <SelectValue placeholder="Seleccione estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={MATCH_STATUS.SCHEDULED}>
                {getStatusTranslation(MATCH_STATUS.SCHEDULED)}
              </SelectItem>
              <SelectItem value={MATCH_STATUS.IN_REVIEW}>
                {getStatusTranslation(MATCH_STATUS.IN_REVIEW)}
              </SelectItem>
              <SelectItem value={MATCH_STATUS.IN_PROGRESS}>
                {getStatusTranslation(MATCH_STATUS.IN_PROGRESS)}
              </SelectItem>
              <SelectItem value={MATCH_STATUS.POST_POSED}>
                {getStatusTranslation(MATCH_STATUS.POST_POSED)}
              </SelectItem>
              <SelectItem value={MATCH_STATUS.CANCELED}>
                {getStatusTranslation(MATCH_STATUS.CANCELED)}
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
