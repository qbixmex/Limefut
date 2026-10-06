const { mockFindMany, mockCount } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockCount: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    announcement: {
      findMany: mockFindMany,
      count: mockCount,
    },
  },
}));

import { fetchAnnouncementsAction } from '@/app/admin/noticias/(actions)/fetchAnnouncementsAction';
import prisma from '@/lib/prisma';
import { announcementsMock } from '../mocks/announcements.mock';

describe('Tests on fetchAnnouncementsAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockFindMany.mockResolvedValue(announcementsMock);
    mockCount.mockResolvedValue(announcementsMock.length);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should fetch announcements with default pagination', async () => {
    const response = await fetchAnnouncementsAction({});

    expect(response.ok).toBe(true);
    expect(response.message).toBe('Los patrocinadores fueron obtenidos correctamente');
    expect(response.announcements).toEqual(announcementsMock);
    expect(prisma.announcement.findMany).toHaveBeenCalledWith({
      where: {},
      select: {
        id: true,
        title: true,
        permalink: true,
        publishedDate: true,
        active: true,
      },
      orderBy: { publishedDate: 'asc' },
      take: 12,
      skip: 0,
    });
    expect(prisma.announcement.count).toHaveBeenCalledWith({ where: {} });
    expect(response.pagination).toEqual({ currentPage: 1, totalPages: 1 });
  });

  test('Should search announcements by title', async () => {
    mockFindMany.mockResolvedValue([announcementsMock[0]]);
    mockCount.mockResolvedValue(1);

    const response = await fetchAnnouncementsAction({ searchTerm: 'apertura' });

    expect(response.ok).toBe(true);
    expect(response.announcements).toHaveLength(1);
    expect(prisma.announcement.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [{ title: { contains: 'apertura', mode: 'insensitive' } }],
        },
      }),
    );
    expect(prisma.announcement.count).toHaveBeenCalledWith({
      where: {
        OR: [{ title: { contains: 'apertura', mode: 'insensitive' } }],
      },
    });
  });

  test('Should paginate results', async () => {
    mockFindMany.mockResolvedValue([announcementsMock[1]]);
    mockCount.mockResolvedValue(3);

    const response = await fetchAnnouncementsAction({ page: 2, take: 1 });

    expect(response.ok).toBe(true);
    expect(response.announcements).toHaveLength(1);
    expect(response.pagination).toEqual({ currentPage: 2, totalPages: 3 });
    expect(prisma.announcement.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 1, take: 1 }),
    );
  });

  test('Should fallback to defaults when page and take are NaN', async () => {
    const response = await fetchAnnouncementsAction({
      page: Number('lorem'),
      take: Number('ipsum'),
    });

    expect(response.ok).toBe(true);
    expect(prisma.announcement.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 12 }),
    );
    expect(response.pagination).toEqual({ currentPage: 1, totalPages: 1 });
  });

  test('Should return an empty list when there are no announcements', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const response = await fetchAnnouncementsAction({});

    expect(response.ok).toBe(true);
    expect(response.announcements).toEqual([]);
    expect(response.pagination).toEqual({ currentPage: 1, totalPages: 0 });
  });

  test('Should return error when database throws an Error', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchAnnouncementsAction({});

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No se pudo obtener las noticias');
    expect(response.announcements).toEqual([]);
    expect(response.pagination).toBe(null);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchAnnouncementsAction({});

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
    expect(response.announcements).toEqual([]);
    expect(response.pagination).toBe(null);
  });
});
