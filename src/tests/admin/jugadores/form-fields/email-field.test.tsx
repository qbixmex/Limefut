import { render, screen, waitFor } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { EmailField } from '@/app/admin/jugadores/(components)/form-fields/email-field';
import { createPlayerSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ email: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createPlayerSchema) as any,
    defaultValues: { email: '' },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function SetInvalidEmail() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('email', 'not-an-email', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetValidEmail() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('email', 'test@email.com', { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <EmailField />', () => {
  test('Should render correctly', () => {
    render(<EmailField />, { wrapper: TestWrapper });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('Should not show error when email is empty', () => {
    render(<EmailField />, { wrapper: TestWrapper });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show error when email is invalid', async () => {
    render(
      <TestWrapper>
        <EmailField />
        <SetInvalidEmail />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/correo electrónico incorrecto/i);
  });

  test('Should not show error when email is valid', async () => {
    render(
      <TestWrapper>
        <EmailField />
        <SetValidEmail />
      </TestWrapper>,
    );

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});
