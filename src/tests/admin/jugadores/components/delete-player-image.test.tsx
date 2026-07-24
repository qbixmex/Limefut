import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { DeletePlayerImage } from '@/app/admin/jugadores/(components)/delete-player-image';

const mockDeleteImageAction = vi.fn<
  (params: {
    playerId: string;
    authenticatedUserId: string | null | undefined;
    authenticatedUserRoles: string[] | null | undefined;
  }) => Promise<{ ok: boolean; message: string }>
>();

vi.mock('@/app/admin/jugadores/(actions)/deletePlayerImageAction', () => ({
  deletePlayerImageAction: (params: {
    playerId: string;
    authenticatedUserId: string | null | undefined;
    authenticatedUserRoles: string[] | null | undefined;
  }) => mockDeleteImageAction(params),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const teamId = 'c93a8c24-ca76-493c-b1e3-f533454bbdae';

describe('Test on <DeletePlayerImage /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteImageAction.mockResolvedValue({
      ok: true,
      message: '¡ La imagen ha sido eliminada correctamente 👍 !',
    });
  });

  test('Should render correctly', () => {
    render(
      <DeletePlayerImage
        teamId={teamId}
        userId="d6443a5d-5c4d-464e-87da-83582ae121e1"
        roles={['admin']}
      />,
      { wrapper: TooltipProvider },
    );

    const deleteButton = screen.getByRole('button');
    expect(deleteButton).toBeInTheDocument();
  });

  test('Should call deletePlayerImageAction on confirm', async () => {
    render(
      <DeletePlayerImage
        teamId={teamId}
        userId="d6443a5d-5c4d-464e-87da-83582ae121e1"
        roles={['admin']}
      />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    const deleteButton = screen.getByRole('button');
    await user.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: /eliminar/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteImageAction).toHaveBeenCalledWith({
        playerId: teamId,
        authenticatedUserId: 'd6443a5d-5c4d-464e-87da-83582ae121e1',
        authenticatedUserRoles: ['admin'],
      });
    });
  });

  test('Should not call deletePlayerImageAction when cancel is clicked', async () => {
    render(
      <DeletePlayerImage
        teamId={teamId}
        userId="d6443a5d-5c4d-464e-87da-83582ae121e1"
        roles={['admin']}
      />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    const deleteButton = screen.getByRole('button');
    await user.click(deleteButton);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockDeleteImageAction).not.toHaveBeenCalled();
  });

  test('Should show error toast when roles do not include admin', async () => {
    const { toast } = await import('sonner');

    render(
      <DeletePlayerImage
        teamId={teamId}
        userId="d6443a5d-5c4d-464e-87da-83582ae121e1"
        roles={['user']}
      />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    const deleteButton = screen.getByRole('button');
    await user.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: /eliminar/i });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        '¡ No tienes permisos administrativos para eliminar la imagen !',
      );
    });
    expect(mockDeleteImageAction).not.toHaveBeenCalled();
  });
});
