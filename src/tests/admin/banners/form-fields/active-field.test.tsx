import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActiveField } from '@/app/admin/banners/(components)/form-fields/active-field';
import { createHeroBannerSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ active: boolean }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createHeroBannerSchema) as any,
    defaultValues: { active: false },
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
  const message = typeof error === 'object' && error !== null && 'message' in error
    ? String(error.message)
    : '';
  return <span data-testid="form-error">{message}</span>;
}

describe('Test on <ActiveField />', () => {
  test('Should render correctly', () => {
    render(
      <TestWrapper>
        <ActiveField />
      </TestWrapper>,
    );

    const switchField = screen.getByRole('switch');
    expect(switchField).toBeInTheDocument();
  });

  test('Should be unchecked by default', () => {
    render(
      <TestWrapper>
        <ActiveField />
      </TestWrapper>,
    );

    const switchField = screen.getByRole('switch', { name: /desactivado/i });
    expect(switchField).toHaveAttribute('aria-checked', 'false');
  });

  test('Should toggle on when clicked', async () => {
    render(
      <TestWrapper>
        <ActiveField />
      </TestWrapper>,
    );

    const switchField = screen.getByRole('switch', { name: /desactivado/i });

    const user = userEvent.setup();
    await user.click(switchField);

    expect(switchField).toHaveAttribute('aria-checked', 'true');
  });

  test('Should toggle off when clicked twice', async () => {
    render(
      <TestWrapper>
        <ActiveField />
      </TestWrapper>,
    );

    const switchField = screen.getByRole('switch');
    const user = userEvent.setup();
    await user.click(switchField);
    await user.click(switchField);

    expect(switchField).toHaveAttribute('aria-checked', 'false');
  });

  test('Should show error when value is not a boolean', async () => {
    render(
      <TestWrapper>
        <ActiveField />
        <FormErrorIndicator />
        <SetNonBooleanValue />
      </TestWrapper>,
    );

    await screen.findByText(/valor boleano/i);
    expect(screen.getByTestId('form-error')).toHaveTextContent(/boleano/i);
  });
});
