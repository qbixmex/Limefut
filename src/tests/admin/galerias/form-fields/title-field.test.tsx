import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TitleField } from '@/app/admin/galerias/(components)/form-fields/title-field';
import { createGallerySchema } from '@/shared/schemas';
import { slugify } from '@/lib/utils';

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({
    resolver: zodResolver(createGallerySchema),
    defaultValues: { title: '', permalink: '', galleryDate: new Date(), active: false },
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
  const renderComponent = (isPermalinkEdited = false, extra?: ReactNode) => {
    render(
      <TestWrapper>
        <TitleField isPermalinkEdited={isPermalinkEdited} />
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
  });

  test('Should auto-generate the permalink when typing the title', async () => {
    const title = 'Finales del torneo apertura';
    const { user, titleInput } = renderComponent();

    await user.type(titleInput, title);

    expect(screen.getByTestId('title-value')).toHaveTextContent(title);
    expect(screen.getByTestId('permalink-value')).toHaveTextContent(slugify(title));
  });

  test('Should NOT auto-generate the permalink when isPermalinkEdited is true', async () => {
    const title = 'Mi Galería';
    const { user, titleInput } = renderComponent(true);

    await user.type(titleInput, title);

    expect(screen.getByTestId('title-value')).toHaveTextContent(title);
    expect(screen.getByTestId('permalink-value')).toHaveTextContent('');
  });

  test('Should show an error when the value is not a string', async () => {
    renderComponent(false, <SetNonStringValue />);

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  test('Should show an error when the title is shorter than 3 characters', async () => {
    const { user, titleInput } = renderComponent();

    await user.type(titleInput, 'ab');

    expect(screen.getByRole('alert')).toHaveTextContent(/nombre debe ser mayor a 3 caracteres/i);
  });

  test('Should not show an error when the title has 3 or more characters', async () => {
    const { user, titleInput } = renderComponent();

    await user.type(titleInput, 'abc');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show an error when the title exceeds 50 characters', async () => {
    const { user, titleInput } = renderComponent();

    await user.type(titleInput, 'x'.repeat(51));

    expect(screen.getByRole('alert')).toHaveTextContent(/nombre debe ser menor a 50 caracteres/i);
  });
});
