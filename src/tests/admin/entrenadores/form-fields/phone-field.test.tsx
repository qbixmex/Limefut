import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PhoneField } from '@/app/admin/entrenadores/(components)/form-fields/phone-field';
import { createCoachSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ phone: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createCoachSchema) as any,
    defaultValues: { phone: '' },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function SetShortPhone() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('phone', '555-1234', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetValidPhone() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('phone', '555-444-3333', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetLongPhone() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('phone', 'x'.repeat(101), { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <PhoneField />', () => {
  test('Should render correctly', () => {
    render(<PhoneField />, { wrapper: TestWrapper });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('Should not show error when phone is empty', () => {
    render(<PhoneField />, { wrapper: TestWrapper });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show error when phone is less than 12 characters', async () => {
    render(
      <TestWrapper>
        <PhoneField />
        <SetShortPhone />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/mayor a 12 caracteres/i);
  });

  test('Should not show error when phone has 12 or more characters', async () => {
    render(
      <TestWrapper>
        <PhoneField />
        <SetValidPhone />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  test('Should show error when phone exceeds 100 characters', async () => {
    render(
      <TestWrapper>
        <PhoneField />
        <SetLongPhone />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/menor a 100 caracteres/i);
  });
});
