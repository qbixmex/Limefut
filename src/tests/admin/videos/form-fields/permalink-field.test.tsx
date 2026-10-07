import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PermalinkField } from '@/app/admin/videos/(components)/form-fields/permalink-field';
import { createVideoSchema } from '@/shared/schemas';

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createVideoSchema) as any,
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
  const permalink = useWatch({ name: 'permalink' });
  return <span data-testid="permalink-value">{permalink}</span>;
}

function SetNonStringValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('permalink', 123 as never, { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <PermalinkField />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <PermalinkField />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const permalinkField = screen.getByRole('textbox');

    return { user, permalinkField };
  };

  test('Should render correctly', () => {
    const { permalinkField } = renderComponent();

    expect(permalinkField).toBeInTheDocument();
    expect(screen.getByText(/enlace permanente/i)).toBeInTheDocument();
  });

  test('Should update the form value when typing', async () => {
    const { user, permalinkField } = renderComponent();

    await user.type(permalinkField, 'video-apertura-2026');

    expect(screen.getByTestId('permalink-value')).toHaveTextContent('video-apertura-2026');
  });

  test('Should show an error when the value is not a string', async () => {
    renderComponent(<SetNonStringValue />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(
      'El enlace permanente debe ser una cadena de texto',
    );
  });

  test('Should show an error when the permalink is shorter than 3 characters', async () => {
    const { user, permalinkField } = renderComponent();

    await user.type(permalinkField, 'ab');

    expect(screen.getByRole('alert')).toHaveTextContent(
      'El enlace permanente debe ser mayor a 3 caracteres',
    );
  });

  test('Should show an error when the permalink exceeds 200 characters', async () => {
    const { user, permalinkField } = renderComponent();

    await user.type(permalinkField, 'x'.repeat(201));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'El enlace permanente debe ser menor a 200 caracteres',
    );
  });

  test('Should not show an error when the permalink is valid', async () => {
    const { user, permalinkField } = renderComponent();

    await user.type(permalinkField, 'video-de-verano');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
