import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImageField } from '@/app/admin/jugadores/(components)/form-fields/image-field';
import { createPlayerSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ image: File | null | undefined }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createPlayerSchema) as any,
    defaultValues: { image: undefined },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function SetNonFileValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('image', 'my-image.jpg', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetValidFile() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('image', new File([], 'image.png', { type: 'image/png' }), { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetTooLargeFile() {
  const { setValue } = useFormContext();
  useEffect(() => {
    const bigBlob = new Blob([new ArrayBuffer(2 * 1024 * 1024 + 1)]);
    setValue('image', new File([bigBlob], 'big.png', { type: 'image/png' }), { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetInvalidTypeFile() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('image', new File(['abc'], 'dummy.txt', { type: 'text/plain' }), { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <ImageField />', () => {
  test('Should render correctly', () => {
    render(
      <TestWrapper>
        <ImageField />
      </TestWrapper>,
    );

    expect(screen.getByRole('group')).toBeInTheDocument();
    expect(screen.getByText(/imagen/i)).toBeInTheDocument();
  });

  test('Should not show error when image is empty', () => {
    render(
      <TestWrapper>
        <ImageField />
      </TestWrapper>,
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show error when value is not a File', async () => {
    render(
      <TestWrapper>
        <ImageField />
        <SetNonFileValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/debe ser un archivo/i);
  });

  test('Should not show error when file is valid', async () => {
    render(
      <TestWrapper>
        <ImageField />
        <SetValidFile />
      </TestWrapper>,
    );

    await waitFor(() => {
      const alert = screen.queryByRole('alert');
      expect(alert).not.toBeInTheDocument();
    });
  });

  test('Should show error when file exceeds 2MB', async () => {
    render(
      <TestWrapper>
        <ImageField />
        <SetTooLargeFile />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/menor a 1mb/i);
  });

  test('Should show error when file type is not accepted', async () => {
    render(
      <TestWrapper>
        <ImageField />
        <SetInvalidTypeFile />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/tipo de archivo/i);
  });
});
