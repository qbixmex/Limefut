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

import { createEmptyCustomPage } from '@/app/admin/paginas/(actions)/createEmptyCustomPage';

const mockTx = {
  customPage: {
    aggregate: vi.fn(),
    create: vi.fn(),
  },
};

describe('Tests on createEmptyCustomPage server action', () => {
  const testId = 'fd34c575-8734-40a9-ae98-7b79aba09a78';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
    mockTx.customPage.aggregate.mockResolvedValue({ _max: { position: 0 } });
    mockTx.customPage.create.mockResolvedValue({ id: 'new-page-id' });
    mockTransaction.mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await createEmptyCustomPage();

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(response.pageId).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: testId,
        roles: null,
      },
    });

    const response = await createEmptyCustomPage();

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(response.pageId).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: testId,
        roles: ['user'],
      },
    });

    const response = await createEmptyCustomPage();

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.pageId).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: testId,
        roles: [],
      },
    });

    const response = await createEmptyCustomPage();

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.pageId).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should create an empty page with the next position', async () => {
    mockTx.customPage.aggregate.mockResolvedValue({ _max: { position: 4 } });

    const response = await createEmptyCustomPage();

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/borrador creado correctamente/i);
    expect(response.pageId).toBe('new-page-id');

    expect(mockTx.customPage.aggregate).toHaveBeenCalledWith({
      _max: { position: true },
    });
    expect(mockTx.customPage.create).toHaveBeenCalledWith({
      data: { position: 5 },
      select: { id: true },
    });
  });

  test('Should default position to 1 when there are no pages', async () => {
    mockTx.customPage.aggregate.mockResolvedValue({ _max: { position: null } });

    await createEmptyCustomPage();

    expect(mockTx.customPage.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: { position: 1 } }),
    );
  });

  test('Should return error on missing record (P2001)', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Record not found', {
        code: 'P2001',
      }),
    );

    const response = await createEmptyCustomPage();

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se encontró la página personalizada/i);
    expect(response.pageId).toBe(null);
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
      }),
    );

    const response = await createEmptyCustomPage();

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/campos duplicados/i);
    expect(response.pageId).toBe(null);
  });

  test('Should return error on unexpected Error', async () => {
    mockTransaction.mockRejectedValue(new Error('Something went wrong'));

    const response = await createEmptyCustomPage();

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo actualizar la página personalizada/i);
    expect(response.pageId).toBe(null);
  });

  test('Should return error on unexpected non-error value', async () => {
    mockTransaction.mockRejectedValue('Something unexpected');

    const response = await createEmptyCustomPage();

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.pageId).toBe(null);
  });
});
