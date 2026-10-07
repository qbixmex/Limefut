import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MatchScoreInput } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/match-score-input';

const mockUpdateAction = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/update-playoff-match-input-score.action', () => ({
  updatePlayoffMatchInputScoreAction: (props: unknown) => mockUpdateAction(props),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const matchId = '24620ff5-cd48-4385-9ab8-b6320d69947f';

describe('Test on <MatchScoreInput /> component', () => {
  const renderComponent = (score = 2, local = true, visitor = false) => {
    render(
      <MatchScoreInput
        matchId={matchId}
        score={score}
        local={local}
        visitor={visitor}
        aria-label="Marcador local"
      />,
    );

    const user = userEvent.setup();
    const input = () => screen.getByRole('spinbutton', { name: 'Marcador local' });

    return { user, input };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateAction.mockResolvedValue({
      ok: true,
      message: 'El marcador del partido fue actualizado correctamente',
    });
  });

  test('Should render the input with the given score', () => {
    const { input } = renderComponent(3);

    expect(input()).toHaveValue(3);
  });

  test('Should call updatePlayoffMatchInputScoreAction on blur', async () => {
    const { user, input } = renderComponent(2);

    await user.clear(input());
    await user.type(input(), '5');
    await user.tab();

    await waitFor(() => {
      expect(mockUpdateAction).toHaveBeenCalledWith({
        matchId,
        score: 5,
        local: true,
        visitor: false,
      });
    });
  });

  test('Should fallback to zero when the input is empty on blur', async () => {
    const { user, input } = renderComponent(2);

    await user.clear(input());
    await user.tab();

    await waitFor(() => {
      expect(mockUpdateAction).toHaveBeenCalledWith({
        matchId,
        score: 0,
        local: true,
        visitor: false,
      });
    });
  });

  test('Should show a success toast on update', async () => {
    const { toast } = await import('sonner');
    const { user, input } = renderComponent(2);

    await user.clear(input());
    await user.type(input(), '4');
    await user.tab();

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'El marcador del partido fue actualizado correctamente',
      );
    });
  });

  test('Should show an error toast when the action fails', async () => {
    mockUpdateAction.mockResolvedValue({
      ok: false,
      message: 'No se pudo actualizar el marcador del partido',
    });
    const { toast } = await import('sonner');
    const { user, input } = renderComponent(2);

    await user.clear(input());
    await user.type(input(), '4');
    await user.tab();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No se pudo actualizar el marcador del partido');
    });
  });
});
