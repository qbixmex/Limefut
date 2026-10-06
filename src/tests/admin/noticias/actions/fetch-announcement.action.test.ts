const { mockFindFirst } = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    announcement: {
      findFirst: mockFindFirst,
    },
  },
}));

import { fetchAnnouncementAction } from '@/app/admin/noticias/(actions)/fetchAnnouncementAction';
import prisma from '@/lib/prisma';
import { announcementMock } from '../mocks/announcement.mock';

const announcementId = announcementMock.id;

describe('Tests on fetchAnnouncementAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockFindFirst.mockResolvedValue(announcementMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return the announcement with the selected fields', async () => {
    const response = await fetchAnnouncementAction(announcementId);

    expect(response.ok).toBe(true);
    expect(response.message).toBe('Noticia obtenida correctamente');
    expect(response.announcement).toEqual(announcementMock);
    expect(prisma.announcement.findFirst).toHaveBeenCalledWith({
      where: { id: announcementId },
      select: {
        id: true,
        title: true,
        permalink: true,
        description: true,
        content: true,
        publishedDate: true,
        imageUrl: true,
        active: true,
      },
    });
  });

  test('Should return error when the announcement does not exist', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await fetchAnnouncementAction(announcementId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Noticia no encontrada');
    expect(response.announcement).toBe(null);
  });

  test('Should return error when the database throws an Error', async () => {
    mockFindFirst.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchAnnouncementAction(announcementId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No se pudo obtener la noticia,\n Revise los logs del servidor');
    expect(response.announcement).toBe(null);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindFirst.mockRejectedValue('Something unexpected');

    const response = await fetchAnnouncementAction(announcementId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado del servidor,\n Revise los logs del servidor');
    expect(response.announcement).toBe(null);
  });
});
