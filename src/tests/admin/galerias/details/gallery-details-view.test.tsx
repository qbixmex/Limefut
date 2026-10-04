const mockRedirect = vi.hoisted(() => vi.fn());

vi.mock('next/navigation', () => ({
  redirect: (url: string) => {
    mockRedirect(url);
    throw new Error('NEXT_REDIRECT');
  },
}));

const mockFetchGallery = vi.hoisted(() => vi.fn());

vi.mock('@/app/admin/galerias/(actions)', () => ({
  fetchGalleryAction: mockFetchGallery,
}));

let galleryDataProps: { gallery: Record<string, unknown> } | undefined;

vi.mock('@/app/admin/galerias/(components)/gallery-data', () => ({
  GalleryData: (props: { gallery: Record<string, unknown> }) => {
    galleryDataProps = props;
    return <span data-testid="gallery-data" />;
  },
}));

vi.mock('@/app/admin/galerias/(components)/add-image', () => ({
  AddImage: ({ imagesQuantity }: { imagesQuantity: number }) => (
    <span data-testid="add-image" data-quantity={imagesQuantity} />
  ),
}));

vi.mock('@/app/admin/galerias/(components)/edit-gallery', () => ({
  EditGallery: () => <span data-testid="edit-gallery" />,
}));

vi.mock('@/app/admin/galerias/(components)/gallery-images', () => ({
  GalleryImages: ({ images }: { images: unknown[] }) => (
    <span data-testid="gallery-images" data-count={images.length} />
  ),
}));

import { render, screen } from '@testing-library/react';
import { GalleryDetailsView } from '@/app/admin/galerias/[id]/gallery-details-view';
import { ROUTES } from '@/shared/constants/routes';
import {
  galleryMock,
  galleryWithoutImagesMock,
} from '../mocks/gallery.mock';

describe('Tests on <GalleryDetailsView />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    galleryDataProps = undefined;
    mockFetchGallery.mockResolvedValue({
      ok: true,
      message: 'Galería obtenida correctamente',
      gallery: galleryMock,
    });
  });

  const renderComponent = async (galleryId = galleryMock.id as string) => {
    const element = await GalleryDetailsView({
      params: Promise.resolve({ id: galleryId }),
    });
    return render(element);
  };

  test('Should render the gallery information', async () => {
    await renderComponent();

    expect(screen.getByText(/detalles de la galería/i)).toBeInTheDocument();
    expect(screen.getByTestId('gallery-data')).toBeInTheDocument();
    expect(mockFetchGallery).toHaveBeenCalledWith(galleryMock.id);
  });

  test('Should pass the gallery data to <GalleryData />', async () => {
    await renderComponent();

    expect(galleryDataProps?.gallery).toEqual({
      id: galleryMock.id,
      title: galleryMock.title,
      permalink: galleryMock.permalink,
      galleryDate: galleryMock.galleryDate,
      active: galleryMock.active,
      createdAt: galleryMock.createdAt,
      updatedAt: galleryMock.updatedAt,
    });
    expect(galleryDataProps?.gallery).not.toHaveProperty('images');
  });

  test('Should render the add image button with the images quantity', async () => {
    await renderComponent();

    expect(screen.getByTestId('add-image')).toBeInTheDocument();
    expect(screen.getByTestId('add-image')).toHaveAttribute(
      'data-quantity',
      String(galleryMock.images.length),
    );
  });

  test('Should render the edit gallery button', async () => {
    await renderComponent();

    expect(screen.getByTestId('edit-gallery')).toBeInTheDocument();
  });

  test('Should render the images section when the gallery has images', async () => {
    await renderComponent();

    const images = screen.getByTestId('gallery-images');

    expect(images).toBeInTheDocument();
    expect(images).toHaveAttribute('data-count', String(galleryMock.images.length));
  });

  test('Should render the empty message when the gallery has no images', async () => {
    mockFetchGallery.mockResolvedValue({
      ok: true,
      message: 'Galería obtenida correctamente',
      gallery: galleryWithoutImagesMock,
    });

    await renderComponent();

    expect(screen.getByText('La galería aún no tiene imágenes')).toBeInTheDocument();
    expect(screen.queryByTestId('gallery-images')).not.toBeInTheDocument();
  });

  test('Should redirect when the gallery fetch fails', async () => {
    mockFetchGallery.mockResolvedValue({
      ok: false,
      message: 'Galería no encontrada',
      gallery: null,
    });

    await expect(
      GalleryDetailsView({ params: Promise.resolve({ id: 'unknown-id' }) }),
    ).rejects.toThrow('NEXT_REDIRECT');

    expect(mockRedirect).toHaveBeenCalledWith(
      `${ROUTES.ADMIN_GALLERIES}?error=${encodeURIComponent('Galería no encontrada')}`,
    );
  });
});
