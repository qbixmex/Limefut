'use client';

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

type Props = {
  name: 'localScore' | 'visitorScore';
  label: string;
};

export const ScoreField = ({ name, label }: Props) => (
  <FormField
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            id={name}
            type="number"
            {...field}
            min={0}
            max={50}
            value={field.value ?? ''}
            onChange={(e) => field.onChange(parseInt(e.target.value))}
            className="w-full lg:w-[75px]"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
