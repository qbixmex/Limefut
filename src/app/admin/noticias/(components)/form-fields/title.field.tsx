'use client';

import type { ChangeEvent, FC } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { slugify } from '@/lib/utils';
import { useFormContext } from 'react-hook-form';

type Props = Readonly<{
  permalinkChanged: boolean;
  handlePermalinkChanged: (status: boolean) => void;
}>;

export const TitleField: FC<Props> = ({ permalinkChanged, handlePermalinkChanged }) => {
  const { setValue } = useFormContext();

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue('title', event.target.value, { shouldValidate: true });
    if (!permalinkChanged) {
      setValue('permalink', slugify(event.target.value), { shouldValidate: true });
      handlePermalinkChanged(false);
    }
  };

  return (
    <FormField
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Título <span className="text-amber-500">*</span>
          </FormLabel>
          <FormControl>
            <Input
              {...field}
              value={field.value ?? ''}
              onChange={handleTitleChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
