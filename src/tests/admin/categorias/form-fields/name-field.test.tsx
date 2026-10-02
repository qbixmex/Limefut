import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { NameField } from '@/app/admin/categorias/(components)/form-fields/name-field';
import { createCategorySchema } from '@/shared/schemas';
import { slugify } from '@/lib/utils';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm({ resolver: zodResolver(createCategorySchema), defaultValues: { name: '', permalink: '' } });

  return (
    <FormProvider {...form}>
      {children}
      <FormValueDisplay />
    </FormProvider>
  );
}

function FormValueDisplay() {
  const name = useWatch({ name: 'name' });
  const permalink = useWatch({ name: 'permalink' });
  return (
    <>
      <span data-testid="name-value">{name}</span>
      <span data-testid="permalink-value">{permalink}</span>
    </>
  );
}

function SetNonStringValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('name', 123, { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <NameField />', () => {
  const renderComponent = (isPermalinkEdited = false, extra?: ReactNode) => {
    render(
      <>
        <NameField isPermalinkEdited={isPermalinkEdited} />
        {extra}
      </>,
      { wrapper: TestWrapper },
    );

    const user = userEvent.setup();
    const textbox = screen.getByRole('textbox');

    return { user, textbox };
  };

  test('Should render correctly', () => {
    const { textbox } = renderComponent();

    expect(textbox).toBeInTheDocument();
  });

  test('Should auto-generate permalink when typing name', async () => {
    const categoryName = 'Mi Categoría';
    const categoryNameSlug = slugify(categoryName);

    const { user, textbox } = renderComponent();

    await user.type(textbox, categoryName);

    expect(screen.getByTestId('name-value')).toHaveTextContent(categoryName);
    expect(screen.getByTestId('permalink-value')).toHaveTextContent(categoryNameSlug);
  });

  test('Should NOT auto-generate permalink when isPermalinkEdited is true', async () => {
    const categoryName = 'Mi Categoría';

    const { user, textbox } = renderComponent(true);

    await user.type(textbox, categoryName);

    expect(screen.getByTestId('name-value')).toHaveTextContent(categoryName);
    expect(screen.getByTestId('permalink-value')).toHaveTextContent('');
  });

  test('Should show error when value is not a string', async () => {
    renderComponent(false, <SetNonStringValue />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/cadena de texto/i);
  });

  test('Should show error when name is less than 3 characters', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'ab');

    expect(screen.getByRole('alert')).toHaveTextContent(/mayor a 3 caracteres/i);
  });

  test('Should not show error when name has 3 or more characters', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'abc');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show error when name exceeds 250 characters', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'x'.repeat(251));

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/menor a 250 caracteres/i);
  });
});
