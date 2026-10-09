import { render, screen } from '@testing-library/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CustomPageDetailsView } from '@/app/admin/paginas/[id]/custom-page-details-view';
import { fetchPageAction } from '@/app/admin/paginas/(actions)/fetchPageAction';
import { customPageMock } from '../mocks/custom-page.mock';

const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/paginas/(actions)/fetchPageAction', () => ({
  fetchPageAction: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
}));

vi.mock('@/app/admin/paginas/(components)/edit-custom-page', () => ({
  EditCustomPage: () => <div data-testid="edit-custom-page" />,
}));

const pageId = customPageMock.id;

describe('Tests on CustomPageDetailsView', () => {
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
    const ServerComponent = await CustomPageDetailsView({
      params: Promise.resolve({ id: pageId }),
    });
    return render(ServerComponent);
  };

  test('Should render the details and SEO tables', async () => {
    await renderComponent();

    expect(screen.getByRole('table', { name: /detalles de la página/i })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /detalles seo/i })).toBeInTheDocument();
  });

  test('Should render the page title and permalink', async () => {
    await renderComponent();

    expect(screen.getByText(customPageMock.title)).toBeInTheDocument();
    expect(screen.getByText(customPageMock.permalink)).toBeInTheDocument();
  });

  test('Should render the status badge', async () => {
    await renderComponent();

    expect(screen.getByText('Publicado')).toBeInTheDocument();
  });

  test('Should render the formatted created and updated dates', async () => {
    await renderComponent();

    const createdAt = format(customPageMock.createdAt, "d 'de' MMMM 'del' yyyy", { locale: es });
    const updatedAt = format(customPageMock.updatedAt, "d 'de' MMMM 'del' yyyy", { locale: es });

    expect(screen.getByText(createdAt)).toBeInTheDocument();
    expect(screen.getByText(updatedAt)).toBeInTheDocument();
  });

  test('Should render SEO title', async () => {
    await renderComponent();
    expect(screen.getByText(customPageMock.seoTitle)).toBeInTheDocument();
  });

  test('Should render the SEO description', async () => {
    await renderComponent();
    expect(screen.getByText(customPageMock.seoDescription)).toBeInTheDocument();
  });

  test('Should render the SEO robots', async () => {
    await renderComponent();
    expect(screen.getByText(/indexar, seguir/i)).toBeInTheDocument();
  });

  test('Should render the markdown content', async () => {
    await renderComponent();

    expect(
      screen.getByRole('heading', { name: /contenido de prueba/i }),
    ).toBeInTheDocument();
  });

  test('Should render the edit button', async () => {
    await renderComponent();

    expect(screen.getByTestId('edit-custom-page')).toBeInTheDocument();
    expect(fetchPageAction).toHaveBeenCalledWith(pageId);
  });

  test('Should show fallbacks when optional fields are missing', async () => {
    vi.mocked(fetchPageAction).mockResolvedValue({
      ...defaultResponse,
      page: {
        ...customPageMock,
        title: null,
        permalink: null,
        seoDescription: null,
        content: null,
      },
    });

    await renderComponent();

    expect(screen.getAllByText('No definido').length).toBeGreaterThan(0);
  });

  test('Should redirect when fetch fails', async () => {
    vi.mocked(fetchPageAction).mockResolvedValue({
      ok: false,
      message: 'Página no encontrada',
      page: null,
    });

    await expect(async () => {
      await CustomPageDetailsView({ params: Promise.resolve({ id: pageId }) });
    }).rejects.toThrow();

    expect(mockRedirect).toHaveBeenCalledWith(
      `/admin/paginas?error=${encodeURIComponent('Página no encontrada')}`,
    );
  });
});
