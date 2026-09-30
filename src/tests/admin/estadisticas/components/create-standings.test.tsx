const { mockCreateStandingsAction } = vi.hoisted(() => ({
  mockCreateStandingsAction: vi.fn(),
}));

vi.mock('@/app/admin/estadisticas/(actions)/create-standings.action', () => ({
  createStandingsAction: (data: unknown) => mockCreateStandingsAction(data),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateStandings } from '@/app/admin/estadisticas/(components)/create-standings';
import {
  CATEGORY_ID,
  LOCAL_TEAM_ID,
  TOURNAMENT_ID,
  VISITOR_TEAM_ID,
  teamsMock,
} from '../mocks/standings.mock';

describe('Tests on <CreateStandings /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateStandingsAction.mockResolvedValue({
      ok: true,
      message: 'Las estadísticas fueron creadas correctamente',
    });
  });

  const renderComponent = () => {
    render(<CreateStandings teams={teamsMock} />);

    const user = userEvent.setup();
    const createButton = () => {
      return screen.getByRole('button', { name: /crear/i });
    };

    return {
      user,
      createButton,
    };
  };

  test('Should render the create button', () => {
    const { createButton } = renderComponent();

    expect(createButton()).toBeInTheDocument();
  });

  test('Should send the teams of the tournament when clicked', async () => {
    const { user, createButton } = renderComponent();

    await user.click(createButton());

    await waitFor(() => {
      expect(mockCreateStandingsAction).toHaveBeenCalledWith([
        {
          tournamentId: TOURNAMENT_ID,
          categoryId: CATEGORY_ID,
          teamId: LOCAL_TEAM_ID,
        },
        {
          tournamentId: TOURNAMENT_ID,
          categoryId: CATEGORY_ID,
          teamId: VISITOR_TEAM_ID,
        },
      ]);
    });
  });

  test('Should show a success toast when standings are created', async () => {
    const { toast } = await import('sonner');
    const { user, createButton } = renderComponent();

    await user.click(createButton());

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Las estadísticas fueron creadas correctamente',
      );
    });
  });

  test('Should show an error toast when creation fails', async () => {
    const { toast } = await import('sonner');
    mockCreateStandingsAction.mockResolvedValue({
      ok: false,
      message: 'El campo "teamId", está duplicado',
    });
    const { user, createButton } = renderComponent();

    await user.click(createButton());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'El campo "teamId", está duplicado',
      );
    });
  });

  test('Should disable the button while the request is in progress', async () => {
    mockCreateStandingsAction.mockReturnValue(new Promise(() => {}));
    const { user, createButton } = renderComponent();

    await user.click(createButton());

    await waitFor(() => {
      expect(createButton()).toBeDisabled();
    });
  });
});
