import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageField } from '@/app/admin/galerias/(components)/gallery-images/gallery-image-form/form-fields/image-field';
import { createGalleryImageSchema } from '@/shared/schemas';

function FormValueDisplay() {
  const image = useWatch({ name: 'image' });

  return <span data-testid="image-value">{image?.name ?? ''}</span>;
}

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({
    resolver: zodResolver(createGalleryImageSchema),
    mode: 'onChange',
    defaultValues: {
      title: 'Imagen de prueba',
      image: undefined,
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

describe('Test on <ImageField />', () => {
  const renderComponent = () => {
    render(
      <TestWrapper>
        <ImageField />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const imageInput = screen.getByLabelText('Imagen');

    return { user, imageInput };
  };

  test('Should render correctly', () => {
    const { imageInput } = renderComponent();

    expect(imageInput).toBeInTheDocument();
    expect(imageInput).toHaveAttribute('type', 'file');
  });

  test('Should update the value when a valid image is uploaded', async () => {
    const { user, imageInput } = renderComponent();
    const file = new File(['content'], 'foto.png', { type: 'image/png' });

    await user.upload(imageInput, file);

    expect(screen.getByTestId('image-value')).toHaveTextContent('foto.png');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show an error when the file type is not accepted', async () => {
    const { user, imageInput } = renderComponent();
    const file = new File(['content'], 'nota.txt', { type: 'text/plain' });

    await user.upload(imageInput, file);

    expect(screen.getByRole('alert')).toHaveTextContent(
      /tipo de archivo debe ser uno de los siguientes/i,
    );
  });

  test('Should show an error when the file is too large', async () => {
    const { user, imageInput } = renderComponent();
    const file = new File(
      [new Uint8Array(1024 * 1024 * 2 + 1)],
      'grande.png',
      { type: 'image/png' },
    );

    await user.upload(imageInput, file);

    expect(screen.getByRole('alert')).toHaveTextContent(
      /tamaño máximo de la imagen/i,
    );
  });
});
