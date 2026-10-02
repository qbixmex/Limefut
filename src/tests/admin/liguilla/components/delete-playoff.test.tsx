import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import userEvent from '@testing-library/user-event';
import { DeletePlayoff } from '@/app/admin/liguilla/(components)/delete-playoff';

const mockDeletePlayoffAction = vi.hoisted(() =>
  vi.fn<(id: string) => Promise<{ ok: boolean; message: string }>>(),
);

vi.mock('@/app/admin/liguilla/(actions)/delete-playoff.action', () => ({
  deletePlayoffAction: (id: string) => mockDeletePlayoffAction(id),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';

const renderComponent = () => {
  render(
    <DeletePlayoff id={playoffId} />,
    { wrapper: TooltipProvider },
  );

  const user = userEvent.setup();
  const triggerButton = screen.getByRole('button', { name: /Borrar encuentro/i });
  const deleteButton = () => screen.getByRole('button', { name: /^eliminar$/ });
  const confirmButton = () => screen.getByRole('button', { name: /^eliminar$/ });
  const cancelButton = () => screen.getByRole('button', { name: /cancelar/i });

  return {
    user,
    triggerButton,
    deleteButton,
    cancelButton,
    confirmButton,
  };
};

describe('Test on <DeletePlayoff /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeletePlayoffAction.mockResolvedValue({
      ok: true,
      message: 'La liguilla ha sido eliminada correctamente',
    });
  });

  test('Should render the trigger button', () => {
    const { triggerButton } = renderComponent();

    expect(triggerButton).toBeInTheDocument();
  });

  test('Should call deletePlayoffAction on confirm', async () => {
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(mockDeletePlayoffAction).toHaveBeenCalledWith(playoffId);
    });
  });

  test('Should show success toast on confirm', async () => {
    const { toast } = await import('sonner');

    const { user, triggerButton, deleteButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(deleteButton());

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('La liguilla ha sido eliminada correctamente');
    });
  });

  test('Should show error toast when the action fails', async () => {
    mockDeletePlayoffAction.mockResolvedValue({
      ok: false,
      message: 'No se puede eliminar la liguilla por que contiene encuentros',
    });
    const { toast } = await import('sonner');

    const { user, triggerButton, deleteButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(deleteButton());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'No se puede eliminar la liguilla por que contiene encuentros',
      );
    });
  });

  test('Should not call deletePlayoffAction when cancel is clicked', async () => {
    const { user, triggerButton, cancelButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(cancelButton());

    expect(mockDeletePlayoffAction).not.toHaveBeenCalled();
  });
});
