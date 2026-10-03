import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MatchStatus } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/match-status';
import { type MATCH_STATUS_TYPE, MATCH_STATUS } from '@/shared/enums';

const mockUpdateAction = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/update-playoff-match-status.action', () => ({
  updatePlayoffMatchStatusAction: (...args: unknown[]) => mockUpdateAction(...args),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const matchId = '24620ff5-cd48-4385-9ab8-b6320d69947f';

describe('Test on <MatchStatus /> component', () => {
  const renderComponent = (status?: MATCH_STATUS_TYPE) => {
    render(
      <MatchStatus
        matchId={matchId}
        status={status ?? 'scheduled'}
      />,
    );

    const user = userEvent.setup();
    const combobox = () => screen.getByRole('combobox', { name: 'Estado del encuentro' });

    return { user, combobox };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateAction.mockResolvedValue({
      ok: true,
      message: 'El estado del partido fue actualizado correctamente',
    });
  });

  test('Should render the status select', () => {
    const { combobox } = renderComponent();

    expect(combobox()).toBeInTheDocument();
  });

  test('Should call updatePlayoffMatchStatusAction when in review status is selected', async () => {
    const { user, combobox } = renderComponent();

    await user.click(combobox());
    const option = await screen.findByRole('option', { name: /en revisión/i });
    await user.click(option);

    await waitFor(() => {
      expect(mockUpdateAction).toHaveBeenCalledWith(matchId, MATCH_STATUS.IN_REVIEW);
    });
  });

  test('Should call updatePlayoffMatchStatusAction when schedule status is selected', async () => {
    const { user, combobox } = renderComponent('completed');

    await user.click(combobox());
    const option = await screen.findByRole('option', { name: /programado/i });
    await user.click(option);

    await waitFor(() => {
      expect(mockUpdateAction).toHaveBeenCalledWith(matchId, MATCH_STATUS.SCHEDULED);
    });
  });

  test('Should call updatePlayoffMatchStatusAction when in progress status is selected', async () => {
    const { user, combobox } = renderComponent();

    await user.click(combobox());
    const option = await screen.findByRole('option', { name: /en progreso/i });
    await user.click(option);

    await waitFor(() => {
      expect(mockUpdateAction).toHaveBeenCalledWith(matchId, MATCH_STATUS.IN_PROGRESS);
    });
  });

  test('Should call updatePlayoffMatchStatusAction when in post posed status is selected', async () => {
    const { user, combobox } = renderComponent();

    await user.click(combobox());
    const option = await screen.findByRole('option', { name: /pospuesto/i });
    await user.click(option);

    await waitFor(() => {
      expect(mockUpdateAction).toHaveBeenCalledWith(matchId, MATCH_STATUS.POST_POSED);
    });
  });

  test('Should call updatePlayoffMatchStatusAction when in canceled status is selected', async () => {
    const { user, combobox } = renderComponent();

    await user.click(combobox());
    const option = await screen.findByRole('option', { name: /cancelado/i });
    await user.click(option);

    await waitFor(() => {
      expect(mockUpdateAction).toHaveBeenCalledWith(matchId, MATCH_STATUS.CANCELED);
    });
  });

  test('Should show a success toast on update', async () => {
    const { toast } = await import('sonner');
    const { user, combobox } = renderComponent();

    await user.click(combobox());
    await user.click(await screen.findByRole('option', { name: /en revisión/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'El estado del partido fue actualizado correctamente',
      );
    });
  });

  test('Should show an error toast when the action fails', async () => {
    mockUpdateAction.mockResolvedValue({
      ok: false,
      message: 'No se pudo actualizar el estado del partido',
    });
    const { toast } = await import('sonner');
    const { user, combobox } = renderComponent();

    await user.click(combobox());
    await user.click(await screen.findByRole('option', { name: /cancelado/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No se pudo actualizar el estado del partido');
    });
  });
});
