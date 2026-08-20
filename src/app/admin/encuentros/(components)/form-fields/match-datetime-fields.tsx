'use client';

import { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Controller, useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { MATCH_TYPE } from '@/app/admin/encuentros/(actions)/fetch-match.action';

type Props = {
  match: MATCH_TYPE | null | undefined;
};

export const MatchDateTimeFields = ({ match }: Props) => {
  const { control } = useFormContext();
  const [enabledDate, setEnabledDate] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    match?.matchDate ? new Date(match.matchDate) : undefined,
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    match?.matchDate ? format(new Date(match.matchDate), 'HH:mm:ss') : '00:00:00',
  );

  return (
    <Controller
      name="matchDate"
      control={control}
      render={({ field, fieldState }) => {
        const handleTimeChange = (date: Date | undefined) => {
          setSelectedDate(date);
          if (date) {
            const [hours, minutes, seconds] = selectedTime.split(':').map(Number);
            const combined = new Date(date);
            combined.setHours(hours, minutes, seconds);
            field.onChange(combined);
          }
          setOpenCalendar(false);
        };

        return (
          <Field data-invalid={fieldState.invalid}>
            {(!enabledDate && !field.value) && (
              <div className="flex items-center gap-5">
                <Switch
                  id="set-date"
                  checked={enabledDate}
                  onCheckedChange={() => setEnabledDate(prev => !prev)}
                />
                <FieldLabel htmlFor="set-date">Programar Fecha y Hora</FieldLabel>
              </div>
            )}

            {(enabledDate || field.value) && (
              <div className="flex gap-5">
                <div className="flex flex-col gap-3">
                  <FieldLabel htmlFor="date-picker" className="px-1">
                    Fecha
                  </FieldLabel>
                  <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-picker"
                        variant="secondary"
                        className="w-[225px] justify-between font-normal"
                        aria-invalid={fieldState.invalid}
                      >
                        {
                          selectedDate
                            ? format(selectedDate as Date, "d 'de' MMMM 'del' yyyy", { locale: es })
                            : (
                              <span>
                                Seleccione Fecha&nbsp;
                                <span className="text-sm text-gray-500">(optional)</span>
                              </span>
                            )
                        }
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        startMonth={new Date(2020, 0)}
                        endMonth={new Date(new Date().getFullYear() + 10, 11)}
                        selected={selectedDate}
                        defaultMonth={selectedDate}
                        captionLayout="dropdown"
                        onSelect={handleTimeChange}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="time-picker" className="px-1">
                    Hora
                  </Label>
                  <Input
                    id="time-picker"
                    type="time"
                    step="1"
                    min="00:00:00"
                    value={selectedTime}
                    onChange={(e) => {
                      const value = !e.target.value ? '00:00:00' : e.target.value;
                      setSelectedTime(value);
                      if (selectedDate) {
                        const [hours, minutes, seconds] = value.split(':').map(Number);
                        const combined = new Date(selectedDate);
                        combined.setHours(hours, minutes, seconds);
                        field.onChange(combined);
                      }
                    }}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    aria-invalid={fieldState.invalid}
                  />
                </div>
              </div>
            )}
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        );
      }}
    />
  );
};
