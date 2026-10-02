import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { DeleteCoachImage } from '@/app/admin/entrenadores/(components)/delete-coach-image';

const mockDeleteCoachImageAction = vi.fn<
  (coachId: string) => Promise<{ ok: boolean; message: string }>
>();

vi.mock('@/app/admin/entrenadores/(actions)', () => ({
  deleteCoachImageAction: (coachId: string) => mockDeleteCoachImageAction(coachId),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const coachId = 'c93a8c24-ca76-493c-b1e3-f533454bbdae';

describe('Test on <DeleteCoachImage /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteCoachImageAction.mockResolvedValue({
      ok: true,
      message: 'La imagen ha sido eliminada correctamente',
    });
  });

  const renderComponent = () => {
    render(
      <DeleteCoachImage coachId={coachId} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    const deleteButton = screen.getByRole('button', { name: /eliminar imagen/i });
    const cancelButton = () => screen.getByRole('button', { name: /cancelar/i });
    const confirmButton = () => screen.getByRole('button', { name: /^eliminar$/ });

    return { user, deleteButton, cancelButton, confirmButton };
  };

  test('Should render correctly', () => {
    const { deleteButton } = renderComponent();

    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton.querySelector('svg')).toBeInTheDocument();
  });

  test('Should call deleteCoachImageAction on confirm', async () => {
    const { user, deleteButton, confirmButton } = renderComponent();

    await user.click(deleteButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(mockDeleteCoachImageAction).toHaveBeenCalledWith(coachId);
    });
  });

  test('Should show error toast when action fails', async () => {
    const { toast } = await import('sonner');
    mockDeleteCoachImageAction.mockResolvedValue({
      ok: false,
      message: 'Error al eliminar la imagen',
    });

    const { user, deleteButton, confirmButton } = renderComponent();

    await user.click(deleteButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al eliminar la imagen');
    });
  });

  test('Should not call deleteCoachImageAction when cancel is clicked', async () => {
    const { user, deleteButton, cancelButton } = renderComponent();

    await user.click(deleteButton);
    await user.click(cancelButton());

    expect(mockDeleteCoachImageAction).not.toHaveBeenCalled();
  });
});
