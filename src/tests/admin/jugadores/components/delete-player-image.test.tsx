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
      message: 'La imagen ha sido eliminada correctamente',
    });
  });

  const renderComponent = () => {
    render(
      <DeletePlayerImage teamId={teamId} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    const deleteButton = screen.getByRole('button', { name: /eliminar imagen/i });
    const confirmButton = () => screen.getByRole('button', { name: /^eliminar$/ });
    const cancelButton = () => screen.getByRole('button', { name: /cancelar/i });

    return { user, deleteButton, confirmButton, cancelButton };
  };

  test('Should render correctly', () => {
    const { deleteButton } = renderComponent();

    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton.querySelector('svg')).toBeInTheDocument();
  });

  test('Should call deletePlayerImageAction on confirm', async () => {
    const { user, deleteButton, confirmButton } = renderComponent();

    await user.click(deleteButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(mockDeleteImageAction).toHaveBeenCalledWith({
        playerId: teamId,
      });
    });
  });

  test('Should not call deletePlayerImageAction when cancel is clicked', async () => {
    const { user, deleteButton, cancelButton } = renderComponent();

    await user.click(deleteButton);
    await user.click(cancelButton());

    expect(mockDeleteImageAction).not.toHaveBeenCalled();
  });
});
