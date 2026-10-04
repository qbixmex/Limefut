const mockDeleteGallery = vi.hoisted(() =>
  vi.fn<(galleryId: string) => Promise<{ ok: boolean; message: string }>>(),
);

vi.mock('@/app/admin/galerias/(actions)', () => ({
  deleteGalleryAction: (galleryId: string) => mockDeleteGallery(galleryId),
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
import { DeleteGallery } from '@/app/admin/galerias/(components)/delete-gallery';

const galleryId = '1f0e2d3c-4b5a-4968-8776-655443322110';

const renderComponent = (roles: string[] = ['admin']) => {
  render(
    <DeleteGallery galleryId={galleryId} roles={roles} />,
    { wrapper: TooltipProvider },
  );

  const user = userEvent.setup();
  const triggerButton = screen.getByRole('button');
  const confirmButton = () => screen.getByRole('button', { name: /^eliminar$/i });
  const cancelButton = () => screen.getByRole('button', { name: /cancelar/i });

  return { user, triggerButton, confirmButton, cancelButton };
};

describe('Test on <DeleteGallery /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteGallery.mockResolvedValue({
      ok: true,
      message: 'La galería "Galería de Apertura" ha sido eliminada correctamente',
    });
  });

  test('Should render the trigger button', () => {
    const { triggerButton } = renderComponent();

    expect(triggerButton).toBeInTheDocument();
    expect(triggerButton.querySelector('svg')).toBeInTheDocument();
  });

  test('Should call deleteGalleryAction on confirm', async () => {
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(mockDeleteGallery).toHaveBeenCalledWith(galleryId);
    });
  });

  test('Should show a success toast on confirm', async () => {
    const { toast } = await import('sonner');
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'La galería "Galería de Apertura" ha sido eliminada correctamente',
      );
    });
  });

  test('Should show an error toast when the action fails', async () => {
    mockDeleteGallery.mockResolvedValue({
      ok: false,
      message: 'No se puede eliminar la galería por que contiene imágenes',
    });
    const { toast } = await import('sonner');
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'No se puede eliminar la galería por que contiene imágenes',
      );
    });
  });

  test('Should block non-admin users and not call the action', async () => {
    const { toast } = await import('sonner');
    const { user, triggerButton, confirmButton } = renderComponent(['user']);

    await user.click(triggerButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'No tienes permisos administrativos para eliminar galerías',
      );
    });
    expect(mockDeleteGallery).not.toHaveBeenCalled();
  });

  test('Should not call deleteGalleryAction when cancel is clicked', async () => {
    const { user, triggerButton, cancelButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(cancelButton());

    expect(mockDeleteGallery).not.toHaveBeenCalled();
  });
});
