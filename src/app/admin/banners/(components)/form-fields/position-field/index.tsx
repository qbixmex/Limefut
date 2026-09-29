'use client';

import type { FC } from 'react';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Controller, useFormContext } from 'react-hook-form';
import { Minus, Plus } from 'lucide-react';
import { PositionButtonModifier } from './position-button-modifier';

export const PositionField: FC = () => {
  const { control } = useFormContext();

  return (
    <Controller
      name="position"
      control={control}
      render={({ field }) => {
        const value = Number(field.value);
        const currentPosition = Number.isFinite(value) ? value : 1;

        const incrementPosition = () => {
          field.onChange(currentPosition + 1);
        };

        const decrementPosition = () => {
          field.onChange(Math.max(1, currentPosition - 1));
        };

        return (
          <Field>
            <FieldLabel htmlFor="position">Posición</FieldLabel>
            <div className="w-full flex items-center gap-5">
              <PositionButtonModifier
                icon={Minus}
                modifyPosition={decrementPosition}
                disabled={currentPosition <= 1}
              />
              <Input
                id="position"
                type="number"
                min={1}
                value={field.value ?? '0'}
                onChange={(e) => field.onChange(parseInt(e.target.value))}
                className="w-16"
              />
              <PositionButtonModifier
                icon={Plus}
                modifyPosition={incrementPosition}
              />
            </div>
          </Field>
        );
      }}
    />
  );
};
