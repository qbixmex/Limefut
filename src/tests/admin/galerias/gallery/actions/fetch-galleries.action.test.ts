const { mockFindMany, mockCount } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockCount: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    gallery: {
      findMany: mockFindMany,
      count: mockCount,
    },
  },
}));

import { fetchGalleriesAction } from '@/app/admin/galerias/(actions)/gallery/fetch-galleries.action';
import prisma from '@/lib/prisma';
import { galleriesMock, prismaGalleriesMock } from '../../mocks/galleries.mock';

describe('Tests on fetchGalleriesAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockFindMany.mockResolvedValue(prismaGalleriesMock);
    mockCount.mockResolvedValue(galleriesMock.length);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should fetch galleries with default pagination and map imagesCount', async () => {
    const response = await fetchGalleriesAction({});

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/galerías fueron obtenidas/i);
    expect(response.galleries).toHaveLength(galleriesMock.length);

    response.galleries.forEach((gallery, index) => {
      expect(gallery.id).toBe(galleriesMock[index].id);
      expect(gallery.title).toBe(galleriesMock[index].title);
      expect(gallery.permalink).toBe(galleriesMock[index].permalink);
      expect(gallery.imagesCount).toBe(galleriesMock[index].imagesCount);
    });

    expect(prisma.gallery.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { title: 'asc' },
      select: {
        id: true,
        title: true,
        permalink: true,
        galleryDate: true,
        active: true,
        _count: { select: { images: true } },
      },
      take: 12,
      skip: 0,
    });
    expect(prisma.gallery.count).toHaveBeenCalledWith({ where: {} });
    expect(response.pagination).toEqual({ currentPage: 1, totalPages: 1 });
  });

  test('Should search galleries by title', async () => {
    mockFindMany.mockResolvedValue([prismaGalleriesMock[0]]);
    mockCount.mockResolvedValue(1);

    const response = await fetchGalleriesAction({ searchTerm: 'apertura' });

    expect(response.ok).toBe(true);
    expect(response.galleries).toHaveLength(1);
    expect(prisma.gallery.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [{ title: { contains: 'apertura', mode: 'insensitive' } }],
        },
      }),
    );
    expect(prisma.gallery.count).toHaveBeenCalledWith({
      where: {
        OR: [{ title: { contains: 'apertura', mode: 'insensitive' } }],
      },
    });
  });

  test('Should paginate results', async () => {
    mockFindMany.mockResolvedValue([prismaGalleriesMock[1]]);
    mockCount.mockResolvedValue(3);

    const response = await fetchGalleriesAction({ page: 2, take: 1 });

    expect(response.ok).toBe(true);
    expect(response.galleries).toHaveLength(1);
    expect(response.pagination).toEqual({ currentPage: 2, totalPages: 3 });
    expect(prisma.gallery.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 1, take: 1 }),
    );
  });

  test('Should fallback to defaults when page and take are NaN', async () => {
    const response = await fetchGalleriesAction({
      page: Number('lorem'),
      take: Number('ipsum'),
    });

    expect(response.ok).toBe(true);
    expect(prisma.gallery.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 12 }),
    );
    expect(response.pagination).toEqual({ currentPage: 1, totalPages: 1 });
  });

  test('Should return an empty list when there are no galleries', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const response = await fetchGalleriesAction({});

    expect(response.ok).toBe(true);
    expect(response.galleries).toEqual([]);
    expect(response.pagination).toEqual({ currentPage: 1, totalPages: 0 });
  });

  test('Should return error when database throws an Error', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchGalleriesAction({});

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.galleries).toEqual([]);
    expect(response.pagination).toEqual({ currentPage: 0, totalPages: 0 });
  });

  test('Should return error on unexpected server error', async () => {
    mockFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchGalleriesAction({});

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado al obtener los equipos, revise los logs del servidor');
    expect(response.galleries).toEqual([]);
  });
});
