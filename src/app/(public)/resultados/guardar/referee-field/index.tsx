import type { FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';

type Props = Readonly<{
  name?: string;
}>;

export const RefereeField: FC<Props> = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="referee"
      control={control}
      render={({ field, fieldState }) => (
        <Field>
          <FieldLabel>Arbitro</FieldLabel>
          <Input {...field} />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
