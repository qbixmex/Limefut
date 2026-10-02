const { mockFindMany } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    category: {
      findMany: mockFindMany,
    },
  },
}));

import { fetchCategoriesAction } from '@/app/admin/liguilla/(actions)/fetch-categories.action';
import { categoriesMock } from '../mocks/categories.mock';

describe('Tests on fetchCategoriesAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return all categories', async () => {
    mockFindMany.mockResolvedValue(categoriesMock);

    const response = await fetchCategoriesAction();

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/categorías fueron obtenidas/i);
    expect(response.categories).toEqual(categoriesMock);
    expect(mockFindMany).toHaveBeenCalledWith({
      orderBy: {
        name: 'desc',
      },
      select: {
        id: true,
        name: true,
        permalink: true,
      },
    });
  });

  test('Should return error when database throws an Error', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchCategoriesAction();

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.categories).toEqual([]);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchCategoriesAction();

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.categories).toEqual([]);
  });
});
