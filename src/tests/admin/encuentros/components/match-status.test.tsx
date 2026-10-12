import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MatchStatus } from '@/app/admin/encuentros/(components)/match-status';
import { type MATCH_STATUS_TYPE, MATCH_STATUS } from '@/shared/enums';

const mockUpdateAction = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/encuentros/(actions)/update-status.action', () => ({
  updateStatusAction: (...args: unknown[]) => mockUpdateAction(...args),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const matchId = '0251b9bf-55e5-48fb-ae2c-6fcdad308d13';

describe('Test on <MatchStatus /> component', () => {
  const renderComponent = (status: MATCH_STATUS_TYPE) => {
    render(<MatchStatus matchId={matchId} status={status} />);

    const user = userEvent.setup();
    const combobox = () => screen.getByRole('combobox', {
      name: 'Estado del encuentro',
    });

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
    const { combobox } = renderComponent(MATCH_STATUS.SCHEDULED);

    expect(combobox()).toBeInTheDocument();
  });

  test('Should call updateStatusAction when in review status is selected', async () => {
    const { user, combobox } = renderComponent(MATCH_STATUS.SCHEDULED);

    await user.click(combobox());
    const option = await screen.findByRole('option', { name: /en revisión/i });
    await user.click(option);

    await waitFor(() => {
      expect(mockUpdateAction).toHaveBeenCalledWith(matchId, MATCH_STATUS.IN_REVIEW);
    });
  });

  test('Should call updateStatusAction when in schedule status is selected', async () => {
    const { user, combobox } = renderComponent(MATCH_STATUS.IN_REVIEW);

    await user.click(combobox());
    const option = await screen.findByRole('option', { name: /programado/i });
    await user.click(option);

    await waitFor(() => {
      expect(mockUpdateAction).toHaveBeenCalledWith(matchId, MATCH_STATUS.SCHEDULED);
    });
  });

  test('Should call updateStatusAction when in progress status is selected', async () => {
    const { user, combobox } = renderComponent(MATCH_STATUS.SCHEDULED);

    await user.click(combobox());
    const option = await screen.findByRole('option', { name: /en progreso/i });
    await user.click(option);

    await waitFor(() => {
      expect(mockUpdateAction).toHaveBeenCalledWith(matchId, MATCH_STATUS.IN_PROGRESS);
    });
  });

  test('Should call updateStatusAction when canceled status is selected', async () => {
    const { user, combobox } = renderComponent(MATCH_STATUS.IN_PROGRESS);

    await user.click(combobox());
    const option = await screen.findByRole('option', { name: /cancelado/i });
    await user.click(option);

    await waitFor(() => {
      expect(mockUpdateAction).toHaveBeenCalledWith(matchId, MATCH_STATUS.CANCELED);
    });
  });

  test('Should show a success toast on update', async () => {
    const { toast } = await import('sonner');
    const { user, combobox } = renderComponent(MATCH_STATUS.SCHEDULED);

    await user.click(combobox());
    const option = await screen.findByRole('option', { name: /en revisión/i });
    await user.click(option);

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
    const { user, combobox } = renderComponent(MATCH_STATUS.IN_REVIEW);

    await user.click(combobox());
    const option = await screen.findByRole('option', { name: /cancelado/i });
    await user.click(option);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No se pudo actualizar el estado del partido');
    });
  });
});
