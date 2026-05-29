'use client';

import { useState } from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover';
import { es } from 'date-fns/locale';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

export const PublishedDateField = () => {
  const { formState, getValues, setValue } = useFormContext();
  const [openPublishedDateCalendar, setOpenPublishedDateCalendar] = useState(false);
  const [selectedPublishedDate, setSelectedPublishedDate] = useState<Date | undefined>(() => {
    return getValues('publishedDate');
  });

  return (
    <FormField
      name="publishedDate"
      render={() => (
        <FormItem>
          <FormLabel htmlFor="date-picker" className="px-1">
            Fecha de publicación <span className="text-amber-500">*</span>
          </FormLabel>
          <FormControl>
            <Popover open={openPublishedDateCalendar} onOpenChange={setOpenPublishedDateCalendar}>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant="secondary"
                  className={cn('justify-between font-normal', {
                    'border-destructive border': formState.errors.publishedDate,
                  })}
                  aria-invalid={formState.errors.publishedDate ? 'true' : 'false'}
                >
                  {selectedPublishedDate
                    ? format(selectedPublishedDate, "d 'de' MMMM 'del' yyyy", { locale: es })
                    : 'Seleccione la fecha de publicación'
                  }
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedPublishedDate}
                  defaultMonth={selectedPublishedDate}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setSelectedPublishedDate(date);
                    setValue('publishedDate', date);
                    setOpenPublishedDateCalendar(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
