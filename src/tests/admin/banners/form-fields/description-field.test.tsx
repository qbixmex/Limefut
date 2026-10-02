import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DescriptionField } from '@/app/admin/banners/(components)/form-fields/description-field';
import { createHeroBannerSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ title: string; description: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createHeroBannerSchema) as any,
    defaultValues: {
      title: 'Banner de bienvenida',
      description: '',
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
    setValue('description', 123, { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetShortDescription() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('description', 'ab', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetValidDescription() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('description', 'En estos cursos de verano aprenderás ...', { shouldValidate: true });
  }, [setValue]);
  return null;
}

function SetLongDescription() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('description', 'x'.repeat(301), { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <DescriptionField />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <DescriptionField />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const textbox = screen.getByRole('textbox');

    return { user, textbox };
  };

  test('Should render correctly', () => {
    const { textbox } = renderComponent();

    expect(textbox).toBeInTheDocument();
  });

  test('Should not show error when description on mounted', () => {
    renderComponent();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show error when value is not a string', async () => {
    renderComponent(<SetNonStringValue />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/cadena de texto/i);
  });

  test('Should show error when description is less than 3 characters', async () => {
    renderComponent(<SetShortDescription />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/mayor a 3 caracteres/i);
  });

  test('Should not show error when description is valid', async () => {
    renderComponent(<SetValidDescription />);

    await waitFor(() => {
      const alert = screen.queryByRole('alert');
      expect(alert).not.toBeInTheDocument();
    });
  });

  test('Should show error when description exceeds 300 characters', async () => {
    renderComponent(<SetLongDescription />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/menor a 300 caracteres/i);
  });

  test('Should show the characters counter when focused', async () => {
    const { user, textbox } = renderComponent();

    await user.click(textbox);
    await user.type(textbox, 'Descripción');

    expect(screen.getByText(/restan/i)).toBeInTheDocument();
  });
});
