import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { DeletePlayer } from '@/app/admin/jugadores/(components)/delete-player';

const mockDeleteAction = vi.fn<
  (params: {
    playerId: string;
    authenticatedUserId: string | undefined;
    authenticatedUserRoles: string[] | null | undefined;
  }) => Promise<{ ok: boolean; message: string }>
>();

vi.mock('@/app/admin/jugadores/(actions)', () => ({
  deletePlayerAction: (params: {
    playerId: string;
    authenticatedUserId: string | undefined;
    authenticatedUserRoles: string[] | null | undefined;
  }) => mockDeleteAction(params),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const playerId = 'c93a8c24-ca76-493c-b1e3-f533454bbdae';

describe('Test on <DeletePlayer /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteAction.mockResolvedValue({
      ok: true,
      message: '¡ El jugador ha sido eliminado correctamente 👍 !',
    });
  });

  test('Should render correctly', () => {
    render(
      <DeletePlayer
        playerId={playerId}
        userId="d6443a5d-5c4d-464e-87da-83582ae121e1"
        roles={['admin']}
      />,
      { wrapper: TooltipProvider },
    );

    const icon = screen.getByRole('img', { name: /icono de basurero/i });

    expect(icon).toBeInTheDocument();
  });

  test('Should call deletePlayerAction on confirm', async () => {
    render(
      <DeletePlayer
        playerId={playerId}
        userId="d6443a5d-5c4d-464e-87da-83582ae121e1"
        roles={['admin']}
      />,
      { wrapper: TooltipProvider },
    );

    const deleteButton = screen.getByRole('button', { name: /icono de basurero/i });
    const user = userEvent.setup();
    await user.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: /^eliminar$/ });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteAction).toHaveBeenCalledWith({
        playerId,
        authenticatedUserId: 'd6443a5d-5c4d-464e-87da-83582ae121e1',
        authenticatedUserRoles: ['admin'],
      });
    });
  });

  test('Should not call deletePlayerAction when cancel is clicked', async () => {
    render(
      <DeletePlayer
        playerId={playerId}
        userId="d6443a5d-5c4d-464e-87da-83582ae121e1"
        roles={['admin']}
      />,
      { wrapper: TooltipProvider },
    );

    const deleteButton = screen.getByRole('button', { name: /icono de basurero/i });
    const user = userEvent.setup();
    await user.click(deleteButton);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockDeleteAction).not.toHaveBeenCalled();
  });

  test('Should show error toast when roles do not include admin', async () => {
    const { toast } = await import('sonner');

    render(
      <DeletePlayer
        playerId={playerId}
        userId="d6443a5d-5c4d-464e-87da-83582ae121e1"
        roles={['user']}
      />,
      { wrapper: TooltipProvider },
    );

    const deleteButton = screen.getByRole('button', { name: /icono de basurero/i });
    const user = userEvent.setup();
    await user.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: /^eliminar$/ });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        '¡ No tienes permisos administrativos para eliminar jugadores !',
      );
    });
    expect(mockDeleteAction).not.toHaveBeenCalled();
  });
});
