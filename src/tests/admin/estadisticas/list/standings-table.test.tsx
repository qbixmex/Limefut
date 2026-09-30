import { render, screen, within } from '@testing-library/react';
import { StandingsTable } from '@/app/admin/estadisticas/(components)/standings-table';
import {
  LOCAL_TEAM_ID,
  VISITOR_TEAM_ID,
  standingsMock,
} from '../mocks/standings.mock';
import { ROUTES } from '@/shared/constants/routes';

describe('Tests on <StandingsTable />', () => {
  test('Should render the table with every header', () => {
    render(<StandingsTable standings={standingsMock} />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    const headers = ['Posición', 'Equipo', 'JJ', 'JG', 'JE', 'JP', 'GF', 'GC', 'DIF', 'PTS', 'PTA', 'PTT'];

    for (const header of headers) {
      const headerCell = within(table).getByRole('columnheader', { name: header });
      expect(headerCell).toBeInTheDocument();
    }
  });

  test('Should render one row per standing plus the header row', () => {
    render(<StandingsTable standings={standingsMock} />);

    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');

    expect(rows).toHaveLength(standingsMock.length + 1);
  });

  test('Should render the position and every counter of the first team', () => {
    render(<StandingsTable standings={standingsMock} />);

    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');
    const cells = within(rows[1]).getAllByRole('cell');

    expect(cells[0]).toHaveTextContent('1');
    expect(cells[1]).toHaveTextContent('Cruz Azul');
    expect(cells[2]).toHaveTextContent('2');
    expect(cells[3]).toHaveTextContent('1');
    expect(cells[4]).toHaveTextContent('1');
    expect(cells[5]).toHaveTextContent('0');
    expect(cells[6]).toHaveTextContent('4');
    expect(cells[7]).toHaveTextContent('2');
    expect(cells[8]).toHaveTextContent('2');
    expect(cells[9]).toHaveTextContent('4');
    expect(cells[10]).toHaveTextContent('1');
  });

  test('Should show the total points as points plus additional points', () => {
    render(<StandingsTable standings={standingsMock} />);

    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');

    const firstTeamTotal = within(rows[1]).getAllByRole('cell')[11];
    expect(firstTeamTotal).toHaveTextContent('5');

    const secondTeamTotal = within(rows[2]).getAllByRole('cell')[11];
    expect(secondTeamTotal).toHaveTextContent('1');
  });

  test('Should link each team to its admin team page', () => {
    render(<StandingsTable standings={standingsMock} />);

    const table = screen.getByRole('table');
    const rows = within(table).getAllByRole('row');

    const firstTeamLink = within(rows[1]).getByRole('link', { name: 'Cruz Azul' });
    const secondTeamLink = within(rows[2]).getByRole('link', { name: 'Atlas' });

    expect(firstTeamLink).toHaveAttribute('href', ROUTES.ADMIN_TEAMS_SHOW(LOCAL_TEAM_ID));
    expect(secondTeamLink).toHaveAttribute('href', ROUTES.ADMIN_TEAMS_SHOW(VISITOR_TEAM_ID));
  });

  test('Should render the abbreviations legend', () => {
    render(<StandingsTable standings={standingsMock} />);

    const gamesPlayed = screen.getByText('Juegos Jugados');

    expect(gamesPlayed).toBeInTheDocument();
  });
});
