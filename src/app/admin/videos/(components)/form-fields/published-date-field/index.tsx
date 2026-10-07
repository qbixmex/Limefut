'use client';

import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Controller, useFormContext } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const PublishedDateField = () => {
  const { control } = useFormContext();
  const [openPublishedDateCalendar, setOpenPublishedDateCalendar] = useState(false);

  return (
    <Controller
      name="publishedDate"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Fecha de publicación <span className="text-amber-500">*</span>
          </FieldLabel>
          <Popover open={openPublishedDateCalendar} onOpenChange={setOpenPublishedDateCalendar}>
            <PopoverTrigger asChild>
              <Button
                id="date-picker"
                type="button"
                variant="secondary"
                className={cn('justify-between font-normal border border-input bg-input/30 text-muted-foreground', {
                  'border-destructive border': fieldState.invalid,
                })}
                aria-invalid={fieldState.invalid}
              >
                {
                  field.value
                    ? format(field.value, "d 'de' MMMM 'del' yyyy", { locale: es })
                    : 'Seleccione la fecha de publicación'
                }
                <ChevronDownIcon aria-hidden="true" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                id="calendar"
                mode="single"
                selected={field.value}
                defaultMonth={field.value}
                captionLayout="dropdown"
                data-testid="calendar"
                onSelect={(date) => {
                  field.onChange(date);
                  setOpenPublishedDateCalendar(false);
                }}
              />
            </PopoverContent>
          </Popover>
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  );
};
