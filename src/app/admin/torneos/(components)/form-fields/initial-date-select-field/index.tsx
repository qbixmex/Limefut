import { useState, type FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Controller, useFormContext } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const InitialDateSelectField: FC = () => {
  const { control } = useFormContext();
  const [openInitDateCalendar, setOpenInitDateCalendar] = useState(false);

  return (
    <Controller
      name="startDate"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>
            Fecha Inicial <span className="text-amber-500">*</span>
          </FieldLabel>
          <Popover
            open={openInitDateCalendar}
            onOpenChange={setOpenInitDateCalendar}
          >
            <PopoverTrigger asChild>
              <Button
                id="date-picker"
                variant="secondary"
                className="w-full justify-between font-normal"
              >
                {
                  field.value
                    ? format(field.value as Date, "d 'de' MMMM 'del' yyyy", { locale: es })
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
                selected={field.value as Date}
                defaultMonth={field.value as Date}
                captionLayout="dropdown"
                onSelect={(date) => {
                  field.onChange(date);
                  setOpenInitDateCalendar(false);
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
