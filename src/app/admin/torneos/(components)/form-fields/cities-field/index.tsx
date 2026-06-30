'use client';

import type { FC, KeyboardEvent } from 'react';
import { useState } from 'react';
import { XIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';

export const CitiesField: FC = () => {
  const { control } = useFormContext();
  const [inputValue, setInputValue] = useState('');

  return (
    <Controller
      name="cities"
      control={control}
      render={({ field, fieldState }) => {
        const cities: string[] = field.value ?? [];

        const addCity = () => {
          const trimmed = inputValue.trim();
          if (!trimmed) return;
          if (cities.some(c => c.toLowerCase() === trimmed.toLowerCase())) return;
          field.onChange([...cities, trimmed]);
          setInputValue('');
        };

        const removeCity = (city: string) => {
          field.onChange(cities.filter(c => c !== city));
        };

        const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addCity();
          }
          if (e.key === 'Backspace' && inputValue === '' && cities.length > 0) {
            removeCity(cities[cities.length - 1]);
          }
        };

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>
              Ciudad(es) <span className="text-gray-500">(opcional)</span>
            </FieldLabel>
            <div className="flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
              {cities.map(city => (
                <Badge key={city} variant="secondary" className="gap-1">
                  {city}
                  <button
                    type="button"
                    onClick={() => removeCity(city)}
                    className="ml-0.5 hover:text-destructive"
                    aria-label={`Eliminar ${city}`}
                  >
                    <XIcon className="size-3" />
                  </button>
                </Badge>
              ))}
              <Input
                ref={field.ref}
                name={field.name}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={field.onBlur}
                aria-invalid={fieldState.invalid}
                className="flex-1 min-w-[120px] border-0 shadow-none p-0 h-7 focus-visible:ring-0"
                placeholder={
                  cities.length === 0
                    ? 'Escribe una ciudad y presiona Enter'
                    : 'Agregar otra'
                }
              />
            </div>
            {fieldState.invalid && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        );
      }}
    />
  );
};
