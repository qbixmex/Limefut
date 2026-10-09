import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import CharactersCounter from '@/shared/components/characters-counter';
import { Textarea } from '@/components/ui/textarea';

const SEO_DESCRIPTION_LIMIT = 160;

export const SeoDescriptionTextArea = () => {
  const { control } = useFormContext();
  const [focused, setFocused] = useState(false);

  return (
    <Controller
      control={control}
      name="seoDescription"
      render={({ field, fieldState }) => {
        const count = field.value?.length ?? 0;

        return (
          <>
            <Field>
              <FieldLabel>Descripción SEO</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ''}
                className="h-[115px] resize-none"
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
                  limit={SEO_DESCRIPTION_LIMIT}
                />
              </div>
            )}
          </>
        );
      }}
    />
  );
};
