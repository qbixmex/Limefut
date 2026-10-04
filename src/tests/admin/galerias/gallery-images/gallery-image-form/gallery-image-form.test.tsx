import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';
import { AddImage } from '@/app/admin/galerias/(components)/gallery-images/gallery-image-form';

const { mockUseImageGallery, mockClearGalleryImage } = vi.hoisted(() => ({
  mockUseImageGallery: vi.fn(),
  mockClearGalleryImage: vi.fn(),
}));

vi.mock('@/store', () => ({
  useImageGallery: mockUseImageGallery,
}));

vi.mock('@/app/admin/galerias/(components)/gallery-images/gallery-image-form/create-gallery-image-form', () => ({
  CreateGalleryImageForm: ({
    galleryId,
    imagesQuantity,
  }: {
    galleryId: string;
    imagesQuantity: number;
  }) => (
    <div
      data-testid="create-form"
      data-gallery-id={galleryId}
      data-quantity={String(imagesQuantity)}
    />
  ),
}));

vi.mock('@/app/admin/galerias/(components)/gallery-images/gallery-image-form/edit-gallery-image-form', () => ({
  EditGalleryImageForm: ({
    galleryImage,
  }: {
    galleryImage: { id: string };
  }) => <div data-testid="edit-form" data-image-id={galleryImage.id} />,
}));

const galleryId = '1f0e2d3c-4b5a-4968-8776-655443322110';
const imagesQuantity = 2;

const renderAddImage = () =>
  render(
    <AddImage
      galleryId={galleryId}
      imagesQuantity={imagesQuantity}
    />,
    { wrapper: TooltipProvider },
  );

const renderComponent = () => {
  renderAddImage();

  const user = userEvent.setup();
  const triggerButton = screen.getByRole('button', {
    name: /subir imagen/i,
  });

  return { user, triggerButton };
};

const testId = '52220544-68da-4c4e-af2c-3ebffcdf4285';

describe('Test on <AddImage />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseImageGallery.mockReturnValue({
      galleryImage: null,
      clearGalleryImage: mockClearGalleryImage,
    });
  });

  test('Should render the trigger button with an accessible name', () => {
    const { triggerButton } = renderComponent();

    expect(triggerButton).toBeInTheDocument();
    expect(triggerButton.querySelector('svg')).toBeInTheDocument();
    expect(triggerButton).toHaveAccessibleName(/subir imagen/i);
  });

  test('Should show the tooltip on hover', async () => {
    const { user, triggerButton } = renderComponent();

    await user.hover(triggerButton);

    expect(await screen.findByRole('tooltip')).toHaveTextContent(/subir imagen/i);
  });

  test('Should open the sheet with the create form when the trigger is clicked', async () => {
    const { user, triggerButton } = renderComponent();

    await user.click(triggerButton);

    const createForm = await screen.findByTestId('create-form');
    const heading = screen.getByRole('heading', { name: /subir imagen/i });

    expect(createForm).toHaveAttribute('data-gallery-id', galleryId);
    expect(createForm).toHaveAttribute('data-quantity', String(imagesQuantity));
    expect(heading).toBeInTheDocument();
  });

  test('Should render the edit form when the store holds a gallery image', async () => {
    mockUseImageGallery.mockReturnValue({
      galleryImage: {
        id: testId,
        title: 'Imagen',
        active: true,
        position: 1,
      },
      clearGalleryImage: mockClearGalleryImage,
    });

    renderAddImage();

    const editForm = await screen.findByTestId('edit-form');
    const heading = screen.getByRole('heading', { name: /editar imagen/i });

    expect(editForm).toHaveAttribute('data-image-id', testId);
    expect(heading).toBeInTheDocument();
  });

  test('Should clear the selected image when closing while editing', async () => {
    mockUseImageGallery.mockReturnValue({
      galleryImage: {
        id: testId,
        title: 'Imagen',
        active: true,
        position: 1,
      },
      clearGalleryImage: mockClearGalleryImage,
    });

    renderAddImage();
    const user = userEvent.setup();

    await screen.findByTestId('edit-form');
    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(mockClearGalleryImage).toHaveBeenCalled();
  });

  test('Should not clear the selected image when closing after creating', async () => {
    const { user, triggerButton } = renderComponent();

    await user.click(triggerButton);
    await screen.findByTestId('create-form');
    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(mockClearGalleryImage).not.toHaveBeenCalled();
  });
});
