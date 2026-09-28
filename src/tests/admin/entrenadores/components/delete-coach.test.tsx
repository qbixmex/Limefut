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
      message: '¡ El entrenador ha sido eliminado correctamente 👍 !',
    });
  });

  test('Should render correctly', () => {
    render(
      <DeleteCoach coachId={coachId} roles={['admin']} />,
      { wrapper: TooltipProvider },
    );

    const trigger = screen.getByRole('button');

    expect(trigger).toBeInTheDocument();
  });

  test('Should call deleteCoachAction on confirm when user is admin', async () => {
    render(
      <DeleteCoach coachId={coachId} roles={['admin']} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    const confirmButton = screen.getByRole('button', { name: /^eliminar$/ });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteCoachAction).toHaveBeenCalledWith(coachId);
    });
  });

  test('Should not call deleteCoachAction when cancel is clicked', async () => {
    render(
      <DeleteCoach coachId={coachId} roles={['admin']} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockDeleteCoachAction).not.toHaveBeenCalled();
  });

  test('Should show error toast and not call action when user is not admin', async () => {
    const { toast } = await import('sonner');

    render(
      <DeleteCoach coachId={coachId} roles={['user']} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    const confirmButton = screen.getByRole('button', { name: /^eliminar$/ });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('No tienes permisos administrativos'),
      );
    });
    expect(mockDeleteCoachAction).not.toHaveBeenCalled();
  });
});
