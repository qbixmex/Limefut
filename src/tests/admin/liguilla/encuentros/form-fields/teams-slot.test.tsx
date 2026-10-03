import { render, screen } from '@testing-library/react';

const teamsSlotProps = vi.hoisted(() => ({ current: undefined as unknown }));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/fetch-playoff-teams.action', () => ({
  fetchPlayoffTeamsAction: vi.fn(),
}));

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/local-and-visitor-teams', () => ({
  LocalAndVisitorTeams: (props: unknown) => {
    teamsSlotProps.current = props;
    return <div data-testid="local-and-visitor-teams" />;
  },
}));

import { fetchPlayoffTeamsAction } from '@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/fetch-playoff-teams.action';
import { TeamsSlot } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/form-fields/teams-slot';
import { playoffTeamsForSelectMock } from '../mocks/playoff-teams.mock';

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';

describe('Test on <TeamsSlot />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    teamsSlotProps.current = undefined;
    vi.mocked(fetchPlayoffTeamsAction).mockResolvedValue({
      ok: true,
      message: '! Los equipos de liguilla fueron obtenidos correctamente 👍',
      teams: playoffTeamsForSelectMock,
    });
  });

  const renderComponent = async (id: string | undefined) => {
    const ServerComponent = await TeamsSlot({ playoffId: id });
    return render(ServerComponent);
  };

  test('Should fetch the teams and pass them to <LocalAndVisitorTeams />', async () => {
    await renderComponent(playoffId);

    expect(vi.mocked(fetchPlayoffTeamsAction)).toHaveBeenCalledWith({ playoffId });
    expect(screen.getByTestId('local-and-visitor-teams')).toBeInTheDocument();
    expect(teamsSlotProps.current).toEqual({ teams: playoffTeamsForSelectMock });
  });

  test('Should not fetch the teams when there is no playoff id', async () => {
    await renderComponent(undefined);

    expect(vi.mocked(fetchPlayoffTeamsAction)).not.toHaveBeenCalled();
    expect(teamsSlotProps.current).toEqual({ teams: [] });
  });
});
