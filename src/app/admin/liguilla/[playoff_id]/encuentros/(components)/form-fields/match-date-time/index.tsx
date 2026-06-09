'use client';

import type { FC } from 'react';
import { useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { es } from 'date-fns/locale';

export const MatchDateTime: FC = () => {
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <Controller
      name="matchDate"
      control={control}
      render={({ field, fieldState }) => {
        const dateValue = field.value as Date | undefined;

        const handleDateSelect = (date: Date | undefined) => {
          if (!date) return;
          const prev = dateValue ?? new Date();
          const next = new Date(date);
          next.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
          field.onChange(next);
          setOpen(false);
        };

        const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const [hours, minutes] = e.target.value.split(':').map(Number);
          const next = dateValue ? new Date(dateValue) : new Date();
          next.setHours(
            isNaN(hours) ? 0 : hours,
            isNaN(minutes) ? 0 : minutes,
            0,
            0,
          );
          field.onChange(next);
        };

        const timeValue = dateValue
          ? `${String(dateValue.getHours()).padStart(2, '0')}:${String(dateValue.getMinutes()).padStart(2, '0')}`
          : '';

        return (
          <section className="flex flex-row gap-5">
            <Field className="flex-2">
              <FieldLabel htmlFor="game-date">
                Fecha <span className="text-amber-500">*</span>
              </FieldLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="game-date"
                    variant="outline-secondary"
                    className="w-64 justify-between font-normal"
                    aria-invalid={fieldState.invalid}
                  >
                    {dateValue
                      ? format(dateValue, 'PPPP', { locale: es })
                      : 'Selecciona fecha del encuentro'}
                    <ChevronDownIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={dateValue}
                    captionLayout="dropdown"
                    defaultMonth={dateValue}
                    onSelect={handleDateSelect}
                  />
                </PopoverContent>
              </Popover>
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
            <Field className="flex-1">
              <FieldLabel htmlFor="game-hour">Hora</FieldLabel>
              <Input
                id="game-hour"
                type="time"
                step="1"
                value={timeValue}
                onChange={handleTimeChange}
                className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </Field>
          </section>
        );
      }}
    />
  );
};
