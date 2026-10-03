import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { DeleteMatch } from '@/app/admin/liguilla/[playoff_id]/encuentros/(components)/delete-match';

const mockDeleteAction = vi.hoisted(() =>
  vi.fn<(id: string) => Promise<{ ok: boolean; message: string }>>(),
);

vi.mock('@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/delete-playoff-match.action', () => ({
  deletePlayoffMatchAction: (id: string) => mockDeleteAction(id),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const matchId = '24620ff5-cd48-4385-9ab8-b6320d69947f';

describe('Test on <DeleteMatch /> component', () => {
  const renderComponent = () => {
    render(<DeleteMatch id={matchId} />, { wrapper: TooltipProvider });

    const user = userEvent.setup();
    const triggerButton = () => screen.getByRole('button', { name: /eliminar encuentro/i });
    const confirmButton = () => screen.getByRole('button', { name: /^eliminar$/ });
    const cancelButton = () => screen.getByRole('button', { name: /^cancelar$/ });

    return { user, triggerButton, confirmButton, cancelButton };
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteAction.mockResolvedValue({
      ok: true,
      message: 'El encuentro ha sido eliminado correctamente',
    });
  });

  test('Should render the trigger button with its icon', () => {
    const { triggerButton } = renderComponent();

    expect(triggerButton()).toBeInTheDocument();
    expect(triggerButton().querySelector('svg')).toBeInTheDocument();
  });

  test('Should call deletePlayoffMatchAction on confirm', async () => {
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton());
    await user.click(confirmButton());

    await waitFor(() => {
      expect(mockDeleteAction).toHaveBeenCalledWith(matchId);
    });
  });

  test('Should show a success toast on confirm', async () => {
    const { toast } = await import('sonner');
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton());
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('El encuentro ha sido eliminado correctamente');
    });
  });

  test('Should show an error toast when the action fails', async () => {
    mockDeleteAction.mockResolvedValue({
      ok: false,
      message: 'No se puede eliminar el encuentro',
    });
    const { toast } = await import('sonner');
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton());
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No se puede eliminar el encuentro');
    });
  });

  test('Should not call the action when cancel is clicked', async () => {
    const { user, triggerButton, cancelButton } = renderComponent();

    await user.click(triggerButton());
    await user.click(cancelButton());

    expect(mockDeleteAction).not.toHaveBeenCalled();
  });
});
