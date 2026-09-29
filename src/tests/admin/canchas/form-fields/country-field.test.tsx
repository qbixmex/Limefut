import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CountryField } from '@/app/admin/canchas/(components)/form-fields/country-field';
import { createFieldSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ country: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createFieldSchema) as any,
    defaultValues: { country: '' },
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
    setValue('country', 123, { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetShortValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('country', 'ab', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetValidValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('country', 'México', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetLongValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('country', 'x'.repeat(251), { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <CountryField />', () => {
  test('Should render correctly', () => {
    render(
      <TestWrapper>
        <CountryField />
      </TestWrapper>,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('Should not show error when country is empty string', async () => {
    render(
      <TestWrapper>
        <CountryField />
      </TestWrapper>,
    );

    const countryField = screen.getByRole('textbox');

    expect(countryField).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should show error when value is not a string', async () => {
    render(
      <TestWrapper>
        <CountryField />
        <SetNonStringValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/país debe ser una cadena de texto/i);
  });

  test('Should show error when country is less than 3 characters', async () => {
    render(
      <TestWrapper>
        <CountryField />
        <SetShortValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/país debe ser mayor a 3 caracteres/i);
  });

  test('Should not show error when country has 3 or more valid characters', async () => {
    render(
      <TestWrapper>
        <CountryField />
        <SetValidValue />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  test('Should show error when country exceeds 250 characters', async () => {
    render(
      <TestWrapper>
        <CountryField />
        <SetLongValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/debe ser menor a 250 caracteres/i);
  });
});
