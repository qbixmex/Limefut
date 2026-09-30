import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TitleField } from '@/app/admin/banners/(components)/form-fields/title-field';
import { createHeroBannerSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ title: string; description: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createHeroBannerSchema) as any,
    defaultValues: {
      title: '',
      description: 'Descripción válida del banner',
    },
  });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function SetNonStringValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('title', 123, { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetShortTitle() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('title', 'ab', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetValidTitle() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('title', 'Cursos de verano', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetLongTitle() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('title', 'x'.repeat(251), { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <TitleField />', () => {
  test('Should render correctly', () => {
    render(<TitleField />, { wrapper: TestWrapper });
    const titleField = screen.getByRole('textbox');
    expect(titleField).toBeInTheDocument();
  });

  test('Should show error when value is not a string', async () => {
    render(
      <TestWrapper>
        <TitleField />
        <SetNonStringValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/cadena de texto/i);
  });

  test('Should show error when title is less than 3 characters', async () => {
    render(
      <TestWrapper>
        <TitleField />
        <SetShortTitle />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/mayor a 3 caracteres/i);
  });

  test('Should not show error when title has 3 or more characters', async () => {
    render(
      <TestWrapper>
        <TitleField />
        <SetValidTitle />
      </TestWrapper>,
    );

    await waitFor(() => {
      const alert = screen.queryByRole('alert');
      expect(alert).not.toBeInTheDocument();
    });
  });

  test('Should show error when title exceeds 250 characters', async () => {
    render(
      <TestWrapper>
        <TitleField />
        <SetLongTitle />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/menor a 250 caracteres/i);
  });
});
