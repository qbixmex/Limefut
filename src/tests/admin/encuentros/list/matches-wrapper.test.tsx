import { render, screen } from '@testing-library/react';
import { MatchesWrapper } from '@/app/admin/encuentros/(components)/matches.wrapper';
import { fetchMatchesAction, type MATCH_TYPE } from '@/app/admin/encuentros/(actions)/fetch-matches.action';
import { ROUTES } from '@/shared/constants/routes';

vi.mock('@/app/admin/encuentros/(actions)/fetch-matches.action', () => ({
  fetchMatchesAction: vi.fn(),
}));

const mockRedirect = vi.fn();

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}));

let matchesTableProps: Record<string, unknown> | undefined;

vi.mock('@/app/admin/encuentros/(components)/matches-table', () => ({
  MatchesTable: (props: Record<string, unknown>) => {
    matchesTableProps = props;
    return <div data-testid="matches-table" />;
  },
}));

const buildMatch = (id: string, week: number | null): MATCH_TYPE => ({
  id,
  localTeam: { id: 'local-1', name: 'Chivas', permalink: 'chivas' },
  visitorTeam: { id: 'visitor-1', name: 'Atlas', permalink: 'atlas' },
  localScore: 0,
  visitorScore: 0,
  status: 'scheduled',
  week,
  matchDate: null,
  penaltyShootout: null,
  field: null,
});

describe('Tests on <MatchesWrapper /> component', () => {
  const defaultResponse = {
    ok: true,
    message: '! Los encuentros fueron obtenidos correctamente 👍',
    matches: [] as MATCH_TYPE[],
    pagination: {
      currentPage: 1,
      totalPages: 1,
    },
  };

  const defaultProps = {
    tournamentId: 'tournament-1',
    categoryId: 'category-1',
    currentPage: 1,
    query: '',
    sortMatchDate: 'asc' as const,
    sortWeek: undefined,
    status: 'scheduled' as const,
  };

  const renderComponent = async (props = defaultProps) => {
    const ServerComponent = await MatchesWrapper(props);
    return render(ServerComponent);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    matchesTableProps = undefined;

    vi.mocked(fetchMatchesAction).mockResolvedValue(defaultResponse);
  });

  test('Should render <MatchesTable /> when fetch succeeds', async () => {
    await renderComponent();

    expect(screen.getByTestId('matches-table')).toBeInTheDocument();
  });

  test('Should call fetchMatchesAction with correct options', async () => {
    await renderComponent();

    expect(vi.mocked(fetchMatchesAction)).toHaveBeenCalledWith({
      tournamentId: 'tournament-1',
      categoryId: 'category-1',
      page: 1,
      take: 12,
      searchTerm: '',
      sortMatchDate: 'asc',
      sortWeek: undefined,
      status: 'scheduled',
    });
  });

  test('Should compute unique non-null matchesWeeks', async () => {
    vi.mocked(fetchMatchesAction).mockResolvedValue({
      ...defaultResponse,
      matches: [
        buildMatch('match-1', 1),
        buildMatch('match-2', null),
        buildMatch('match-3', 2),
        buildMatch('match-4', 1),
      ],
    });

    await renderComponent();

    expect(matchesTableProps).toEqual(
      expect.objectContaining({
        matchesWeeks: [1, 2],
      }),
    );
  });

  test('Should redirect when fetch fails', async () => {
    vi.mocked(fetchMatchesAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener los encuentros',
      matches: [],
      pagination: {
        currentPage: 0,
        totalPages: 0,
      },
    });

    try {
      await MatchesWrapper(defaultProps);
    } catch {
      // redirect throws in Next.js
    }

    expect(mockRedirect).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_MATCHES}?error=${
        encodeURIComponent('Error al obtener los encuentros')
      }`,
    );
  });
});
