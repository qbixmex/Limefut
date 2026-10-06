'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { es } from 'date-fns/locale';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const PublishedDateField: FC = () => {
  const { control } = useFormContext();
  const [openPublishedDateCalendar, setOpenPublishedDateCalendar] = useState(false);

  return (
    <Controller
      control={control}
      name="publishedDate"
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="date-picker">
            Fecha de publicación <span className="text-amber-500">*</span>
          </FieldLabel>
          <Popover open={openPublishedDateCalendar} onOpenChange={setOpenPublishedDateCalendar}>
            <PopoverTrigger asChild>
              <Button
                id="date-picker"
                type="button"
                variant="secondary"
                className={cn('justify-between font-normal', {
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
