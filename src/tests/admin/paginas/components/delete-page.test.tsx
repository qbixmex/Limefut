import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { DeletePage } from '@/app/admin/paginas/(components)/delete-page';

const { mockDeletePageAction } = vi.hoisted(() => ({
  mockDeletePageAction: vi.fn<
    (pageId: string) => Promise<{ ok: boolean; message: string }>
  >(),
}));

vi.mock('@/app/admin/paginas/(actions)/deletePageAction', () => ({
  deletePageAction: mockDeletePageAction,
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const pageId = '3f2a8c7e-1b4d-4e6f-9a2b-7c8d5e4f3a21';

describe('Test on <DeletePage /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeletePageAction.mockResolvedValue({
      ok: true,
      message: 'La página "Página de prueba" ha sido eliminada correctamente',
    });
  });

  const renderComponent = (roles: string[]) => {
    render(
      <DeletePage pageId={pageId} roles={roles} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    const deleteButton = screen.getByRole('button', { name: /eliminar página/i });
    const confirmButton = () => screen.getByRole('button', { name: /^eliminar$/ });
    const cancelButton = () => screen.getByRole('button', { name: /cancelar/i });

    return { user, deleteButton, confirmButton, cancelButton };
  };

  test('Should render correctly', () => {
    const { deleteButton } = renderComponent(['user']);

    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton.querySelector('svg')).toBeInTheDocument();
  });

  test('Should call deletePageAction on confirm when user is admin', async () => {
    const { user, deleteButton, confirmButton } = renderComponent(['admin']);

    await user.click(deleteButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(mockDeletePageAction).toHaveBeenCalledWith(pageId);
    });
  });

  test('Should not call deletePageAction when cancel is clicked', async () => {
    const { user, deleteButton, cancelButton } = renderComponent(['admin']);

    await user.click(deleteButton);
    await user.click(cancelButton());

    expect(mockDeletePageAction).not.toHaveBeenCalled();
  });

  test('Should show error toast and not call action when user is not admin', async () => {
    const { toast } = await import('sonner');
    const { user, deleteButton, confirmButton } = renderComponent(['user']);

    await user.click(deleteButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('No tienes permisos administrativos'),
      );
    });
    expect(mockDeletePageAction).not.toHaveBeenCalled();
  });
});
