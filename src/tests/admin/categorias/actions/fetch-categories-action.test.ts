vi.mock('next/cache');

const { mockFindMany, mockCount } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockCount: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    category: {
      findMany: mockFindMany,
      count: mockCount,
    },
  },
}));

import { fetchCategoriesAction } from '@/app/admin/categorias/(actions)/fetch-categories.action';
import prisma from '@/lib/prisma';
import { categoriesMock } from '../mocks/categories.mock';

describe('Tests on fetch categories server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockFindMany.mockResolvedValue(categoriesMock);
    mockCount.mockResolvedValue(3);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should fetch categories with default pagination', async () => {
    const response = await fetchCategoriesAction();

    expect(response.ok).toBe(true);
    expect(response.message).toContain('obtenidas correctamente');
    expect(response.categories).toHaveLength(2);
    expect(response.pagination).not.toBeNull();
    expect(response.pagination?.currentPage).toBe(1);
    expect(response.pagination?.totalPages).toBe(1);

    expect(prisma.category.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { name: 'desc' },
      select: { id: true, name: true, permalink: true },
      take: 12,
      skip: 0,
    });
    expect(prisma.category.count).toHaveBeenCalledWith({ where: {} });
  });

  test('Should fetch categories with pagination (page 2, take 1)', async () => {
    mockFindMany.mockResolvedValue([categoriesMock[0]]);
    mockCount.mockResolvedValue(3);

    const response = await fetchCategoriesAction({ page: 2, take: 1 });

    expect(response.ok).toBe(true);
    expect(response.categories).toHaveLength(1);
    expect(response.pagination?.currentPage).toBe(2);
    expect(response.pagination?.totalPages).toBe(3);

    expect(prisma.category.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { name: 'desc' },
      select: { id: true, name: true, permalink: true },
      take: 1,
      skip: 1,
    });
  });

  test('Should fetch categories with search by name', async () => {
    mockFindMany.mockResolvedValue(categoriesMock);
    mockCount.mockResolvedValue(2);

    const response = await fetchCategoriesAction({ searchTerm: 'secundaria' });

    expect(response.ok).toBe(true);
    expect(response.categories).toHaveLength(2);

    response.categories.forEach((category, index) => {
      expect(category.id).toBe(categoriesMock[index].id);
      expect(category.name).toBe(categoriesMock[index].name);
      expect(category.permalink).toBe(categoriesMock[index].permalink);
    });

    expect(prisma.category.findMany).toHaveBeenCalledWith({
      where: {
        name: { contains: 'secundaria', mode: 'insensitive' },
      },
      orderBy: { name: 'desc' },
      select: { id: true, name: true, permalink: true },
      take: 12,
      skip: 0,
    });
    expect(prisma.category.count).toHaveBeenCalledWith({
      where: { name: { contains: 'secundaria', mode: 'insensitive' } },
    });
  });

  test('Should return error on db error', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchCategoriesAction();

    expect(response.ok).toBe(false);
    expect(response.message).toContain('DB connection failed');
    expect(response.categories).toEqual([]);
    expect(response.pagination).toBe(null);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindMany.mockRejectedValue('Unexpected string error');

    const response = await fetchCategoriesAction();

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error inesperado');
    expect(response.categories).toEqual([]);
    expect(response.pagination).toBe(null);
  });
});
