const mockDeleteAnnouncement = vi.hoisted(() =>
  vi.fn<(announcementId: string) => Promise<{ ok: boolean; message: string }>>(),
);

vi.mock('@/app/admin/noticias/(actions)', () => ({
  deleteAnnouncementAction: (announcementId: string) => mockDeleteAnnouncement(announcementId),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

import { render, screen, waitFor } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { DeleteAnnouncement } from '@/app/admin/noticias/(components)/delete-announcement';

const announcementId = '1f0e2d3c-4b5a-4968-8776-655443322110';

const renderComponent = (roles: string[] = ['admin']) => {
  render(<DeleteAnnouncement announcementId={announcementId} roles={roles} />, {
    wrapper: TooltipProvider,
  });

  const user = userEvent.setup();
  const triggerButton = screen.getByRole('button', { name: /eliminar noticia/i });
  const confirmButton = () => screen.getByRole('button', { name: /^eliminar$/i });
  const cancelButton = () => screen.getByRole('button', { name: /cancelar/i });

  return { user, triggerButton, confirmButton, cancelButton };
};

describe('Test on <DeleteAnnouncement /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteAnnouncement.mockResolvedValue({
      ok: true,
      message: 'La noticia ha sido eliminada correctamente',
    });
  });

  test('Should render the trigger button', () => {
    const { triggerButton } = renderComponent();

    expect(triggerButton).toBeInTheDocument();
    expect(triggerButton.querySelector('svg')).toBeInTheDocument();
  });

  test('Should call deleteAnnouncementAction on confirm', async () => {
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(mockDeleteAnnouncement).toHaveBeenCalledWith(announcementId);
    });
  });

  test('Should show a success toast on confirm', async () => {
    const { toast } = await import('sonner');
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'La noticia ha sido eliminada correctamente',
      );
    });
  });

  test('Should show an error toast when the action fails', async () => {
    mockDeleteAnnouncement.mockResolvedValue({
      ok: false,
      message: 'No se puede eliminar la noticia',
    });
    const { toast } = await import('sonner');
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No se puede eliminar la noticia');
    });
  });

  test('Should block non-admin users and not call the action', async () => {
    const { toast } = await import('sonner');
    const { user, triggerButton, confirmButton } = renderComponent(['user']);

    await user.click(triggerButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'No tienes permisos administrativos para eliminar noticias',
      );
    });
    expect(mockDeleteAnnouncement).not.toHaveBeenCalled();
  });

  test('Should not call deleteAnnouncementAction when cancel is clicked', async () => {
    const { user, triggerButton, cancelButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(cancelButton());

    expect(mockDeleteAnnouncement).not.toHaveBeenCalled();
  });
});
