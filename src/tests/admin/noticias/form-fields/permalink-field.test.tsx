import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PermalinkField } from '@/app/admin/noticias/(components)/form-fields/permalink-field';
import { CreateAnnouncementSchema } from '@/shared/schemas';

const handlePermalinkChanged = vi.fn();

function TestWrapper({ children }: Readonly<{ children: ReactNode }>) {
  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(CreateAnnouncementSchema) as any,
    defaultValues: {
      title: '',
      permalink: '',
      publishedDate: undefined,
      description: '',
      content: '',
      active: false,
    },
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
        <PermalinkField handlePermalinkChanged={handlePermalinkChanged} />
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

  test('Should call handlePermalinkChanged when typing', async () => {
    const { user, permalinkField } = renderComponent();

    await user.type(permalinkField, 'noticia-apertura-2026');

    expect(handlePermalinkChanged).toHaveBeenCalledWith(true);
  });

  test('Should show an error when the value is not a string', async () => {
    renderComponent(<SetNonStringValue />);

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();
  });

  test('Should show an error when the permalink is shorter than 3 characters', async () => {
    const { user, permalinkField } = renderComponent();

    await user.type(permalinkField, 'ab');

    expect(screen.getByRole('alert')).toHaveTextContent('El nombre debe ser mayor a 3 caracteres');
  });

  test('Should show an error when the permalink exceeds 200 characters', async () => {
    const { user, permalinkField } = renderComponent();

    await user.type(permalinkField, 'x'.repeat(201));

    expect(screen.getByRole('alert')).toHaveTextContent('El nombre debe ser menor a 200 caracteres');
  });

  test('Should not show an error when the permalink is valid', async () => {
    const { user, permalinkField } = renderComponent();

    await user.type(permalinkField, 'noticia-de-verano');

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
