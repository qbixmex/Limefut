import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InitialDateSelectField } from '@/app/admin/torneos/(components)/form-fields/initial-date-select-field';
import { createTournamentSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ startDate: Date }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createTournamentSchema) as any,
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function TriggerValidation() {
  const { trigger } = useFormContext();
  useEffect(() => {
    trigger();
  }, [trigger]);
  return null;
}

function SetValidDate() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('startDate', new Date(2025, 5, 15), { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <InitialDateSelectField />', () => {
  test('Should render correctly', () => {
    render(
      <TestWrapper>
        <InitialDateSelectField />
      </TestWrapper>,
    );

    expect(screen.getByRole('button', { name: /selecciona fecha/i })).toBeInTheDocument();
  });

  test('Should show error when date is not provided', async () => {
    render(
      <TestWrapper>
        <InitialDateSelectField />
        <TriggerValidation />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/fecha válida/i);
  });

  test('Should not show error when date is valid', async () => {
    render(
      <TestWrapper>
        <InitialDateSelectField />
        <SetValidDate />
      </TestWrapper>,
    );

    const button = await screen.findByRole('button', { name: /15 de junio del 2025/i });
    expect(button).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
