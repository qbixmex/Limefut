import { use, act } from 'react';
import { render, screen } from '@testing-library/react';
import { StandingsView } from '@/app/admin/estadisticas/(components)/standings-view';
import {
  CATEGORY_ID,
  TOURNAMENT_ID,
} from '../mocks/standings.mock';

const { mockRedirect, mockFetchAdminTournament, mockFetchAdminCategory } = vi.hoisted(
  () => ({
    mockRedirect: vi.fn(),
    mockFetchAdminTournament: vi.fn(),
    mockFetchAdminCategory: vi.fn(),
  }),
);

vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
}));

vi.mock('@/shared/actions/fetch-admin-tournament.action', () => ({
  fetchAdminTournamentAction: mockFetchAdminTournament,
}));

vi.mock('@/shared/actions/fetch-admin-category.action', () => ({
  fetchAdminCategoryAction: mockFetchAdminCategory,
}));

const shouldSuspend = vi.hoisted(() => ({ value: true }));

vi.mock('@/app/admin/estadisticas/(components)/standings-content', () => ({
  StandingsContent: () => {
    if (shouldSuspend.value) {
      use(new Promise(() => {}));
    }
    return <div data-testid="standings-content" />;
  },
}));

vi.mock('@/app/admin/estadisticas/(components)/standings-table/skeleton-table', () => ({
  SkeletonTable: () => <div data-testid="skeleton-table" />,
}));

type SearchParams = {
  tournament?: string;
  category?: string;
};

describe('Tests on <StandingsView />', () => {
  beforeEach(() => {
    shouldSuspend.value = true;
    mockRedirect.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT');
    });
    mockFetchAdminTournament.mockResolvedValue({
      ok: true,
      message: '¡ Torneo obtenido correctamente 👍 !',
      tournament: { id: TOURNAMENT_ID },
    });
    mockFetchAdminCategory.mockResolvedValue({
      ok: true,
      message: '¡ Categoría obtenida correctamente 👍 !',
      category: { id: CATEGORY_ID },
    });
  });

  test('Should render nothing when there is no tournament', async () => {
    const result = await StandingsView({
      searchParams: Promise.resolve<SearchParams>({}),
    });

    expect(result).toBeNull();
    expect(mockFetchAdminTournament).not.toHaveBeenCalled();
  });

  test('Should render nothing when there is no category', async () => {
    const result = await StandingsView({
      searchParams: Promise.resolve<SearchParams>({ tournament: 'liga-de-prueba' }),
    });

    expect(result).toBeNull();
    expect(mockFetchAdminTournament).not.toHaveBeenCalled();
  });

  test('Should redirect when the tournament does not exist', async () => {
    mockFetchAdminTournament.mockResolvedValue({
      ok: false,
      message: 'El torneo no existe',
      tournament: null,
    });

    const view = StandingsView({
      searchParams: Promise.resolve<SearchParams>({
        tournament: 'liga-desconocida',
        category: 'sub-17',
      }),
    });

    await expect(view).rejects.toThrow('NEXT_REDIRECT');
    expect(mockRedirect).toHaveBeenCalledWith(
      '/admin/estadisticas?error=El%20torneo%20no%20existe',
    );
    expect(mockFetchAdminCategory).not.toHaveBeenCalled();
  });

  test('Should redirect when the category does not exist', async () => {
    mockFetchAdminCategory.mockResolvedValue({
      ok: false,
      message: 'La categoría no existe',
      category: null,
    });

    const view = StandingsView({
      searchParams: Promise.resolve<SearchParams>({
        tournament: 'liga-de-prueba',
        category: 'sub-99',
      }),
    });

    await expect(view).rejects.toThrow('NEXT_REDIRECT');
    expect(mockRedirect).toHaveBeenCalledWith(
      '/admin/estadisticas?error=La%20categor%C3%ADa%20no%20existe',
    );
  });

  test('Should render the standings content', async () => {
    shouldSuspend.value = false;

    const ServerComponent = await StandingsView({
      searchParams: Promise.resolve<SearchParams>({
        tournament: 'liga-de-prueba',
        category: 'sub-17',
      }),
    });
    render(ServerComponent);

    const content = screen.getByTestId('standings-content');

    expect(content).toBeInTheDocument();
  });

  test('Should render the skeleton while loading', async () => {
    const ServerComponent = await StandingsView({
      searchParams: Promise.resolve<SearchParams>({
        tournament: 'liga-de-prueba',
        category: 'sub-17',
      }),
    });

    await act(() => render(ServerComponent));

    const skeleton = screen.getByTestId('skeleton-table');

    expect(skeleton).toBeInTheDocument();
  });
});
