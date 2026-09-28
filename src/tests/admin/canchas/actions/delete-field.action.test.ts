const { mockCount, mockDelete, mockGetSession } = vi.hoisted(() => ({
  mockCount: vi.fn(),
  mockDelete: vi.fn(),
  mockGetSession: vi.fn(),
}));

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
        message: '¡ Debes estar autentificado para realizar esta acción !',
      };
    }

    if (!session.user.roles?.includes('admin')) {
      return {
        ok: false,
        message: '¡ No tienes permisos administrativos para realizar esta acción !',
      };
    }

    return { ok: true, session };
  },
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    field: {
      count: mockCount,
      delete: mockDelete,
    },
  },
}));

import { deleteFieldAction } from '@/app/admin/canchas/(actions)/deleteFieldAction';

const fieldId = 'c93a8c24-ca76-493c-b1e3-f533454bbdae';

describe('Tests on deleteFieldAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
    mockCount.mockResolvedValue(1);
    mockDelete.mockResolvedValue({ id: fieldId });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await deleteFieldAction(fieldId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/debes estar autentificado/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['user'] },
    });

    const response = await deleteFieldAction(fieldId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: null },
    });

    const response = await deleteFieldAction(fieldId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: [] },
    });

    const response = await deleteFieldAction(fieldId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when field does not exist', async () => {
    mockCount.mockResolvedValue(0);

    const response = await deleteFieldAction(fieldId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe/i);
    expect(mockCount).toHaveBeenCalledWith({ where: { id: fieldId } });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should delete a field', async () => {
    const response = await deleteFieldAction(fieldId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/eliminada correctamente/i);

    expect(mockCount).toHaveBeenCalledWith({ where: { id: fieldId } });
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: fieldId } });
  });

  test('Should propagate error when count fails', async () => {
    mockCount.mockRejectedValue(new Error('DB connection failed'));

    await expect(deleteFieldAction(fieldId)).rejects.toThrow('DB connection failed');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should propagate error when delete fails', async () => {
    mockDelete.mockRejectedValue(new Error('Database connection lost'));

    await expect(deleteFieldAction(fieldId)).rejects.toThrow('Database connection lost');
  });
});
