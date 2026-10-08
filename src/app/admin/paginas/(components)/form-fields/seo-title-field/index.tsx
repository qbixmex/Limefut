'use client';

import { useState } from 'react';
import CharactersCounter from '@/shared/components/characters-counter';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { CountCharacters } from '../../../editar/[id]/edit-custom-page-view';

export const SeoTitleField = () => {
  const { control, watch } = useFormContext();
  const [seoTitleChars, setSeoTitleChars] = useState<CountCharacters>({
    count: watch('seoTitle').length ?? 0,
    focused: false,
  });

  return (
    <>
      <Controller
        control={control}
        name="seoTitle"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Título SEO</FieldLabel>
            <Input
              {...field}
              value={field.value ?? ''}
              onFocus={() => setSeoTitleChars((prev) => ({
                ...prev,
                focused: true,
              }))}
              onBlur={() => setSeoTitleChars((prev) => ({
                ...prev,
                focused: false,
              }))}
              onChange={(event) => {
                field.onChange(event);
                setSeoTitleChars(prev => ({
                  ...prev,
                  count: event.target.value.length,
                }));
              }}
            />
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
      {seoTitleChars.focused && (
        <div className="mt-3 ml-2">
          <CharactersCounter
            charactersCount={seoTitleChars.count}
            limit={70}
          />
        </div>
      )}
    </>
  );
};
