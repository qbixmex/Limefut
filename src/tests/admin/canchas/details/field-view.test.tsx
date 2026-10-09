import { FieldView } from '@/app/admin/canchas/[id]/field-view';
import { render, screen } from '@testing-library/react';
import { fieldMock } from '../mocks/field.mock';
import { fetchFieldAction } from '@/app/admin/canchas/(actions)';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/canchas/(actions)', () => ({
  fetchFieldAction: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
}));

vi.mock('@/app/admin/canchas/(components)/edit-field', () => ({
  EditField: () => <div data-testid="edit-field" />,
}));

describe('Tests on FieldView', () => {
  const defaultResponse = {
    ok: true,
    message: 'Cancha obtenida correctamente',
    field: fieldMock,
  };

  const renderComponent = async () => {
    vi.mocked(fetchFieldAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await FieldView({
      params: Promise.resolve({ id: fieldMock.id as string }),
    });
    return render(ServerComponent);
  };

  test('Should render table correctly', async () => {
    await renderComponent();

    const table = screen.getByRole('table', { name: /cancha/i });

    expect(table).toBeInTheDocument();
  });

  test('Should render field name', async () => {
    await renderComponent();

    const name = screen.getByText(fieldMock.name);

    expect(name).toBeInTheDocument();
  });

  test('Should render permalink', async () => {
    await renderComponent();

    const permalink = screen.getByText(fieldMock.permalink);

    expect(permalink).toBeInTheDocument();
  });

  test('Should render city', async () => {
    await renderComponent();

    const city = screen.getByText(fieldMock.city);

    expect(city).toBeInTheDocument();
  });

  test('Should render state', async () => {
    await renderComponent();

    const state = screen.getByText(fieldMock.state);

    expect(state).toBeInTheDocument();
  });

  test('Should render country', async () => {
    await renderComponent();

    const country = screen.getByText(fieldMock.country);

    expect(country).toBeInTheDocument();
  });

  test('Should render address', async () => {
    await renderComponent();

    const address = screen.getByText(fieldMock.address);

    expect(address).toBeInTheDocument();
  });

  test('Should show fallback when address is null', async () => {
    vi.mocked(fetchFieldAction).mockResolvedValue({
      ...defaultResponse,
      field: { ...fieldMock, address: null },
    });
    const ServerComponent = await FieldView({
      params: Promise.resolve({ id: fieldMock.id as string }),
    });
    render(ServerComponent);

    const emptyMessage = screen.getByRole('status', {
      name: /dirección/i,
    });

    expect(emptyMessage).toHaveTextContent(/no especificada/i);
  });

  test('Should render created date', async () => {
    await renderComponent();

    const createdDate = format(
      new Date(fieldMock.createdAt as Date),
      "d 'de' MMMM 'del' yyyy",
      { locale: es },
    );

    const createdAtDate = screen.getByText(createdDate);

    expect(createdAtDate).toBeInTheDocument();
  });

  test('Should render updated date', async () => {
    await renderComponent();

    const updatedDate = format(
      new Date(fieldMock.updatedAt as Date),
      "d 'de' MMMM 'del' yyyy",
      { locale: es },
    );

    const updatedAtDate = screen.getByText(updatedDate);

    expect(updatedAtDate).toBeInTheDocument();
  });

  test('Should render edit button', async () => {
    await renderComponent();

    const editButton = screen.getByTestId('edit-field');

    expect(editButton).toBeInTheDocument();
  });

  test('Should redirect when fetch fails', async () => {
    vi.mocked(fetchFieldAction).mockResolvedValue({
      ok: false,
      message: 'Cancha no encontrada',
      field: null,
    });

    await expect(async () => {
      await FieldView({ params: Promise.resolve({ id: fieldMock.id as string }) });
    }).rejects.toThrow();

    expect(mockRedirect).toHaveBeenCalledWith(
      `/admin/canchas?error=${encodeURIComponent('Cancha no encontrada')}`,
    );
  });
});
