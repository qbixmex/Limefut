const { MockPrismaClientKnownRequestError, mockCount, mockDelete } = vi.hoisted(() => {
  class MockPrismaClientKnownRequestError extends Error {
    code: string;
    meta?: Record<string, unknown>;
    constructor(
      message: string,
      options: { code: string; meta?: Record<string, unknown> },
    ) {
      super(message);
      this.name = 'PrismaClientKnownRequestError';
      this.code = options.code;
      this.meta = options.meta;
    }
  }
  return {
    MockPrismaClientKnownRequestError,
    mockCount: vi.fn(),
    mockDelete: vi.fn(),
  };
});

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    category: {
      count: mockCount,
      delete: mockDelete,
    },
  },
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { deleteCategoryAction } from '@/app/admin/categorias/(actions)/delete-category.action';

const categoryId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

describe('Tests on delete category server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockCount.mockResolvedValue(1);
    mockDelete.mockResolvedValue({ id: categoryId });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when authenticatedUserId is undefined', async () => {
    const response = await deleteCategoryAction({
      categoryId,
      authenticatedUserId: undefined,
      authenticatedUserRoles: ['admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('autentificado');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    const response = await deleteCategoryAction({
      categoryId,
      authenticatedUserId: 'ecc10b39-fb57-49d6-856b-31c4098be95a',
      authenticatedUserRoles: ['user'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when roles is null', async () => {
    const response = await deleteCategoryAction({
      categoryId,
      authenticatedUserId: 'ecc10b39-fb57-49d6-856b-31c4098be95a',
      authenticatedUserRoles: null,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when roles are empty', async () => {
    const response = await deleteCategoryAction({
      categoryId,
      authenticatedUserId: '19fafe1d-6847-450c-a5a7-80f61c80ed4f',
      authenticatedUserRoles: [],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when category does not exist', async () => {
    mockCount.mockResolvedValue(0);

    const response = await deleteCategoryAction({
      categoryId,
      authenticatedUserId: 'dbcf3107-c2bb-4f9f-ba4d-152ac918d93c',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('no existe');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should delete a category successfully', async () => {
    const response = await deleteCategoryAction({
      categoryId,
      authenticatedUserId: 'dbcf3107-c2bb-4f9f-ba4d-152ac918d93c',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(true);
    expect(response.message).toContain('eliminada correctamente');

    expect(mockCount).toHaveBeenCalledWith({
      where: { id: categoryId },
    });
    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: categoryId },
    });
  });

  test('Should return error on prisma known error (P2002)', async () => {
    mockDelete.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { target: ['name'] },
      }),
    );

    const response = await deleteCategoryAction({
      categoryId,
      authenticatedUserId: '987df461-89c3-4050-bf44-4d4dc4a3e9a1',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Unique constraint');
  });

  test('Should return error on generic error', async () => {
    mockDelete.mockRejectedValue(new Error('Database connection lost'));

    const response = await deleteCategoryAction({
      categoryId,
      authenticatedUserId: '14b74b98-bba8-4798-be65-a002fb1912d9',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('logs del servidor');
  });

  test('Should return error on unknown error', async () => {
    mockDelete.mockRejectedValue('Some non-error object');

    const response = await deleteCategoryAction({
      categoryId,
      authenticatedUserId: 'a452830b-d97e-4100-b4ae-3da6bb3b758c',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error del servidor no esperado');
  });
});
