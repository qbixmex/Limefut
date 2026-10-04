const mockDeleteGalleryImage = vi.hoisted(() =>
  vi.fn<(galleryImageId: string) => Promise<{ ok: boolean; message: string }>>(),
);

vi.mock('@/app/admin/galerias/(actions)/gallery-images/delete-gallery-image.action', () => ({
  deleteGalleryImageAction: (galleryImageId: string) =>
    mockDeleteGalleryImage(galleryImageId),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

import { render, screen, waitFor, within } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { DeleteGalleryImage } from '@/app/admin/galerias/(components)/gallery-images/delete-gallery-image';

const imageId = '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d';

const renderComponent = () => {
  render(
    <DeleteGalleryImage imageId={imageId} />,
    { wrapper: TooltipProvider },
  );

  const user = userEvent.setup();
  const triggerButton = screen.getByRole('button', {
    name: /eliminar imagen/i,
  });
  const confirmButton = () =>
    screen.getByRole('button', { name: /^eliminar$/i });
  const cancelButton = () => screen.getByRole('button', { name: /cancelar/i });

  return { user, triggerButton, confirmButton, cancelButton };
};

describe('Test on <DeleteGalleryImage /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteGalleryImage.mockResolvedValue({
      ok: true,
      message: 'La imagen de la galería ha sido eliminada correctamente',
    });
  });

  test('Should render the trigger button', () => {
    const { triggerButton } = renderComponent();

    expect(triggerButton).toBeInTheDocument();
    expect(triggerButton.querySelector('svg')).toBeInTheDocument();
  });

  test('Should show the tooltip on hover', async () => {
    const { user, triggerButton } = renderComponent();

    await user.hover(triggerButton);

    const tooltip = await screen.findByRole('tooltip');

    expect(tooltip).toHaveTextContent(/eliminar/i);
  });

  test('Should open the confirmation dialog', async () => {
    const { user, triggerButton } = renderComponent();

    await user.click(triggerButton);

    const dialog = await screen.findByRole('alertdialog');

    expect(
      within(dialog).getByText(/¿ estas seguro de eliminar la imagen \?/i),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(/esta acción no se puede deshacer/i),
    ).toBeInTheDocument();
  });

  test('Should call the action with the image id on confirm', async () => {
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(mockDeleteGalleryImage).toHaveBeenCalledWith(imageId);
    });
  });

  test('Should show a success toast on confirm', async () => {
    const { toast } = await import('sonner');
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'La imagen de la galería ha sido eliminada correctamente',
      );
    });
  });

  test('Should show an error toast when the action fails', async () => {
    const errorMessage = 'No se puede eliminar la imagen de la galería';
    mockDeleteGalleryImage.mockResolvedValue({
      ok: false,
      message: errorMessage,
    });
    const { toast } = await import('sonner');
    const { user, triggerButton, confirmButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(confirmButton());

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  test('Should not call the action when cancel is clicked', async () => {
    const { user, triggerButton, cancelButton } = renderComponent();

    await user.click(triggerButton);
    await user.click(cancelButton());

    expect(mockDeleteGalleryImage).not.toHaveBeenCalled();
  });
});
