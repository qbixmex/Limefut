import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActiveSwitch } from '@/app/admin/jugadores/(components)/form-fields/active-switch';
import { createPlayerSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ active: boolean }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createPlayerSchema) as any,
    defaultValues: { active: false },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function SetNullActive() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('active', null, { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <ActiveSwitch />', () => {
  const renderComponent = () => {
    render(
      <TestWrapper>
        <ActiveSwitch />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const switchField = screen.getByRole('switch', { name: /activo/i });

    return { user, switchField };
  };

  test('Should render correctly', () => {
    const { switchField } = renderComponent();

    expect(switchField).toBeInTheDocument();
  });

  test('Should be unchecked by default', () => {
    const { switchField } = renderComponent();

    expect(switchField).toHaveAttribute('aria-checked', 'false');
  });

  test('Should toggle on when clicked', async () => {
    const { user, switchField } = renderComponent();

    await user.click(switchField);

    expect(switchField).toHaveAttribute('aria-checked', 'true');
  });

  test('Should toggle off when clicked twice', async () => {
    const { user, switchField } = renderComponent();

    await user.click(switchField);
    await user.click(switchField);

    expect(switchField).toHaveAttribute('aria-checked', 'false');
  });

  test('Should stay unchecked when the value is null', () => {
    render(
      <TestWrapper>
        <ActiveSwitch />
        <SetNullActive />
      </TestWrapper>,
    );

    expect(screen.getByRole('switch', { name: /activo/i })).toHaveAttribute(
      'aria-checked',
      'false',
    );
  });
});
