import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PermalinkField } from '@/app/admin/galerias/(components)/form-fields/permalink-field';
import { createGallerySchema } from '@/shared/schemas';

const setPermalinkEdited = vi.fn();

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({
    resolver: zodResolver(createGallerySchema),
    defaultValues: { title: '', permalink: '', galleryDate: new Date(), active: false },
  });

  return <FormProvider {...form}>{children}</FormProvider>;
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
    const permalinkField = screen.getByRole('textbox');

    return { user, permalinkField };
  };

  test('Should render correctly', () => {
    const { permalinkField } = renderComponent();

    expect(permalinkField).toBeInTheDocument();
    expect(screen.getByText(/enlace permanente/i)).toBeInTheDocument();
  });

  test('Should call setPermalinkEdited when typing', async () => {
    const { user, permalinkField } = renderComponent();

    await user.type(permalinkField, 'torneo-apertura-2026');

    expect(setPermalinkEdited).toHaveBeenCalledWith(true);
  });

  test('Should show an error when the value is not a string', async () => {
    renderComponent(<SetNonStringValue />);

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  test('Should show an error when the permalink is shorter than 3 characters', async () => {
    const { user, permalinkField } = renderComponent();

    await user.type(permalinkField, 'ab');
    const alert = screen.getByRole('alert');

    expect(alert).toHaveTextContent(/enlace permanente debe ser mayor a 3 caracteres/i);
  });

  test('Should show an error when the permalink exceeds 100 characters', async () => {
    const { user, permalinkField } = renderComponent();

    await user.type(permalinkField, 'x'.repeat(101));

    const alert = screen.getByRole('alert');

    expect(alert).toHaveTextContent(/enlace permanente debe ser menor a 100 caracteres/i);
  });

  test('Should not show an error when the permalink is valid', async () => {
    const { user, permalinkField } = renderComponent();

    await user.type(permalinkField, 'torneo-de-verano');

    const alert = screen.queryByRole('alert');

    expect(alert).not.toBeInTheDocument();
  });
});
