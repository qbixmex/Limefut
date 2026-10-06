import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageField } from '@/app/admin/noticias/(components)/form-fields/image-field';
import { CreateAnnouncementSchema } from '@/shared/schemas';

function FormValueDisplay() {
  const image = useWatch({ name: 'image' });
  return <span data-testid="image-value">{image?.name ?? ''}</span>;
}

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateAnnouncementSchema) as any,
    mode: 'onChange',
    defaultValues: {
      title: 'Noticia de prueba',
      permalink: 'noticia-de-prueba',
      publishedDate: new Date(),
      description: 'Descripción de prueba',
      content: 'Contenido de prueba',
      image: undefined,
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

function SetNonFileValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('image', 'my-image.jpg' as never, { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <ImageField />', () => {
  const renderComponent = (extra?: ReactNode) => {
    const { container } = render(
      <TestWrapper>
        <ImageField />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const imageInput = container.querySelector('#image-field') as HTMLInputElement;

    return { user, imageInput };
  };

  test('Should render correctly', () => {
    const { imageInput } = renderComponent();

    expect(screen.getByRole('group')).toBeInTheDocument();
    expect(screen.getByText(/imagen/i)).toBeInTheDocument();
    expect(imageInput).toBeInTheDocument();
    expect(imageInput).toHaveAttribute('type', 'file');
  });

  test('Should not show an error when the image is empty', () => {
    renderComponent();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should update the value when a valid image is uploaded', async () => {
    const { user, imageInput } = renderComponent();
    const file = new File(['content'], 'picture.png', { type: 'image/png' });

    await user.upload(imageInput, file);

    expect(screen.getByTestId('image-value')).toHaveTextContent('picture.png');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show an error when the value is not a File', async () => {
    renderComponent(<SetNonFileValue />);

    const alert = await screen.findByRole('alert');

    expect(alert).toHaveTextContent(/debe ser un archivo/i);
  });

  test('Should show an error when the file type is not accepted', async () => {
    const { user, imageInput } = renderComponent();
    const file = new File(['content'], 'nota.txt', { type: 'text/plain' });

    await user.upload(imageInput, file);

    expect(screen.getByRole('alert')).toHaveTextContent(/tipo de archivo/i);
  });

  test('Should show an error when the file exceeds 2 mb', async () => {
    const { user, imageInput } = renderComponent();
    const file = new File([new Uint8Array(1024 * 1024 * 2 + 1)], 'grande.png', {
      type: 'image/png',
    });

    await user.upload(imageInput, file);

    expect(screen.getByRole('alert')).toHaveTextContent(/menor a 2 mb/i);
  });
});
