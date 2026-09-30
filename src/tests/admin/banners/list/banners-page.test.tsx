import BannersPage from '@/app/admin/banners/page';
import { render, screen } from '@testing-library/react';

vi.mock('@/shared/components/search', () => ({
  Search: () => <div data-testid="search-component" />,
}));

vi.mock('@/app/admin/banners/(components)/create-banner', () => ({
  CreateBanner: () => <div data-testid="create-banner" />,
}));

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/app/admin/banners/(components)/banners-view', () => ({
  BannersView: () => <div data-testid="banners-view" />,
}));

type SearchParams = { query?: string; page?: string; };

describe('Tests on banners page', () => {
  test('Should render heading', async () => {
    const ServerComponent = await BannersPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    const heading = screen.getByRole('heading', { name: /título/i });

    expect(heading).toHaveTextContent(/banners/i);
  });

  test('Should render <Search /> and <CreateBanner /> components', async () => {
    const ServerComponent = await BannersPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    const searchComponent = screen.getByTestId('search-component');
    const createBanner = screen.getByTestId('create-banner');

    expect(searchComponent).toBeInTheDocument();
    expect(createBanner).toBeInTheDocument();
  });

  test('Should render <BannersView /> component', async () => {
    const ServerComponent = await BannersPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    const bannersView = screen.getByTestId('banners-view');

    expect(bannersView).toBeInTheDocument();
  });
});
