import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActiveSwitch } from '@/app/admin/jugadores/(components)/form-fields/active-switch';
import { createPlayerSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ active: boolean }>({
    resolver: zodResolver(createPlayerSchema) as any,
    defaultValues: { active: false },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
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
});
