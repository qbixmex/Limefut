import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UrlField } from '@/app/admin/videos/(components)/form-fields/url-field';
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
  const url = useWatch({ name: 'url' });
  return <span data-testid="url-value">{url}</span>;
}

function SetNonStringValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('url', 123 as never, { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <UrlField />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <UrlField />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const urlInput = screen.getByRole('textbox');

    return { user, urlInput };
  };

  test('Should render correctly', () => {
    const { urlInput } = renderComponent();

    expect(urlInput).toBeInTheDocument();
    expect(screen.getByText(/url/i)).toBeInTheDocument();
  });

  test('Should update the form value when typing', async () => {
    const { user, urlInput } = renderComponent();

    await user.type(urlInput, 'https://youtube.com/watch?v=abc');

    expect(screen.getByTestId('url-value')).toHaveTextContent('https://youtube.com/watch?v=abc');
  });

  test('Should show an error when the value is not a string', async () => {
    renderComponent(<SetNonStringValue />);

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  test('Should show an error when the url is shorter than 3 characters', async () => {
    const { user, urlInput } = renderComponent();

    await user.type(urlInput, 'ab');

    expect(screen.getByRole('alert')).toHaveTextContent(
      'El URL debe ser mayor a 3 caracteres',
    );
  });

  test('Should not show an error when the url is valid', async () => {
    const { user, urlInput } = renderComponent();

    await user.type(urlInput, 'https://youtube.com/watch?v=abc');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
