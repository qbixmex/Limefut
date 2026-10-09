import type { ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PermalinkField } from '@/app/admin/paginas/(components)/form-fields/permalink-field';
import { editPageSchema } from '@/shared/schemas';

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
  const permalink = useWatch({ name: 'permalink' });
  return <span data-testid="permalink-value">{permalink}</span>;
}

describe('Test on <PermalinkField />', () => {
  const renderComponent = () => {
    const setPermalinkEdited = vi.fn();
    render(
      <TestWrapper>
        <PermalinkField setPermalinkEdited={setPermalinkEdited} />
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const textbox = screen.getByRole('textbox');

    return { user, textbox, setPermalinkEdited };
  };

  test('Should render correctly', () => {
    const { textbox } = renderComponent();

    expect(textbox).toBeInTheDocument();
    expect(screen.getByText(/enlace permanente/i)).toBeInTheDocument();
  });

  test('Should update the permalink and mark it as edited when typing', async () => {
    const { user, textbox, setPermalinkEdited } = renderComponent();

    await user.type(textbox, 'nueva-pagina');

    expect(setPermalinkEdited).toHaveBeenCalledWith(true);
    expect(screen.getByTestId('permalink-value')).toHaveTextContent('nueva-pagina');
  });

  test('Should show an error when the permalink is shorter than 3 characters', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'ab');

    expect(screen.getByRole('alert')).toHaveTextContent(/mayor a 3 caracteres/i);
    expect(textbox).toHaveAttribute('aria-invalid', 'true');
  });

  test('Should show an error when the permalink exceeds 255 characters', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'x'.repeat(256));

    expect(screen.getByRole('alert')).toHaveTextContent(/menor a 255 caracteres/i);
  });
});
