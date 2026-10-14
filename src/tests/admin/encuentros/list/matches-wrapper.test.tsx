import { render, screen } from '@testing-library/react';
import type { ComponentProps } from 'react';
import { MatchesWrapper } from '@/app/admin/encuentros/(components)/matches.wrapper';
import { fetchMatchesAction, type MATCH_TYPE } from '@/app/admin/encuentros/(actions)/fetch-matches.action';
import { ROUTES } from '@/shared/constants/routes';
import { matchesMock } from '../mocks/matches.mock';

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

const tournamentId = '9c3eeaa6-8ea3-4198-a9b5-1ae5e351532e';
const categoryId = '88a1c831-d5ac-44d3-8e15-005b469436b0';

describe('Tests on <MatchesWrapper /> component', () => {
  const defaultResponse = {
    ok: true,
    message: 'Los encuentros fueron obtenidos correctamente',
    matches: [] as MATCH_TYPE[],
    pagination: {
      currentPage: 1,
      totalPages: 1,
    },
  };

  const defaultProps: ComponentProps<typeof MatchesWrapper> = {
    tournamentId,
    categoryId,
    currentPage: 1,
    query: '',
    sortMatchDate: 'asc' as const,
    sortWeek: undefined,
    status: 'scheduled' as const,
    mode: undefined,
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

    const matchesTable = screen.getByTestId('matches-table');

    expect(matchesTable).toBeInTheDocument();
  });

  test('Should call fetchMatchesAction with correct options', async () => {
    await renderComponent();

    expect(vi.mocked(fetchMatchesAction)).toHaveBeenCalledWith({
      tournamentId,
      categoryId,
      page: 1,
      take: 12,
      searchTerm: '',
      sortMatchDate: 'asc',
      sortWeek: undefined,
      status: 'scheduled',
      mode: undefined,
    });
  });

  test('Should forward the mode filter to fetchMatchesAction', async () => {
    await renderComponent({ ...defaultProps, mode: 'friendly' });

    expect(vi.mocked(fetchMatchesAction)).toHaveBeenCalledWith(
      expect.objectContaining({ mode: 'friendly' }),
    );
  });

  test('Should compute unique non-null matchesWeeks', async () => {
    vi.mocked(fetchMatchesAction).mockResolvedValue({
      ...defaultResponse,
      matches: matchesMock,
    });

    await renderComponent();

    expect(matchesTableProps).toEqual(
      expect.objectContaining({
        matchesWeeks: [1, 2],
        matches: matchesMock,
        pagination: {
          currentPage: 1,
          totalPages: 1,
        },
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
      ROUTES.ADMIN_MATCHES +
      '?error=' +
      encodeURIComponent('Error al obtener los encuentros'),
    );
  });
});
