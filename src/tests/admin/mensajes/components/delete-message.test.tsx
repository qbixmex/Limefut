import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { DeleteMessage } from '@/app/admin/mensajes/(components)/delete-message';

const mockDeleteMessageAction = vi.fn<(id: string) => Promise<{ ok: boolean; message: string }>>();

vi.mock('@/app/admin/mensajes/(actions)/deleteMessageAction', () => ({
  deleteMessageAction: (id: string) => mockDeleteMessageAction(id),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const messageId = 'c93a8c24-ca76-493c-b1e3-f533454bbdae';

describe('Test on <DeleteMessage /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteMessageAction.mockResolvedValue({
      ok: true,
      message: 'El mensaje de ha sido eliminado correctamente',
    });
  });

  const renderComponent = (roles: ('user' | 'admin')[]) => {
    render(
      <DeleteMessage id={messageId} roles={roles} />,
      { wrapper: TooltipProvider },
    );

    const icon = screen.getByRole('status', { name: /icono/i });
    const user = userEvent.setup();
    const triggerButton = screen.getByRole('button');
    const cancelButton = () => {
      return screen.getByRole('button', { name: /cancelar/i });
    };
    const confirmButton = () => {
      return screen.getByRole('button', { name: /^eliminar$/ });
    };

    return {
      icon,
      user,
      triggerButton,
      cancelButton,
      confirmButton,
    };
  };

  test('Should render correctly', () => {
    const { icon } = renderComponent(['admin']);

    expect(icon).toBeInTheDocument();
  });

  test('Should call deleteMessageAction on confirm when user is admin', async () => {
    const { user, triggerButton, confirmButton } = renderComponent(['admin']);

    await user.click(triggerButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(mockDeleteMessageAction).toHaveBeenCalledWith(messageId);
    });
  });

  test('Should not call deleteMessageAction when cancel is clicked', async () => {
    const { user, triggerButton, cancelButton } = renderComponent(['admin']);

    await user.click(triggerButton);
    await user.click(cancelButton());

    expect(mockDeleteMessageAction).not.toHaveBeenCalled();
  });

  test('Should show error toast and not call action when user is not admin', async () => {
    const { toast } = await import('sonner');

    const { user, triggerButton, confirmButton } = renderComponent(['user']);

    await user.click(triggerButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('permisos administrativos'),
      );
    });
    expect(mockDeleteMessageAction).not.toHaveBeenCalled();
  });
});
