import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { ContentImages } from '@/app/admin/paginas/(components)/content-images';
import { customPageMock } from '../mocks/custom-page.mock';

const { mockDeleteImageAction } = vi.hoisted(() => ({
  mockDeleteImageAction: vi.fn<
    (pageId: string, publicId: string) => Promise<{ ok: boolean; message: string }>
  >(),
}));

vi.mock('@/app/admin/paginas/(actions)/delete-content-image', () => ({
  deleteContentImageAction: mockDeleteImageAction,
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const pageId = customPageMock.id;

const setClipboard = (value: unknown) => {
  Object.defineProperty(navigator, 'clipboard', {
    value,
    configurable: true,
  });
};

describe('Tests on <ContentImages /> component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteImageAction.mockResolvedValue({
      ok: true,
      message: 'La imagen del contenido ha sido eliminada',
    });
  });

  afterEach(() => {
    setClipboard(undefined);
  });

  const renderComponent = (onImageDeleted = vi.fn()) => {
    render(
      <ContentImages
        pageId={pageId}
        contentImages={customPageMock.images}
        onImageDeleted={onImageDeleted}
      />,
    );

    const user = userEvent.setup();

    return { user, onImageDeleted };
  };

  test('Should render nothing when there are no images', () => {
    const { container } = render(
      <ContentImages
        pageId={pageId}
        contentImages={[]}
        onImageDeleted={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  test('Should render the heading and an image per content image', () => {
    renderComponent();

    const heading = screen.getByRole('heading', {
      name: /imágenes del contenido/i,
      level: 2,
    });

    expect(heading).toBeInTheDocument();
    expect(screen.getAllByAltText('Imagen del contenido')).toHaveLength(
      customPageMock.images.length,
    );
  });

  test('Should copy the image url to the clipboard', async () => {
    const { toast } = await import('sonner');
    const { user } = renderComponent();

    const copyButtons = screen.getAllByRole('button', { name: /copiar url de la imagen/i });
    await user.click(copyButtons[0]);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('URL copiada al portapapeles');
    });
  });

  test('Should call the delete action and notify the parent on success', async () => {
    const { user, onImageDeleted } = renderComponent();

    const deleteButtons = screen.getAllByRole('button', { name: /eliminar imagen/i });
    await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(mockDeleteImageAction).toHaveBeenCalledWith(
        pageId,
        customPageMock.images[0].resourceId,
      );
    });
    expect(onImageDeleted).toHaveBeenCalledWith(customPageMock.images[0].resourceId);
  });
});
