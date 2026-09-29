import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { StateField } from '@/app/admin/canchas/(components)/form-fields/state-field';
import { createFieldSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ state: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createFieldSchema) as any,
    defaultValues: { state: '' },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function SetNonStringValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('state', 123, { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetShortValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('state', 'ab', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetValidValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('state', 'Jalisco', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetLongValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('state', 'x'.repeat(251), { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <StateField />', () => {
  test('Should render correctly', () => {
    render(
      <TestWrapper>
        <StateField />
      </TestWrapper>,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('Should not show error when state is empty string', async () => {
    render(
      <TestWrapper>
        <StateField />
      </TestWrapper>,
    );

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should show error when value is not a string', async () => {
    render(
      <TestWrapper>
        <StateField />
        <SetNonStringValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/estado debe ser una cadena de texto/i);
  });

  test('Should show error when state is less than 3 characters', async () => {
    render(
      <TestWrapper>
        <StateField />
        <SetShortValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/estado debe ser mayor a 3 caracteres/i);
  });

  test('Should not show error when state has 3 or more valid characters', async () => {
    render(
      <TestWrapper>
        <StateField />
        <SetValidValue />
      </TestWrapper>,
    );

    await waitFor(() => {
      const alert = screen.queryByRole('alert');
      expect(alert).not.toBeInTheDocument();
    });
  });

  test('Should show error when state exceeds 250 characters', async () => {
    render(
      <TestWrapper>
        <StateField />
        <SetLongValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/menor a 250 caracteres/i);
  });
});
