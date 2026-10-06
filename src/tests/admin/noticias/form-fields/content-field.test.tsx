import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContentField } from '@/app/admin/noticias/(components)/form-fields/content-field';
import { CreateAnnouncementSchema } from '@/shared/schemas';

vi.mock('@/app/admin/paginas/(components)/md-editor-field', () => ({
  MdEditorField: ({
    markdownString,
    setContent,
  }: {
    markdownString: string;
    setContent: (value: string) => void;
  }) => (
    <textarea
      aria-label="Editor de contenido"
      value={markdownString ?? ''}
      onChange={(event) => setContent(event.target.value)}
    />
  ),
}));

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateAnnouncementSchema) as any,
    mode: 'onChange',
    defaultValues: {
      title: '',
      permalink: '',
      publishedDate: undefined,
      description: '',
      content: '',
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
  const content = useWatch({ name: 'content' });
  return <span data-testid="content-value">{content}</span>;
}

function SetNonStringValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('content', 123 as never, { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <ContentField />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <ContentField />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const content = screen.getByRole('textbox', { name: /editor de contenido/i });

    return { user, content };
  };

  test('Should render correctly', () => {
    const { content } = renderComponent();

    expect(content).toBeInTheDocument();
    expect(screen.getByText(/contenido/i)).toBeInTheDocument();
  });

  test('Should update the form value when typing', async () => {
    const { user, content } = renderComponent();

    await user.type(content, 'Contenido de prueba');

    expect(screen.getByTestId('content-value')).toHaveTextContent('Contenido de prueba');
  });

  test('Should show an error when the value is not a string', async () => {
    renderComponent(<SetNonStringValue />);

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  test('Should show an error when the content is shorter than 8 characters', async () => {
    const { user, content } = renderComponent();

    await user.type(content, 'abc');

    expect(screen.getByRole('alert')).toHaveTextContent(
      'El contenido debe ser mayor a 8 caracteres',
    );
  });

  test('Should not show an error when the content is valid', async () => {
    const { user, content } = renderComponent();

    await user.type(content, 'Valid content');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
