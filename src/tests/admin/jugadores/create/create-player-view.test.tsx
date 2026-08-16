import { render, screen } from '@testing-library/react';
import { CreatePlayerView } from '@/app/admin/jugadores/crear/create-player-view';

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
