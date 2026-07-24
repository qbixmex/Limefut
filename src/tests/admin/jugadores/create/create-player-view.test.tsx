import { render, screen } from '@testing-library/react';
import { CreatePlayerView } from '@/app/admin/jugadores/crear/create-player-view';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

const sessionData = vi.hoisted(() => ({
  user: {
    id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Test User',
    username: 'test-user',
    email: 'test_user@gmail.com',
    emailVerified: true,
    roles: ['user', 'admin'],
    image: 'user.webp',
  },
  session: {
    token: '86a9fd98ab4f4908b202f54a52d678ef',
    createdAt: new Date('2025-08-15T20:44:15.135Z'),
    expiresAt: new Date('2025-08-15T22:44:15.135Z'),
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

const mockFetchTeams = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/jugadores/(actions)', () => ({
  fetchTeamsForPlayer: mockFetchTeams,
}));

vi.mock('@/app/admin/jugadores/(components)/create-player-form', () => ({
  CreatePlayerForm: () => <div data-testid="create-player-form" />,
}));

const mockRedirect = vi.fn();

vi.mock('next/navigation', () => ({
  redirect: (...args: unknown[]) => mockRedirect(...args),
}));

describe('Test on <CreatePlayerView />', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { auth } = await import('@/lib/auth');
    sessionData.user.roles = ['user', 'admin'];
    vi.mocked(auth.api.getSession).mockResolvedValue(sessionData);
    mockFetchTeams.mockResolvedValue({
      ok: true,
      message: 'Equipos obtenidos',
      teams: [
        { id: 'team-1', name: 'Eagles' },
        { id: 'team-2', name: 'Sharks' },
      ],
    });
  });

  test('Should render correctly', async () => {
    const ServerComponent = await CreatePlayerView({
      searchParamsPromise: Promise.resolve({ tournament: 'test-tournament' }),
    });
    render(ServerComponent);

    expect(screen.getByTestId('create-player-form')).toBeInTheDocument();
  });

  test('Should redirect when session does not exist', async () => {
    const errorMessage = '¡ No tienes permisos administrativos para crear jugadores !';
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValue(null);

    try {
      await CreatePlayerView({
        searchParamsPromise: Promise.resolve({ tournament: 'test-tournament' }),
      });
    } catch {
      // redirect throws in Next.js
    }

    expect(mockRedirect).toHaveBeenCalledWith(
      `/admin/jugadores?error=${encodeURIComponent(errorMessage)}`,
    );
  });

  test('Should redirect when user is not admin', async () => {
    const errorMessage = '¡ No tienes permisos administrativos para crear jugadores !';
    const { auth } = await import('@/lib/auth');
    vi.mocked(auth.api.getSession).mockResolvedValue({
      user: { id: 'test', name: 'Test User', roles: ['user'] },
      session: null,
    } as never);

    try {
      await CreatePlayerView({
        searchParamsPromise: Promise.resolve({ tournament: 'test-tournament' }),
      });
    } catch {
      // redirect throws in Next.js
    }

    expect(mockRedirect).toHaveBeenCalledWith(
      `/admin/jugadores?error=${encodeURIComponent(errorMessage)}`,
    );
  });

  test('Should redirect when fetchTeamsForPlayer fails', async () => {
    const errorMessage = '¡ Error al obtener equipos !';
    mockFetchTeams.mockResolvedValue({
      ok: false,
      message: errorMessage,
      teams: [],
    });

    try {
      await CreatePlayerView({
        searchParamsPromise: Promise.resolve({ tournament: 'test-tournament' }),
      });
    } catch {
      // redirect throws in Next.js
    }

    expect(mockRedirect).toHaveBeenCalledWith(
      `/admin/jugadores?error=${encodeURIComponent(errorMessage)}`,
    );
  });
});
