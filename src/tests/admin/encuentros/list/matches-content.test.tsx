import { use } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MatchesContent } from '@/app/admin/encuentros/matches-content';

const shouldSuspend = vi.hoisted(() => ({ value: true }));

vi.mock('@/app/admin/encuentros/(components)/matches-table-skeleton', () => ({
  MatchesTableSkeleton: () => <div data-testid="matches-table-skeleton" />,
}));

vi.mock('@/app/admin/encuentros/(components)/matches.wrapper', () => ({
  MatchesWrapper: () => {
    if (shouldSuspend.value) {
      use(new Promise(() => { }));
    }
    return <div data-testid="matches-wrapper" />;
  },
}));

const mockFetchTournament = vi.fn().mockResolvedValue({
  ok: true,
  message: '¡ Torneo obtenido correctamente 👍 !',
  tournament: { id: 'tournament-id' },
});

const mockFetchCategory = vi.fn().mockResolvedValue({
  ok: true,
  message: '¡ Categoría obtenida correctamente 👍 !',
  category: { id: 'category-id' },
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
      message: '¡ Torneo obtenido correctamente 👍 !',
      tournament: { id: 'tournament-id' },
    });

    mockFetchCategory.mockResolvedValue({
      ok: true,
      message: '¡ Categoría obtenida correctamente 👍 !',
      category: { id: 'category-id' },
    });
  });

  test('Should render null when missing required params', async () => {
    shouldSuspend.value = false;

    const ServerComponent = await MatchesContent({
      searchParams: Promise.resolve<SearchParams>({}),
    });
    render(ServerComponent);

    expect(screen.queryByTestId('matches-wrapper')).not.toBeInTheDocument();
    expect(screen.queryByTestId('matches-table-skeleton')).not.toBeInTheDocument();
  });

  test('Should render <MatchesWrapper /> when fetches succeed', async () => {
    shouldSuspend.value = false;

    const ServerComponent = await MatchesContent({
      searchParams: Promise.resolve<SearchParams>({
        tournament: 'tournament-test',
        category: 'category-test',
      }),
    });
    render(ServerComponent);

    expect(screen.getByTestId('matches-wrapper')).toBeInTheDocument();
  });

  test('Should redirect when tournament fetch fails', async () => {
    mockFetchTournament.mockResolvedValue({
      ok: false,
      message: '¡ El torneo con el enlace permanente: "tournament-test" no existe ❌ !',
      tournament: null,
    });

    try {
      await MatchesContent({
        searchParams: Promise.resolve<SearchParams>({
          tournament: 'tournament-test',
          category: 'category-test',
        }),
      });
    } catch {
      // redirect throws in Next.js
    }

    expect(mockRedirect).toHaveBeenCalledWith(expect.stringContaining('error='));
  });

  test('Should redirect when category fetch fails', async () => {
    mockFetchCategory.mockResolvedValue({
      ok: false,
      message: '¡ La categoría con el enlace permanente: "category-test" no existe ❌ !',
      category: null,
    });

    try {
      await MatchesContent({
        searchParams: Promise.resolve<SearchParams>({
          tournament: 'tournament-test',
          category: 'category-test',
        }),
      });
    } catch {
      // redirect throws in Next.js
    }

    expect(mockRedirect).toHaveBeenCalledWith(expect.stringContaining('error='));
  });

  test('Should render skeleton while suspended', async () => {
    const ServerComponent = await MatchesContent({
      searchParams: Promise.resolve<SearchParams>({
        tournament: 'tournament-test',
        category: 'category-test',
      }),
    });

    render(ServerComponent);

    await waitFor(() => {
      const skeleton = screen.getByTestId('matches-table-skeleton');
      expect(skeleton).toBeInTheDocument();
    });
  });
});
