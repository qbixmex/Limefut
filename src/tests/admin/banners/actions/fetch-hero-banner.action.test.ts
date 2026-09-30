const { mockFindFirst } = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    heroBanner: {
      findFirst: mockFindFirst,
    },
  },
}));

import { fetchHeroBannerAction } from '@/app/admin/banners/(actions)/fetch-hero-banner.action';
import { heroBannerMock } from '../mocks/hero-banner.mock';

const bannerId = heroBannerMock.id;

describe('Tests on fetchHeroBannerAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return the banner', async () => {
    mockFindFirst.mockResolvedValue(heroBannerMock);

    const response = await fetchHeroBannerAction(bannerId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/banner obtenido correctamente/i);
    expect(response.heroBanner).toEqual(heroBannerMock);
    expect(mockFindFirst).toHaveBeenCalledOnce();
    expect(mockFindFirst).toHaveBeenCalledWith({ where: { id: bannerId } });
  });

  test('Should return error when banner is not found', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await fetchHeroBannerAction(bannerId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no encontrado/i);
    expect(response.heroBanner).toBe(null);
  });

  test('Should return error on database failure', async () => {
    mockFindFirst.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchHeroBannerAction(bannerId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo obtener el banner/i);
    expect(response.heroBanner).toBe(null);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindFirst.mockRejectedValue('Something unexpected');

    const response = await fetchHeroBannerAction(bannerId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.heroBanner).toBe(null);
  });
});
