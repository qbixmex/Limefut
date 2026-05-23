'use client';

import { useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { MATCH_TYPE } from '@/app/admin/encuentros/(actions)/fetch-match.action';

type Props = {
  match: MATCH_TYPE | null | undefined;
};

export const MatchDateTimeFields = ({ match }: Props) => {
  const { setValue } = useFormContext();
  const [enabledDate, setEnabledDate] = useState(false);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    match?.matchDate ? new Date(match.matchDate) : undefined,
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    match?.matchDate ? format(new Date(match.matchDate), 'HH:mm:ss') : '00:00:00',
  );

  return (
    <>
      {(!enabledDate && !match?.matchDate) && (
        <div className="flex items-center gap-5">
          <Switch
            id="set-date"
            checked={enabledDate}
            onCheckedChange={() => setEnabledDate(prev => !prev)}
          />
          <Label htmlFor='set-date'>Programar Fecha y Hora</Label>
        </div>
      )}

      {(enabledDate || match?.matchDate) && (
        <div className="flex gap-5">
          <div className="flex flex-col gap-3">
            <Label htmlFor="date-picker" className="px-1">
              Fecha
            </Label>
            <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant="secondary"
                  className="w-[225px] justify-between font-normal"
                >
                  {selectedDate
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
                  onSelect={(date) => {
                    setSelectedDate(date);
                    if (date) {
                      const [hours, minutes, seconds] = selectedTime.split(':').map(Number);
                      const combined = new Date(date);
                      combined.setHours(hours, minutes, seconds);
                      setValue('matchDate', combined);
                    }
                    setOpenCalendar(false);
                  }}
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
                  setValue('matchDate', combined);
                }
              }}
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </div>
        </div>
      )}
    </>
  );
};
