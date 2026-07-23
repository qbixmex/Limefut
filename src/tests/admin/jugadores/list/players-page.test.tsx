import PlayersPage from '@/app/admin/jugadores/page';
import { render, screen } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('tournament=t1&category=c1'),
  usePathname: () => '/admin/jugadores',
  useRouter: () => ({
    replace: vi.fn(),
    push: vi.fn(),
  }),
}));

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/shared/components/search', () => ({
  Search: () => <div data-testid="search-component" />,
}));

vi.mock('@/app/admin/equipos/(components)/TournamentsSelectorSkeleton', () => ({
  TournamentsSelectorSkeleton: () => null,
}));

vi.mock('@/app/admin/jugadores/(components)/create-player-button', () => ({
  CreatePlayerButton: () => <div data-testid="create-player-button" />,
}));

vi.mock('@/shared/components/search-params-selectors', () => ({
  SearchParamsSelectors: () => <div data-testid="search-params-selectors" />,
}));

vi.mock('@/app/admin/jugadores/(components)/teams-content', () => ({
  TeamsContent: () => <div data-testid="teams-content" />,
}));

vi.mock('@/app/admin/jugadores/(components)/players-view', () => ({
  PlayersView: () => <div data-testid="players-view" />,
}));

type SearchParams = {
  tournament?: string;
  category?: string;
  team?: string;
  query?: string;
  page?: string;
};

describe('Tests on PlayersPage', () => {
  test('Should render heading', async () => {
    const ServerComponent = await PlayersPage({
      searchParams: Promise.resolve<SearchParams>({
        tournament: 'tournament-test',
        category: 'category-test',
        team: undefined,
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    const heading = screen.getByText(/jugadores/i);
    expect(heading).toBeInTheDocument();
  });

  test('Should render child components', async () => {
    const ServerComponent = await PlayersPage({
      searchParams: Promise.resolve<SearchParams>({
        tournament: 'tournament-test',
        category: 'category-test',
        team: undefined,
        query: undefined,
        page: undefined,
      }),
    });
    render(ServerComponent);

    expect(screen.getByTestId('search-component')).toBeInTheDocument();
    expect(screen.getByTestId('create-player-button')).toBeInTheDocument();
    expect(screen.getByTestId('search-params-selectors')).toBeInTheDocument();
    expect(screen.getByTestId('teams-content')).toBeInTheDocument();
    expect(screen.getByTestId('players-view')).toBeInTheDocument();
  });
});
