import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SeoTitleField } from '@/app/admin/paginas/(components)/form-fields/seo-title-field';
import { editPageSchema } from '@/shared/schemas';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ seoTitle: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(editPageSchema) as any,
    mode: 'onChange',
    defaultValues: { seoTitle: '' },
  });

  return (
    <FormProvider {...form}>
      {children}
      <FormValueDisplay />
    </FormProvider>
  );
}

function UndefinedTitleWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ seoTitle?: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(editPageSchema) as any,
    defaultValues: { seoTitle: undefined },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
}

function FormValueDisplay() {
  const seoTitle = useWatch({ name: 'seoTitle' });
  return <span data-testid="seo-title-value">{seoTitle}</span>;
}

function SetSeoTitle() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('seoTitle', 'Valor programático', { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <SeoTitleField />', () => {
  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <SeoTitleField />
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
    expect(screen.getByText(/título seo/i)).toBeInTheDocument();
  });

  test('Should render without crashing when seoTitle is undefined', () => {
    render(
      <UndefinedTitleWrapper>
        <SeoTitleField />
      </UndefinedTitleWrapper>,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.queryByText(/restan/i)).not.toBeInTheDocument();
  });

  test('Should update the value and show the characters counter', async () => {
    const text = 'Lorem Ipsum';
    const { user, textbox } = renderComponent();

    await user.type(textbox, text);

    expect(screen.getByTestId('seo-title-value')).toHaveTextContent(text);
    expect(
      screen.getByText(new RegExp(`restan ${70 - text.length} caracteres`, 'i')),
    ).toBeInTheDocument();
  });

  test('Should show the counter for a programmatically set value', async () => {
    const value = 'Valor programático';
    const { user, textbox } = renderComponent(<SetSeoTitle />);

    await user.click(textbox);

    expect(screen.getByTestId('seo-title-value')).toHaveTextContent(value);
    expect(
      screen.getByText(new RegExp(`restan ${70 - value.length} caracteres`, 'i')),
    ).toBeInTheDocument();
  });

  test('Should show an error when the seo title is less than 3 characters', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'ab');

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/mayor a 3 caracteres/i);
  });

  test('Should show an error when the seo title exceeds 70 characters', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'x'.repeat(71));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/menor a 70 caracteres/i);
  });
});
