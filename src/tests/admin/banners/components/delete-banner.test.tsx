import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { DeleteBanner } from '@/app/admin/banners/(components)/delete-banner';

const mockDeleteBannerAction = vi.fn<(bannerId: string) => Promise<{ ok: boolean; message: string }>>();

vi.mock('@/app/admin/banners/(actions)', () => ({
  deleteHeroBannerAction: (bannerId: string) => mockDeleteBannerAction(bannerId),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const bannerId = 'c93a8c24-ca76-493c-b1e3-f533454bbdae';

describe('Test on <DeleteBanner /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteBannerAction.mockResolvedValue({
      ok: true,
      message: '¡ El banner ha sido eliminado correctamente 👍 !',
    });
  });

  test('Should render correctly', () => {
    render(
      <DeleteBanner bannerId={bannerId} roles={['admin']} />,
      { wrapper: TooltipProvider },
    );

    const trigger = screen.getByRole('button', { name: /eliminar banner/i });

    expect(trigger).toBeInTheDocument();
  });

  test('Should call deleteHeroBannerAction on confirm when user is admin', async () => {
    render(
      <DeleteBanner bannerId={bannerId} roles={['admin']} />,
      { wrapper: TooltipProvider },
    );

    const deleteButton = screen.getByRole('button', { name: /eliminar banner/i });

    const user = userEvent.setup();
    await user.click(deleteButton);

    const confirmButton = screen.getByRole('button', { name: /^eliminar$/ });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockDeleteBannerAction).toHaveBeenCalledWith(bannerId);
    });
  });

  test('Should not call deleteHeroBannerAction when cancel is clicked', async () => {
    render(
      <DeleteBanner bannerId={bannerId} roles={['admin']} />,
      { wrapper: TooltipProvider },
    );

    const deleteButton = screen.getByRole('button', { name: /eliminar banner/i });

    const user = userEvent.setup();
    await user.click(deleteButton);

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    await user.click(cancelButton);

    expect(mockDeleteBannerAction).not.toHaveBeenCalled();
  });

  test('Should show error toast and not call action when user is not admin', async () => {
    const { toast } = await import('sonner');

    render(
      <DeleteBanner bannerId={bannerId} roles={['user']} />,
      { wrapper: TooltipProvider },
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /eliminar banner/i }));

    const confirmButton = screen.getByRole('button', { name: /^eliminar$/ });
    await user.click(confirmButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        expect.stringContaining('No tienes permisos administrativos'),
      );
    });
    expect(mockDeleteBannerAction).not.toHaveBeenCalled();
  });
});
