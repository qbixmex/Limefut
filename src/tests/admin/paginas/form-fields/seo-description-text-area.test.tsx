import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SeoDescriptionTextArea } from '@/app/admin/paginas/(components)/form-fields/seo-description-text-area';
import { editPageSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ seoDescription: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(editPageSchema) as any,
    mode: 'onChange',
    defaultValues: { seoDescription: '' },
  });

  return (
    <FormProvider {...form}>
      {children}
      <FormValueDisplay />
    </FormProvider>
  );
}

function FormValueDisplay() {
  const seoDescription = useWatch({ name: 'seoDescription' });
  return <span data-testid="seo-description-value">{seoDescription}</span>;
}

function SetSeoDescription() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('seoDescription', 'Descripción programática', { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <SeoDescriptionTextArea />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <SeoDescriptionTextArea />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const textbox = screen.getByRole('textbox');

    return { user, textbox };
  };

  test('Should render correctly with the label', () => {
    const { textbox } = renderComponent();

    expect(textbox).toBeInTheDocument();
    expect(screen.getByText(/descripción seo/i)).toBeInTheDocument();
  });

  test('Should update the value and show the characters counter', async () => {
    const text = 'Una descripción SEO';
    const { user, textbox } = renderComponent();

    await user.type(textbox, text);

    expect(screen.getByTestId('seo-description-value')).toHaveTextContent(text);
    expect(
      screen.getByText(new RegExp(`restan ${160 - text.length} caracteres`, 'i')),
    ).toBeInTheDocument();
  });

  test('Should show the counter for a programmatically set value', async () => {
    const value = 'Descripción programática';
    const { user, textbox } = renderComponent(<SetSeoDescription />);

    await user.click(textbox);

    expect(screen.getByTestId('seo-description-value')).toHaveTextContent(value);
    expect(
      screen.getByText(new RegExp(`restan ${160 - value.length} caracteres`, 'i')),
    ).toBeInTheDocument();
  });

  test('Should show an error when the seo description is less than 3 characters', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'ab');

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/mayor a 3 caracteres/i);
  });

  test('Should show an error when the seo description exceeds 160 characters', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'x'.repeat(161));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/menor a 160 caracteres/i);
  });
});
