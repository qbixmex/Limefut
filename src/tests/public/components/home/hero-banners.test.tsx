import { render, screen } from '@testing-library/react';
import fetchPublicHeroBannersAction from '@/app/(public)/(actions)/home/fetchPublicHeroBannersAction';
import { Hero } from '@/app/(public)/components/hero';

vi.mock('@/app/(public)/(actions)/home/fetchPublicHeroBannersAction');
vi.mock('embla-carousel-react', () => ({
  default: vi.fn(() => [
    { current: null },
    {
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
      plugins: vi.fn(() => ({
        autoplay: {
          play: vi.fn(),
          stop: vi.fn(),
        },
      })),
      selectedScrollSnap: vi.fn(() => 0),
      scrollPrev: vi.fn(),
      scrollNext: vi.fn(),
      canScrollPrev: vi.fn(() => false),
      canScrollNext: vi.fn(() => true),
    },
  ]),
}));

describe('Tests on <LatestImages />', () => {
  test('Should render correctly', async () => {
    vi.mocked(fetchPublicHeroBannersAction).mockResolvedValue({
      ok: true,
      message: 'Banners cargados exitosamente',
      heroBanners: [],
    });

    const serverComponent = await Hero();

    render(serverComponent);

    const carousel = screen.getByTestId('hero-carousel');
    expect(carousel).toBeInTheDocument();
  });

  test('Should render images', async () => {
    const banners = [
      {
        id: '1',
        title: 'Banner One',
        description: 'Banner one description',
        imageUrl: 'https://example.com/image-one.jpg',
        dataAlignment: 'left',
        showData: false,
        position: 1,
      },
      {
        id: '2',
        title: 'Banner Two',
        description: 'Banner two description',
        imageUrl: 'https://example.com/image-two.jpg',
        dataAlignment: 'center',
        showData: false,
        position: 2,
      },
    ];
    vi.mocked(fetchPublicHeroBannersAction).mockResolvedValue({
      ok: true,
      message: 'Banners cargados exitosamente',
      heroBanners: banners,
    });

    const serverComponent = await Hero();

    render(serverComponent);

    banners.forEach((banner, index) => {
      expect(screen.queryByRole('heading', {
        level: 2,
        name: banner.title,
      })).not.toBeInTheDocument();
      expect(screen.queryByText(banner.description)).not.toBeInTheDocument();
      const image = screen.getByAltText(banner.title) as HTMLImageElement;
      expect(image).toBeInTheDocument();
      const src = image.getAttribute('src') ?? '';
      const parsedUrl = new URL(src, 'http://localhost');
      const originalUrl = parsedUrl.searchParams.get('url');
      expect(originalUrl).toBe(banners[index].imageUrl);
    });
  });

  test('Should show title and description', async () => {
    const banners = [
      {
        id: '1',
        title: 'Banner One',
        description: 'Banner one description',
        imageUrl: 'https://example.com/image-one.jpg',
        dataAlignment: 'left',
        showData: true,
        position: 1,
      },
      {
        id: '2',
        title: 'Banner Two',
        description: 'Banner two description',
        imageUrl: 'https://example.com/image-two.jpg',
        dataAlignment: 'center',
        showData: true,
        position: 2,
      },
    ];
    vi.mocked(fetchPublicHeroBannersAction).mockResolvedValue({
      ok: true,
      message: 'Banners cargados exitosamente',
      heroBanners: banners,
    });

    const serverComponent = await Hero();

    render(serverComponent);

    banners.forEach((banner) => {
      expect(
        screen.queryByRole('heading', {
          level: 2,
          name: banner.title,
        }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(banner.description),
      ).toBeInTheDocument();
    });
  });

  test('Should contains dot buttons', async () => {
    const banners = [
      {
        id: '1',
        title: 'Banner One',
        description: 'Banner one description',
        imageUrl: 'https://example.com/image-one.jpg',
        dataAlignment: 'left',
        showData: false,
        position: 1,
      },
      {
        id: '2',
        title: 'Banner Two',
        description: 'Banner two description',
        imageUrl: 'https://example.com/image-two.jpg',
        dataAlignment: 'left',
        showData: false,
        position: 2,
      },
      {
        id: '3',
        title: 'Banner Three',
        description: 'Banner three description',
        imageUrl: 'https://example.com/image-three.jpg',
        dataAlignment: 'left',
        showData: false,
        position: 3,
      },
    ];
    vi.mocked(fetchPublicHeroBannersAction).mockResolvedValue({
      ok: true,
      message: 'Banners cargados exitosamente',
      heroBanners: banners,
    });

    const serverComponent = await Hero();

    const { container } = render(serverComponent);

    const dotButtons = container.querySelectorAll('.embla__dot');

    expect(dotButtons).toHaveLength(3);
  });
});
