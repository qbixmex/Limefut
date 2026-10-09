const { mockGetSession, mockFetchPages } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockFetchPages: vi.fn(),
}));

let deletePageProps: Record<string, unknown> | undefined;

vi.mock('@/lib/get-session', () => ({
  getSession: mockGetSession,
  requireAdmin: vi.fn(),
}));

vi.mock('@/app/admin/paginas/(actions)/fetchPagesAction', () => ({
  fetchPagesAction: mockFetchPages,
}));

vi.mock('@/app/admin/paginas/(components)/show-custom-page-details', () => ({
  ShowCustomPageDetails: () => <span data-testid="show-custom-page-details" />,
}));

vi.mock('@/app/admin/paginas/(components)/edit-custom-page', () => ({
  EditCustomPage: () => <span data-testid="edit-custom-page" />,
}));

vi.mock('@/app/admin/paginas/(components)/delete-page', () => ({
  DeletePage: (props: Record<string, unknown>) => {
    deletePageProps = props;
    return <span data-testid="delete-page" />;
  },
}));

vi.mock('@/shared/components/pagination', () => ({
  Pagination: () => <span data-testid="pagination" />,
}));

import { render, screen } from '@testing-library/react';
import { PagesTable } from '@/app/admin/paginas/(components)/pages-table';
import { customPagesMock } from '../mocks/custom-pages.mock';

const defaultResponse = {
  ok: true,
  message: 'Las páginas fueron obtenidas correctamente',
  customPages: customPagesMock,
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
};

describe('Tests on <PagesTable /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    deletePageProps = undefined;
    mockGetSession.mockResolvedValue({ user: { roles: ['admin'] } });
    mockFetchPages.mockResolvedValue(defaultResponse);
  });

  const renderComponent = async ({
    query = '',
    currentPage = '1',
  }: { query?: string; currentPage?: string } = {}) => {
    const ServerComponent = await PagesTable({ query, currentPage });
    return render(ServerComponent);
  };

  test('Should render the table', async () => {
    await renderComponent();

    const table = screen.getByRole('table', { name: /lista de páginas/i });

    expect(table).toBeInTheDocument();
  });

  test('Should render the table columns', async () => {
    await renderComponent();

    expect(screen.getByRole('columnheader', { name: 'Título' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Enlace Permanente' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Robots' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Estado' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Posición' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Acciones' })).toBeInTheDocument();
  });

  test('Should render the empty state when there are no pages', async () => {
    mockFetchPages.mockResolvedValue({ ...defaultResponse, customPages: [] });

    await renderComponent();

    const emptyMessage = screen.getByText('No hay páginas disponibles');
    const table = screen.queryByRole('table', { name: /lista de páginas/i });

    expect(emptyMessage).toBeInTheDocument();
    expect(table).not.toBeInTheDocument();
  });

  test('Should render each page title and permalink', async () => {
    await renderComponent();

    customPagesMock.forEach((page) => {
      if (page.title) {
        const title = screen.getByText(page.title);
        expect(title).toBeInTheDocument();
      }
      if (page.permalink) {
        const permalink = screen.getByText(page.permalink);
        expect(permalink).toBeInTheDocument();
      }
    });
  });

  test('Should render placeholder when title is null', async () => {
    await renderComponent();

    const title = screen.getByRole('status', { name: /título de la página/i });

    expect(title).toHaveTextContent(/no especificado/i);
  });

  test('Should render placeholder when permalink is null', async () => {
    await renderComponent();

    const permalink = screen.getByRole('status', { name: /enlace permanente/i });

    expect(permalink).toHaveTextContent(/no especificado/i);
  });

  test('Should render the status badges', async () => {
    await renderComponent();

    expect(screen.getByText('Publicado')).toBeInTheDocument();
    expect(screen.getByText('Borrador')).toBeInTheDocument();
    expect(screen.getByText('Retenido')).toBeInTheDocument();
  });

  test('Should render the action buttons for each page', async () => {
    await renderComponent();

    const showDetailsButtons = screen.getAllByTestId('show-custom-page-details');
    const editButtons = screen.getAllByTestId('edit-custom-page');
    const deleteButtons = screen.getAllByTestId('delete-page');

    expect(showDetailsButtons).toHaveLength(customPagesMock.length);
    expect(editButtons).toHaveLength(customPagesMock.length);
    expect(deleteButtons).toHaveLength(customPagesMock.length);
  });

  test('Should pass the session roles to <DeletePage />', async () => {
    await renderComponent();

    expect(deletePageProps).toEqual(
      expect.objectContaining({ roles: ['admin'] }),
    );
  });

  test('Should call fetchPagesAction with the pagination params', async () => {
    await renderComponent({ query: 'prueba', currentPage: '2' });

    expect(mockFetchPages).toHaveBeenCalledWith({
      page: '2',
      take: 12,
      searchTerm: 'prueba',
    });
  });

  test('Should hide the pagination when there is a single page', async () => {
    await renderComponent();

    const wrapper = screen.getByTestId('pagination').closest('div');

    expect(wrapper).toHaveClass('hidden');
  });

  test('Should show the pagination when there are multiple pages', async () => {
    mockFetchPages.mockResolvedValue({
      ...defaultResponse,
      pagination: { currentPage: 1, totalPages: 3 },
    });

    await renderComponent();

    const wrapper = screen.getByTestId('pagination').closest('div');

    expect(wrapper).not.toHaveClass('hidden');
  });
});
