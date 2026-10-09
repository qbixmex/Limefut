import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TitleField } from '@/app/admin/paginas/(components)/form-fields/title-field';
import { editPageSchema } from '@/shared/schemas';
import { slugify } from '@/lib/utils';

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm<{ title: string; permalink: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(editPageSchema) as any,
    defaultValues: { title: '', permalink: '' },
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

describe('Test on <TitleField />', () => {
  const renderComponent = (isPermalinkEdited = false) => {
    render(
      <TestWrapper>
        <TitleField isPermalinkEdited={isPermalinkEdited} />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const textbox = screen.getByRole('textbox');

    return { user, textbox };
  };

  test('Should render correctly', () => {
    const { textbox } = renderComponent();

    expect(textbox).toBeInTheDocument();
    expect(screen.getByText(/título de la página/i)).toBeInTheDocument();
    expect(textbox).toHaveAttribute('aria-invalid', 'false');
  });

  test('Should auto-generate the permalink when typing', async () => {
    const fieldTitle = 'Unidad deportiva metropolitana';

    const { user, textbox } = renderComponent();

    await user.type(textbox, fieldTitle);

    expect(screen.getByTestId('title-value')).toHaveTextContent(fieldTitle);
    expect(screen.getByTestId('permalink-value')).toHaveTextContent(slugify(fieldTitle));
  });

  test('Should NOT auto-generate the permalink when isPermalinkEdited is true', async () => {
    const fieldTitle = 'Unidad deportiva metropolitana';

    const { user, textbox } = renderComponent(true);

    await user.type(textbox, fieldTitle);

    expect(screen.getByTestId('title-value')).toHaveTextContent(fieldTitle);
    expect(screen.getByTestId('permalink-value')).toHaveTextContent('');
  });

  test('Should show an error when the title is shorter than 3 characters', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'ab');

    expect(screen.getByRole('alert')).toHaveTextContent(/mayor a 3 caracteres/i);
    expect(textbox).toHaveAttribute('aria-invalid', 'true');
  });

  test('Should not show an error when the title has 3 or more characters', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'abc');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  test('Should show an error when the title exceeds 255 characters', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'x'.repeat(256));

    expect(screen.getByRole('alert')).toHaveTextContent(/menor a 255 caracteres/i);
  });
});
