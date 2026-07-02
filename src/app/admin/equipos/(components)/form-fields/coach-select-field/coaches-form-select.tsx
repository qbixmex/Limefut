'use client';

import type { FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Controller, useFormContext } from 'react-hook-form';

type Props = Readonly<{
  coaches: COACH_TYPE[];
}>;

type COACH_TYPE = {
  id: string;
  name: string;
};

export const CoachesFormSelect: FC<Props> = ({ coaches }) => {
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="coachId"
      render={(({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Entrenador <span className="text-gray-500">(opcional)</span>
          </FieldLabel>
          <Select
            value={field.value ?? ''}
            onValueChange={field.onChange}
            aria-invalid={fieldState.invalid}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione un entrenador" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="none">
                  ninguno
                </SelectItem>
                {coaches.map(({ id, name }) => (
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
