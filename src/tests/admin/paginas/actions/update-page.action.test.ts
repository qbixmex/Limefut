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

import { updatePageAction } from '@/app/admin/paginas/(actions)/updatePageAction';
import { customPageMock } from '../mocks/custom-page.mock';

const pageId = customPageMock.id;

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('title', customPageMock.title);
  formData.append('permalink', customPageMock.permalink);
  formData.append('content', customPageMock.content);
  formData.append('seoTitle', customPageMock.seoTitle);
  formData.append('seoDescription', customPageMock.seoDescription);
  formData.append('seoRobots', customPageMock.seoRobots);
  formData.append('position', '1');
  formData.append('status', customPageMock.status);
  return formData;
};

const mockTx = {
  customPage: {
    count: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  },
};

describe('Tests on updatePageAction server action', () => {
  const testId = 'd885b3f2-13f9-4dae-92f9-fbf628cfda30';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
    mockTx.customPage.count.mockResolvedValueOnce(1).mockResolvedValueOnce(0);
    mockTx.customPage.findMany.mockResolvedValue([{ id: pageId, position: 1 }]);
    mockTx.customPage.update.mockResolvedValue(customPageMock);
    mockTransaction.mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updatePageAction({ pageId, formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(response.page).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({ user: { id: 'user-1', roles: null } });

    const response = await updatePageAction({ pageId, formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(response.page).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({ user: { id: testId, roles: ['user'] } });

    const response = await updatePageAction({ pageId, formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.page).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({ user: { id: testId, roles: [] } });

    const response = await updatePageAction({ pageId, formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.page).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when zod validation fails (short title)', async () => {
    const formData = validFormData();
    formData.set('title', 'ab');

    const response = await updatePageAction({ pageId, formData });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/mayor a 3/i);
    expect(response.page).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when page does not exist', async () => {
    mockTx.customPage.count.mockReset();
    mockTx.customPage.count.mockResolvedValueOnce(0);

    const response = await updatePageAction({ pageId, formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe o ha sido eliminada/i);
    expect(mockTx.customPage.update).not.toHaveBeenCalled();
  });

  test('Should return error when permalink already exists', async () => {
    mockTx.customPage.count.mockReset();
    mockTx.customPage.count.mockResolvedValueOnce(1).mockResolvedValueOnce(1);

    const response = await updatePageAction({ pageId, formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/ya existe ese enlace permanente/i);
    expect(mockTx.customPage.update).not.toHaveBeenCalled();
  });

  test('Should update a page keeping the same position', async () => {
    const response = await updatePageAction({ pageId, formData: validFormData() });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/guardada correctamente/i);
    expect(response.page).not.toBe(null);

    expect(mockTx.customPage.update).toHaveBeenCalledOnce();
    expect(mockTx.customPage.update).toHaveBeenCalledWith({
      where: { id: pageId },
      data: expect.objectContaining({
        title: customPageMock.title,
        permalink: customPageMock.permalink,
        position: 1,
      }),
    });
  });

  test('Should move the page up and shift the affected pages', async () => {
    mockTx.customPage.findMany.mockResolvedValue([
      { id: 'other-page', position: 1 },
      { id: pageId, position: 2 },
    ]);

    const response = await updatePageAction({ pageId, formData: validFormData() });

    expect(response.ok).toBe(true);
    expect(mockTx.customPage.update).toHaveBeenCalledWith({
      where: { id: 'other-page' },
      data: { position: 2 },
    });
    expect(mockTx.customPage.update).toHaveBeenLastCalledWith({
      where: { id: pageId },
      data: expect.objectContaining({ position: 1 }),
    });
  });

  test('Should move the page down and shift the affected pages', async () => {
    const formData = validFormData();
    formData.set('position', '3');
    mockTx.customPage.findMany.mockResolvedValue([
      { id: pageId, position: 1 },
      { id: 'other-page-1', position: 2 },
      { id: 'other-page-2', position: 3 },
    ]);

    const response = await updatePageAction({ pageId, formData });

    expect(response.ok).toBe(true);
    expect(mockTx.customPage.update).toHaveBeenCalledWith({
      where: { id: 'other-page-1' },
      data: { position: 1 },
    });
    expect(mockTx.customPage.update).toHaveBeenCalledWith({
      where: { id: 'other-page-2' },
      data: { position: 2 },
    });
    expect(mockTx.customPage.update).toHaveBeenLastCalledWith({
      where: { id: pageId },
      data: expect.objectContaining({ position: 3 }),
    });
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTx.customPage.update.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
      }),
    );

    const response = await updatePageAction({ pageId, formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/campos duplicados/i);
    expect(response.page).toBe(null);
  });

  test('Should return error on unexpected Error inside transaction', async () => {
    mockTx.customPage.update.mockRejectedValue(new Error('Something went wrong'));

    const response = await updatePageAction({ pageId, formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo actualizar la página personalizada/i);
    expect(response.page).toBe(null);
  });

  test('Should return error on unexpected non-error value inside transaction', async () => {
    mockTx.customPage.update.mockRejectedValue('Something unexpected');

    const response = await updatePageAction({ pageId, formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.page).toBe(null);
  });

  test('Should return generic error when the transaction itself rejects', async () => {
    mockTransaction.mockRejectedValue(new Error('Infrastructure failure'));

    const response = await updatePageAction({ pageId, formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.page).toBe(null);
  });
});
