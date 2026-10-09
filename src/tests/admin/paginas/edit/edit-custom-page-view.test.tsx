import { render, screen } from '@testing-library/react';
import { EditCustomPageView } from '@/app/admin/paginas/editar/[id]/edit-custom-page-view';
import { fetchPageAction } from '@/app/admin/paginas/(actions)/fetchPageAction';
import { customPageMock } from '../mocks/custom-page.mock';
import { ROUTES } from '@/shared/constants/routes';

const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/paginas/(actions)/fetchPageAction', () => ({
  fetchPageAction: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
}));

vi.mock('@/app/admin/paginas/editar/[id]/edit-custom-page-form', () => ({
  EditCustomPageForm: () => <div data-testid="edit-custom-page-form" />,
}));

const pageId = customPageMock.id;

describe('Tests on EditCustomPageView', () => {
  const defaultResponse = {
    ok: true,
    message: 'Página obtenida correctamente',
    page: customPageMock,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchPageAction).mockResolvedValue(defaultResponse);
  });

  const renderComponent = async () => {
    const ServerComponent = await EditCustomPageView({
      params: Promise.resolve({ id: pageId }),
    });
    return render(ServerComponent);
  };

  test('Should render <EditCustomPageForm /> component', async () => {
    await renderComponent();

    const form = screen.getByTestId('edit-custom-page-form');

    expect(form).toBeInTheDocument();
    expect(fetchPageAction).toHaveBeenCalledWith(pageId);
  });

  test('Should redirect when the page does not exist', async () => {
    const errorMessage = `La página con el id: "${pageId}", no existe`;
    vi.mocked(fetchPageAction).mockResolvedValue({
      ok: false,
      message: 'Página no encontrada',
      page: null,
    });

    await EditCustomPageView({ params: Promise.resolve({ id: pageId }) });

    expect(mockRedirect).toHaveBeenCalledWith(
      ROUTES.ADMIN_CUSTOM_PAGES +
      '?error=' +
      encodeURIComponent(errorMessage),
    );
  });
});
