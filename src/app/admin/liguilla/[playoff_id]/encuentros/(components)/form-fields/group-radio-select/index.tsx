'use client';

import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Controller, useFormContext } from 'react-hook-form';

export const GroupRadioSelect = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="group"
      control={control}
      render={({ field, fieldState }) => (
        <Field className="w-fit">
          <FieldLabel>Grupo</FieldLabel>
          <RadioGroup
            value={field.value}
            onValueChange={field.onChange}
            aria-invalid={fieldState.invalid}
            className="flex gap-10"
          >
            <Field orientation="horizontal">
              <RadioGroupItem value="gold" id="gold" />
              <FieldContent>
                <FieldLabel htmlFor="gold">Oro</FieldLabel>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="silver" id="silver" />
              <FieldContent>
                <FieldLabel htmlFor="silver">Plata</FieldLabel>
              </FieldContent>
            </Field>
          </RadioGroup>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
