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

import { updateCategoryAction } from '@/app/admin/categorias/(actions)/update-category.action';

const categoryId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('name', 'Primaria Femenil');
  formData.append('permalink', 'primaria-femenil');
  return formData;
};

const mockUpdatedCategory = {
  id: categoryId,
  name: 'Primaria Femenil',
  permalink: 'primaria-femenil',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockTx = {
  category: { count: vi.fn(), update: vi.fn() },
  field: { count: vi.fn() },
};

describe('Tests on update category server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockTx.category.count.mockResolvedValue(1);
    mockTx.field.count.mockResolvedValue(0);
    mockTx.category.update.mockResolvedValue(mockUpdatedCategory);
    mockTransaction.mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when authenticatedUserId is undefined', async () => {
    const response = await updateCategoryAction({
      authenticatedUserId: undefined,
      authenticatedUserRoles: ['admin'],
      categoryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('autentificado');
    expect(response.category).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    const response = await updateCategoryAction({
      authenticatedUserId: 'ecc10b39-fb57-49d6-856b-31c4098be95a',
      authenticatedUserRoles: ['user'],
      categoryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(response.category).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should not allow to update a category if roles is null', async () => {
    const response = await updateCategoryAction({
      authenticatedUserId: 'ecc10b39-fb57-49d6-856b-31c4098be95a',
      authenticatedUserRoles: null,
      categoryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(response.category).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should not allow to update a category if roles are empty', async () => {
    const response = await updateCategoryAction({
      authenticatedUserId: '19fafe1d-6847-450c-a5a7-80f61c80ed4f',
      authenticatedUserRoles: [],
      categoryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(response.category).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when zod validation fails (short name)', async () => {
    const formData = validFormData();
    formData.set('name', 'ab');

    const response = await updateCategoryAction({
      authenticatedUserId: '7ab083c7-9389-4842-8735-1dd283eaf3c4',
      authenticatedUserRoles: ['user', 'admin'],
      categoryId,
      formData,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('nombre');
    expect(response.category).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when category does not exist', async () => {
    mockTx.category.count.mockResolvedValue(0);

    const response = await updateCategoryAction({
      authenticatedUserId: 'dbcf3107-c2bb-4f9f-ba4d-152ac918d93c',
      authenticatedUserRoles: ['user', 'admin'],
      categoryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('no existe');
    expect(response.category).toBe(null);
    expect(mockTx.category.update).not.toHaveBeenCalled();
  });

  test('Should return error when permalink is duplicated (excluding current id)', async () => {
    mockTx.category.count.mockResolvedValue(1);
    mockTx.field.count.mockResolvedValue(1);

    const response = await updateCategoryAction({
      authenticatedUserId: 'dbcf3107-c2bb-4f9f-ba4d-152ac918d93c',
      authenticatedUserRoles: ['user', 'admin'],
      categoryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('enlace permanente ya existe');
    expect(response.category).toBe(null);
    expect(mockTx.category.update).not.toHaveBeenCalled();
  });

  test('Should update a category successfully', async () => {
    mockTx.category.count.mockResolvedValue(1);
    mockTx.field.count.mockResolvedValue(0);
    mockTx.category.update.mockResolvedValue(mockUpdatedCategory);

    const response = await updateCategoryAction({
      authenticatedUserId: 'dbcf3107-c2bb-4f9f-ba4d-152ac918d93c',
      authenticatedUserRoles: ['user', 'admin'],
      categoryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(true);
    expect(response.message).toContain('actualizada');
    expect(response.category).not.toBe(null);
    expect(response.category?.id).toBe(mockUpdatedCategory.id);
    expect(response.category?.name).toBe(mockUpdatedCategory.name);
    expect(response.category?.permalink).toBe(mockUpdatedCategory.permalink);

    expect(mockTransaction).toHaveBeenCalled();
    expect(mockTx.category.count).toHaveBeenCalledWith({
      where: { id: categoryId },
    });
    expect(mockTx.field.count).toHaveBeenCalledWith({
      where: {
        id: { not: categoryId },
        permalink: 'primaria-femenil',
      },
    });
    expect(mockTx.category.update).toHaveBeenCalledWith({
      where: { id: categoryId },
      data: {
        name: 'Primaria Femenil',
        permalink: 'primaria-femenil',
      },
      select: {
        id: true,
        name: true,
        permalink: true,
      },
    });
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTx.category.count.mockResolvedValue(1);
    mockTx.field.count.mockResolvedValue(0);
    mockTx.category.update.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { target: ['name', 'permalink'] },
      }),
    );

    const response = await updateCategoryAction({
      authenticatedUserId: '987df461-89c3-4050-bf44-4d4dc4a3e9a1',
      authenticatedUserRoles: ['user', 'admin'],
      categoryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('campos duplicados');
    expect(response.category).toBe(null);
  });

  test('Should return error on prisma known error (P2003)', async () => {
    mockTx.category.count.mockResolvedValue(1);
    mockTx.field.count.mockResolvedValue(0);
    mockTx.category.update.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
      }),
    );

    const response = await updateCategoryAction({
      authenticatedUserId: 'fdbd8d2f-ece3-4cb7-9417-b3e4b4086399',
      authenticatedUserRoles: ['user', 'admin'],
      categoryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error al crear la categoría');
    expect(response.category).toBe(null);
  });

  test('Should return error on unexpected error inside transaction', async () => {
    mockTx.category.count.mockResolvedValue(1);
    mockTx.field.count.mockResolvedValue(0);
    mockTx.category.update.mockRejectedValue(new Error('Something went wrong'));

    const response = await updateCategoryAction({
      authenticatedUserId: '14b74b98-bba8-4798-be65-a002fb1912d9',
      authenticatedUserRoles: ['user', 'admin'],
      categoryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error inesperado');
    expect(response.category).toBe(null);
  });

  test('Should return error on unexpected error outside transaction', async () => {
    mockTransaction.mockRejectedValue(new Error('Transaction failed'));

    const response = await updateCategoryAction({
      authenticatedUserId: '14b74b98-bba8-4798-be65-a002fb1912d9',
      authenticatedUserRoles: ['user', 'admin'],
      categoryId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error inesperado');
    expect(response.category).toBe(null);
  });
});
