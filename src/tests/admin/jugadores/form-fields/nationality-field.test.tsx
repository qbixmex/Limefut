import { render, screen, waitFor } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { NationalityField } from '@/app/admin/jugadores/(components)/form-fields/nationality-field';
import { createPlayerSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ nationality: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createPlayerSchema) as any,
    defaultValues: { nationality: '' },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function SetShortNationality() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('nationality', 'AB', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetValidNationality() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('nationality', 'Mexicana', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetLongNationality() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('nationality', 'x'.repeat(101), { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <NationalityField />', () => {
  test('Should render correctly', () => {
    render(<NationalityField />, { wrapper: TestWrapper });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('Should not show error when nationality is empty', () => {
    render(<NationalityField />, { wrapper: TestWrapper });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show error when nationality is less than 3 characters', async () => {
    render(
      <TestWrapper>
        <NationalityField />
        <SetShortNationality />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/mayor a 3 caracteres/i);
  });

  test('Should not show error when nationality has 3 or more characters', async () => {
    render(
      <TestWrapper>
        <NationalityField />
        <SetValidNationality />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  test('Should show error when nationality exceeds 100 characters', async () => {
    render(
      <TestWrapper>
        <NationalityField />
        <SetLongNationality />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/menor a 100 caracteres/i);
  });
});
