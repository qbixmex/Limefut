import { render, screen } from '@testing-library/react';
import { PlayersTable } from '@/app/admin/jugadores/(components)/players-table';
import { playersMock } from '../mocks/players.mock';
import { fetchPlayersAction } from '@/app/admin/jugadores/(actions)';

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn().mockResolvedValue({ user: { roles: [] } }),
    },
  },
}));

vi.mock('@/app/admin/jugadores/(actions)', () => ({
  fetchPlayersAction: vi.fn(),
  updatePlayerStateAction: vi.fn(),
}));

vi.mock('@/app/admin/jugadores/(components)/delete-player', () => ({
  DeletePlayer: () => <span data-testid="delete-player" />,
}));

vi.mock('@/app/admin/jugadores/(components)/edit-player', () => ({
  EditPlayer: () => <span data-testid="edit-player" />,
}));

vi.mock('@/app/admin/jugadores/(components)/player-details', () => ({
  PlayerDetails: () => <span data-testid="player-details" />,
}));

vi.mock('@/shared/components/active-switch', () => ({
  ActiveSwitch: () => <span data-testid="active-switch" />,
}));

vi.mock('@/shared/components/pagination', () => ({
  Pagination: () => <span data-testid="pagination" />,
}));

vi.mock('@/shared/components/delete-players', () => ({
  DeletePlayers: () => <span data-testid="delete-players" />,
}));

describe('Tests on <PlayersTable /> component', () => {
  const defaultResponse = {
    ok: true,
    message: '! Los jugadores fueron obtenidos correctamente 👍',
    players: playersMock,
    pagination: {
      currentPage: 1,
      totalPages: 1,
    },
  };

  const renderComponent = async () => {
    const ServerComponent = await PlayersTable({
      teamId: 'team-1',
      query: '',
      currentPage: 1,
    });
    return render(ServerComponent);
  };

  beforeEach(() => {
    vi.mocked(fetchPlayersAction).mockResolvedValue(defaultResponse);
  });

  test('Should render correctly', async () => {
    await renderComponent();

    const table = screen.getByRole('table', { name: /jugadores/i });
    expect(table).toBeInTheDocument();
  });

  test('Should render empty state when no players', async () => {
    vi.mocked(fetchPlayersAction).mockResolvedValue({
      ...defaultResponse,
      players: [],
    });

    await renderComponent();

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(/no hay jugadores/i);

    const table = screen.queryByRole('table', { name: /jugadores/i });
    expect(table).not.toBeInTheDocument();
  });

  test('Should render player name', async () => {
    await renderComponent();

    playersMock.forEach((player) => {
      expect(screen.getByText(player.name)).toBeInTheDocument();
    });
  });

  test('Should render player email or fallback', async () => {
    await renderComponent();

    expect(screen.getByText('juan@email.com')).toBeInTheDocument();
    expect(screen.getByText('No proporcionado')).toBeInTheDocument();
  });

  test('Should render team badge or fallback', async () => {
    await renderComponent();

    expect(screen.getByText('Eagles')).toBeInTheDocument();
    expect(screen.getByText('Sin equipo asignado')).toBeInTheDocument();
  });

  test('Should render action buttons', async () => {
    await renderComponent();

    expect(screen.getAllByTestId('player-details')).toHaveLength(playersMock.length);
    expect(screen.getAllByTestId('edit-player')).toHaveLength(playersMock.length);
    expect(screen.getAllByTestId('delete-player')).toHaveLength(playersMock.length);
    expect(screen.getAllByTestId('active-switch')).toHaveLength(playersMock.length);
    expect(screen.getByTestId('delete-players')).toBeInTheDocument();
  });

  test('Should render pagination when totalPages is greater than 1', async () => {
    vi.mocked(fetchPlayersAction).mockResolvedValue({
      ...defaultResponse,
      pagination: { currentPage: 1, totalPages: 3 },
    });

    await renderComponent();

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  test('Should render empty state when fetch fails', async () => {
    vi.mocked(fetchPlayersAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener los jugadores',
      players: null,
      pagination: null,
    });

    await renderComponent();

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(/no hay jugadores/i);

    const table = screen.queryByRole('table', { name: /jugadores/i });
    expect(table).not.toBeInTheDocument();
  });
});
