const mockDeleteVideo = vi.hoisted(() =>
  vi.fn<(videoId: string) => Promise<{ ok: boolean; message: string }>>(),
);

vi.mock('@/app/admin/videos/(actions)', () => ({
  deleteVideoAction: (videoId: string) => mockDeleteVideo(videoId),
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
import { DeleteVideo } from '@/app/admin/videos/(components)/delete-video';

const videoId = '1f0e2d3c-4b5a-4968-8776-655443322110';

const renderComponent = (roles: string[] = ['admin']) => {
  render(<DeleteVideo videoId={videoId} roles={roles} />, {
    wrapper: TooltipProvider,
  });

  const user = userEvent.setup();
  const triggerButton = screen.getByRole('button', { name: /eliminar video/i });
  const confirmButton = () => screen.getByRole('button', { name: /^eliminar$/i });
  const cancelButton = () => screen.getByRole('button', { name: /cancelar/i });

  return { user, triggerButton, confirmButton, cancelButton };
};

describe('Test on <DeleteVideo /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteVideo.mockResolvedValue({
      ok: true,
      message: 'El video ha sido eliminado correctamente',
    });
  });

  test('Should render the trigger button', () => {
    const { triggerButton } = renderComponent();

    expect(triggerButton).toBeInTheDocument();
    expect(triggerButton.querySelector('svg')).toBeInTheDocument();
  });

  test('Should call deleteVideoAction on confirm', async () => {
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(mockDeleteVideo).toHaveBeenCalledWith(videoId);
    });
  });

  test('Should show a success toast on confirm', async () => {
    const { toast } = await import('sonner');
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'El video ha sido eliminado correctamente',
      );
    });
  });

  test('Should show an error toast when the action fails', async () => {
    mockDeleteVideo.mockResolvedValue({
      ok: false,
      message: 'No se puede eliminar el video',
    });
    const { toast } = await import('sonner');
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('No se puede eliminar el video');
    });
  });

  test('Should block non-admin users and not call the action', async () => {
    const { toast } = await import('sonner');
    const { user, triggerButton, confirmButton } = renderComponent(['user']);

    await user.click(triggerButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'No tienes permisos administrativos para eliminar videos',
      );
    });
    expect(mockDeleteVideo).not.toHaveBeenCalled();
  });

  test('Should not call deleteVideoAction when cancel is clicked', async () => {
    const { user, triggerButton, cancelButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(cancelButton());

    expect(mockDeleteVideo).not.toHaveBeenCalled();
  });
});
