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

  test('Should return error when authenticatedUserId is undefined', async () => {
    const response = await fetchCategoryAction({
      authenticatedUserId: undefined,
      authenticatedUserRoles: ['user', 'admin'],
      categoryId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('autentificado');
    expect(response.category).toBe(null);
  });

  test('Should return error when user does not have admin role', async () => {
    const response = await fetchCategoryAction({
      authenticatedUserId: 'ecc10b39-fb57-49d6-856b-31c4098be95a',
      authenticatedUserRoles: ['user'],
      categoryId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(response.category).toBe(null);
  });

  test('Should not allow to fetch a category if roles is null', async () => {
    const response = await fetchCategoryAction({
      authenticatedUserId: 'ecc10b39-fb57-49d6-856b-31c4098be95a',
      authenticatedUserRoles: null,
      categoryId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(response.category).toBe(null);
  });

  test('Should return error when category is not found', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await fetchCategoryAction({
      authenticatedUserId: 'dbcf3107-c2bb-4f9f-ba4d-152ac918d93c',
      authenticatedUserRoles: ['user', 'admin'],
      categoryId,
    });

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

    const response = await fetchCategoryAction({
      authenticatedUserId: 'dbcf3107-c2bb-4f9f-ba4d-152ac918d93c',
      authenticatedUserRoles: ['user', 'admin'],
      categoryId,
    });

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

    const response = await fetchCategoryAction({
      authenticatedUserId: 'dbcf3107-c2bb-4f9f-ba4d-152ac918d93c',
      authenticatedUserRoles: ['user', 'admin'],
      categoryId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('No se pudo obtener la categoría');
    expect(response.category).toBe(null);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindFirst.mockRejectedValue('Unexpected string error');

    const response = await fetchCategoryAction({
      authenticatedUserId: 'dbcf3107-c2bb-4f9f-ba4d-152ac918d93c',
      authenticatedUserRoles: ['user', 'admin'],
      categoryId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error inesperado');
    expect(response.category).toBe(null);
  });
});
