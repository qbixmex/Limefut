import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ActiveField } from '@/app/admin/galerias/(components)/gallery-images/gallery-image-form/form-fields/active-field';
import { createGalleryImageSchema } from '@/shared/schemas';

function FormValueDisplay() {
  const active = useWatch({ name: 'active' });

  return <span data-testid="active-value">{String(active)}</span>;
}

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({
    resolver: zodResolver(createGalleryImageSchema),
    mode: 'onChange',
    defaultValues: {
      title: 'Imagen de prueba',
      image: new File(['content'], 'imagen.png', { type: 'image/png' }),
      position: 1,
      active: false,
    },
  });

  return (
    <FormProvider {...form}>
      {children}
      <FormValueDisplay />
    </FormProvider>
  );
}

describe('Test on <ActiveField />', () => {
  const renderComponent = () => {
    render(
      <TestWrapper>
        <ActiveField />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const switchField = screen.getByRole('switch');

    return { user, switchField };
  };

  test('Should render as hidden by default', () => {
    const { switchField } = renderComponent();

    expect(switchField).toBeInTheDocument();
    expect(switchField).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByText(/oculta/i)).toBeInTheDocument();
  });

  test('Should show as visible and update the value when toggled on', async () => {
    const { user, switchField } = renderComponent();

    await user.click(switchField);

    expect(switchField).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByText(/visible/i)).toBeInTheDocument();
    expect(screen.getByTestId('active-value')).toHaveTextContent('true');
  });

  test('Should show as hidden again when toggled off', async () => {
    const { user, switchField } = renderComponent();

    await user.click(switchField);
    await user.click(switchField);

    expect(switchField).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByText(/oculta/i)).toBeInTheDocument();
    expect(screen.getByTestId('active-value')).toHaveTextContent('false');
  });
});
