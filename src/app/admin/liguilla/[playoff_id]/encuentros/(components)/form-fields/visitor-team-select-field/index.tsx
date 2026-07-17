'use client';

import type { FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

type Props = Readonly<{
  teams: { id: string; name: string; }[];
}>;

export const VisitorTeamSelectField: FC<Props> = ({ teams }) => {
  const { control } = useFormContext();
  const localId = useWatch({ name: 'localTeamId' });

  return (
    <Controller
      name="visitorTeamId"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>Equipo Visitante</FieldLabel>
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={teams.length === 0}
          >
            <SelectTrigger
              aria-invalid={fieldState.invalid}
              className="min-w-30"
            >
              <SelectValue placeholder="seleccione equipo visitante" />
            </SelectTrigger>
            <SelectContent>
              {teams.map(({ id, name }) => (
                <SelectItem
                  key={id}
                  value={id}
                  disabled={id === localId}
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
