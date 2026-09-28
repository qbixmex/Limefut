import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddressField } from '@/app/admin/canchas/(components)/form-fields/address-field';
import { createFieldSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ address: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createFieldSchema) as any,
    defaultValues: { address: '' },
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
    setValue('address', 123, { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetShortValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('address', 'ab', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetValidValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('address', 'Avenida La Paz 3465', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetLongValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('address', 'x'.repeat(251), { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <AddressField />', () => {
  test('Should render correctly', () => {
    render(
      <TestWrapper>
        <AddressField />
      </TestWrapper>,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('Should not show error when address is empty string', async () => {
    render(
      <TestWrapper>
        <AddressField />
      </TestWrapper>,
    );

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should show error when value is not a string', async () => {
    render(
      <TestWrapper>
        <AddressField />
        <SetNonStringValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/dirección debe ser una cadena de texto/i);
  });

  test('Should show error when address is less than 3 characters', async () => {
    render(
      <TestWrapper>
        <AddressField />
        <SetShortValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/dirección debe ser mayor a 3 caracteres/i);
  });

  test('Should not show error when address has 3 or more valid characters', async () => {
    render(
      <TestWrapper>
        <AddressField />
        <SetValidValue />
      </TestWrapper>,
    );

    await waitFor(() => {
      const alert = screen.queryByRole('alert');
      expect(alert).not.toBeInTheDocument();
    });
  });

  test('Should show error when address exceeds 250 characters', async () => {
    render(
      <TestWrapper>
        <AddressField />
        <SetLongValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/dirección debe ser menor a 250 caracteres/i);
  });
});
