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

vi.mock('@/app/admin/encuentros/matches-content', () => ({
  MatchesContent: () => <div data-testid="matches-content" />,
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

    expect(screen.getByTestId('search-component')).toBeInTheDocument();
  });

  test('Should render <ClearFilters /> component', async () => {
    const ServerComponent = await MatchesPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    expect(screen.getByTestId('clear-filters')).toBeInTheDocument();
  });

  test('Should render <CreateMatch /> component', async () => {
    const ServerComponent = await MatchesPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    expect(screen.getByTestId('create-match')).toBeInTheDocument();
  });

  test('Should render <SearchParamsSelectors /> component', async () => {
    const ServerComponent = await MatchesPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    expect(screen.getByTestId('search-params-selectors')).toBeInTheDocument();
  });

  test('Should render <MatchesContent /> component', async () => {
    const ServerComponent = await MatchesPage({
      searchParams: Promise.resolve<SearchParams>({
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    expect(screen.getByTestId('matches-content')).toBeInTheDocument();
  });
});
