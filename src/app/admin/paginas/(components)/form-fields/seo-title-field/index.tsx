'use client';

import { useState } from 'react';
import CharactersCounter from '@/shared/components/characters-counter';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

const SEO_TITLE_LIMIT = 70;

export const SeoTitleField = () => {
  const { control } = useFormContext();
  const [focused, setFocused] = useState(false);

  return (
    <Controller
      control={control}
      name="seoTitle"
      render={({ field, fieldState }) => {
        const count = field.value?.length ?? 0;
        return (
          <>
            <Field>
              <FieldLabel>Título SEO</FieldLabel>
              <Input
                {...field}
                value={field.value ?? ''}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
            {focused && (
              <div className="mt-3 ml-2">
                <CharactersCounter
                  charactersCount={count}
                  limit={SEO_TITLE_LIMIT}
                />
              </div>
            )}
          </>
        );
      }}
    />
  );
};
