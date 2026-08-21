import { MatchView } from '@/app/(public)/liguilla/encuentro/match-view';
import { render, screen } from '@testing-library/react';
import { formatInTimeZone } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import { fetchPublicPlayoffMatchAction } from '@/app/(public)/liguilla/(actions)/fetch-public-playoff-match';
import { MATCH_GROUP } from '@/shared/enums/match-group.enum';
import { MATCH_STATUS } from '@/shared/enums';
import {
  matchMock,
  penaltyShootoutMock,
  type SearchParams,
} from './data/match.mock';

vi.mock('@/app/(public)/liguilla/(actions)/fetch-public-playoff-match');

const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
}));

const TIME_ZONE = 'America/Mexico_City';

type SearchParamsOverrides = Partial<SearchParams>;

const searchParamsWith = (
  overrides: SearchParamsOverrides = {},
): Promise<SearchParams> => {
  return Promise.resolve<SearchParams>({
    tournament: 'torneo-apertura',
    category: 'sub-15',
    local_team: 'club-country',
    visitor_team: 'deportivo-lime',
    ...overrides,
  });
};

const renderMatchView = async ({
  searchParams = {},
  match = matchMock,
}: {
  searchParams?: SearchParamsOverrides;
  match?: typeof matchMock;
} = {}) => {
  vi.mocked(fetchPublicPlayoffMatchAction).mockResolvedValue({
    ok: true,
    message: '! Encuentro obtenido correctamente 👍 !',
    match,
  });

  const ServerComponent = await MatchView({
    searchParams: searchParamsWith(searchParams),
  });
  render(ServerComponent);
};

describe('Tests on MatchView', () => {
  test('Should pass search params to fetch action', async () => {
    await renderMatchView();

    expect(fetchPublicPlayoffMatchAction).toHaveBeenCalledWith({
      tournamentPermalink: 'torneo-apertura',
      categoryPermalink: 'sub-15',
      localTeamPermalink: 'club-country',
      visitorTeamPermalink: 'deportivo-lime',
    });
  });

  test('Should render main regions correctly', async () => {
    await renderMatchView();

    expect(screen.getByRole('region', { name: /información del encuentro/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /cancha del encuentro/i })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /detalles del encuentro/i })).toBeInTheDocument();
    expect(
      screen.getByRole('region', { name: /fecha, hora y sede del encuentro/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('region', { name: /comentarios adicionales/i })).toBeInTheDocument();
  });

  test('Should render teams groups', async () => {
    await renderMatchView();

    expect(screen.getByRole('group', { name: /equipo local/i })).toBeInTheDocument();
    expect(screen.getByRole('group', { name: /equipo visitante/i })).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: /equipos y marcador del encuentro/i }),
    ).toBeInTheDocument();
  });

  test('Should render local team shield image', async () => {
    await renderMatchView();

    const image = screen.getByAltText(`${matchMock.local.name} equipo`);
    expect(image).toBeInTheDocument();
    expect(image.getAttribute('src')).toContain(
      encodeURIComponent(matchMock.local.imageUrl!),
    );
  });

  test('Should render visitor team shield image', async () => {
    await renderMatchView();

    const image = screen.getByAltText(`${matchMock.visitor.name} equipo`);
    expect(image).toBeInTheDocument();
    expect(image.getAttribute('src')).toContain(
      encodeURIComponent(matchMock.visitor.imageUrl!),
    );
  });

  test('Should not render shield image when team has no imageUrl', async () => {
    const match = {
      ...matchMock,
      local: { ...matchMock.local, imageUrl: null },
    };
    await renderMatchView({ match });

    expect(
      screen.queryByAltText(`${matchMock.local.name} equipo`),
    ).not.toBeInTheDocument();
    expect(
      screen.getByAltText(`${matchMock.visitor.name} equipo`),
    ).toBeInTheDocument();
  });

  test('Should render local team name link with correct href', async () => {
    await renderMatchView();

    const link = screen.getByRole('link', { name: matchMock.local.name });
    expect(link).toHaveAttribute(
      'href',
      `/equipos/${matchMock.local.permalink}?tournament=torneo-apertura&category=club-country`,
    );
  });

  test('Should render visitor team name link with correct href', async () => {
    await renderMatchView();

    const link = screen.getByRole('link', { name: matchMock.visitor.name });
    expect(link).toHaveAttribute(
      'href',
      `/equipos/${matchMock.visitor.permalink}?tournament=torneo-apertura&category=sub-15`,
    );
  });

  test('Should render match score', async () => {
    await renderMatchView();

    const score = screen.getByRole('status', { name: /marcador del encuentro/i });
    expect(score).toHaveTextContent(
      `${matchMock.localScore}${matchMock.visitorScore}`,
    );
  });

  test('Should render tournament link with correct href', async () => {
    await renderMatchView();

    const link = screen.getByRole('link', { name: matchMock.tournament.name });
    expect(link).toHaveAttribute(
      'href',
      `/torneos/${matchMock.tournament.permalink}?category=sub-15`,
    );
  });

  test('Should render category badge', async () => {
    await renderMatchView();

    expect(screen.getByText(matchMock.category!.name)).toBeInTheDocument();
  });

  test('Should render category fallback when match has no category', async () => {
    const match = { ...matchMock, category: null };
    await renderMatchView({ match });

    expect(screen.getByText('no disponible')).toBeInTheDocument();
  });

  test('Should render translated round badge', async () => {
    await renderMatchView();

    expect(screen.getByText('Semifinal')).toBeInTheDocument();
  });

  test('Should render winner team when match is completed with a winner', async () => {
    await renderMatchView();

    const winnerBadge = screen.getByRole('status', { name: /equipo ganador/i });
    expect(winnerBadge).toHaveTextContent(matchMock.winner!.name);
  });

  test('Should render draw badge when match is completed with equal scores', async () => {
    const match = {
      ...matchMock,
      localScore: 1,
      visitorScore: 1,
      penaltyShootout: penaltyShootoutMock,
    };
    await renderMatchView({ match });

    const drawBadge = screen.getByRole('status', { name: /resultado del encuentro/i });
    expect(drawBadge).toHaveTextContent(/empate/i);
  });

  test('Should render pending badge when match is not completed', async () => {
    const match = { ...matchMock, status: MATCH_STATUS.SCHEDULED };
    await renderMatchView({ match });

    const pendingBadge = screen.getByRole('status', { name: /ganador pendiente/i });
    expect(pendingBadge).toHaveTextContent(/pendiente/i);
  });

  test('Should render gold group badge', async () => {
    await renderMatchView();

    expect(screen.getByText('oro')).toBeInTheDocument();
  });

  test('Should render silver group badge', async () => {
    const match = { ...matchMock, group: MATCH_GROUP.SILVERED };
    await renderMatchView({ match });

    expect(screen.getByText('plata')).toBeInTheDocument();
  });

  test('Should render general group badge by default', async () => {
    const match = { ...matchMock, group: 'regular' };
    await renderMatchView({ match });

    expect(screen.getByText('general')).toBeInTheDocument();
  });

  test('Should render formatted match date and time', async () => {
    await renderMatchView();

    const date = matchMock.matchDate!;
    const expectedDay = formatInTimeZone(date, TIME_ZONE, 'dd', { locale: es });
    const expectedMonth = formatInTimeZone(date, TIME_ZONE, 'LLLL', { locale: es });
    const expectedYear = formatInTimeZone(date, TIME_ZONE, 'y', { locale: es });
    const expectedTime = formatInTimeZone(date, TIME_ZONE, 'h:mm aaa', { locale: es });

    expect(screen.getByText(expectedDay)).toBeInTheDocument();
    expect(screen.getByText(expectedMonth)).toBeInTheDocument();
    expect(screen.getByText(expectedYear)).toBeInTheDocument();
    expect(screen.getByText(expectedTime)).toBeInTheDocument();
  });

  test('Should render date and time fallbacks when match has no date', async () => {
    const match = { ...matchMock, matchDate: null };
    await renderMatchView({ match });

    expect(screen.getAllByText('no disponible')).toHaveLength(2);
  });

  test('Should render match status', async () => {
    await renderMatchView();

    const status = screen.getByRole('status', { name: /estado del encuentro/i });
    expect(status).toHaveTextContent(/finalizado/i);
  });

  test('Should render field badge', async () => {
    await renderMatchView();

    expect(screen.getByText(matchMock.field!.name)).toBeInTheDocument();
  });

  test('Should render field fallback when match has no field', async () => {
    const match = { ...matchMock, field: null };
    await renderMatchView({ match });

    expect(screen.getByText('no disponible')).toBeInTheDocument();
  });

  test('Should render referee name', async () => {
    await renderMatchView();

    expect(screen.getByText(matchMock.referee!)).toBeInTheDocument();
  });

  test('Should render referee fallback when match has no referee', async () => {
    const match = { ...matchMock, referee: null };
    await renderMatchView({ match });

    expect(screen.getByText('No especificado')).toBeInTheDocument();
  });

  test('Should render additional remarks', async () => {
    await renderMatchView();

    expect(screen.getByRole('heading', { name: /comentarios adicionales/i })).toBeInTheDocument();
    expect(screen.getByText(matchMock.remarks!)).toBeInTheDocument();
  });

  test('Should render remarks fallback when match has no remarks', async () => {
    const match = { ...matchMock, remarks: null };
    await renderMatchView({ match });

    expect(screen.getByText(/sin comentarios/i)).toBeInTheDocument();
  });

  test('Should render penalty shootout section when completed match ends in draw', async () => {
    const match = {
      ...matchMock,
      localScore: 1,
      visitorScore: 1,
      penaltyShootout: penaltyShootoutMock,
    };
    await renderMatchView({ match });

    expect(screen.getByRole('heading', { name: /tanda de penales/i })).toBeInTheDocument();
    expect(screen.getByText(/completado/i)).toBeInTheDocument();
    expect(screen.getByText(penaltyShootoutMock.kicks[0].shooterName!)).toBeInTheDocument();
    expect(screen.getByText(penaltyShootoutMock.kicks[1].shooterName!)).toBeInTheDocument();
  });

  test('Should not render penalty shootout section when match has a winner', async () => {
    await renderMatchView();

    expect(
      screen.queryByRole('heading', { name: /tanda de penales/i }),
    ).not.toBeInTheDocument();
  });

  test('Should redirect to liguilla when fetch fails', async () => {
    vi.mocked(fetchPublicPlayoffMatchAction).mockResolvedValue({
      ok: false,
      message: '! No se encontró el encuentro ¡',
      match: null,
    });

    await expect(async () => {
      await MatchView({ searchParams: searchParamsWith() });
    }).rejects.toThrow();

    expect(mockRedirect).toHaveBeenCalledWith(
      `/liguilla?error=${encodeURIComponent('! No se encontró el encuentro ¡')}`,
    );
  });
});
