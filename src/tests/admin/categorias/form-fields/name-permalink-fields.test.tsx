import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { NamePermalinkFields } from '@/app/admin/categorias/(components)/form-fields/name-permalink-fields';
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

describe('Test on <NamePermalinkFields />', () => {
  test('Should render both fields', () => {
    render(<NamePermalinkFields />, { wrapper: TestWrapper });

    const textboxes = screen.getAllByRole('textbox');
    expect(textboxes).toHaveLength(2);
  });

  test('Should auto-generate permalink from name initially', async () => {
    const categoryName = 'Secundaria Varonil';
    render(<NamePermalinkFields />, { wrapper: TestWrapper });

    const user = userEvent.setup();
    const [nameInput] = screen.getAllByRole('textbox');

    await user.type(nameInput, categoryName);

    expect(screen.getByTestId('name-value')).toHaveTextContent(categoryName);
    expect(screen.getByTestId('permalink-value')).toHaveTextContent(slugify(categoryName));
  });

  test('Should NOT auto-generate permalink when permalink was manually edited', async () => {
    const categoryName = 'Secundaria Varonil';
    const customPermalink = 'mi-enlace-personalizado';
    render(<NamePermalinkFields />, { wrapper: TestWrapper });

    const user = userEvent.setup();
    const [nameInput, permalinkInput] = screen.getAllByRole('textbox');

    await user.type(permalinkInput, customPermalink);
    await user.type(nameInput, categoryName);

    expect(screen.getByTestId('permalink-value')).toHaveTextContent(customPermalink);
  });
});
