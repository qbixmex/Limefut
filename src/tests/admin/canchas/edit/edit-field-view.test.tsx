import { EditFieldPageView } from '@/app/admin/canchas/editar/[id]/edit-field-view';
import { render, screen } from '@testing-library/react';
import { fieldMock } from '../mocks/field.mock';
import { fetchFieldAction } from '@/app/admin/canchas/(actions)';

const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/canchas/(actions)', () => ({
  fetchFieldAction: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
}));

vi.mock('@/app/admin/canchas/editar/[id]/edit-field-form', () => ({
  EditFieldForm: () => <div data-testid="edit-field-form" />,
}));

describe('Tests on EditFieldPageView', () => {
  const defaultResponse = {
    ok: true,
    message: 'Cancha obtenida correctamente',
    field: fieldMock,
  };

  const renderComponent = async () => {
    vi.mocked(fetchFieldAction).mockResolvedValue(defaultResponse);
    const ServerComponent = await EditFieldPageView({
      params: Promise.resolve({ id: fieldMock.id as string }),
    });
    return render(ServerComponent);
  };

  test('Should render title', async () => {
    await renderComponent();

    const title = screen.getByRole('heading', { name: /título/i });

    expect(title).toHaveTextContent(/editar cancha/i);
  });

  test('Should render <EditFieldForm /> component', async () => {
    await renderComponent();

    const editFieldForm = screen.getByTestId('edit-field-form');

    expect(editFieldForm).toBeInTheDocument();
    expect(fetchFieldAction).toHaveBeenCalledWith(fieldMock.id);
  });

  test('Should redirect when fetch fails', async () => {
    vi.mocked(fetchFieldAction).mockResolvedValue({
      ok: false,
      message: 'Cancha no encontrada',
      field: null,
    });

    await EditFieldPageView({
      params: Promise.resolve({ id: fieldMock.id as string }),
    });

    expect(mockRedirect).toHaveBeenCalledWith(
      `/admin/canchas?error=${encodeURIComponent('Cancha no encontrada')}`,
    );
  });
});
