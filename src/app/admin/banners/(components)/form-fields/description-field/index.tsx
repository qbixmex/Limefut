'use client';

import { useState, type FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { CharactersCounter } from '@/shared/components/characters-counter';

export const DescriptionField: FC = () => {
  const { control } = useFormContext();
  const description = useWatch({ control, name: 'description' }) as string | undefined;
  const [focused, setFocused] = useState(false);

  return (
    <Controller
      name="description"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Descripción <span className="text-amber-500">*</span>
          </FieldLabel>
          <Textarea
            {...field}
            value={field.value ?? ''}
            className="h-[115px] resize-none"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-invalid={fieldState.invalid}
          />

          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}

          {focused && (
            <div className="mt-3 ml-2">
              <CharactersCounter
                charactersCount={description?.length ?? 0}
                limit={300}
              />
            </div>
          )}
        </Field>
      )}
    />
  );
};
