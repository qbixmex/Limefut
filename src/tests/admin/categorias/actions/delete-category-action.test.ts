const { MockPrismaClientKnownRequestError, mockCount, mockDelete, mockGetSession } = vi.hoisted(() => {
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
    mockGetSession: vi.fn(),
  };
});

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: mockGetSession,
    },
  },
}));

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
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
    mockCount.mockResolvedValue(1);
    mockDelete.mockResolvedValue({ id: categoryId });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await deleteCategoryAction({
      categoryId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ Debes estar autentificado para realizar esta acción !');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['user'] },
    });

    const response = await deleteCategoryAction({
      categoryId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when category does not exist', async () => {
    mockCount.mockResolvedValue(0);

    const response = await deleteCategoryAction({
      categoryId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('no existe');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should delete a category successfully', async () => {
    const response = await deleteCategoryAction({
      categoryId,
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
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Unique constraint');
  });

  test('Should return error on generic error', async () => {
    mockDelete.mockRejectedValue(new Error('Database connection lost'));

    const response = await deleteCategoryAction({
      categoryId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('logs del servidor');
  });

  test('Should return error on unknown error', async () => {
    mockDelete.mockRejectedValue('Some non-error object');

    const response = await deleteCategoryAction({
      categoryId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error del servidor no esperado');
  });
});
