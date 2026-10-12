import MatchesPage from '@/app/admin/encuentros/page';
import { render, screen } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('page=1'),
  usePathname: () => '/admin/encuentros',
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
}));

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/app/admin/encuentros/(components)/search', () => ({
  Search: () => <div data-testid="search-component" />,
}));

vi.mock('@/app/admin/encuentros/(components)/clear-filters', () => ({
  ClearFilters: () => <div data-testid="clear-filters" />,
}));

vi.mock('@/app/admin/encuentros/(components)/create-match', () => ({
  CreateMatch: () => <div data-testid="create-match" />,
}));

vi.mock('@/shared/components/search-params-selectors', () => ({
  SearchParamsSelectors: () => <div data-testid="search-params-selectors" />,
}));

vi.mock('@/app/admin/encuentros/matches-view', () => ({
  MatchesView: () => <div data-testid="matches-view" />,
}));

vi.mock('@/app/(public)/components', () => ({
  TournamentsSelectorSkeleton: () => null,
}));

type SearchParams = {
  query?: string;
  page?: string;
};

describe('Tests on MatchesPage', () => {
  test('Should render correctly', async () => {
    const ServerComponent = await MatchesPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    const heading = screen.getByText(/encuentros/i);
    expect(heading).toBeInTheDocument();
  });

  test('Should render <Search /> component', async () => {
    const ServerComponent = await MatchesPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    const search = screen.getByTestId('search-component');

    expect(search).toBeInTheDocument();
  });

  test('Should render <ClearFilters /> component', async () => {
    const ServerComponent = await MatchesPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    const clearFilters = screen.getByTestId('clear-filters');

    expect(clearFilters).toBeInTheDocument();
  });

  test('Should render <CreateMatch /> component', async () => {
    const ServerComponent = await MatchesPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    const createMatch = screen.getByTestId('create-match');

    expect(createMatch).toBeInTheDocument();
  });

  test('Should render <SearchParamsSelectors /> component', async () => {
    const ServerComponent = await MatchesPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    const searchParams = screen.getByTestId('search-params-selectors');

    expect(searchParams).toBeInTheDocument();
  });

  test('Should render <MatchesContent /> component', async () => {
    const ServerComponent = await MatchesPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    const matchesView = screen.getByTestId('matches-view');

    expect(matchesView).toBeInTheDocument();
  });
});
