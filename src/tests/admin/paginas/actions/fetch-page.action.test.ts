const { mockFindFirst } = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    customPage: {
      findFirst: mockFindFirst,
    },
  },
}));

import { fetchPageAction } from '@/app/admin/paginas/(actions)/fetchPageAction';
import { customPageMock } from '../mocks/custom-page.mock';

const pageId = customPageMock.id;

describe('Tests on fetchPageAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return the page mapped with images', async () => {
    const dbPage = {
      ...customPageMock,
      images: customPageMock.images.map(({ id, imageUrl, resourceId }) => ({
        id,
        imageUrl,
        publicId: resourceId,
      })),
    };
    mockFindFirst.mockResolvedValue(dbPage);

    const response = await fetchPageAction(pageId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/página obtenida correctamente/i);
    expect(response.page?.id).toBe(pageId);
    expect(response.page?.images).toEqual(
      customPageMock.images.map(({ id, imageUrl, resourceId }) => ({
        id,
        imageUrl,
        resourceId,
      })),
    );
    expect(mockFindFirst).toHaveBeenCalledOnce();
  });

  test('Should return error when page is not found', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await fetchPageAction(pageId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/página no encontrada/i);
    expect(response.page).toBe(null);
  });

  test('Should return error when the database throws an Error', async () => {
    mockFindFirst.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchPageAction(pageId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo obtener la página/i);
    expect(response.page).toBe(null);
  });

  test('Should return error on unexpected value', async () => {
    mockFindFirst.mockRejectedValue('Something unexpected');

    const response = await fetchPageAction(pageId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.page).toBe(null);
  });
});
