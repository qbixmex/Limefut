import { render, screen, waitFor } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { PhoneField } from '@/app/admin/jugadores/(components)/form-fields/phone-field';
import { createPlayerSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ phone: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createPlayerSchema) as any,
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
    setValue('phone', '123', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetValidPhone() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('phone', '555-1234', { shouldValidate: true });
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

  test('Should show error when phone is less than 5 characters', async () => {
    render(
      <TestWrapper>
        <PhoneField />
        <SetShortPhone />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/mayor a 5 caracteres/i);
  });

  test('Should not show error when phone has 5 or more characters', async () => {
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
