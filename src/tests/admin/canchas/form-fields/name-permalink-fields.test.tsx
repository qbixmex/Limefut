import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { ReactNode } from 'react';
import { NamePermalinkFields } from '@/app/admin/canchas/(components)/form-fields/name-permalink-fields';
import { createFieldSchema } from '@/shared/schemas';
import { slugify } from '@/lib/utils';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm({
    resolver: zodResolver(createFieldSchema),
    defaultValues: { name: '', permalink: '' },
  });

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
  const renderComponent = () => {
    render(<NamePermalinkFields />, { wrapper: TestWrapper });

    const user = userEvent.setup();
    const textboxes = screen.getAllByRole('textbox');

    return { user, textboxes };
  };

  test('Should render both fields', () => {
    const { textboxes } = renderComponent();

    expect(textboxes).toHaveLength(2);
  });

  test('Should auto-generate permalink from name initially', async () => {
    const fieldName = 'Unidad deportiva metropolitana';
    const { user, textboxes } = renderComponent();
    const [nameInput] = textboxes;

    await user.type(nameInput, fieldName);

    expect(screen.getByTestId('name-value')).toHaveTextContent(fieldName);
    expect(screen.getByTestId('permalink-value')).toHaveTextContent(slugify(fieldName));
  });

  test('Should NOT auto-generate permalink when permalink was manually edited', async () => {
    const fieldName = 'Soccer Stars';
    const customPermalink = 'soccer-stars';
    const { user, textboxes } = renderComponent();
    const [nameInput, permalinkInput] = textboxes;

    await user.type(permalinkInput, customPermalink);
    await user.type(nameInput, fieldName);

    expect(screen.getByTestId('permalink-value')).toHaveTextContent(customPermalink);
  });
});
