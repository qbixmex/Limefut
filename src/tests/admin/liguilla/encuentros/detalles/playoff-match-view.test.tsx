import { render, screen } from '@testing-library/react';

const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error('NEXT_REDIRECT');
  },
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/fetch-playoff-match.action', () => ({
  fetchPlayoffMatchAction: vi.fn(),
}));

import { fetchPlayoffMatchAction } from '@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/fetch-playoff-match.action';
import { PlayoffMatchView } from '@/app/admin/liguilla/[playoff_id]/encuentros/detalles/[match_id]/playoff-match-view';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';
import { ROUTES } from '@/shared/constants/routes';
import { MATCH_STATUS } from '@/shared/enums';
import { MATCH_ID, PLAYOFF_ID, playoffMatchMock } from '../mocks/playoff-match.mock';

const TIME_ZONE = 'America/Mexico_City';

const defaultResponse = {
  ok: true,
  message: 'Las canchas fueron obtenidas correctamente',
  match: playoffMatchMock,
};

describe('Tests on <PlayoffMatchView />', () => {
  const renderComponent = async (match = playoffMatchMock) => {
    vi.mocked(fetchPlayoffMatchAction).mockResolvedValue({
      ...defaultResponse,
      match,
    } as never);
    const ServerComponent = await PlayoffMatchView({
      params: Promise.resolve({ playoff_id: PLAYOFF_ID, match_id: MATCH_ID }),
    });
    return render(ServerComponent);
  };

  test('Should call fetchPlayoffMatchAction with the ids', async () => {
    await renderComponent();

    expect(vi.mocked(fetchPlayoffMatchAction)).toHaveBeenCalledWith({
      playoffId: PLAYOFF_ID,
      matchId: MATCH_ID,
    });
  });

  test('Should render the local and visitor team links', async () => {
    await renderComponent();

    const local = screen.getByRole('link', { name: playoffMatchMock.local.name });
    const visitor = screen.getByRole('link', { name: playoffMatchMock.visitor.name });

    expect(local).toHaveAttribute('href', ROUTES.ADMIN_TEAMS_SHOW(playoffMatchMock.local.id));
    expect(visitor).toHaveAttribute('href', ROUTES.ADMIN_TEAMS_SHOW(playoffMatchMock.visitor.id));
  });

  test('Should render the score', async () => {
    await renderComponent();

    expect(screen.getByRole('status', { name: 'Anotaciones del equipo local' }))
      .toHaveTextContent(String(playoffMatchMock.localScore));
    expect(screen.getByRole('status', { name: 'Anotaciones del equipo visitante' }))
      .toHaveTextContent(String(playoffMatchMock.visitorScore));
  });

  test('Should render the referee', async () => {
    await renderComponent();

    expect(screen.getByRole('text', { name: 'Arbitro del encuentro' }))
      .toHaveTextContent(playoffMatchMock.referee!);
  });

  test('Should render the referee fallback when there is no referee', async () => {
    await renderComponent({ ...playoffMatchMock, referee: null });

    expect(screen.getByRole('text', { name: 'Arbitro del encuentro' }))
      .toHaveTextContent(/no definido/i);
  });

  test('Should render the field', async () => {
    await renderComponent();

    expect(screen.getByRole('text', { name: 'Sede del encuentro' }))
      .toHaveTextContent(playoffMatchMock.field!.name);
  });

  test('Should render the field fallback when there is no field', async () => {
    await renderComponent({ ...playoffMatchMock, field: null });

    expect(screen.getByRole('text', { name: 'Sede del encuentro' }))
      .toHaveTextContent(/no definida/i);
  });

  test('Should render the formatted date and time', async () => {
    await renderComponent();

    const expectedDate = format(playoffMatchMock.matchDate!, "d 'de' MMMM 'del' yyyy", { locale: es });
    const expectedTime = formatInTimeZone(playoffMatchMock.matchDate!, TIME_ZONE, 'h:mm a', { locale: es });

    expect(screen.getByRole('text', { name: 'Fecha del encuentro' })).toHaveTextContent(expectedDate);
    expect(screen.getByRole('text', { name: 'Hora del encuentro' })).toHaveTextContent(expectedTime);
  });

  test('Should render the date and time fallbacks when there is no date', async () => {
    await renderComponent({ ...playoffMatchMock, matchDate: null });

    expect(screen.getByRole('text', { name: 'Fecha del encuentro' })).toHaveTextContent(/no proporcionada/i);
    expect(screen.getByRole('text', { name: 'Hora del encuentro' })).toHaveTextContent(/no proporcionada/i);
  });

  test('Should render the status badge', async () => {
    await renderComponent();

    expect(screen.getByRole('status', { name: 'Estado del encuentro' }))
      .toHaveTextContent(/finalizado/i);
  });

  test('Should render the scheduled status badge', async () => {
    await renderComponent({ ...playoffMatchMock, status: MATCH_STATUS.SCHEDULED });

    expect(screen.getByRole('status', { name: 'Estado del encuentro' }))
      .toHaveTextContent(/programado/i);
  });

  test('Should render the remarks', async () => {
    await renderComponent();

    expect(screen.getByText(playoffMatchMock.remarks!)).toBeInTheDocument();
  });

  test('Should render the remarks fallback when there are no remarks', async () => {
    await renderComponent({ ...playoffMatchMock, remarks: null });

    expect(screen.getByText(/sin comentarios/i)).toBeInTheDocument();
  });

  test('Should render the creation and update dates', async () => {
    await renderComponent();

    const expectedDate = format(playoffMatchMock.createdAt, "d 'de' MMMM 'del' yyyy", { locale: es });

    expect(screen.getAllByText(expectedDate)).toHaveLength(2);
  });

  test('Should redirect to the playoff matches list when fetch fails', async () => {
    vi.mocked(fetchPlayoffMatchAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener el encuentro',
      match: null,
    });

    await expect(async () => {
      await PlayoffMatchView({
        params: Promise.resolve({ playoff_id: PLAYOFF_ID, match_id: MATCH_ID }),
      });
    }).rejects.toThrow('NEXT_REDIRECT');

    expect(mockRedirect).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_PLAYOFFS_MATCHES(PLAYOFF_ID)}?error=${encodeURIComponent(
        'Error al obtener el encuentro',
      )}`,
    );
  });
});
