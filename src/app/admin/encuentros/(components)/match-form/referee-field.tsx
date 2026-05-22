'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export const RefereeField = () => {
  return (
    <FormField
      name="referee"
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            Arbitro <span className="text-sm text-gray-500">(opcional)</span>
          </FormLabel>
          <FormControl>
            <Input {...field} value={field.value ?? ''} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
