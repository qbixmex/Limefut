import { render, screen } from '@testing-library/react';
import { LatestImages } from '@/app/(public)/components/latest-images';
import { fetchLatestImagesAction } from '@/app/(public)/(actions)/home/fetchLatestImagesAction';

vi.mock('@/app/(public)/(actions)/home/fetchLatestImagesAction');

describe('Tests on <LatestImages />', () => {
  test('Should render correctly', async () => {
    vi.mocked(fetchLatestImagesAction).mockResolvedValue({
      ok: false,
      message: '',
      latestImages: [],
    });

    const serverComponent = await LatestImages({ props: {} });

    render(serverComponent);

    const text = screen.getByText(/últimas imágenes/i);
    const link = screen.getByRole('link', {
      name: /ver todas/i,
    });
    expect(text).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/imagenes');
  });

  test('Should show empty image message', async () => {
    vi.mocked(fetchLatestImagesAction).mockResolvedValue({
      ok: false,
      message: '',
      latestImages: [],
    });

    const serverComponent = await LatestImages({ props: {} });

    render(serverComponent);

    const text = screen.getByText(/no hay imágenes/i);
    expect(text).toBeInTheDocument();
  });

  test('Should show images', async () => {
    const galleryImages = [
      {
        id: 'bs24',
        title: 'Image One',
        permalink: 'image-one',
        imageUrl: 'https://cloudinary.com/image-one.webp',
      },
      {
        id: 'rvi3',
        title: 'Image Two',
        permalink: 'image-two',
        imageUrl: 'https://cloudinary.com/image-two.webp',
      },
    ];
    vi.mocked(fetchLatestImagesAction).mockResolvedValue({
      ok: false,
      message: '',
      latestImages: galleryImages,
    });

    const serverComponent = await LatestImages({ props: {} });

    render(serverComponent);

    const images = screen.getAllByRole('img');
    const figCaptions = screen.getAllByRole('figure');
    const links = screen.getAllByRole('link', {
      name: /ver galeria/i,
    });

    images.forEach((image, index) => {
      const src = image.getAttribute('src') ?? '';
      const parsedUrl = new URL(src, 'http://localhost');
      const originalUrl = parsedUrl.searchParams.get('url');

      expect(originalUrl).toBe(galleryImages[index].imageUrl);
    });

    figCaptions.forEach((caption, index) => {
      expect(caption).toHaveTextContent(galleryImages[index].title);
    });

    links.forEach((link, index) => {
      expect(link).toHaveAttribute('href', `imagenes/${galleryImages[index].permalink}`);
    });
  });
});
