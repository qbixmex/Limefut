import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActiveVideoSwitch } from '@/app/admin/videos/(components)/form-fields/active-video-switch';
import { createVideoSchema } from '@/shared/schemas';

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createVideoSchema) as any,
    defaultValues: {
      title: '',
      permalink: '',
      url: '',
      platform: undefined,
      publishedDate: undefined,
      description: '',
      active: false,
    },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function FormValueDisplay() {
  const { watch } = useFormContext();
  return <span data-testid="active-value">{String(watch('active'))}</span>;
}

describe('Test on <ActiveVideoSwitch />', () => {
  const renderComponent = () => {
    render(
      <TestWrapper>
        <ActiveVideoSwitch />
        <FormValueDisplay />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const switchField = screen.getByRole('switch', { name: /activo/i });

    return { user, switchField };
  };

  test('Should render correctly', () => {
    const { switchField } = renderComponent();

    expect(switchField).toBeInTheDocument();
    expect(screen.getByText(/no activo/i)).toBeInTheDocument();
  });

  test('Should be unchecked by default', () => {
    const { switchField } = renderComponent();

    expect(switchField).toHaveAttribute('aria-checked', 'false');
  });

  test('Should toggle on when clicked', async () => {
    const { user, switchField } = renderComponent();

    await user.click(switchField);

    expect(switchField).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByTestId('active-value')).toHaveTextContent('true');
  });

  test('Should toggle off when clicked twice', async () => {
    const { user, switchField } = renderComponent();

    await user.click(switchField);
    await user.click(switchField);

    expect(switchField).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByTestId('active-value')).toHaveTextContent('false');
  });
});
