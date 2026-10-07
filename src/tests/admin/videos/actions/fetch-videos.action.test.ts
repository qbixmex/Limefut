const { mockFindMany, mockCount } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockCount: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    video: {
      findMany: mockFindMany,
      count: mockCount,
    },
  },
}));

import { fetchVideosAction } from '@/app/admin/videos/(actions)/fetchVideosAction';
import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { videosMock, videosPaginationMock } from '../mocks/videos.mock';

describe('Tests on fetchVideosAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockFindMany.mockResolvedValue(videosMock);
    mockCount.mockResolvedValue(videosMock.length);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should fetch videos with default pagination', async () => {
    const response = await fetchVideosAction({});

    expect(response.ok).toBe(true);
    expect(response.message).toBe('Los videos fueron obtenidos correctamente');
    expect(response.videos).toEqual(videosMock);
    expect(prisma.video.findMany).toHaveBeenCalledWith({
      where: {},
      select: {
        id: true,
        title: true,
        permalink: true,
        publishedDate: true,
        platform: true,
        active: true,
      },
      orderBy: { publishedDate: 'asc' },
      take: 12,
      skip: 0,
    });
    expect(prisma.video.count).toHaveBeenCalledWith({ where: {} });
    expect(response.pagination).toEqual(videosPaginationMock);
  });

  test('Should search videos by title', async () => {
    mockFindMany.mockResolvedValue([videosMock[0]]);
    mockCount.mockResolvedValue(1);

    const response = await fetchVideosAction({ searchTerm: 'apertura' });

    expect(response.ok).toBe(true);
    expect(response.videos).toHaveLength(1);
    expect(prisma.video.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [{ title: { contains: 'apertura', mode: 'insensitive' } }],
        },
      }),
    );
    expect(prisma.video.count).toHaveBeenCalledWith({
      where: {
        OR: [{ title: { contains: 'apertura', mode: 'insensitive' } }],
      },
    });
  });

  test('Should paginate results', async () => {
    mockFindMany.mockResolvedValue([videosMock[1]]);
    mockCount.mockResolvedValue(3);

    const response = await fetchVideosAction({ page: 2, take: 1 });

    expect(response.ok).toBe(true);
    expect(response.videos).toHaveLength(1);
    expect(response.pagination).toEqual({ currentPage: 2, totalPages: 3 });
    expect(prisma.video.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 1, take: 1 }),
    );
  });

  test('Should fallback to defaults when page and take are NaN', async () => {
    const response = await fetchVideosAction({
      page: Number('lorem'),
      take: Number('ipsum'),
    });

    expect(response.ok).toBe(true);
    expect(prisma.video.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 12 }),
    );
    expect(response.pagination).toEqual(videosPaginationMock);
  });

  test('Should return an empty list when there are no videos', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const response = await fetchVideosAction({});

    expect(response.ok).toBe(true);
    expect(response.videos).toEqual([]);
    expect(response.pagination).toEqual({ currentPage: 1, totalPages: 0 });
  });

  test('Should return error when database throws an Error', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchVideosAction({});

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No se pudieron obtener los videos, revise los logs del servidor');
    expect(response.videos).toEqual([]);
    expect(response.pagination).toBe(null);
  });

  test('Should return error on a known Prisma request error', async () => {
    mockFindMany.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Database error', {
        code: 'P2003',
        clientVersion: 'test',
        meta: { modelName: 'Video' },
      }),
    );

    const response = await fetchVideosAction({});

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Hubo errores de base de datos, revise los logs del servidor');
    expect(response.videos).toEqual([]);
    expect(response.pagination).toBe(null);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchVideosAction({});

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
    expect(response.videos).toEqual([]);
    expect(response.pagination).toBe(null);
  });
});
