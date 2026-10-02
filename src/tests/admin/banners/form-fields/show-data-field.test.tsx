import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShowDataField } from '@/app/admin/banners/(components)/form-fields/show-data-field';
import { createHeroBannerSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ showData: boolean }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createHeroBannerSchema) as any,
    defaultValues: { showData: false },
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
    setValue('showData', 'lorem' as never, { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <ShowDataField />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <ShowDataField />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const switchField = screen.getByRole('switch', { name: /información/i });

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
    expect(screen.getByText(/información visible/i)).toBeInTheDocument();
  });

  test('Should toggle off when clicked twice', async () => {
    const { user, switchField } = renderComponent();

    await user.click(switchField);
    await user.click(switchField);

    expect(switchField).toHaveAttribute('aria-checked', 'false');
  });

  test('Should show error when value is not a boolean', async () => {
    renderComponent(<SetNonBooleanValue />);

    await waitFor(() => {
      const alert = screen.queryByRole('alert');
      expect(alert).toHaveTextContent(/valor boleano/i);
    });
  });
});
