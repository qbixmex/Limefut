import { MatchView } from '@/app/admin/encuentros/detalles/[id]/match-view/index';
import { render, screen } from '@testing-library/react';
import { fetchMatchAction } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { ROUTES } from '@/shared/constants/routes';
import { MATCH_STATUS } from '@/shared/enums';
import { MATCH_ID, matchMock, penaltyShootoutMock } from '../mocks/match.mock';

vi.mock('@/app/admin/encuentros/(actions)/fetch-match.action');

const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
}));

const mockedEditMatch = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/encuentros/(components)/edit-match', () => ({
  EditMatch: (props: unknown) => {
    mockedEditMatch(props);
    return null;
  },
}));

const TIME_ZONE = 'America/Mexico_City';

const FETCH_SUCCESS_MESSAGE = '¡ Encuentro obtenido correctamente 👍 !';
const FETCH_ERROR_MESSAGE = '¡ Encuentro no encontrado ❌ !';

const renderMatchView = async ({ match = matchMock }: { match?: typeof matchMock | null } = {}) => {
  vi.mocked(fetchMatchAction).mockResolvedValue({
    ok: true,
    message: FETCH_SUCCESS_MESSAGE,
    match,
  });

  const ServerComponent = await MatchView({
    params: Promise.resolve({ id: MATCH_ID }),
  });
  render(ServerComponent);
};

describe('Tests on <MatchView />', () => {
  test('Should pass the match id to the fetch action', async () => {
    await renderMatchView();

    expect(fetchMatchAction).toHaveBeenCalledWith(MATCH_ID);
  });

  test('Should redirect to matches list when fetch fails', async () => {
    vi.mocked(fetchMatchAction).mockResolvedValue({
      ok: false,
      message: FETCH_ERROR_MESSAGE,
      match: null,
    });

    await expect(async () => {
      await MatchView({
        params: Promise.resolve({ id: MATCH_ID }),
      });
    }).rejects.toThrow();

    expect(mockRedirect).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_MATCHES}?error=${encodeURIComponent(FETCH_ERROR_MESSAGE)}`,
    );
  });

  test('Should render local team name link with correct href', async () => {
    await renderMatchView();

    const link = screen.getByRole('link', { name: matchMock.localTeam.name });

    expect(link).toHaveAttribute(
      'href',
      ROUTES.ADMIN_TEAMS_SHOW(matchMock.localTeam.id),
    );
    expect(link).toHaveAttribute('target', '_blank');
  });

  test('Should render visitor team name link with correct href', async () => {
    await renderMatchView();

    const link = screen.getByRole('link', { name: matchMock.visitorTeam.name });

    expect(link).toHaveAttribute(
      'href',
      ROUTES.ADMIN_TEAMS_SHOW(matchMock.visitorTeam.id),
    );
    expect(link).toHaveAttribute('target', '_blank');
  });

  test('Should render match score', async () => {
    await renderMatchView();

    const localScore = screen.getByRole('status', { name: /anotaciones del equipo local/i });
    const visitorScore = screen.getByRole('status', { name: /anotaciones del equipo visitante/i });

    expect(localScore).toHaveTextContent(`${matchMock.localScore}`);
    expect(visitorScore).toHaveTextContent(`${matchMock.visitorScore}`);
  });

  test('Should render referee name', async () => {
    await renderMatchView();

    const referee = screen.getByRole('text', { name: /arbitro del encuentro/i });

    expect(referee).toHaveTextContent(matchMock.referee!);
  });

  test('Should render referee fallback when match has no referee', async () => {
    await renderMatchView({ match: { ...matchMock, referee: null } });

    const referee = screen.getByRole('text', { name: /arbitro del encuentro/i });

    expect(referee).toHaveTextContent(/no definido/i);
  });

  test('Should render field name', async () => {
    await renderMatchView();

    const field = screen.getByRole('text', { name: /sede del encuentro/i });

    expect(field).toHaveTextContent(matchMock.field!.name);
  });

  test('Should render field fallback when match has no field', async () => {
    await renderMatchView({ match: { ...matchMock, field: null } });

    const field = screen.getByRole('text', { name: /sede del encuentro/i });

    expect(field).toHaveTextContent(/no definida/i);
  });

  test('Should render formatted match date', async () => {
    await renderMatchView();

    const expectedDate = format(matchMock.matchDate!, "d 'de' MMMM 'del' yyyy", { locale: es });
    const date = screen.getByRole('text', { name: /fecha del encuentro/i });

    expect(date).toHaveTextContent(expectedDate);
  });

  test('Should render formatted match time', async () => {
    await renderMatchView();

    const expectedTime = formatInTimeZone(matchMock.matchDate!, TIME_ZONE, 'h:mm a', { locale: es });
    const time = screen.getByRole('text', { name: /hora del encuentro/i });

    expect(time).toHaveTextContent(expectedTime);
  });

  test('Should render date and time fallbacks when match has no date', async () => {
    await renderMatchView({ match: { ...matchMock, matchDate: null } });

    const date = screen.getByRole('text', { name: /fecha del encuentro/i });
    const time = screen.getByRole('text', { name: /hora del encuentro/i });

    expect(date).toHaveTextContent(/no asignada/i);
    expect(time).toHaveTextContent(/no asignada/i);
  });

  test('Should render match week', async () => {
    await renderMatchView();

    const week = screen.getByRole('text', { name: /jornada del encuentro/i });

    expect(week).toHaveTextContent(`${matchMock.week}`);
  });

  test('Should render completed status badge', async () => {
    await renderMatchView();

    const status = screen.getByRole('status', { name: /estado del encuentro/i });

    expect(status).toHaveTextContent(/finalizado/i);
  });

  test('Should render scheduled status badge', async () => {
    await renderMatchView({ match: { ...matchMock, status: MATCH_STATUS.SCHEDULED } });

    const status = screen.getByRole('status', { name: /estado del encuentro/i });

    expect(status).toHaveTextContent(/programado/i);
  });

  test('Should render tournament link with correct href', async () => {
    await renderMatchView();

    const link = screen.getByRole('link', { name: matchMock.tournament.name });

    expect(link).toHaveAttribute(
      'href',
      ROUTES.ADMIN_TOURNAMENTS_SHOW(matchMock.tournament.id),
    );
    expect(link).toHaveAttribute('target', '_blank');
  });

  test('Should render formatted creation date', async () => {
    await renderMatchView();

    const expectedDate = format(matchMock.createdAt, "d 'de' MMMM 'del' yyyy", { locale: es });
    const createdAt = screen.getByRole('text', { name: /fecha de creación del encuentro/i });

    expect(createdAt).toHaveTextContent(expectedDate);
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
    expect(screen.getByText(penaltyShootoutMock.kicks[0].shooterName!)).toBeInTheDocument();
    expect(screen.getByText(penaltyShootoutMock.kicks[1].shooterName!)).toBeInTheDocument();
  });

  test('Should not render penalty shootout section when match has a winner', async () => {
    await renderMatchView();

    expect(
      screen.queryByRole('heading', { name: /tanda de penales/i }),
    ).not.toBeInTheDocument();
  });

  test('Should not render penalty shootout section when match is not completed', async () => {
    const match = {
      ...matchMock,
      status: MATCH_STATUS.SCHEDULED,
      localScore: 1,
      visitorScore: 1,
    };
    await renderMatchView({ match });

    expect(
      screen.queryByRole('heading', { name: /tanda de penales/i }),
    ).not.toBeInTheDocument();
  });

  test('Should pass match id to <EditMatch /> component', async () => {
    await renderMatchView();

    expect(mockedEditMatch).toHaveBeenCalledWith({ matchId: MATCH_ID });
  });
});
