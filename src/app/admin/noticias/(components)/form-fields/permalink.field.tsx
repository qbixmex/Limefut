'use client';

import type { FC, ChangeEvent } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';

type Props = Readonly<{
  handlePermalinkChanged: (state: boolean) => void;
}>;

export const PermalinkField: FC<Props> = ({ handlePermalinkChanged }) => {
  const { setValue } = useFormContext();

  const handlePermalinkChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('permalink', event.target.value, { shouldValidate: true });
    handlePermalinkChanged(true);
  };

  return (
    <FormField
      name="permalink"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Enlace Permanente <span className="text-amber-500">*</span>
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              value={field.value ?? ''}
              onChange={handlePermalinkChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
