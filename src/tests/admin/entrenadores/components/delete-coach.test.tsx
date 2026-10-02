import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { DeleteCoach } from '@/app/admin/entrenadores/(components)/delete-coach';

const mockDeleteCoachAction = vi.fn<(coachId: string) => Promise<{ ok: boolean; message: string }>>();

vi.mock('@/app/admin/entrenadores/(actions)', () => ({
  deleteCoachAction: (coachId: string) => mockDeleteCoachAction(coachId),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const coachId = 'c93a8c24-ca76-493c-b1e3-f533454bbdae';

describe('Test on <DeleteCoach /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteCoachAction.mockResolvedValue({
      ok: true,
      message: 'El entrenador ha sido eliminado correctamente',
    });
  });

  const renderComponent = (roles: ('user' | 'admin')[]) => {
    render(
      <DeleteCoach coachId={coachId} roles={roles} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    const deleteButton = screen.getByRole('button', { name: /eliminar entrenador/i });
    const confirmButton = () => screen.getByRole('button', { name: /^eliminar$/ });
    const cancelButton = () => screen.getByRole('button', { name: /cancelar/i });

    return {
      user,
      deleteButton,
      confirmButton,
      cancelButton,
    };
  };

  test('Should render correctly', () => {
    const { deleteButton } = renderComponent(['admin']);

    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton.querySelector('svg')).toBeInTheDocument();
  });

  test('Should call deleteCoachAction on confirm when user is admin', async () => {
    const { user, deleteButton, confirmButton } = renderComponent(['admin']);

    await user.click(deleteButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(mockDeleteCoachAction).toHaveBeenCalledWith(coachId);
    });
  });

  test('Should not call deleteCoachAction when cancel is clicked', async () => {
    const { user, deleteButton, cancelButton } = renderComponent(['admin']);

    await user.click(deleteButton);
    await user.click(cancelButton());

    expect(mockDeleteCoachAction).not.toHaveBeenCalled();
  });

  test('Should show error toast and not call action when user is not admin', async () => {
    const { toast } = await import('sonner');

    const { user, deleteButton, confirmButton } = renderComponent(['user']);

    await user.click(deleteButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('No tienes permisos administrativos'),
      );
    });
    expect(mockDeleteCoachAction).not.toHaveBeenCalled();
  });
});
