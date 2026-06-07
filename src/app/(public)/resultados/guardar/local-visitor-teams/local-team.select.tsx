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

export const LocalTeamSelect: FC<Props> = ({ teams, disabled }) => {
  const { control } = useFormContext();
  const visitorTeamId = useWatch({ name: 'visitorTeamId' });

  return (
    <Controller
      name="localTeamId"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>
            Equipo Local <span className="text-amber-500">*</span>
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
              <SelectValue placeholder="seleccione equipo local" />
            </SelectTrigger>
            <SelectContent>
              {teams.map(({ id, name }) => (
                <SelectItem key={id} value={id} disabled={id === visitorTeamId}>
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
