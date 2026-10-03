import type { ReactNode } from 'react';
import { renderHook, act } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { useGoalField } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/local-and-visitor-goals/use-goal-field';

function createWrapper(initialValue = 0) {
  return function Wrapper({ children }: Readonly<{ children: ReactNode }>) {
    const form = useForm({ defaultValues: { localTeamScore: initialValue } });
    return <FormProvider {...form}>{children}</FormProvider>;
  };
}

const changeEvent = (value: string) =>
  ({ target: { value } }) as React.ChangeEvent<HTMLInputElement>;

describe('Tests on useGoalField hook', () => {
  test('Should initialize the display with the form value', () => {
    const { result } = renderHook(() => useGoalField('localTeamScore'), {
      wrapper: createWrapper(3),
    });

    expect(result.current.display).toBe('3');
    expect(result.current.formValue).toBe(3);
  });

  test('Should increment the value', () => {
    const { result } = renderHook(() => useGoalField('localTeamScore'), {
      wrapper: createWrapper(0),
    });

    act(() => {
      result.current.increment();
    });

    expect(result.current.formValue).toBe(1);
  });

  test('Should decrement the value', () => {
    const { result } = renderHook(() => useGoalField('localTeamScore'), {
      wrapper: createWrapper(2),
    });

    act(() => {
      result.current.decrement();
    });

    expect(result.current.formValue).toBe(1);
  });

  test('Should not decrement below zero', () => {
    const { result } = renderHook(() => useGoalField('localTeamScore'), {
      wrapper: createWrapper(0),
    });

    act(() => {
      result.current.decrement();
    });

    expect(result.current.formValue).toBe(0);
  });

  test('Should keep only digits when typing', () => {
    const { result } = renderHook(() => useGoalField('localTeamScore'), {
      wrapper: createWrapper(0),
    });

    act(() => {
      result.current.handleInputChange(changeEvent('a1b2'));
    });

    expect(result.current.display).toBe('12');
    expect(result.current.formValue).toBe(12);
  });

  test('Should reset the display to zero on blur when empty', () => {
    const { result } = renderHook(() => useGoalField('localTeamScore'), {
      wrapper: createWrapper(0),
    });

    act(() => {
      result.current.handleInputChange(changeEvent(''));
    });
    expect(result.current.display).toBe('');

    act(() => {
      result.current.handleBlur();
    });

    expect(result.current.display).toBe('0');
    expect(result.current.formValue).toBe(0);
  });
});
