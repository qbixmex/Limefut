const { mockFindMany, mockCount } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockCount: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    customPage: {
      findMany: mockFindMany,
      count: mockCount,
    },
  },
}));

import { fetchPagesAction } from '@/app/admin/paginas/(actions)/fetchPagesAction';
import { customPagesMock } from '../mocks/custom-pages.mock';

describe('Tests on fetchPagesAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockFindMany.mockResolvedValue(customPagesMock);
    mockCount.mockResolvedValue(customPagesMock.length);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return the pages with pagination', async () => {
    const response = await fetchPagesAction({ page: 1, take: 12, searchTerm: '' });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/obtenidas correctamente/i);
    expect(response.customPages).toEqual(customPagesMock);
    expect(response.pagination).toEqual({ currentPage: 1, totalPages: 1 });
  });

  test('Should apply the search filter when a term is provided', async () => {
    await fetchPagesAction({ page: 1, take: 12, searchTerm: 'prueba' });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            {
              title: {
                contains: 'prueba',
                mode: 'insensitive',
              },
            },
          ],
        },
      }),
    );
  });

  test('Should compute the skip based on the page and take', async () => {
    await fetchPagesAction({ page: 3, take: 12 });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 12, skip: 24 }),
    );
  });

  test('Should compute the total pages from the count', async () => {
    mockCount.mockResolvedValue(25);

    const response = await fetchPagesAction({ page: 1, take: 12 });

    expect(response.pagination.totalPages).toBe(3);
  });

  test('Should fallback to default pagination when page is NaN', async () => {
    const response = await fetchPagesAction({ page: Number('lorem'), take: 12 });

    expect(response.pagination.currentPage).toBe(1);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0 }),
    );
  });

  test('Should fallback to default take when it is NaN', async () => {
    await fetchPagesAction({ page: 1, take: Number('lorem') });

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 12 }),
    );
  });

  test('Should return the error message when the query throws an Error', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchPagesAction({ page: 1, take: 12 });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.customPages).toEqual([]);
  });

  test('Should return a generic error on unexpected value', async () => {
    mockFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchPagesAction({ page: 1, take: 12 });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.customPages).toEqual([]);
  });
});
