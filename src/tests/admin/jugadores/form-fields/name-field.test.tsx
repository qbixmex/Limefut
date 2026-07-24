import { render, screen, waitFor } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { NameField } from '@/app/admin/jugadores/(components)/form-fields/name-field';
import { createPlayerSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ name: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createPlayerSchema) as any,
    defaultValues: { name: '' },
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
    setValue('name', 123, { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetShortName() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('name', 'ab', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetValidName() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('name', 'Juan', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetLongName() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('name', 'x'.repeat(51), { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <NameField />', () => {
  test('Should render correctly', () => {
    render(<NameField />, { wrapper: TestWrapper });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('Should show error when value is not a string', async () => {
    render(
      <TestWrapper>
        <NameField />
        <SetNonStringValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/expected string/i);
  });

  test('Should show error when name is less than 3 characters', async () => {
    render(
      <TestWrapper>
        <NameField />
        <SetShortName />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/mayor a 3 caracteres/i);
  });

  test('Should not show error when name has 3 or more characters', async () => {
    render(
      <TestWrapper>
        <NameField />
        <SetValidName />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  test('Should show error when name exceeds 50 characters', async () => {
    render(
      <TestWrapper>
        <NameField />
        <SetLongName />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/menor a 50 caracteres/i);
  });
});
