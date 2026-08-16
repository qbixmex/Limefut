import { render, screen } from '@testing-library/react';
import { playerMock } from '../mocks/player.mock';
import { EditPlayerView } from '@/app/admin/jugadores/editar/[id]/edit-player-view';

const mockFetchPlayer = vi.hoisted(() => vi.fn());

const mockFetchTeams = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/jugadores/(actions)', () => ({
  fetchPlayerAction: mockFetchPlayer,
  fetchTeamsForPlayer: mockFetchTeams,
}));

vi.mock('@/app/admin/jugadores/(components)/edit-player-form', () => ({
  EditPlayerForm: () => <div data-testid="edit-player-form" />,
}));

const mockRedirect = vi.fn();

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}));

describe('Test on <EditPlayerView />', () => {
  beforeEach(async () => {
    vi.clearAllMocks();

    mockFetchPlayer.mockResolvedValue({
      ok: true,
      message: '¡ Jugador obtenido correctamente 👍 !',
      player: {
        ...playerMock,
        team: playerMock.team,
      },
    });

    mockFetchTeams.mockResolvedValue({
      ok: true,
      message: 'Equipos obtenidos',
      teams: [
        { id: '550e8400-e29b-41d4-a716-446655440010', name: 'Eagles' },
        { id: '0bdb1e3c-e4f5-4f16-b6f1-16e28afa490b', name: 'Sharks' },
      ],
    });
  });

  test('Should render correctly', async () => {
    const ServerComponent = await EditPlayerView({
      paramsPromise: Promise.resolve({ id: playerMock.id }),
      searchParamsPromise: Promise.resolve({}),
    });
    render(ServerComponent);

    expect(screen.getByTestId('edit-player-form')).toBeInTheDocument();
  });

  test('Should redirect when fetchPlayerAction fails', async () => {
    mockFetchPlayer.mockResolvedValue({
      ok: false,
      message: '¡ Jugador no encontrado !',
      player: null,
    });

    try {
      await EditPlayerView({
        paramsPromise: Promise.resolve({ id: playerMock.id }),
        searchParamsPromise: Promise.resolve({}),
      });
    } catch {
      // redirect throws in Next.js
    }

    expect(mockRedirect).toHaveBeenCalled();
  });

  test('Should redirect when fetchTeamsForPlayer fails', async () => {
    mockFetchTeams.mockResolvedValue({
      ok: false,
      message: '¡ Error al obtener equipos !',
      teams: [],
    });

    try {
      await EditPlayerView({
        paramsPromise: Promise.resolve({ id: playerMock.id }),
        searchParamsPromise: Promise.resolve({}),
      });
    } catch {
      // redirect throws in Next.js
    }

    expect(mockRedirect).toHaveBeenCalled();
  });
});
