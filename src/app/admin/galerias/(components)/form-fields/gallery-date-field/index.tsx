import { useState, type FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Field, FieldLabel } from '@/components/ui/field';
import { ChevronDownIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const GalleryDateField: FC = () => {
  const { control } = useFormContext();
  const [openCalendar, setOpenCalendar] = useState(false);

  return (
    <Controller
      name="galleryDate"
      control={control}
      render={({ field }) => (
        <Field>
          <FieldLabel htmlFor="date-picker">Fecha</FieldLabel>
          <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
            <PopoverTrigger asChild>
              <Button
                id="date-picker"
                type="button"
                variant="secondary"
                className="w-[220px] justify-between font-normal"
              >
                {
                  field.value
                    ? format(field.value, "d 'de' MMMM 'del' yyyy", { locale: es })
                    : 'Selecciona Fecha'
                }
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                startMonth={new Date(2020, 0)}
                endMonth={new Date(new Date().getFullYear() + 10, 11)}
                selected={field.value}
                defaultMonth={field.value}
                captionLayout="dropdown"
                onSelect={(date) => {
                  field.onChange(date);
                  setOpenCalendar(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </Field>
      )}
    />
  );
};
