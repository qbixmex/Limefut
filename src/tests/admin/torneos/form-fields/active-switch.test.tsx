import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActiveSwitch } from '@/app/admin/torneos/(components)/form-fields/active-switch';
import { createTournamentSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ active: boolean }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createTournamentSchema) as any,
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function SetNonBooleanValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('active', 'invalid' as never, { shouldValidate: true });
  }, [setValue]);
  return null;
}

function FormErrorIndicator() {
  const { formState } = useFormContext();
  const error = formState.errors.active;
  const message = typeof error === 'object' && error !== null && 'message' in error ? String(error.message) : '';
  return <span data-testid="form-error">{message}</span>;
}

describe('Test on <ActiveSwitch />', () => {
  test('Should render correctly', () => {
    render(
      <TestWrapper>
        <ActiveSwitch />
      </TestWrapper>,
    );

    const switchField = screen.getByRole('switch', { name: /activo/i });
    expect(switchField).toBeInTheDocument();
  });

  test('Should be unchecked by default', () => {
    render(
      <TestWrapper>
        <ActiveSwitch />
      </TestWrapper>,
    );

    const switchField = screen.getByRole('switch', { name: /activo/i });
    expect(switchField).toHaveAttribute('aria-checked', 'false');
  });

  test('Should toggle on when clicked', async () => {
    render(
      <TestWrapper>
        <ActiveSwitch />
      </TestWrapper>,
    );

    const switchField = screen.getByRole('switch', { name: /activo/i });

    const user = userEvent.setup();
    await user.click(switchField);

    expect(switchField).toHaveAttribute('aria-checked', 'true');
  });

  test('Should toggle off when clicked twice', async () => {
    render(
      <TestWrapper>
        <ActiveSwitch />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const switchField = screen.getByRole('switch', { name: /activo/i });
    await user.click(switchField);
    await user.click(switchField);

    expect(switchField).toHaveAttribute('aria-checked', 'false');
  });

  test('Should show error when value is not a boolean', async () => {
    render(
      <TestWrapper>
        <ActiveSwitch />
        <FormErrorIndicator />
        <SetNonBooleanValue />
      </TestWrapper>,
    );

    await screen.findByText(/falso o verdadero/i);
    expect(screen.getByTestId('form-error')).toHaveTextContent(/falso o verdadero/i);
  });
});
