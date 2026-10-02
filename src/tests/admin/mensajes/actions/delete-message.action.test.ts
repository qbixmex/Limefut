const { mockFindUnique, mockDelete, mockGetSession } = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
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
    contactMessage: {
      findUnique: mockFindUnique,
      delete: mockDelete,
    },
  },
}));

import { deleteMessageAction } from '@/app/admin/mensajes/(actions)/deleteMessageAction';

const userId = '7f009373-1e34-4446-a4fe-604b68517ba6';
const messageId = 'c93a8c24-ca76-493c-b1e3-f533454bbdae';

describe('Tests on deleteMessageAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: userId, roles: ['admin'] },
    });
    mockFindUnique.mockResolvedValue({ id: messageId });
    mockDelete.mockResolvedValue({ id: messageId });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await deleteMessageAction(messageId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/debes estar autentificado/i);
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: userId, roles: ['user'] },
    });

    const response = await deleteMessageAction(messageId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: userId, roles: null },
    });

    const response = await deleteMessageAction(messageId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: userId, roles: [] },
    });

    const response = await deleteMessageAction(messageId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when message does not exist', async () => {
    mockFindUnique.mockResolvedValue(null);

    const response = await deleteMessageAction(messageId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se puede eliminar/i);
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: messageId } });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should delete a message', async () => {
    const response = await deleteMessageAction(messageId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/eliminado correctamente/i);

    expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: messageId } });
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: messageId } });
  });

  test('Should propagate error when findUnique fails', async () => {
    mockFindUnique.mockRejectedValue(new Error('DB connection failed'));

    await expect(deleteMessageAction(messageId)).rejects.toThrow('DB connection failed');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should propagate error when delete fails', async () => {
    mockDelete.mockRejectedValue(new Error('Database connection lost'));

    await expect(deleteMessageAction(messageId)).rejects.toThrow('Database connection lost');
  });
});
