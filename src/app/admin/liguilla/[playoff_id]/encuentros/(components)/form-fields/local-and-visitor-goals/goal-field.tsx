'use client';

import type { FC } from 'react';
import { Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { useGoalField } from './use-goal-field';

type Props = {
  name: string;
  label: string;
};

export const GoalField: FC<Props> = ({ name, label }) => {
  const {
    display,
    error,
    formValue,
    increment,
    decrement,
    handleInputChange,
    handleFocus,
    handleBlur,
  } = useGoalField(name);

  return (
    <Field className="w-auto">
      <FieldLabel>
        {label} <span className="text-amber-500">*</span>
      </FieldLabel>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline-primary"
          size="icon"
          className="rounded-full"
          onClick={decrement}
          disabled={formValue <= 0}
        >
          <Minus />
        </Button>
        <Input
          type="text"
          inputMode="numeric"
          className="w-16 text-center text-lg font-semibold"
          value={display}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <Button
          type="button"
          variant="outline-primary"
          size="icon"
          className="rounded-full"
          onClick={increment}
        >
          <Plus />
        </Button>
      </div>
      {error && <FieldError errors={[error as (typeof error) & { message: string }]} />}
    </Field>
  );
};
