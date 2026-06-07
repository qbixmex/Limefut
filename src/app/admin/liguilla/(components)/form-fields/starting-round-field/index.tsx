'use client';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PLAYOFF_ROUND } from '@/shared/enums';
import { Controller, useFormContext } from 'react-hook-form';

export const StartingRoundField = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="startingRound"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>Ronda Inicial</FieldLabel>
          <Select
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione ronda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PLAYOFF_ROUND.QUARTER_FINAL}>Cuartos de Final</SelectItem>
              <SelectItem value={PLAYOFF_ROUND.SEMI_FINAL}>Semi Finales</SelectItem>
              <SelectItem value={PLAYOFF_ROUND.FINAL}>Final</SelectItem>
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
