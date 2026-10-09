import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TitleField } from '@/app/admin/videos/(components)/form-fields/title-field';
import { createVideoSchema } from '@/shared/schemas';
import { slugify } from '@/lib/utils';

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
  const title = useWatch({ name: 'title' });
  const permalink = useWatch({ name: 'permalink' });
  return (
    <>
      <span data-testid="title-value">{title}</span>
      <span data-testid="permalink-value">{permalink}</span>
    </>
  );
}

function SetNonStringValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('title', 123 as never, { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <TitleField />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <TitleField />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const titleInput = screen.getByRole('textbox');

    return { user, titleInput };
  };

  test('Should render correctly', () => {
    const { titleInput } = renderComponent();

    expect(titleInput).toBeInTheDocument();
    expect(screen.getByText(/título/i)).toBeInTheDocument();
  });

  test('Should auto-generate the permalink when typing the title', async () => {
    const title = 'Video de prueba';
    const { user, titleInput } = renderComponent();

    await user.type(titleInput, title);

    expect(screen.getByTestId('title-value')).toHaveTextContent(title);
    expect(screen.getByTestId('permalink-value')).toHaveTextContent(slugify(title));
  });

  test('Should show an error when the value is not a string', async () => {
    renderComponent(<SetNonStringValue />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(
      'El título debe ser una cadena de texto',
    );
  });

  test('Should show an error when the title is shorter than 3 characters', async () => {
    const { user, titleInput } = renderComponent();

    await user.type(titleInput, 'ab');

    expect(screen.getByRole('alert')).toHaveTextContent(
      'El título debe ser mayor a 3 caracteres',
    );
  });

  test('Should not show an error when the title has 3 or more characters', async () => {
    const { user, titleInput } = renderComponent();

    await user.type(titleInput, 'abc');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show an error when the title exceeds 200 characters', async () => {
    const { user, titleInput } = renderComponent();

    await user.type(titleInput, 'x'.repeat(201));

    expect(screen.getByRole('alert')).toHaveTextContent(
      'El título debe ser menor a 200 caracteres',
    );
  });
});
