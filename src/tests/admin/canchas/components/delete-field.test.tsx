import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { DeleteField } from '@/app/admin/canchas/(components)/delete-field';

const mockDeleteFieldAction = vi.fn<(fieldId: string) => Promise<{ ok: boolean; message: string }>>();

vi.mock('@/app/admin/canchas/(actions)', () => ({
  deleteFieldAction: (fieldId: string) => mockDeleteFieldAction(fieldId),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const fieldId = 'c93a8c24-ca76-493c-b1e3-f533454bbdae';

describe('Test on <DeleteField /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteFieldAction.mockResolvedValue({
      ok: true,
      message: '¡ La cancha ha sido eliminada correctamente 👍 !',
    });
  });

  test('Should render correctly', () => {
    render(
      <DeleteField fieldId={fieldId} roles={['admin']} />,
      { wrapper: TooltipProvider },
    );

    const trigger = screen.getByRole('button');

    expect(trigger).toBeInTheDocument();
  });

  test('Should call deleteFieldAction on confirm when user is admin', async () => {
    render(
      <DeleteField fieldId={fieldId} roles={['admin']} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    const confirmButton = screen.getByRole('button', { name: /^eliminar$/ });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteFieldAction).toHaveBeenCalledWith(fieldId);
    });
  });

  test('Should not call deleteFieldAction when cancel is clicked', async () => {
    render(
      <DeleteField fieldId={fieldId} roles={['admin']} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button'));

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockDeleteFieldAction).not.toHaveBeenCalled();
  });

  test('Should show error toast and not call action when user is not admin', async () => {
    const { toast } = await import('sonner');

    render(
      <DeleteField fieldId={fieldId} roles={['user']} />,
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
    expect(mockDeleteFieldAction).not.toHaveBeenCalled();
  });
});
