import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { DeletePenaltyShootouts } from '@/app/admin/encuentros/editar/[id]/components/delete-penalty-shootouts';

const mockDeleteAction = vi.hoisted(() => vi.fn());

vi.mock('@/shared/actions/delete-penalty-shootout.action', () => ({
  deletePenaltyShootoutAction: (props: unknown) => mockDeleteAction(props),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const props = {
  penaltyShootoutsId: 'b2f343d3-5936-4e83-9bcf-6ffa150d9dc3',
  winnerTeamId: '3f24c2e0-7fd2-46e4-94ba-4dd0b557e675',
  phase: 'regular' as const,
};

describe('Test on <DeletePenaltyShootouts /> component', () => {
  const renderComponent = () => {
    render(<DeletePenaltyShootouts {...props} />, { wrapper: TooltipProvider });

    const user = userEvent.setup();
    const triggerButton = () => screen.getByRole('button', { name: /eliminar tanda de penales/i });
    const confirmButton = () => screen.getByRole('button', { name: /^eliminar$/ });
    const cancelButton = () => screen.getByRole('button', { name: /^cancelar$/ });

    return { user, triggerButton, confirmButton, cancelButton };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteAction.mockResolvedValue({
      ok: true,
      message: 'La tanda de penales ha sido eliminada correctamente',
    });
  });

  test('Should render the trigger button with its icon', () => {
    const { triggerButton } = renderComponent();

    expect(triggerButton()).toBeInTheDocument();
    expect(triggerButton().querySelector('svg')).toBeInTheDocument();
  });

  test('Should call deletePenaltyShootoutAction on confirm', async () => {
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton());
    await user.click(confirmButton());

    await waitFor(() => {
      expect(mockDeleteAction).toHaveBeenCalledWith({
        id: props.penaltyShootoutsId,
        winnerTeamId: props.winnerTeamId,
        phase: props.phase,
      });
    });
  });

  test('Should show a success toast on confirm', async () => {
    const { toast } = await import('sonner');
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton());
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'La tanda de penales ha sido eliminada correctamente',
      );
    });
  });

  test('Should show an error toast when the action fails', async () => {
    mockDeleteAction.mockResolvedValue({
      ok: false,
      message: 'No se pudo eliminar la tanda de penales',
    });
    const { toast } = await import('sonner');
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton());
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No se pudo eliminar la tanda de penales');
    });
  });

  test('Should not call the action when cancel is clicked', async () => {
    const { user, triggerButton, cancelButton } = renderComponent();

    await user.click(triggerButton());
    await user.click(cancelButton());

    expect(mockDeleteAction).not.toHaveBeenCalled();
  });
});
