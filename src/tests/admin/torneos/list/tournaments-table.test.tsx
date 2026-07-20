import { render, screen } from '@testing-library/react';
import { TournamentsTable } from '@/app/admin/torneos/(components)/tournaments-table';
import { fetchTournamentsAction } from '@/app/admin/torneos/(actions)/fetch-tournaments.action';
import { tournamentsMock } from '../mocks/tournaments.mock';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

vi.mock('@/app/admin/torneos/(actions)/fetch-tournaments.action');
vi.mock('@/app/admin/torneos/(actions)/update-tournament-state.action');

vi.mock('@/app/admin/torneos/(components)/delete-tournament', () => ({
  DeleteTournament: () => <span data-testid="delete-tournament" />,
}));

vi.mock('@/app/admin/torneos/(components)/show-tournament-details', () => ({
  ShowTournamentDetails: () => <span data-testid="show-details" />,
}));

vi.mock('@/app/admin/torneos/(components)/edit-tournament', () => ({
  EditTournament: () => <span data-testid="edit-tournament" />,
}));

vi.mock('@/shared/components/active-switch', () => ({
  ActiveSwitch: () => <span data-testid="active-switch" />,
}));

vi.mock('@/shared/components/pagination', () => ({
  Pagination: () => <span data-testid="pagination" />,
}));

describe('Test on <TournamentsTable /> component', () => {
  const defaultResponse = {
    ok: true,
    message: 'Los torneos fueron obtenidos satisfactoriamente',
    tournaments: tournamentsMock,
    pagination: {
      currentPage: 1,
      totalPages: 1,
    },
  };

  const renderComponent = async () => {
    const ServerComponent = await TournamentsTable({ query: '', currentPage: '' });
    return render(ServerComponent);
  };

  beforeEach(() => {
    vi.mocked(fetchTournamentsAction).mockResolvedValue(defaultResponse);
  });

  test('Should render correctly', async () => {
    await renderComponent();

    expect(screen.getByRole('table', { name: /tabla/i })).toBeInTheDocument();
  });

  test('Should render empty state when no tournaments', async () => {
    vi.mocked(fetchTournamentsAction).mockResolvedValue({
      ...defaultResponse,
      tournaments: [],
    });

    await renderComponent();

    expect(screen.getByText('Aún no hay torneos creados')).toBeInTheDocument();
  });

  test('Should render tournament name', async () => {
    await renderComponent();

    const tableCells = screen.getAllByRole('cell', { name: /nombre/i });

    tableCells.forEach((cell, index) => {
      expect(cell).toHaveTextContent(tournamentsMock[index].name);
    });
  });

  test('Should render tournament season', async () => {
    await renderComponent();

    tournamentsMock.forEach((tournament) => {
      expect(screen.getByText(tournament.season as string)).toBeInTheDocument();
    });
  });

  test('Should render categories badge', async () => {
    await renderComponent();

    const badges = screen.getAllByRole('status', { name: /categorías/i });

    badges.forEach((badge, index) => {
      expect(badge).toHaveTextContent(
        tournamentsMock[index].categoriesQuantity.toString(),
      );
    });
  });

  test('Should render formatted start and end dates', async () => {
    await renderComponent();

    tournamentsMock.forEach((tournament) => {
      const startDate = format(tournament.startDate, "EEE d MMM',' y", { locale: es });
      const endDate = format(tournament.endDate, "EEE d MMM',' y", { locale: es });

      expect(screen.getByText(startDate)).toBeInTheDocument();
      expect(screen.getByText(endDate)).toBeInTheDocument();
    });
  });

  test('Should render action buttons', async () => {
    await renderComponent();

    expect(screen.getAllByTestId('active-switch')).toHaveLength(tournamentsMock.length);
    expect(screen.getAllByTestId('show-details')).toHaveLength(tournamentsMock.length);
    expect(screen.getAllByTestId('edit-tournament')).toHaveLength(tournamentsMock.length);
    expect(screen.getAllByTestId('delete-tournament')).toHaveLength(tournamentsMock.length);
  });

  test('Should render pagination when totalPages is greater than 1', async () => {
    await renderComponent();

    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  test('Should render link to tournament details', async () => {
    await renderComponent();

    tournamentsMock.forEach(({ id }) => {
      expect(screen.getByTestId(id)).toHaveAttribute('href', `/admin/torneos/${id}`);
    });
  });

  test('Should render error message when fetch fails', async () => {
    vi.mocked(fetchTournamentsAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener los torneos',
      tournaments: [],
      pagination: null,
    });

    await renderComponent();

    expect(screen.getByText('Error al obtener los torneos')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
