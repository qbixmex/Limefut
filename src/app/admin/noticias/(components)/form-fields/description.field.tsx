'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export const DescriptionField = () => {
  return (
    <FormField
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Descripción <span className="text-amber-500">*</span>
          </FormLabel>
          <FormControl>
            <Textarea
              rows={2}
              {...field}
              value={field.value ?? ''}
              className="resize-none"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
