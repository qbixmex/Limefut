let formSelectProps: { teams: unknown[] } | undefined;

vi.mock('@/app/admin/liguilla/(actions)/fetch-teams.action', () => ({
  fetchTeamsAction: vi.fn(),
}));

vi.mock('@/app/admin/liguilla/(components)/form-fields/teams-select-field/teams-form-select', () => ({
  TeamsFormSelect: (props: { teams: unknown[] }) => {
    formSelectProps = props;
    return <div data-testid="teams-form-select" />;
  },
}));

import { TeamsSelectField } from '@/app/admin/liguilla/(components)/form-fields/teams-select-field';
import { render, screen } from '@testing-library/react';
import { fetchTeamsAction } from '@/app/admin/liguilla/(actions)/fetch-teams.action';
import { teamsMock } from '../mocks/teams.mock';

const tournamentPermalink = 'torneo-de-apertura-2026';
const categoryPermalink = 'varonil';

describe('Test on <TeamsSelectField />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    formSelectProps = undefined;
  });

  test('Should fetch and render the teams when both permalinks are present', async () => {
    vi.mocked(fetchTeamsAction).mockResolvedValue({
      ok: true,
      message: 'Los equipos fueron obtenidos correctamente',
      teams: teamsMock,
    });

    const ServerComponent = await TeamsSelectField({
      tournamentPermalink,
      categoryPermalink,
    });
    render(ServerComponent);

    const formSelect = screen.getByTestId('teams-form-select');

    expect(formSelect).toBeInTheDocument();
    expect(vi.mocked(fetchTeamsAction)).toHaveBeenCalledWith({ tournamentPermalink });
    expect(formSelectProps?.teams).toEqual(teamsMock);
  });

  test('Should not fetch the teams when a permalink is missing', async () => {
    const ServerComponent = await TeamsSelectField({
      tournamentPermalink,
      categoryPermalink: undefined,
    });
    render(ServerComponent);

    const formSelect = screen.getByTestId('teams-form-select');

    expect(formSelect).toBeInTheDocument();
    expect(vi.mocked(fetchTeamsAction)).not.toHaveBeenCalled();
    expect(formSelectProps?.teams).toEqual([]);
  });

  test('Should render an empty teams list when the fetch fails', async () => {
    vi.mocked(fetchTeamsAction).mockResolvedValue({
      ok: false,
      message: 'Error al obtener los equipos',
      teams: [],
    });

    const ServerComponent = await TeamsSelectField({
      tournamentPermalink,
      categoryPermalink,
    });
    render(ServerComponent);

    const formSelect = screen.getByTestId('teams-form-select');

    expect(formSelect).toBeInTheDocument();
    expect(formSelectProps?.teams).toEqual([]);
  });
});
