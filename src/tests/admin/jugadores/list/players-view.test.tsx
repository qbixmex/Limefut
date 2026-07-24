import { use, act } from 'react';
import { PlayersView } from '@/app/admin/jugadores/(components)/players-view';
import { render, screen } from '@testing-library/react';

const shouldSuspend = vi.hoisted(() => ({ value: true }));

vi.mock('@/shared/components/errorHandler', () => ({
  ErrorHandler: () => null,
}));

vi.mock('@/app/admin/jugadores/(components)/players-table-skeleton', () => ({
  PlayersTableSkeleton: () => <div data-testid="players-table-skeleton" />,
}));

vi.mock('@/app/admin/jugadores/(components)/players-table', () => ({
  PlayersTable: () => {
    if (shouldSuspend.value) {
      use(new Promise(() => { }));
    }
    return <div data-testid="players-table" />;
  },
}));

type SearchParams = {
  tournament?: string;
  category?: string;
  team?: string;
  query?: string;
  page?: string;
};

describe('Tests on PlayersView', () => {
  beforeEach(() => {
    shouldSuspend.value = true;
  });

  test('Should render null when missing required params', async () => {
    shouldSuspend.value = false;

    const ServerComponent = await PlayersView({
      searchParams: Promise.resolve<SearchParams>({}),
    });
    render(ServerComponent);

    expect(screen.queryByTestId('players-table')).not.toBeInTheDocument();
    expect(screen.queryByTestId('players-table-skeleton')).not.toBeInTheDocument();
  });

  test('Should render table when all params present', async () => {
    shouldSuspend.value = false;

    const ServerComponent = await PlayersView({
      searchParams: Promise.resolve<SearchParams>({
        tournament: 'tournament-test',
        category: 'category-test',
        team: 'team-test',
      }),
    });
    render(ServerComponent);

    expect(screen.getByTestId('players-table')).toBeInTheDocument();
  });

  test('Should render skeleton while suspended', async () => {
    const ServerComponent = await PlayersView({
      searchParams: Promise.resolve<SearchParams>({
        tournament: 'tournament-test',
        category: 'category-test',
        team: 'team-test',
      }),
    });

    await act(() => render(ServerComponent));

    expect(screen.getByTestId('players-table-skeleton')).toBeInTheDocument();
  });
});
