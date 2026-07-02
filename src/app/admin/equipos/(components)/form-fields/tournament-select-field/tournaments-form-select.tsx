'use client';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

type Props = Readonly<{
  tournaments: TOURNAMENT_TYPE[];
}>;

type TOURNAMENT_TYPE = {
  id: string;
  name: string;
};

export const TournamentsFormSelect: FC<Props> = ({ tournaments }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="tournamentId"
      render={(({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Torneo <span className="text-orange-500">*</span>
          </FieldLabel>
          <Select
            value={field.value ?? ''}
            onValueChange={field.onChange}
            aria-invalid={fieldState.invalid}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione una torneo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {tournaments.map(({ id, name }) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      ))}
    />
  );
};
