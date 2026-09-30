const { mockFetchStandings } = vi.hoisted(() => ({
  mockFetchStandings: vi.fn(),
}));

vi.mock('@/app/admin/estadisticas/(actions)/fetch-standings.action', () => ({
  fetchStandingsAction: mockFetchStandings,
}));

vi.mock('@/shared/components/tournament-data', () => ({
  TournamentData: () => <div data-testid="tournament-data" />,
}));

vi.mock('@/app/admin/estadisticas/(components)/create-standings', () => ({
  CreateStandings: () => <div data-testid="create-standings" />,
}));

vi.mock('@/app/admin/estadisticas/(components)/update-standings', () => ({
  UpdateStandings: () => <div data-testid="update-standings" />,
}));

vi.mock('@/app/admin/estadisticas/(components)/delete-standings', () => ({
  DeleteStandings: () => <div data-testid="delete-standings" />,
}));

vi.mock('@/app/admin/estadisticas/(components)/standings-table', () => ({
  StandingsTable: () => <div data-testid="standings-table" />,
}));

import { StandingsContent } from '@/app/admin/estadisticas/(components)/standings-content';
import { render, screen } from '@testing-library/react';
import {
  CATEGORY_ID,
  TOURNAMENT_ID,
  standingsMock,
  teamsMock,
  tournamentMock,
} from '../mocks/standings.mock';

const responseWith = ({
  teams = teamsMock,
  standings = standingsMock,
} = {}) => ({
  ok: true,
  message: 'Las estadísticas fueron obtenidas correctamente',
  teams,
  tournament: tournamentMock,
  standings,
});

describe('Tests on <StandingsContent />', () => {
  beforeEach(() => {
    mockFetchStandings.mockResolvedValue(responseWith());
  });

  test('Should render nothing when there is no tournament and no category', async () => {
    const result = await StandingsContent({ tournamentId: '', categoryId: '' });

    expect(result).toBeNull();
    expect(mockFetchStandings).not.toHaveBeenCalled();
  });

  test('Should render the tournament data', async () => {
    const ServerComponent = await StandingsContent({
      tournamentId: TOURNAMENT_ID,
      categoryId: CATEGORY_ID,
    });
    render(ServerComponent);

    const tournamentData = screen.getByTestId('tournament-data');

    expect(tournamentData).toBeInTheDocument();
  });

  test('Should render the standings table and its actions when standings exist', async () => {
    const ServerComponent = await StandingsContent({
      tournamentId: TOURNAMENT_ID,
      categoryId: CATEGORY_ID,
    });
    render(ServerComponent);

    const table = screen.getByTestId('standings-table');
    const updateButton = screen.getByTestId('update-standings');
    const deleteButton = screen.getByTestId('delete-standings');
    const createButton = screen.queryByTestId('create-standings');

    expect(table).toBeInTheDocument();
    expect(updateButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
    expect(createButton).not.toBeInTheDocument();
  });

  test('Should offer to create standings when the tournament has teams but no standings', async () => {
    mockFetchStandings.mockResolvedValue(responseWith({ standings: [] }));

    const ServerComponent = await StandingsContent({
      tournamentId: TOURNAMENT_ID,
      categoryId: CATEGORY_ID,
    });
    render(ServerComponent);

    const createButton = screen.getByTestId('create-standings');
    const table = screen.queryByTestId('standings-table');

    expect(createButton).toBeInTheDocument();
    expect(table).not.toBeInTheDocument();
  });

  test('Should not offer to create standings when the tournament has no teams', async () => {
    mockFetchStandings.mockResolvedValue(responseWith({ teams: [], standings: [] }));

    const ServerComponent = await StandingsContent({
      tournamentId: TOURNAMENT_ID,
      categoryId: CATEGORY_ID,
    });
    render(ServerComponent);

    const createButton = screen.queryByTestId('create-standings');

    expect(createButton).not.toBeInTheDocument();
  });
});
