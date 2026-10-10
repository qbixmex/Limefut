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
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const MatchDateTimeFields = () => {
  const { control, getValues } = useFormContext();
  const [enabledDate, setEnabledDate] = useState<boolean>(!!getValues('matchDate'));
  const [openCalendar, setOpenCalendar] = useState(false);
  const defaultTime = getValues('matchDate') as Date | undefined;
  const [selectedTime, setSelectedTime] = useState<string>(
    defaultTime ? format(new Date(defaultTime), 'HH:mm:ss') : '00:00:00',
  );

  const matchDate = useWatch({ control, name: 'matchDate' }) as Date | undefined;
  const [syncedMatchDate, setSyncedMatchDate] = useState(matchDate);

  // Reset the local time input and the schedule switch whenever the form value
  // changes (e.g. `form.reset()`), so the whole field clears. Adjusting state
  // during render is the recommended pattern for syncing with a value.
  if (matchDate !== syncedMatchDate) {
    setSyncedMatchDate(matchDate);
    setSelectedTime(
      matchDate ? format(new Date(matchDate), 'HH:mm:ss') : '00:00:00',
    );
    setEnabledDate(Boolean(matchDate));
  }

  return (
    <Controller
      name="matchDate"
      control={control}
      render={({ field, fieldState }) => {
        const dateValue = matchDate;

        const handleDateSelect = (date: Date | undefined) => {
          if (!date) return;

          const [hours, minutes, seconds] = selectedTime.split(':').map(Number);
          const combined = new Date(date);
          combined.setHours(hours, minutes, seconds, 0);
          field.onChange(combined);
          setOpenCalendar(false);
        };

        const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = !e.target.value ? '00:00:00' : e.target.value;
          setSelectedTime(value);
          if (dateValue) {
            const [hours, minutes, seconds] = value.split(':').map(Number);
            const combined = new Date(dateValue);
            combined.setHours(hours, minutes, seconds);
            field.onChange(combined);
          }
        };

        return (
          <Field data-invalid={fieldState.invalid}>
            {(!enabledDate && !dateValue) && (
              <div className="flex items-center gap-5">
                <Switch
                  id="set-date"
                  checked={enabledDate}
                  onCheckedChange={() => setEnabledDate(prev => !prev)}
                />
                <FieldLabel htmlFor="set-date">Programar Fecha y Hora</FieldLabel>
              </div>
            )}

            {(enabledDate || dateValue) && (
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
                          dateValue
                            ? format(dateValue, "d 'de' MMMM 'del' yyyy", { locale: es })
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
                        selected={dateValue}
                        defaultMonth={dateValue}
                        captionLayout="dropdown"
                        onSelect={handleDateSelect}
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
                    onChange={handleTimeChange}
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
