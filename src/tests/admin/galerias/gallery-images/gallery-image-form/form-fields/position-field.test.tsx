import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PositionField } from '@/app/admin/galerias/(components)/gallery-images/gallery-image-form/form-fields/position-field';
import { createGalleryImageSchema } from '@/shared/schemas';

function FormValueDisplay() {
  const position = useWatch({ name: 'position' });

  return <span data-testid="position-value">{String(position)}</span>;
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

describe('Test on <PositionField />', () => {
  const renderComponent = () => {
    render(
      <TestWrapper>
        <PositionField />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const positionInput = screen.getByLabelText('Posición');

    return { user, positionInput };
  };

  test('Should render with the default value', () => {
    const { positionInput } = renderComponent();

    expect(positionInput).toBeInTheDocument();
    expect(screen.getByText(/posición/i)).toBeInTheDocument();
    expect(positionInput).toHaveValue(1);
  });

  test('Should update the position value when typing', async () => {
    const { user, positionInput } = renderComponent();

    await user.clear(positionInput);
    await user.type(positionInput, '7');

    expect(screen.getByTestId('position-value')).toHaveTextContent('7');
  });

  test('Should show an error when the position is not a number', async () => {
    const { user, positionInput } = renderComponent();

    await user.clear(positionInput);

    expect(screen.getByRole('alert')).toHaveTextContent(
      /posición debe ser un número válido/i,
    );
  });
});
