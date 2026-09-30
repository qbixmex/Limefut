const { mockFindMany, mockCount } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockCount: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    heroBanner: {
      findMany: mockFindMany,
      count: mockCount,
    },
  },
}));

import { fetchHeroBannersAction } from '@/app/admin/banners/(actions)/fetch-hero-banners.action';
import { heroBannersMock } from '../mocks/hero-banners.mock';

const prismaBanners = heroBannersMock.map((banner) => ({
  id: banner.id,
  title: banner.title,
  imageUrl: banner.imageUrl,
  showData: banner.showData,
  position: banner.position,
  active: banner.active,
}));

describe('Tests on fetchHeroBannersAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return all banners with default pagination', async () => {
    mockFindMany.mockResolvedValue(prismaBanners);
    mockCount.mockResolvedValue(2);

    const response = await fetchHeroBannersAction();

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/banners fueron obtenidos/i);
    expect(response.heroBanners).toHaveLength(heroBannersMock.length);

    response.heroBanners.forEach((heroBanner, index) => {
      expect(heroBanner.id).toBe(heroBannersMock[index].id);
      expect(heroBanner.title).toBe(heroBannersMock[index].title);
      expect(heroBanner.imageUrl).toBe(heroBannersMock[index].imageUrl);
      expect(heroBanner.showData).toBe(heroBannersMock[index].showData);
      expect(heroBanner.position).toBe(heroBannersMock[index].position);
      expect(heroBanner.active).toBe(heroBannersMock[index].active);
    });

    expect(mockFindMany).toHaveBeenCalledWith({
      where: {},
      select: {
        id: true,
        title: true,
        imageUrl: true,
        showData: true,
        position: true,
        active: true,
      },
      orderBy: { position: 'asc' },
      take: 12,
      skip: 0,
    });
    expect(mockCount).toHaveBeenCalledWith({ where: {} });
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
    });
  });

  test('Should search banners by title', async () => {
    const searchTerm = 'inscripciones';
    const filtered = prismaBanners.filter((banner) => banner.title.toLowerCase().includes(searchTerm));
    mockFindMany.mockResolvedValue(filtered);
    mockCount.mockResolvedValue(1);

    const response = await fetchHeroBannersAction({ searchTerm });

    expect(response.ok).toBe(true);
    expect(response.heroBanners).toHaveLength(1);
    expect(response.heroBanners[0].title.toLowerCase()).toContain(searchTerm);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
      }),
    );
    expect(mockCount).toHaveBeenCalledWith({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
    });
  });

  test('Should paginate results', async () => {
    mockFindMany.mockResolvedValue([prismaBanners[0]]);
    mockCount.mockResolvedValue(2);

    const response = await fetchHeroBannersAction({ page: 2, take: 1 });

    expect(response.ok).toBe(true);
    expect(response.heroBanners).toHaveLength(1);
    expect(response.pagination).toEqual({
      currentPage: 2,
      totalPages: 2,
    });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 1, take: 1 }),
    );
  });

  test('Should handle NaN page and take with fallback defaults', async () => {
    mockFindMany.mockResolvedValue(prismaBanners);
    mockCount.mockResolvedValue(2);

    const response = await fetchHeroBannersAction({
      page: Number('lorem'),
      take: Number('ipsum'),
    });

    expect(response.ok).toBe(true);
    expect(response.heroBanners).toHaveLength(2);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 12 }),
    );
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
    });
  });

  test('Should return empty array when no banners match', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const response = await fetchHeroBannersAction();

    expect(response.ok).toBe(true);
    expect(response.heroBanners).toHaveLength(0);
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 0,
    });
  });

  test('Should return error when database throws', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchHeroBannersAction();

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.heroBanners).toHaveLength(0);
    expect(response.pagination).toBe(null);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchHeroBannersAction();

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.heroBanners).toHaveLength(0);
    expect(response.pagination).toBe(null);
  });
});
