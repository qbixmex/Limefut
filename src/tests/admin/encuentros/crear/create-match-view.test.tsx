import { render, screen } from '@testing-library/react';
import { MatchView } from '@/app/admin/encuentros/crear/create-match-view';
import { ROUTES } from '@/shared/constants/routes';

const mockRedirect = vi.hoisted(() => vi.fn());
const formProps = vi.hoisted(() => ({ current: undefined as unknown }));

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error('NEXT_REDIRECT');
  },
}));

vi.mock('@/app/admin/encuentros/(actions)/fetch-tournaments-for-match.action', () => ({
  fetchTournamentsForMatchAction: vi.fn(),
}));

vi.mock('@/app/admin/encuentros/(actions)/fetch-categories-for-match.action', () => ({
  fetchCategoriesForMatchAction: vi.fn(),
}));

vi.mock('@/app/admin/encuentros/(actions)/fetch-teams-for-match-create.action', () => ({
  fetchTeamsForMatchCreateAction: vi.fn(),
}));

vi.mock('@/app/admin/encuentros/(actions)/fetch-fields.action', () => ({
  fetchFieldsAction: vi.fn(),
}));

vi.mock('@/app/admin/encuentros/(components)/create-match-form', () => ({
  CreateMatchForm: (props: unknown) => {
    formProps.current = props;
    return <div data-testid="create-match-form" />;
  },
}));

import { fetchTournamentsForMatchAction } from '@/app/admin/encuentros/(actions)/fetch-tournaments-for-match.action';
import { fetchCategoriesForMatchAction } from '@/app/admin/encuentros/(actions)/fetch-categories-for-match.action';
import { fetchTeamsForMatchCreateAction } from '@/app/admin/encuentros/(actions)/fetch-teams-for-match-create.action';
import { fetchFieldsAction } from '@/app/admin/encuentros/(actions)/fetch-fields.action';
import { tournamentsMock } from '../mocks/tournaments.mock';
import { categoriesMock } from '../mocks/categories.mock';
import { fieldsMock } from '../mocks/fields.mock';
import { teamsForMatchMock } from '../mocks/teams-for-match.mock';

const teamsResponse = teamsForMatchMock.map((team) => ({
  id: team.id,
  name: team.name,
  fields: team.fields,
}));

type MatchViewProps = {
  tournaments: unknown;
  categories: unknown;
  teams: unknown;
  fields: unknown;
  defaultTournament?: string;
  defaultCategory?: string;
};

describe('Test on <MatchView /> (create)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    formProps.current = undefined;

    vi.mocked(fetchTournamentsForMatchAction).mockResolvedValue({
      ok: true,
      message: 'Los torneos fueron obtenidos correctamente',
      tournaments: tournamentsMock,
    });
    vi.mocked(fetchCategoriesForMatchAction).mockResolvedValue({
      ok: true,
      message: 'Las categorías fueron obtenidas correctamente',
      categories: categoriesMock,
    });
    vi.mocked(fetchTeamsForMatchCreateAction).mockResolvedValue({
      ok: true,
      message: 'Los equipos fueron obtenidos correctamente',
      teams: teamsResponse as never,
    });
    vi.mocked(fetchFieldsAction).mockResolvedValue({
      ok: true,
      message: 'Las canchas fueron obtenidas correctamente',
      fields: fieldsMock,
    });
  });

  const renderComponent = async (searchParams: Record<string, string> = {}) => {
    const ServerComponent = await MatchView({
      searchParams: Promise.resolve(searchParams),
    });
    return render(ServerComponent);
  };

  test('Should render <CreateMatchForm /> with the fetched data', async () => {
    await renderComponent({ tournament: 'liga-mx', category: 'sub-15' });

    expect(screen.getByTestId('create-match-form')).toBeInTheDocument();

    const props = formProps.current as MatchViewProps;
    expect(props.tournaments).toEqual(tournamentsMock);
    expect(props.categories).toEqual(categoriesMock);
    expect(props.fields).toEqual(fieldsMock);
    expect(props.defaultTournament).toBe('liga-mx');
    expect(props.defaultCategory).toBe('sub-15');
  });

  test('Should not fetch categories or teams when there are no params', async () => {
    await renderComponent();

    expect(fetchCategoriesForMatchAction).not.toHaveBeenCalled();
    expect(fetchTeamsForMatchCreateAction).not.toHaveBeenCalled();

    const props = formProps.current as MatchViewProps;
    expect(props.categories).toEqual([]);
    expect(props.teams).toEqual([]);
  });

  test('Should fetch teams when both tournament and category are provided', async () => {
    await renderComponent({ tournament: 'torneo-verano', category: 'primaria-femenil' });

    expect(fetchTeamsForMatchCreateAction).toHaveBeenCalledWith({
      tournamentPermalink: 'torneo-verano',
      categoryPermalink: 'primaria-femenil',
    });
  });

  test('Should redirect when the tournaments fetch fails', async () => {
    vi.mocked(fetchTournamentsForMatchAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener los torneos',
      tournaments: [],
    });

    await expect(renderComponent()).rejects.toThrow('NEXT_REDIRECT');

    expect(mockRedirect).toHaveBeenCalledWith(
      ROUTES.ADMIN_MATCHES +
      '?error=' +
      encodeURIComponent('Error al obtener los torneos'),
    );
  });

  test('Should redirect when the categories fetch fails', async () => {
    vi.mocked(fetchCategoriesForMatchAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener las categorías',
      categories: [],
    });

    await expect(renderComponent({ tournament: 'liga-mx' })).rejects.toThrow('NEXT_REDIRECT');

    expect(mockRedirect).toHaveBeenCalledWith(
      ROUTES.ADMIN_MATCHES +
      '?error=' +
      encodeURIComponent('Error al obtener las categorías'),
    );
  });

  test('Should redirect when the teams fetch fails', async () => {
    vi.mocked(fetchTeamsForMatchCreateAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener los equipos',
      teams: [],
    });

    await expect(
      renderComponent({ tournament: 'liga-mx', category: 'sub-15' }),
    ).rejects.toThrow('NEXT_REDIRECT');

    expect(mockRedirect).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent('Error al obtener los equipos')}`,
    );
  });

  test('Should redirect when the fields fetch fails', async () => {
    vi.mocked(fetchFieldsAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener las canchas',
      fields: [],
    });

    await expect(renderComponent()).rejects.toThrow('NEXT_REDIRECT');

    expect(mockRedirect).toHaveBeenCalledWith(
      ROUTES.ADMIN_MATCHES +
      '?error=' +
      encodeURIComponent('Error al obtener las canchas'),
    );
  });
});
