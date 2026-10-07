const { mockFindFirst } = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    video: {
      findFirst: mockFindFirst,
    },
  },
}));

import { fetchVideoAction } from '@/app/admin/videos/(actions)/fetchVideoAction';
import { Prisma } from '@/generated/prisma/client';
import prisma from '@/lib/prisma';
import { videoMock } from '../mocks/video.mock';

const videoId = videoMock.id;

describe('Tests on fetchVideoAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockFindFirst.mockResolvedValue(videoMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return the video without a select clause', async () => {
    const response = await fetchVideoAction(videoId);

    expect(response.ok).toBe(true);
    expect(response.message).toBe('Video obtenido correctamente');
    expect(response.video).toEqual(videoMock);
    expect(prisma.video.findFirst).toHaveBeenCalledWith({
      where: { id: videoId },
    });
  });

  test('Should return error when the video does not exist', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await fetchVideoAction(videoId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Video no encontrada');
    expect(response.video).toBe(null);
  });

  test('Should return error when the database throws an Error', async () => {
    mockFindFirst.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchVideoAction(videoId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No se pudo obtener el video, revise los logs del servidor');
    expect(response.video).toBe(null);
  });

  test('Should return error on a known Prisma request error', async () => {
    mockFindFirst.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Database error', {
        code: 'P2003',
        clientVersion: 'test',
        meta: { modelName: 'Video' },
      }),
    );

    const response = await fetchVideoAction(videoId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Hubo errores de base de datos, revise los logs del servidor');
    expect(response.video).toBe(null);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindFirst.mockRejectedValue('Something unexpected');

    const response = await fetchVideoAction(videoId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
    expect(response.video).toBe(null);
  });
});
