import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ContentTextArea } from '@/app/admin/paginas/(components)/form-fields/content-text-area';
import { editPageSchema } from '@/shared/schemas';

vi.mock('@/app/admin/paginas/(components)/md-editor-field', () => ({
  default: ({
    markdownString,
    setContent,
    resourceId,
  }: {
    markdownString?: string;
    setContent: (value: string) => void;
    resourceId?: string;
  }) => (
    <div>
      <textarea
        data-testid="md-editor"
        value={markdownString ?? ''}
        onChange={(event) => setContent(event.target.value)}
      />
      <span data-testid="md-editor-resource-id">{resourceId}</span>
    </div>
  ),
}));

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ content: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(editPageSchema) as any,
    defaultValues: { content: '' },
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

function EmptyContent() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('content', '', { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <ContentTextArea />', () => {
  const pageId = '3f2a8c7e-1b4d-4e6f-9a2b-7c8d5e4f3a21';

  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <ContentTextArea pageId={pageId} updateContentImage={vi.fn()} />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const editor = screen.getByTestId('md-editor');

    return { user, editor };
  };

  test('Should render the markdown editor with the pageId', () => {
    renderComponent();

    expect(screen.getByTestId('md-editor')).toBeInTheDocument();
    expect(screen.getByTestId('md-editor-resource-id')).toHaveTextContent(pageId);
  });

  test('Should update the form value through setContent', async () => {
    const { user, editor } = renderComponent();

    await user.type(editor, 'Contenido de prueba');

    expect(screen.getByTestId('content-value')).toHaveTextContent('Contenido de prueba');
  });

  test('Should show an error when the content is empty', async () => {
    renderComponent(<EmptyContent />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/el contenido es obligatorio/i);
  });
});
