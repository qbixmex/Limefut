'use client';

import type { FC } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

type TEAM_TYPE = { id: string; name: string; };
type Props = Readonly<{
  teams: TEAM_TYPE[];
  disabled: boolean;
}>;

export const VisitorTeamSelect: FC<Props> = ({ teams, disabled }) => {
  const { control } = useFormContext();
  const localTeamId = useWatch({ name: 'localTeamId' });

  return (
    <Controller
      name="visitorTeamId"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>
            Equipo Visitante <span className="text-amber-500">*</span>
          </FieldLabel>
          <Select
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger
              aria-invalid={fieldState.invalid}
              className="min-w-30"
            >
              <SelectValue placeholder="selecciona equipo visitante" />
            </SelectTrigger>
            <SelectContent>
              {teams.map(({ id, name }) => (
                <SelectItem key={id} value={id} disabled={id === localTeamId}>
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
