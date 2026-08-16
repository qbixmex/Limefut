import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { DeletePlayerImage } from '@/app/admin/jugadores/(components)/delete-player-image';

const mockDeleteImageAction = vi.fn<
  (params: {
    playerId: string;
  }) => Promise<{ ok: boolean; message: string }>
>();

vi.mock('@/app/admin/jugadores/(actions)/deletePlayerImageAction', () => ({
  deletePlayerImageAction: (params: {
    playerId: string;
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
      <DeletePlayerImage teamId={teamId} />,
      { wrapper: TooltipProvider },
    );

    const deleteButton = screen.getByRole('button');
    expect(deleteButton).toBeInTheDocument();
  });

  test('Should call deletePlayerImageAction on confirm', async () => {
    render(
      <DeletePlayerImage teamId={teamId} />,
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
      });
    });
  });

  test('Should not call deletePlayerImageAction when cancel is clicked', async () => {
    render(
      <DeletePlayerImage teamId={teamId} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    const deleteButton = screen.getByRole('button');
    await user.click(deleteButton);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockDeleteImageAction).not.toHaveBeenCalled();
  });
});
