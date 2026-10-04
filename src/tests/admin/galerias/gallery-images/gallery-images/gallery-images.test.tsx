import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

vi.mock('@/app/admin/galerias/(components)/gallery-images/gallery-image', () => ({
  GalleryImage: () => <div data-testid="gallery-image" />,
}));

import { GalleryImages } from '@/app/admin/galerias/(components)/gallery-images';
import { galleryImagesMock } from './gallery-images.mock';

describe('Test on <GalleryImages /> component', () => {
  const renderComponent = (images = galleryImagesMock) => {
    return render(<GalleryImages images={images} />);
  };

  const openDialog = async (imageIndex: number) => {
    const user = userEvent.setup();
    const magnifyButtons = screen.getAllByRole('button', {
      name: /ampliar imagen/i,
    });

    await user.click(magnifyButtons[imageIndex]);

    return screen.findByRole('dialog');
  };

  test('Should contain the title', () => {
    renderComponent();

    expect(
      screen.getByRole('heading', { name: /imágenes/i, level: 2 }),
    ).toBeInTheDocument();
  });

  test('Should render Gallery Images', () => {
    renderComponent();

    const galleryImage = screen.getAllByTestId('gallery-image');

    expect(galleryImage).toHaveLength(galleryImagesMock.length);
  });

  test('Should shows a position for every image', () => {
    renderComponent();

    const positions = screen.getAllByRole('status', {
      name: /posición de la imagen/i,
    });

    positions.forEach((position, index) => {
      const mockPosition = galleryImagesMock[index].position.toString();
      expect(position).toHaveTextContent(mockPosition);
    });
  });

  test('Should contains a magnify button', () => {
    renderComponent();

    const magnifyButtons = screen.getAllByRole('button', {
      name: /ampliar imagen/i,
    });

    expect(magnifyButtons).toHaveLength(galleryImagesMock.length);

    magnifyButtons.forEach((button, index) => {
      expect(button).toHaveAccessibleName(
        new RegExp(galleryImagesMock[index].title),
      );
      expect(button.querySelector('svg')).toBeInTheDocument();
    });
  });

  test('Should show the full size image when user clicks the magnify button', async () => {
    renderComponent();
    const image = galleryImagesMock[0];

    const dialog = await openDialog(0);

    expect(
      within(dialog).getByRole('heading', { name: image.title }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(`Imagen de ${image.title}`),
    ).toBeInTheDocument();

    const fullSizeImage = within(dialog).getByRole('img', {
      name: image.title,
    });
    const src = fullSizeImage.getAttribute('src') ?? '';
    const parsedUrl = new URL(src, 'http://localhost');

    expect(parsedUrl.searchParams.get('url')).toBe(image.imageUrl);
  });

  test('Should show empty message if there is no gallery found', () => {
    renderComponent([]);

    expect(
      screen.getByText(/la galería aún no tiene imágenes/i),
    ).toBeInTheDocument();
    expect(screen.queryAllByTestId('gallery-image')).toHaveLength(0);
  });
});
