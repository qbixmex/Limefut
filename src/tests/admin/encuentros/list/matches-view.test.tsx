import { render, screen } from '@testing-library/react';
import { MatchesView } from '@/app/admin/encuentros/matches-view';
import { ROUTES } from '@/shared/constants/routes';

const shouldSuspend = vi.hoisted(() => ({ value: true }));

vi.mock('@/app/admin/encuentros/(components)/matches-table-skeleton', () => ({
  MatchesTableSkeleton: () => <div data-testid="matches-table-skeleton" />,
}));

vi.mock('@/app/admin/encuentros/(components)/matches.wrapper', () => ({
  MatchesWrapper: () => {
    if (shouldSuspend.value) {
      throw new Promise(() => {});
    }
    return <div data-testid="matches-wrapper" />;
  },
}));

const tournamentId = 'd9816c2a-1c84-438d-9dfe-eab91277c2b8';
const categoryId = 'aff07903-239e-48f3-96fb-d018e46b0869';

const mockFetchTournament = vi.fn().mockResolvedValue({
  ok: true,
  message: 'Torneo obtenido correctamente',
  tournament: { id: tournamentId },
});

const mockFetchCategory = vi.fn().mockResolvedValue({
  ok: true,
  message: 'Categoría obtenida correctamente',
  category: { id: categoryId },
});

vi.mock('@/shared/actions/fetch-admin-tournament.action', () => ({
  fetchAdminTournamentAction: (...args: unknown[]) => mockFetchTournament(...args),
}));

vi.mock('@/shared/actions/fetch-admin-category.action', () => ({
  fetchAdminCategoryAction: (...args: unknown[]) => mockFetchCategory(...args),
}));

const mockRedirect = vi.fn();

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}));

type SearchParams = {
  query?: string;
  page?: string;
  tournament?: string;
  category?: string;
  'sort-week'?: 'asc' | 'desc';
  'sort-match-date'?: 'asc' | 'desc';
};

describe('Tests on <MatchesContent />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    shouldSuspend.value = true;

    mockFetchTournament.mockResolvedValue({
      ok: true,
      message: 'Torneo obtenido correctamente',
      tournament: { id: 'tournament-id' },
    });

    mockFetchCategory.mockResolvedValue({
      ok: true,
      message: 'Categoría obtenida correctamente',
      category: { id: 'category-id' },
    });
  });

  test('Should render null when missing required params', async () => {
    shouldSuspend.value = false;

    const ServerComponent = await MatchesView({
      searchParams: Promise.resolve<SearchParams>({}),
    });
    render(ServerComponent);

    const matchesWrapper = screen.queryByTestId('matches-wrapper');
    const skeleton = screen.queryByTestId('matches-table-skeleton');

    expect(matchesWrapper).not.toBeInTheDocument();
    expect(skeleton).not.toBeInTheDocument();
  });

  test('Should render <MatchesWrapper /> when fetches succeed', async () => {
    shouldSuspend.value = false;

    const ServerComponent = await MatchesView({
      searchParams: Promise.resolve<SearchParams>({
        tournament: 'tournament-test',
        category: 'category-test',
      }),
    });
    render(ServerComponent);

    const matchesWrapper = screen.queryByTestId('matches-wrapper');

    expect(matchesWrapper).toBeInTheDocument();
  });

  test('Should redirect when tournament fetch fails', async () => {
    const errorMessage = 'El torneo con el enlace permanente: "torneo-verano" no existe';
    mockFetchTournament.mockResolvedValue({
      ok: false,
      message: errorMessage,
      tournament: null,
    });

    try {
      await MatchesView({
        searchParams: Promise.resolve<SearchParams>({
          tournament: 'torneo-verano',
          category: 'secundaria-varonil',
        }),
      });
    } catch {
      // redirect throws in Next.js
    }

    expect(mockRedirect).toHaveBeenCalledWith(
      ROUTES.ADMIN_MATCHES +
      '?error=' +
      encodeURIComponent(errorMessage),
    );
  });

  test('Should redirect when category fetch fails', async () => {
    const errorMessage = 'La categoría con el enlace permanente: "secundaria-varonil" no existe';

    mockFetchCategory.mockResolvedValue({
      ok: false,
      message: errorMessage,
      category: null,
    });

    try {
      await MatchesView({
        searchParams: Promise.resolve<SearchParams>({
          tournament: 'torneo-verano',
          category: 'secundaria-varonil',
        }),
      });
    } catch {
      // redirect throws in Next.js
    }

    expect(mockRedirect).toHaveBeenCalledWith(
      ROUTES.ADMIN_MATCHES +
      '?error=' +
      encodeURIComponent(errorMessage),
    );
  });

  test('Should render skeleton while suspended', async () => {
    shouldSuspend.value = true;

    const ServerComponent = await MatchesView({
      searchParams: Promise.resolve<SearchParams>({
        tournament: 'tournament-test',
        category: 'category-test',
      }),
    });
    render(ServerComponent);

    const skeleton = screen.getByTestId('matches-table-skeleton');
    expect(skeleton).toBeInTheDocument();
  });
});
