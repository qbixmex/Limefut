import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AgeField } from '@/app/admin/entrenadores/(components)/form-fields/age-field';
import { createCoachSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ age: number | undefined }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createCoachSchema) as any,
    defaultValues: { age: undefined },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function SetBelowMin() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('age', 0, { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetAboveMax() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('age', 101, { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetValidAge() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('age', 20, { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetNonIntegerValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('age', 1.5, { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <AgeField />', () => {
  test('Should render correctly', () => {
    render(<AgeField />, { wrapper: TestWrapper });

    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    expect(screen.getByLabelText(/edad/i)).toBeInTheDocument();
  });

  test('Should not show error when age is empty', () => {
    render(<AgeField />, { wrapper: TestWrapper });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show error when age is below the minimum', async () => {
    render(
      <TestWrapper>
        <AgeField />
        <SetBelowMin />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/mayor a 1/i);
  });

  test('Should show error when age exceeds the maximum', async () => {
    render(
      <TestWrapper>
        <AgeField />
        <SetAboveMax />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/menor a 100/i);
  });

  test('Should show error when value is not an integer', async () => {
    render(
      <TestWrapper>
        <AgeField />
        <SetNonIntegerValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/expected int/i);
  });

  test('Should not show error when age is valid', async () => {
    render(
      <TestWrapper>
        <AgeField />
        <SetValidAge />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
