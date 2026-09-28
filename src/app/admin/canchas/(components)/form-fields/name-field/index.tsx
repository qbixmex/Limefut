import type { ChangeEvent, FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';
import { slugify } from '@/lib/utils';

type Props = Readonly<{ isPermalinkEdited: boolean }>;

export const NameField: FC<Props> = ({ isPermalinkEdited }) => {
  const { control, setValue } = useFormContext();

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('name', event.target.value, { shouldValidate: true });
    if (!isPermalinkEdited) {
      setValue('permalink', slugify(event.target.value), { shouldValidate: true });
    }
  };

  return (
    <Controller
      name="name"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Nombre <span className="text-amber-500">*</span>
          </FieldLabel>
          <Input
            {...field}
            value={field.value ?? ''}
            onChange={handleNameChange}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
