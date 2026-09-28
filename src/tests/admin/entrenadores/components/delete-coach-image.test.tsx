import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { DeleteCoachImage } from '@/app/admin/entrenadores/(components)/delete-coach-image';

const mockDeleteCoachImageAction = vi.fn<
  (coachId: string) => Promise<{ ok: boolean; message: string }>
>();

vi.mock('@/app/admin/entrenadores/(actions)/deleteCoachImageAction', () => ({
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
      message: '¡ La imagen ha sido eliminada correctamente 👍 !',
    });
  });

  test('Should render correctly', () => {
    render(
      <DeleteCoachImage coachId={coachId} />,
      { wrapper: TooltipProvider },
    );

    const deleteButton = screen.getByRole('button');
    expect(deleteButton).toBeInTheDocument();
  });

  test('Should call deleteCoachImageAction on confirm', async () => {
    render(
      <DeleteCoachImage coachId={coachId} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    const confirmButton = screen.getByRole('button', { name: /^eliminar$/ });
    await user.click(confirmButton);

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

    render(
      <DeleteCoachImage coachId={coachId} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    const confirmButton = screen.getByRole('button', { name: /^eliminar$/ });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al eliminar la imagen');
    });
  });

  test('Should not call deleteCoachImageAction when cancel is clicked', async () => {
    render(
      <DeleteCoachImage coachId={coachId} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockDeleteCoachImageAction).not.toHaveBeenCalled();
  });
});
