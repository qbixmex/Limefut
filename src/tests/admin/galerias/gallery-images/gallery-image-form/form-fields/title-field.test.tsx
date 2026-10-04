import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TitleField } from '@/app/admin/galerias/(components)/gallery-images/gallery-image-form/form-fields/title-field';
import { createGalleryImageSchema } from '@/shared/schemas';

function FormValueDisplay() {
  const title = useWatch({ name: 'title' });

  return <span data-testid="title-value">{title}</span>;
}

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({
    resolver: zodResolver(createGalleryImageSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
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

describe('Test on <TitleField />', () => {
  const renderComponent = () => {
    render(
      <TestWrapper>
        <TitleField />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const titleInput = screen.getByLabelText('Título de la imagen');

    return { user, titleInput };
  };

  test('Should render correctly', () => {
    const { titleInput } = renderComponent();

    expect(titleInput).toBeInTheDocument();
    expect(screen.getByText(/título de la imagen/i)).toBeInTheDocument();
  });

  test('Should update the title value when typing', async () => {
    const { user, titleInput } = renderComponent();

    await user.type(titleInput, 'Imagen de verano');

    expect(screen.getByTestId('title-value')).toHaveTextContent(
      'Imagen de verano',
    );
  });

  test('Should show an error when the title is shorter than 3 characters', async () => {
    const { user, titleInput } = renderComponent();

    await user.type(titleInput, 'ab');

    expect(screen.getByRole('alert')).toHaveTextContent(
      /título debe ser mayor a 3 caracteres/i,
    );
  });

  test('Should not show an error when the title has 3 or more characters', async () => {
    const { user, titleInput } = renderComponent();

    await user.type(titleInput, 'abc');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show an error when the title exceeds 50 characters', async () => {
    const { user, titleInput } = renderComponent();

    await user.type(titleInput, 'x'.repeat(51));

    expect(screen.getByRole('alert')).toHaveTextContent(
      /título debe ser menor a 50 caracteres/i,
    );
  });
});
