import { render, screen } from '@testing-library/react';
import { playerMock } from '../mocks/player.mock';
import { EditPlayerView } from '@/app/admin/jugadores/editar/[id]/edit-player-view';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

const sessionData = vi.hoisted(() => ({
  user: {
    id: 'fd3a97d5-9a5f-43e8-9826-62eaba6e814d',
    name: 'Admin User',
    username: 'admin',
    email: 'admin@test.com',
    emailVerified: true,
    roles: ['admin'],
    image: 'admin.webp',
  },
  session: {
    token: 'a41d9b460c1379bd205b1',
    createdAt: new Date('2025-01-02T00:00:00.000Z'),
    expiresAt: new Date('2025-01-02T01:00:00.000Z'),
    userAgent: null,
  },
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue(sessionData),
    },
  },
}));

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
    const { auth } = await import('@/lib/auth');
    sessionData.user.roles = ['admin'];
    vi.mocked(auth.api.getSession).mockResolvedValue(sessionData);

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

  test('Should redirect when user is not admin', async () => {
    sessionData.user.roles = ['user'];

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
