const {
  MockPrismaClientKnownRequestError,
  mockTransaction,
  mockGetSession,
} = vi.hoisted(() => {
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
    mockGetSession: vi.fn(),
  };
});

vi.mock('next/cache');

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/get-session', () => ({
  getSession: mockGetSession,
  requireAdmin: async () => {
    const session = await mockGetSession();

    if (!session?.user) {
      return {
        ok: false,
        message: 'Debes estar autentificado para realizar esta acción',
      };
    }

    if (!session.user.roles?.includes('admin')) {
      return {
        ok: false,
        message: 'No tienes permisos administrativos para realizar esta acción',
      };
    }

    return { ok: true, session };
  },
}));

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

import { updateFieldAction } from '@/app/admin/canchas/(actions)/updateFieldAction';
import { fieldMock } from '../mocks/field.mock';

const fieldId = fieldMock.id;

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('name', 'Estadio Azteca');
  formData.append('permalink', 'estadio-azteca');
  formData.append('city', 'Ciudad de México');
  formData.append('state', 'CDMX');
  formData.append('country', 'México');
  formData.append('address', 'Calzada de Tlalpan 3465');
  formData.append('map', 'https://maps.app.goo.gl/eYugNe5Cay9cFwex9');
  return formData;
};

const mockTx = {
  field: {
    count: vi.fn(),
    update: vi.fn(),
  },
};

describe('Tests on updateFieldAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
    mockTx.field.count.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    mockTx.field.update.mockResolvedValue(fieldMock);
    mockTransaction.mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateFieldAction({
      fieldId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(response.field).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '7c8a28d0-8d51-4981-b024-cba74821f8b4',
        roles: ['user'],
      },
    });

    const response = await updateFieldAction({
      fieldId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(response.field).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '2aaae461-19f9-4e90-b237-12556afd3073',
        roles: null,
      },
    });

    const response = await updateFieldAction({
      fieldId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(response.field).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: 'fabcb074-6129-4e01-ab16-eed1e0f5f4fd',
        roles: [],
      },
    });

    const response = await updateFieldAction({
      fieldId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.field).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when zod validation fails (short name)', async () => {
    const formData = validFormData();
    formData.set('name', 'ab');

    const response = await updateFieldAction({ fieldId, formData });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/nombre/i);
    expect(response.field).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when field does not exist', async () => {
    mockTx.field.count.mockReset();
    mockTx.field.count.mockResolvedValueOnce(0);

    const response = await updateFieldAction({
      fieldId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe o ha sido eliminada/i);
    expect(response.field).toBe(null);
    expect(mockTx.field.update).not.toHaveBeenCalled();
  });

  test('Should return error when permalink already exists', async () => {
    mockTx.field.count.mockReset();
    mockTx.field.count.mockResolvedValueOnce(1).mockResolvedValueOnce(1);

    const response = await updateFieldAction({
      fieldId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El enlace permanente ya existe, elija otro');
    expect(response.field).toBe(null);
    expect(mockTx.field.update).not.toHaveBeenCalled();
  });

  test('Should update a field successfully', async () => {
    const response = await updateFieldAction({
      fieldId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/actualizada correctamente/i);
    expect(response.field).not.toBe(null);
    expect(response.field?.id).toBe(fieldMock.id);

    expect(mockTx.field.count).toHaveBeenNthCalledWith(1, {
      where: { id: fieldId },
    });
    expect(mockTx.field.count).toHaveBeenNthCalledWith(2, {
      where: {
        permalink: 'estadio-azteca',
        id: { not: fieldId },
      },
    });
    expect(mockTx.field.update).toHaveBeenCalledOnce();
    expect(mockTx.field.update).toHaveBeenCalledWith({
      where: { id: fieldId },
      data: {
        name: 'Estadio Azteca',
        permalink: 'estadio-azteca',
        city: 'Ciudad de México',
        state: 'CDMX',
        country: 'México',
        address: 'Calzada de Tlalpan 3465',
        map: 'https://maps.app.goo.gl/eYugNe5Cay9cFwex9',
      },
    });
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTx.field.update.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'Field', target: ['permalink'] },
      }),
    );

    const response = await updateFieldAction({
      fieldId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/campos duplicados/i);
    expect(response.field).toBe(null);
  });

  test('Should return generic prisma error for non-P2002 codes', async () => {
    mockTx.field.update.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'Field' },
      }),
    );

    const response = await updateFieldAction({
      fieldId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al crear la cancha/i);
    expect(response.field).toBe(null);
  });

  test('Should return error on unexpected Error inside transaction', async () => {
    mockTx.field.update.mockRejectedValue(new Error('Something went wrong'));

    const response = await updateFieldAction({
      fieldId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al crear la cancha/i);
    expect(response.field).toBe(null);
  });

  test('Should return error on unexpected non-error value inside transaction', async () => {
    mockTx.field.update.mockRejectedValue('Something unexpected');

    const response = await updateFieldAction({
      fieldId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.field).toBe(null);
  });

  test('Should return error when transaction itself rejects', async () => {
    mockTransaction.mockRejectedValue(new Error('Infrastructure failure'));

    const response = await updateFieldAction({
      fieldId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.field).toBe(null);
  });
});
