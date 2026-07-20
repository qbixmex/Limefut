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
  test('Should render correctly', () => {
    render(<NameField isPermalinkEdited={false} />, { wrapper: TestWrapper });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('Should auto-generate permalink when typing name', async () => {
    const categoryName = 'Mi Categoría';
    const categoryNameSlug = slugify(categoryName);
    render(<NameField isPermalinkEdited={false} />, { wrapper: TestWrapper });

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), categoryName);

    expect(screen.getByTestId('name-value')).toHaveTextContent(categoryName);
    expect(screen.getByTestId('permalink-value')).toHaveTextContent(categoryNameSlug);
  });

  test('Should NOT auto-generate permalink when isPermalinkEdited is true', async () => {
    const categoryName = 'Mi Categoría';
    render(<NameField isPermalinkEdited />, { wrapper: TestWrapper });

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), categoryName);

    expect(screen.getByTestId('name-value')).toHaveTextContent(categoryName);
    expect(screen.getByTestId('permalink-value')).toHaveTextContent('');
  });

  test('Should show error when value is not a string', async () => {
    render(
      <TestWrapper>
        <NameField isPermalinkEdited={false} />
        <SetNonStringValue />
      </TestWrapper>,
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/cadena de texto/i);
  });

  test('Should show error when name is less than 3 characters', async () => {
    render(<NameField isPermalinkEdited={false} />, { wrapper: TestWrapper });

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), 'ab');

    expect(screen.getByRole('alert')).toHaveTextContent(/mayor a 3 caracteres/i);
  });

  test('Should not show error when name has 3 or more characters', async () => {
    render(<NameField isPermalinkEdited={false} />, { wrapper: TestWrapper });

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), 'abc');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show error when name exceeds 250 characters', async () => {
    render(<NameField isPermalinkEdited={false} />, { wrapper: TestWrapper });

    const user = userEvent.setup();
    await user.type(screen.getByRole('textbox'), 'x'.repeat(251));

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/menor a 250 caracteres/i);
  });
});
