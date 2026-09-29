import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapField } from '@/app/admin/canchas/(components)/form-fields/map-field';
import { createFieldSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ map: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createFieldSchema) as any,
    defaultValues: { map: '' },
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
    setValue('map', 123, { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetShortValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('map', 'ab', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetValidValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('map', 'https://maps.app.goo.gl/abc', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetLongValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('map', 'x'.repeat(256), { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <MapField />', () => {
  test('Should render correctly', () => {
    render(
      <TestWrapper>
        <MapField />
      </TestWrapper>,
    );

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute(
      'placeholder',
      'Ejemplo: https://maps.app.goo.gl/eYugNe5Cay9cFwex9',
    );
  });

  test('Should not show error when map is empty string', async () => {
    render(
      <TestWrapper>
        <MapField />
      </TestWrapper>,
    );

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should show error when value is not a string', async () => {
    render(
      <TestWrapper>
        <MapField />
        <SetNonStringValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/mapa debe ser una cadena de texto/i);
  });

  test('Should show error when map is less than 3 characters', async () => {
    render(
      <TestWrapper>
        <MapField />
        <SetShortValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/mapa debe ser mayor a 3 caracteres/i);
  });

  test('Should not show error when map has 3 or more valid characters', async () => {
    render(
      <TestWrapper>
        <MapField />
        <SetValidValue />
      </TestWrapper>,
    );

    await waitFor(() => {
      const alert = screen.queryByRole('alert');
      expect(alert).not.toBeInTheDocument();
    });
  });

  test('Should show error when map exceeds 255 characters', async () => {
    render(
      <TestWrapper>
        <MapField />
        <SetLongValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/mapa debe ser menor a 255 caracteres/i);
  });
});
