import { render, screen } from '@testing-library/react';

const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error('NEXT_REDIRECT');
  },
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/fetch-playoff-matches.action', () => ({
  fetchPlayoffMatchesAction: vi.fn(),
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/matches-wrapper', () => ({
  MatchesWrapper: () => <div data-testid="matches-wrapper" />,
}));

import { fetchPlayoffMatchesAction } from '@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/fetch-playoff-matches.action';
import { PlayoffsMatchesView } from '@/app/admin/liguilla/[playoff_id]/encuentros/playoff-matches-view';
import { ROUTES } from '@/shared/constants/routes';
import type { MATCH_STATUS_TYPE } from '@/shared/enums';
import { playoffId } from '../mocks/playoff.mock';
import { playoffMatchesMock } from '../mocks/playoff-matches.mock';

type SearchParams = {
  query?: string;
  page?: string;
  status?: MATCH_STATUS_TYPE;
  'sort-match-date'?: 'asc' | 'desc';
};

const defaultResponse = {
  ok: true,
  message: 'Los encuentros de liguilla fueron obtenidos correctamente',
  matches: playoffMatchesMock,
  pagination: { currentPage: 0, totalPages: 1 },
};

describe('Tests on <PlayoffsMatchesView />', () => {
  const renderComponent = async (searchParams: SearchParams = {}) => {
    vi.mocked(fetchPlayoffMatchesAction).mockResolvedValue(defaultResponse as never);
    const ServerComponent = await PlayoffsMatchesView({
      playoffIdPromise: Promise.resolve(playoffId),
      searchParams: Promise.resolve(searchParams),
    });
    return render(ServerComponent);
  };

  test('Should render <MatchesWrapper /> when fetch succeeds', async () => {
    await renderComponent();

    const matchesWrapper = screen.getByTestId('matches-wrapper');

    expect(matchesWrapper).toBeInTheDocument();
  });

  test('Should call fetchPlayoffMatchesAction with default options', async () => {
    await renderComponent();

    const mockAction = vi.mocked(fetchPlayoffMatchesAction);

    expect(mockAction).toHaveBeenCalledWith({
      playoffId,
      searchTerm: undefined,
      sortMatchDate: 'asc',
      status: undefined,
      page: 0,
      take: 12,
    });
  });

  test('Should call fetchPlayoffMatchesAction with parsed search params', async () => {
    await renderComponent({
      query: 'atlas',
      page: '2',
      status: 'scheduled',
      'sort-match-date': 'desc',
    });

    const mockAction = vi.mocked(fetchPlayoffMatchesAction);

    expect(mockAction).toHaveBeenCalledWith({
      playoffId,
      searchTerm: 'atlas',
      sortMatchDate: 'desc',
      status: 'scheduled',
      page: 2,
      take: 12,
    });
  });

  test('Should redirect when fetch fails', async () => {
    vi.mocked(fetchPlayoffMatchesAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener los encuentros de liguilla',
      matches: [],
      pagination: { currentPage: 0, totalPages: 0 },
    } as never);

    await expect(async () => {
      await PlayoffsMatchesView({
        playoffIdPromise: Promise.resolve(playoffId),
        searchParams: Promise.resolve({}),
      });
    }).rejects.toThrow('NEXT_REDIRECT');

    expect(mockRedirect).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_PLAYOFFS_MATCHES(playoffId)}?error=${encodeURIComponent(
        'Error al obtener los encuentros de liguilla',
      )}`,
    );
  });
});
