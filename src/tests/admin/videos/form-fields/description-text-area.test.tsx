import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DescriptionTextArea } from '@/app/admin/videos/(components)/form-fields/description-text-area';
import { createVideoSchema } from '@/shared/schemas';

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createVideoSchema) as any,
    mode: 'onChange',
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

  return (
    <FormProvider {...form}>
      {children}
      <FormValueDisplay />
    </FormProvider>
  );
}

function FormValueDisplay() {
  const description = useWatch({ name: 'description' });
  return <span data-testid="description-value">{description}</span>;
}

function SetNonStringValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('description', 123 as never, { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <DescriptionTextArea />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <DescriptionTextArea />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const description = screen.getByRole('textbox');

    return { user, description };
  };

  test('Should render correctly', () => {
    const { description } = renderComponent();

    expect(description).toBeInTheDocument();
    expect(screen.getByText(/descripción/i)).toBeInTheDocument();
  });

  test('Should update the form value when typing', async () => {
    const { user, description } = renderComponent();

    await user.type(description, 'Una descripción');

    expect(screen.getByTestId('description-value')).toHaveTextContent('Una descripción');
  });

  test('Should show an error when the value is not a string', async () => {
    renderComponent(<SetNonStringValue />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(
      'La descripción debe ser una cadena de texto',
    );
  });

  test('Should show an error when the description is shorter than 3 characters', async () => {
    const { user, description } = renderComponent();

    await user.type(description, 'ab');

    expect(screen.getByRole('alert')).toHaveTextContent(
      'La descripción debe ser mayor a 3 caracteres',
    );
  });

  test('Should show an error when the description exceeds 250 characters', async () => {
    const { user, description } = renderComponent();

    await user.type(description, 'x'.repeat(251));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'La descripción debe ser menor a 250 caracteres',
    );
  });

  test('Should not show an error when the description is valid', async () => {
    const { user, description } = renderComponent();

    await user.type(description, 'Descripción válida');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
