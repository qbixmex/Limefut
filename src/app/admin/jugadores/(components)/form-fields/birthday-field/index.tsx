import type { FC } from 'react';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const BirthdayField: FC = () => {
  const { control, setValue } = useFormContext();

  const birthdayValue = useWatch({
    control,
    name: 'birthday',
  });

  return (
    <Controller
      name="birthday"
      control={control}
      render={({ fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Fecha de Nacimiento</FieldLabel>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Día"
              min={1}
              max={31}
              value={birthdayValue ? format(birthdayValue as Date, 'd') : ''}
              onChange={(e) => {
                const currentDate = (birthdayValue as Date) || new Date();
                const newDate = new Date(currentDate);
                newDate.setDate(parseInt(e.target.value) || 1);
                setValue('birthday', newDate);
              }}
              className="w-20"
              aria-invalid={fieldState.invalid}
            />
            <Input
              type="number"
              placeholder="Mes"
              min={1}
              max={12}
              value={birthdayValue ? format(birthdayValue as Date, 'M') : ''}
              onChange={(e) => {
                const currentDate = (birthdayValue as Date) || new Date();
                const newDate = new Date(currentDate);
                newDate.setMonth((parseInt(e.target.value) || 1) - 1);
                setValue('birthday', newDate);
              }}
              className="w-20"
              aria-invalid={fieldState.invalid}
            />
            <Input
              type="number"
              placeholder="Año"
              min={2000}
              max={new Date().getFullYear()}
              value={birthdayValue ? format(birthdayValue as Date, 'yyyy') : ''}
              onChange={(e) => {
                const currentDate = (birthdayValue as Date) || new Date();
                const newDate = new Date(currentDate);
                newDate.setFullYear(parseInt(e.target.value) || 2000);
                setValue('birthday', newDate);
              }}
              className="w-24"
              aria-invalid={fieldState.invalid}
            />
            <span className="text-sm text-gray-400 italic">
              {birthdayValue
                ? format(birthdayValue as Date, "d 'de' MMMM 'del' yyyy", { locale: es })
                : ''}
            </span>
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};
