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
      message: 'El jugador ha sido eliminado correctamente',
    });
  });

  const renderComponent = () => {
    render(
      <DeletePlayer playerId={playerId} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    const deleteButton = screen.getByRole('button', { name: /eliminar jugador/i });
    const confirmButton = () => screen.getByRole('button', { name: /^eliminar$/ });
    const cancelButton = () => screen.getByRole('button', { name: /cancelar/i });

    return { user, deleteButton, confirmButton, cancelButton };
  };

  test('Should render correctly', () => {
    const { deleteButton } = renderComponent();

    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton.querySelector('svg')).toBeInTheDocument();
  });

  test('Should call deletePlayerAction on confirm', async () => {
    const { user, deleteButton, confirmButton } = renderComponent();

    await user.click(deleteButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(mockDeleteAction).toHaveBeenCalledWith({
        playerId,
      });
    });
  });

  test('Should not call deletePlayerAction when cancel is clicked', async () => {
    const { user, deleteButton, cancelButton } = renderComponent();

    await user.click(deleteButton);
    await user.click(cancelButton());

    expect(mockDeleteAction).not.toHaveBeenCalled();
  });
});
