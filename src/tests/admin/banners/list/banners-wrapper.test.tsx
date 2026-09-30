import { render, screen } from '@testing-library/react';
import { BannersWrapper } from '@/app/admin/banners/(components)/banners-wrapper';
import { fetchHeroBannersAction } from '@/app/admin/banners/(actions)';
import { heroBannersMock } from '../mocks/hero-banners.mock';

const { mockGetSession } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
}));

vi.mock('@/lib/get-session', () => ({
  getSession: mockGetSession,
}));

vi.mock('@/app/admin/banners/(actions)', () => ({
  fetchHeroBannersAction: vi.fn(),
}));

vi.mock('@/app/admin/banners/(components)/banners-table', () => ({
  BannersTable: (props: { banners: unknown[]; roles: string[]; pagination: unknown }) => (
    <div
      data-testid="banners-table"
      data-roles={(props.roles ?? []).join(',')}
      data-count={props.banners.length}
    />
  ),
}));

describe('Tests on <BannersWrapper />', () => {
  const defaultResponse = {
    ok: true,
    message: 'Los banners fueron obtenidos correctamente',
    heroBanners: heroBannersMock,
    pagination: {
      currentPage: 1,
      totalPages: 1,
    },
  };

  const renderComponent = async (query = '', currentPage = 1) => {
    const ServerComponent = await BannersWrapper({ currentPage, query });
    return render(ServerComponent);
  };

  beforeEach(() => {
    mockGetSession.mockResolvedValue({
      user: { roles: ['admin'] },
    });
    vi.mocked(fetchHeroBannersAction).mockResolvedValue(defaultResponse);
  });

  test('Should render the banners table with the fetched banners', async () => {
    await renderComponent();

    const table = screen.getByTestId('banners-table');

    expect(table).toBeInTheDocument();
    expect(table).toHaveAttribute('data-count', String(heroBannersMock.length));
    expect(table).toHaveAttribute('data-roles', 'admin');
  });

  test('Should call fetchHeroBannersAction with page, take and search term', async () => {
    await renderComponent('Torneo', 2);

    expect(fetchHeroBannersAction).toHaveBeenCalledWith({
      page: 2,
      take: 12,
      searchTerm: 'Torneo',
    });
  });

  test('Should render an empty table when there are no banners', async () => {
    vi.mocked(fetchHeroBannersAction).mockResolvedValue({
      ...defaultResponse,
      heroBanners: [],
    });

    await renderComponent();

    const table = screen.getByTestId('banners-table');

    expect(table).toHaveAttribute('data-count', '0');
  });

  test('Should fall back to an empty list and default pagination when response is empty', async () => {
    vi.mocked(fetchHeroBannersAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener los banners',
      heroBanners: [],
      pagination: null,
    });

    await renderComponent();

    const table = screen.getByTestId('banners-table');

    expect(table).toHaveAttribute('data-count', '0');
  });
});
