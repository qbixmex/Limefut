import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CityField } from '@/app/admin/canchas/(components)/form-fields/city-field';
import { createFieldSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ city: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createFieldSchema) as any,
    defaultValues: { city: '' },
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
    setValue('city', 123, { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetShortValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('city', 'ab', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetValidValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('city', 'Guadalajara', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetLongValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('city', 'x'.repeat(251), { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <CityField />', () => {
  test('Should render correctly', () => {
    render(
      <TestWrapper>
        <CityField />
      </TestWrapper>,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('Should not show error when city is empty string', async () => {
    render(
      <TestWrapper>
        <CityField />
      </TestWrapper>,
    );

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should show error when value is not a string', async () => {
    render(
      <TestWrapper>
        <CityField />
        <SetNonStringValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/ciudad debe ser una cadena de texto/i);
  });

  test('Should show error when city is less than 3 characters', async () => {
    render(
      <TestWrapper>
        <CityField />
        <SetShortValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/ciudad debe ser mayor a 3 caracteres/i);
  });

  test('Should not show error when city has 3 or more valid characters', async () => {
    render(
      <TestWrapper>
        <CityField />
        <SetValidValue />
      </TestWrapper>,
    );

    await waitFor(() => {
      const alert = screen.queryByRole('alert');
      expect(alert).not.toBeInTheDocument();
    });
  });

  test('Should show error when city exceeds 250 characters', async () => {
    render(
      <TestWrapper>
        <CityField />
        <SetLongValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/menor a 250 caracteres/i);
  });
});
