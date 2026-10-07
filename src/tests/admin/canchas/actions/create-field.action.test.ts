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

import { createFieldAction } from '@/app/admin/canchas/(actions)/createFieldAction';
import { fieldMock } from '../mocks/field.mock';

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
    create: vi.fn(),
  },
};

describe('Tests on createFieldAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
    mockTx.field.count.mockResolvedValue(0);
    mockTx.field.create.mockResolvedValue(fieldMock);
    mockTransaction.mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await createFieldAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(response.field).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: 'feb4b76b-a25b-4fe9-b0c4-59e07ecd3de5',
        roles: ['user'],
      },
    });

    const response = await createFieldAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(response.field).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '2fec0fd0-9f34-4a29-84f7-c030ddd55dfd',
        roles: null,
      },
    });

    const response = await createFieldAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(response.field).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '28120270-3450-46e9-b3b4-cd71369ea436',
        roles: [],
      },
    });

    const response = await createFieldAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.field).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when zod validation fails (short name)', async () => {
    const formData = validFormData();
    formData.set('name', 'ab');

    const response = await createFieldAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/nombre/i);
    expect(response.field).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when permalink already exists', async () => {
    mockTx.field.count.mockResolvedValue(1);

    const response = await createFieldAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/enlace permanente ya existe/i);
    expect(response.field).toBe(null);
    expect(mockTx.field.count).toHaveBeenCalledWith({
      where: { permalink: 'estadio-azteca' },
    });
    expect(mockTx.field.create).not.toHaveBeenCalled();
  });

  test('Should create a field successfully', async () => {
    const response = await createFieldAction(validFormData());

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/creada satisfactoriamente/i);
    expect(response.field).not.toBe(null);
    expect(response.field?.id).toBe(fieldMock.id);
    expect(response.field?.name).toBe(fieldMock.name);

    expect(mockTx.field.count).toHaveBeenCalledWith({
      where: { permalink: 'estadio-azteca' },
    });
    expect(mockTx.field.create).toHaveBeenCalledOnce();
    expect(mockTx.field.create).toHaveBeenCalledWith({
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

  test('Should create a field without optional values', async () => {
    const formData = new FormData();
    formData.append('name', 'Estadio Azteca');
    formData.append('permalink', 'estadio-azteca');

    const response = await createFieldAction(formData);

    expect(response.ok).toBe(true);
    expect(mockTx.field.create).toHaveBeenCalledWith({
      data: {
        name: 'Estadio Azteca',
        permalink: 'estadio-azteca',
      },
    });
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'Field', target: ['permalink'] },
      }),
    );

    const response = await createFieldAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/campos duplicados/i);
    expect(response.field).toBe(null);
  });

  test('Should return generic prisma error for non-P2002 codes', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'Field' },
      }),
    );

    const response = await createFieldAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al crear la cancha/i);
    expect(response.field).toBe(null);
  });

  test('Should return error on unexpected Error', async () => {
    mockTransaction.mockRejectedValue(new Error('Something went wrong'));

    const response = await createFieldAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al crear la cancha/i);
    expect(response.field).toBe(null);
  });

  test('Should return error on unexpected non-error value', async () => {
    mockTransaction.mockRejectedValue('Something unexpected');

    const response = await createFieldAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.field).toBe(null);
  });
});
