'use client';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

import { Controller, useFormContext } from 'react-hook-form';

export const PositionSelectField = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="position"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>Posición</FieldLabel>
          <RadioGroup
            className="w-fit"
            onValueChange={(value) => field.onChange(parseInt(value))}
          >
            <div className="flex items-center gap-3">
              <RadioGroupItem id="first-position" value="1" />
              <Label htmlFor="first-position">Primera posición</Label>
            </div>
            <div className="flex items-center gap-3">
              <RadioGroupItem value="2" id="second-position" />
              <Label htmlFor="second-position">Segunda posición</Label>
            </div>
          </RadioGroup>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
