'use client';

import type { FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

type Props = Readonly<{
  teams: { id: string; name: string; }[];
}>;

export const LocalTeamSelectField: FC<Props> = ({ teams }) => {
  const { control } = useFormContext();
  const visitorId = useWatch({ name: 'visitorTeamId' });

  return (
    <Controller
      name="localTeamId"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>Equipo Local</FieldLabel>
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={teams.length === 0}
          >
            <SelectTrigger
              aria-invalid={fieldState.invalid}
              className="min-w-30"
            >
              <SelectValue placeholder="seleccione equipo local" />
            </SelectTrigger>
            <SelectContent>
              {teams.map(({ id, name }) => (
                <SelectItem
                  key={id}
                  value={id}
                  disabled={id === visitorId}
                >
                  {name}
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
