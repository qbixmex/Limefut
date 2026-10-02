import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PermalinkField } from '@/app/admin/categorias/(components)/form-fields/permalink-field';
import { createCategorySchema } from '@/shared/schemas';

const setPermalinkEdited = vi.fn();

function TestWrapper({ children }: { children: ReactNode }) {
  const form = useForm({ resolver: zodResolver(createCategorySchema), defaultValues: { permalink: '' } });

  return (
    <FormProvider {...form}>
      {children}
    </FormProvider>
  );
}

function SetNonStringValue() {
  const { setValue } = useFormContext();
  useEffect(() => {
    setValue('permalink', 123 as never, { shouldValidate: true });
  }, [setValue]);
  return null;
}

describe('Test on <PermalinkField />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (extra?: ReactNode) => {
    render(
      <TestWrapper>
        <PermalinkField setPermalinkEdited={setPermalinkEdited} />
        {extra}
      </TestWrapper>,
    );

    const user = userEvent.setup();
    const textbox = screen.getByRole('textbox');

    return { user, textbox };
  };

  test('Should render correctly', () => {
    const { textbox } = renderComponent();

    expect(textbox).toBeInTheDocument();
  });

  test('Should call setPermalinkEdited when typing', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'mi-categoria');

    expect(setPermalinkEdited).toHaveBeenCalledWith(true);
  });

  test('Should show error when value is not a string', async () => {
    renderComponent(<SetNonStringValue />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/cadena de texto/i);
  });

  test('Should show error when permalink is less than 3 characters', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'ab');

    expect(screen.getByRole('alert')).toHaveTextContent(/mayor a 3 caracteres/i);
  });

  test('Should show error when permalink has more than 250 characters', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'x'.repeat(251));

    expect(screen.getByRole('alert')).toHaveTextContent(/menor a 250 caracteres/i);
  });

  test('Should show error when permalink contains spaces', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'mi categoria');

    expect(screen.getByRole('alert')).toHaveTextContent(/espacios/i);
  });

  test('Should show error when permalink contains accents', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'mi-categoría');

    expect(screen.getByRole('alert')).toHaveTextContent(/acentos/i);
  });

  test('Should not show error when permalink is valid', async () => {
    const { user, textbox } = renderComponent();

    await user.type(textbox, 'mi-categoria');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
