const { mockGetSession, mockFetchGalleries, mockUpdateState } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockFetchGalleries: vi.fn(),
  mockUpdateState: vi.fn(),
}));

let deleteGalleryProps: Record<string, unknown> | undefined;

vi.mock('@/lib/get-session', () => ({
  getSession: mockGetSession,
  requireAdmin: vi.fn(),
}));

vi.mock('@/app/admin/galerias/(actions)', () => ({
  fetchGalleriesAction: mockFetchGalleries,
  updateGalleryStateAction: mockUpdateState,
}));

vi.mock('@/app/admin/galerias/(components)/edit-gallery', () => ({
  EditGallery: () => <span data-testid="edit-gallery" />,
}));

vi.mock('@/app/admin/galerias/(components)/delete-gallery', () => ({
  DeleteGallery: (props: Record<string, unknown>) => {
    deleteGalleryProps = props;
    return <span data-testid="delete-gallery" />;
  },
}));

vi.mock('@/app/admin/galerias/(components)/show-gallery-images', () => ({
  ShowGalleryImages: () => <span data-testid="show-gallery-images" />,
}));

vi.mock('@/shared/components/active-switch', () => ({
  ActiveSwitch: () => <span data-testid="active-switch" />,
}));

vi.mock('@/shared/components/pagination', () => ({
  Pagination: () => <span data-testid="pagination" />,
}));

import { render, screen } from '@testing-library/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { GalleriesTable } from '@/app/admin/galerias/(components)/galleries-table';
import { galleriesMock } from '../mocks/galleries.mock';

const defaultResponse = {
  ok: true,
  message: 'Las galerías fueron obtenidas correctamente',
  galleries: galleriesMock,
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
};

const formatDate = (date: Date) =>
  format(date, "d 'de' MMMM 'del' yyyy", { locale: es });

describe('Tests on <GalleriesTable />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    deleteGalleryProps = undefined;
    mockGetSession.mockResolvedValue({ user: { roles: ['admin'] } });
    mockFetchGalleries.mockResolvedValue(defaultResponse);
  });

  const renderComponent = async ({
    query = '',
    currentPage = '1',
  }: { query?: string; currentPage?: string } = {}) => {
    const ServerComponent = await GalleriesTable({ query, currentPage });
    return render(ServerComponent);
  };

  test('Should render the table', async () => {
    await renderComponent();

    const table = screen.getByRole('table', { name: 'Lista de galerías' });

    expect(table).toBeInTheDocument();
  });

  test('Should render the table columns', async () => {
    await renderComponent();

    expect(screen.getByRole('columnheader', { name: 'Título' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Imágenes' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Fecha' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Activo' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Acciones' })).toBeInTheDocument();
  });

  test('Should render the empty state when there are no galleries', async () => {
    mockFetchGalleries.mockResolvedValue({ ...defaultResponse, galleries: [] });

    await renderComponent();

    const emptyMessage = screen.getByText('No hay galerías');
    const table = screen.queryByRole('table', { name: 'Lista de galerías' });
    const imagesCount = screen.queryAllByRole('status', { name: 'Cantidad de imágenes' });

    expect(emptyMessage).toBeInTheDocument();
    expect(table).not.toBeInTheDocument();
    expect(imagesCount).toHaveLength(0);
  });

  test('Should render each gallery title and images count', async () => {
    await renderComponent();

    galleriesMock.forEach((gallery) => {
      expect(screen.getByText(gallery.title)).toBeInTheDocument();
    });

    const imagesCount = screen.getAllByRole('status', { name: 'Cantidad de imágenes' });

    expect(imagesCount).toHaveLength(galleriesMock.length);

    imagesCount.forEach((itemCount, index) => {
      const imagesCountMock = String(galleriesMock[index].imagesCount);
      expect(itemCount).toHaveTextContent(imagesCountMock);
    });
  });

  test('Should render the formatted gallery date', async () => {
    await renderComponent();

    galleriesMock.forEach((gallery) => {
      expect(screen.getByText(formatDate(gallery.galleryDate))).toBeInTheDocument();
    });
  });

  test('Should render the action buttons and the active switch per row', async () => {
    await renderComponent();

    expect(screen.getAllByTestId('show-gallery-images')).toHaveLength(galleriesMock.length);
    expect(screen.getAllByTestId('edit-gallery')).toHaveLength(galleriesMock.length);
    expect(screen.getAllByTestId('delete-gallery')).toHaveLength(galleriesMock.length);
    expect(screen.getAllByTestId('active-switch')).toHaveLength(galleriesMock.length);
  });

  test('Should pass the session roles to <DeleteGallery />', async () => {
    await renderComponent();

    expect(deleteGalleryProps).toEqual(
      expect.objectContaining({ roles: ['admin'] }),
    );
  });

  test('Should call fetchGalleriesAction with the pagination params', async () => {
    await renderComponent({ query: 'apertura', currentPage: '2' });

    expect(mockFetchGalleries).toHaveBeenCalledWith({
      page: '2',
      take: 12,
      searchTerm: 'apertura',
    });
  });

  test('Should hide the pagination when there is a single page', async () => {
    await renderComponent();

    const wrapper = screen.getByTestId('pagination').closest('div');

    expect(wrapper).toHaveClass('hidden');
  });

  test('Should show the pagination when there are multiple pages', async () => {
    mockFetchGalleries.mockResolvedValue({
      ...defaultResponse,
      pagination: { currentPage: 1, totalPages: 3 },
    });

    await renderComponent();

    const wrapper = screen.getByTestId('pagination').closest('div');

    expect(wrapper).not.toHaveClass('hidden');
  });
});
