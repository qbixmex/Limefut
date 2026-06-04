'use client';

import { useState, useEffect, useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export const useGoalField = (name: string) => {
  const { setValue, formState } = useFormContext();
  const formValue = useWatch({ name }) ?? 0;
  const [display, setDisplay] = useState(String(formValue));

  useEffect(() => {
    setDisplay(String(formValue));
  }, [formValue]);

  const increment = useCallback(() => {
    setValue(name, formValue + 1, { shouldValidate: true });
  }, [formValue, name, setValue]);

  const decrement = useCallback(() => {
    if (formValue <= 0) return;
    setValue(name, formValue - 1, { shouldValidate: true });
  }, [formValue, name, setValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw === '') {
      setDisplay('');
      return;
    }
    const digits = raw.replace(/\D/g, '');
    setDisplay(digits);
    if (digits !== '') {
      setValue(name, parseInt(digits, 10), { shouldValidate: true });
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleBlur = () => {
    if (display === '') {
      setDisplay('0');
      setValue(name, 0, { shouldValidate: true });
    }
  };

  const error = formState.errors[name];

  return {
    display,
    error,
    formValue,
    increment,
    decrement,
    handleInputChange,
    handleFocus,
    handleBlur,
  };
};
