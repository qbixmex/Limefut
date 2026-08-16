import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { DeletePlayer } from '@/app/admin/jugadores/(components)/delete-player';

const mockDeleteAction = vi.fn<
  (params: {
    playerId: string;
  }) => Promise<{ ok: boolean; message: string }>
>();

vi.mock('@/app/admin/jugadores/(actions)', () => ({
  deletePlayerAction: (params: {
    playerId: string;
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
      <DeletePlayer playerId={playerId} />,
      { wrapper: TooltipProvider },
    );

    const icon = screen.getByRole('img', { name: /icono de basurero/i });

    expect(icon).toBeInTheDocument();
  });

  test('Should call deletePlayerAction on confirm', async () => {
    render(
      <DeletePlayer playerId={playerId} />,
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
      });
    });
  });

  test('Should not call deletePlayerAction when cancel is clicked', async () => {
    render(
      <DeletePlayer playerId={playerId} />,
      { wrapper: TooltipProvider },
    );

    const deleteButton = screen.getByRole('button', { name: /icono de basurero/i });
    const user = userEvent.setup();
    await user.click(deleteButton);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockDeleteAction).not.toHaveBeenCalled();
  });
});
