import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import CharactersCounter from '@/shared/components/characters-counter';
import { Textarea } from '@/components/ui/textarea';
import type { CountCharacters } from '../../../editar/[id]/edit-custom-page-view';

export const SeoDescriptionTextArea = () => {
  const { control, watch } = useFormContext();
  const [seoDescriptionChars, setSeoDescriptionChars] = useState<CountCharacters>({
    count: watch('seoDescription')?.length ?? 0,
    focused: false,
  });

  return (
    <>
      <Controller
        control={control}
        name="seoDescription"
        render={({ field, fieldState }) => (
          <Field>
            <FieldLabel>Descripción SEO</FieldLabel>
            <Textarea
              {...field}
              value={field.value ?? ''}
              className="h-[115px] resize-none"
              onFocus={() => setSeoDescriptionChars((prev) => ({
                ...prev,
                focused: true,
              }))}
              onBlur={() => setSeoDescriptionChars((prev) => ({
                ...prev,
                focused: false,
              }))}
              onChange={(event) => {
                field.onChange(event);
                setSeoDescriptionChars(prev => ({
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
      {seoDescriptionChars.focused && (
        <div className="mt-3 ml-2">
          <CharactersCounter
            charactersCount={seoDescriptionChars.count}
            limit={160}
          />
        </div>
      )}
    </>
  );
};
