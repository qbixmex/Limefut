const { MockPrismaClientKnownRequestError, mockTransaction } = vi.hoisted(() => {
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
    mockTransaction: vi.fn(),
  };
});

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    $transaction: mockTransaction,
  },
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { createCategoryAction } from '@/app/admin/categorias/(actions)/create-category.action';

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('name', 'Category Test');
  formData.append('permalink', 'category-test');
  return formData;
};

const mockCreatedCategory = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  name: 'Categoría Test',
  permalink: 'category-test',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockTx = {
  field: { count: vi.fn() },
  category: { create: vi.fn() },
};

describe('Tests on create category server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockTx.field.count.mockResolvedValue(0);
    mockTx.category.create.mockResolvedValue(mockCreatedCategory);
    mockTransaction.mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when authenticatedUserId is undefined', async () => {
    const response = await createCategoryAction({
      authenticatedUserId: undefined,
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('autentificado');
    expect(response.category).toBeNull();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    const response = await createCategoryAction({
      authenticatedUserId: 'ecc10b39-fb57-49d6-856b-31c4098be95a',
      authenticatedUserRoles: ['user'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(response.category).toBeNull();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should not allow to create a category if roles is null', async () => {
    const response = await createCategoryAction({
      authenticatedUserId: 'ecc10b39-fb57-49d6-856b-31c4098be95a',
      authenticatedUserRoles: null,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(response.category).toBeNull();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should not allow to create a category if roles are empty', async () => {
    const response = await createCategoryAction({
      authenticatedUserId: '19fafe1d-6847-450c-a5a7-80f61c80ed4f',
      authenticatedUserRoles: [],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(response.category).toBeNull();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when zod validation fails (short name)', async () => {
    const formData = validFormData();
    formData.set('name', 'ab');

    const response = await createCategoryAction({
      authenticatedUserId: '7ab083c7-9389-4842-8735-1dd283eaf3c4',
      authenticatedUserRoles: ['user', 'admin'],
      formData,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('nombre');
    expect(response.category).toBeNull();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when zod validation fails (permalink with spaces)', async () => {
    const formData = validFormData();
    formData.set('permalink', 'mi permalink');

    const response = await createCategoryAction({
      authenticatedUserId: '7ab083c7-9389-4842-8735-1dd283eaf3c4',
      authenticatedUserRoles: ['user', 'admin'],
      formData,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('espacios');
    expect(response.category).toBeNull();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when permalink already exists in database', async () => {
    mockTx.field.count.mockResolvedValue(1);

    const response = await createCategoryAction({
      authenticatedUserId: 'dbcf3107-c2bb-4f9f-ba4d-152ac918d93c',
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('enlace permanente ya existe');
    expect(response.category).toBe(null);
    expect(mockTx.category.create).not.toHaveBeenCalled();
  });

  test('Should create a category successfully', async () => {
    const response = await createCategoryAction({
      authenticatedUserId: 'dbcf3107-c2bb-4f9f-ba4d-152ac918d93c',
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(true);
    expect(response.message).toContain('creada satisfactoriamente');
    expect(response.category).not.toBe(null);
    expect(response.category?.id).toBe(mockCreatedCategory.id);
    expect(response.category?.name).toBe(mockCreatedCategory.name);
    expect(response.category?.permalink).toBe(mockCreatedCategory.permalink);

    expect(mockTransaction).toHaveBeenCalled();
    expect(mockTx.field.count).toHaveBeenCalledOnce();
    expect(mockTx.category.create).toHaveBeenCalledOnce();
    expect(mockTx.category.create).toHaveBeenCalledWith({
      data: { name: 'Category Test', permalink: 'category-test' },
    });
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { target: ['name', 'permalink'] },
      }),
    );

    const response = await createCategoryAction({
      authenticatedUserId: '987df461-89c3-4050-bf44-4d4dc4a3e9a1',
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('campos duplicados');
    expect(response.category).toBe(null);
  });

  test('Should return error on prisma known error (P2003)', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
      }),
    );

    const response = await createCategoryAction({
      authenticatedUserId: 'fdbd8d2f-ece3-4cb7-9417-b3e4b4086399',
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error al crear la categoría');
    expect(response.category).toBe(null);
  });

  test('Should return error on unexpected error', async () => {
    mockTransaction.mockRejectedValue(new Error('Something went wrong'));

    const response = await createCategoryAction({
      authenticatedUserId: '14b74b98-bba8-4798-be65-a002fb1912d9',
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error inesperado');
    expect(response.category).toBe(null);
  });
});
