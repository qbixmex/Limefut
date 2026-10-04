import { render, screen } from '@testing-library/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { userEvent } from '@testing-library/user-event';

const mockSetGalleryImage = vi.hoisted(() => vi.fn());

vi.mock('~/src/store', () => ({
  useImageGallery: () => ({ setGalleryImage: mockSetGalleryImage }),
}));

vi.mock('@/app/admin/galerias/(components)/gallery-images/delete-gallery-image', () => ({
  DeleteGalleryImage: ({ imageId }: { imageId: string }) => (
    <button data-testid="delete-gallery-image" data-image-id={imageId} />
  ),
}));

import { GalleryImage } from '@/app/admin/galerias/(components)/gallery-images/gallery-image';
import {
  galleryImageMock,
  galleryImageInactiveMock,
} from './gallery-image.mock';

describe('Test on <GalleryImage /> component', () => {
  const renderComponent = (galleryImage = galleryImageMock) => {
    return render(
      <GalleryImage galleryImage={galleryImage} />,
      { wrapper: TooltipProvider },
    );
  };

  test('Should render the image with its src and alt', () => {
    renderComponent();

    const image = screen.getByRole('img', { name: galleryImageMock.title });
    const src = image.getAttribute('src') ?? '';
    const parsedUrl = new URL(src, 'http://localhost');

    expect(parsedUrl.searchParams.get('url')).toBe(galleryImageMock.imageUrl);
    expect(image).toHaveAttribute('alt', galleryImageMock.title);
  });

  test('Should label the figure with the image title', () => {
    renderComponent();

    const figure = screen.getByRole('figure', { name: galleryImageMock.title });

    expect(figure).toBeInTheDocument();
  });

  test('Should not show the hidden indicator when the image is active', () => {
    renderComponent(galleryImageMock);

    const hiddenIndicator = screen.queryByText(/imagen oculta/i);

    expect(hiddenIndicator).not.toBeInTheDocument();
  });

  test('Should show the hidden indicator when the image is not active', () => {
    renderComponent(galleryImageInactiveMock);

    const hiddenIndicator = screen.queryByText(/imagen oculta/i);

    expect(hiddenIndicator).toBeInTheDocument();
  });

  test('Should render an accessible edit button', () => {
    renderComponent();

    const editButton = screen.getByRole('button', {
      name: /editar imagen/i,
    });

    expect(editButton).toBeInTheDocument();
    expect(editButton.querySelector('svg')).toBeInTheDocument();
  });

  test('Should pass the image data when the edit button is clicked', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole('button', { name: /editar imagen/i }));

    expect(mockSetGalleryImage).toHaveBeenCalledWith({
      id: galleryImageMock.id,
      title: galleryImageMock.title,
      active: galleryImageMock.active,
      position: galleryImageMock.position,
    });
  });

  test('Should render the delete control with the image id', () => {
    renderComponent();

    const deleteGalleryImage = screen.getByTestId('delete-gallery-image');

    expect(deleteGalleryImage).toHaveAttribute(
      'data-image-id',
      galleryImageMock.id,
    );
  });

  test('Should show the edit tooltip on hover', async () => {
    const user = userEvent.setup();
    renderComponent();

    const editButton = screen.getByRole('button', { name: /editar imagen/i });

    await user.hover(editButton);

    const tooltip = await screen.findByRole('tooltip');

    expect(tooltip).toHaveTextContent(/editar/i);
  });
});
