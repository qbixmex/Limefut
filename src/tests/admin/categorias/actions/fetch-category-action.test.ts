vi.mock('next/cache');

const { mockFindFirst } = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    category: {
      findFirst: mockFindFirst,
    },
  },
}));

import { fetchCategoryAction } from '@/app/admin/categorias/(actions)/fetch-category.action';

const categoryId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

const mockCategory = {
  id: categoryId,
  name: 'Secundaria Masculina',
  permalink: 'secundaria-masculina',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('Tests on fetch category server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockFindFirst.mockResolvedValue(mockCategory);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when category is not found', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await fetchCategoryAction(categoryId);

    expect(response.ok).toBe(false);
    expect(response.message).toContain('no se encuentra');
    expect(response.category).toBe(null);
  });

  test('Should fetch a category successfully', async () => {
    const mockCategory = {
      id: categoryId,
      name: 'Secundaria Varonil',
      permalink: 'secundaria-varonil',
    };

    mockFindFirst.mockResolvedValue(mockCategory);

    const response = await fetchCategoryAction(categoryId);

    expect(response.ok).toBe(true);
    expect(response.message).toContain('obtenida correctamente');
    expect(response.category).not.toBe(null);
    expect(response.category?.id).toBe(mockCategory.id);
    expect(response.category?.name).toBe(mockCategory.name);
    expect(response.category?.permalink).toBe(mockCategory.permalink);

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: categoryId },
      select: {
        id: true,
        name: true,
        permalink: true,
      },
    });
  });

  test('Should return error on db error', async () => {
    mockFindFirst.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchCategoryAction(categoryId);

    expect(response.ok).toBe(false);
    expect(response.message).toContain('No se pudo obtener la categoría');
    expect(response.category).toBe(null);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindFirst.mockRejectedValue('Unexpected string error');

    const response = await fetchCategoryAction(categoryId);

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error inesperado');
    expect(response.category).toBe(null);
  });
});
