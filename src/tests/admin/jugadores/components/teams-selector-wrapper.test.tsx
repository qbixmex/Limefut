import { render, screen } from '@testing-library/react';
import { TeamsSelectorWrapper } from '@/app/admin/jugadores/(components)/teams-selector-wrapper';

const { mockFetchTeamsForPlayer } = vi.hoisted(() => ({
  mockFetchTeamsForPlayer: vi.fn(),
}));

vi.mock('@/app/admin/jugadores/(components)/teams-selector', () => ({
  TeamsSelector: ({ teams }: { teams: { id: string; name: string }[] }) => (
    <div data-testid="teams-selector" data-teams={teams.map((t) => t.name).join(',')} />
  ),
}));

vi.mock('@/app/admin/jugadores/(actions)/fetchTeamsForPlayer', () => ({
  fetchTeamsForPlayer: (permalink: string) => mockFetchTeamsForPlayer(permalink),
}));

const teams = [
  { id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', name: 'América' },
  { id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', name: 'Chicas' },
];

const teamsNames = teams.map((team) => team.name).join(',');

describe('Test on <TeamsSelectorWrapper /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchTeamsForPlayer.mockResolvedValue({
      ok: true,
      message: 'Los equipos fueron obtenidos correctamente',
      teams,
    });
  });

  const renderComponent = async (tournamentPermalink = 'torneo-verano') => {
    const ServerComponent = await TeamsSelectorWrapper({ tournamentPermalink });
    return render(ServerComponent);
  };

  test('Should render correctly', async () => {
    await renderComponent();

    expect(screen.getByTestId('teams-selector')).toBeInTheDocument();
  });

  test('Should pass the fetched teams down to the selector', async () => {
    await renderComponent();

    expect(screen.getByTestId('teams-selector')).toHaveAttribute(
      'data-teams',
      teamsNames,
    );
  });

  test('Should fetch the teams with the provided tournament permalink', async () => {
    await renderComponent('torneo-verano');

    expect(mockFetchTeamsForPlayer).toHaveBeenCalledWith('torneo-verano');
    expect(mockFetchTeamsForPlayer).toHaveBeenCalledOnce();
  });

  test('Should render the selector inside the responsive section', async () => {
    await renderComponent();

    const section = screen.getByTestId('teams-selector').closest('section');

    expect(section).toBeInTheDocument();
    expect(section).toHaveClass(
      'w-full',
      'lg:w-1/2',
      '2xl:w-full',
      '2xl:max-w-[600px]',
    );
  });

  test('Should render an empty list when the tournament has no teams', async () => {
    mockFetchTeamsForPlayer.mockResolvedValue({
      ok: false,
      message: 'No hay equipos registrados con el torneo y categoría subministrados',
      teams: [],
    });

    await renderComponent();

    expect(screen.getByTestId('teams-selector')).toHaveAttribute('data-teams', '');
  });
});
