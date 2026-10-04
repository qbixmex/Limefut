const { mockFindUnique } = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    gallery: {
      findUnique: mockFindUnique,
    },
  },
}));

import { fetchGalleryAction } from '@/app/admin/galerias/(actions)/gallery/fetch-gallery.action';
import prisma from '@/lib/prisma';
import { galleryMock } from '../../mocks/gallery.mock';

const galleryId = galleryMock.id;

describe('Tests on fetchGalleryAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockFindUnique.mockResolvedValue(galleryMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return the gallery with its images ordered by position', async () => {
    const response = await fetchGalleryAction(galleryId);

    expect(response.ok).toBe(true);
    expect(response.message).toBe('Galería obtenida correctamente');
    expect(response.gallery).toEqual(galleryMock);
    expect(prisma.gallery.findUnique).toHaveBeenCalledWith({
      where: { id: galleryId },
      select: {
        id: true,
        title: true,
        permalink: true,
        galleryDate: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        images: {
          select: {
            id: true,
            title: true,
            imageUrl: true,
            active: true,
            position: true,
          },
          orderBy: { position: 'asc' },
        },
      },
    });
  });

  test('Should return error when gallery does not exist', async () => {
    mockFindUnique.mockResolvedValue(null);

    const response = await fetchGalleryAction(galleryId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Galería no encontrada');
    expect(response.gallery).toBe(null);
  });

  test('Should return error when database throws an Error', async () => {
    mockFindUnique.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchGalleryAction(galleryId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No se pudo obtener la galería,\n¡ Revise los logs del servidor');
    expect(response.gallery).toBe(null);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindUnique.mockRejectedValue('Something unexpected');

    const response = await fetchGalleryAction(galleryId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado del servidor,\n¡ Revise los logs del servidor');
    expect(response.gallery).toBe(null);
  });
});
