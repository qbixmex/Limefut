const { mockCount, mockUpdate, mockGetSession } = vi.hoisted(() => ({
  mockCount: vi.fn(),
  mockUpdate: vi.fn(),
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
      count: mockCount,
      update: mockUpdate,
    },
  },
}));

import { updateMessageStatusAction } from '@/app/admin/mensajes/(actions)/updateMessageStatusAction';

const userId = '2fc13a27-e938-4ca2-9566-fdfde55602fa';
const messageId = '17834fc4-afd8-490a-b07d-88d62e601521';

describe('Tests on updateMessageStatusAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({
      user: {
        id: userId,
        roles: ['admin'],
      },
    });
    mockCount.mockResolvedValue(1);
    mockUpdate.mockResolvedValue({ id: messageId, read: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when there is no authenticated session', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateMessageStatusAction(messageId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/debes estar autentificado/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '569911ef-8652-4aea-81b9-25fc0679dd53',
        roles: ['user'],
      },
    });

    const response = await updateMessageStatusAction(messageId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when userRoles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: userId, roles: null },
    });

    const response = await updateMessageStatusAction(messageId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when userRoles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: userId, roles: [] },
    });

    const response = await updateMessageStatusAction(messageId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when message does not exist', async () => {
    mockCount.mockResolvedValue(0);

    const response = await updateMessageStatusAction(messageId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Mensaje no encontrado');
    expect(mockCount).toHaveBeenCalledWith({ where: { id: messageId } });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should mark a message as read', async () => {
    const response = await updateMessageStatusAction(messageId, true);

    expect(response.ok).toBe(true);
    expect(response.message).toBe('El mensaje fue actualizado correctamente');
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: messageId },
      data: { read: true },
    });
  });

  test('Should mark a message as unread', async () => {
    const response = await updateMessageStatusAction(messageId, false);

    expect(response.ok).toBe(true);
    expect(response.message).toBe('El mensaje fue actualizado correctamente');
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: messageId },
      data: { read: false },
    });
  });

  test('Should propagate error when update fails', async () => {
    mockUpdate.mockRejectedValue(new Error('Database connection lost'));

    await expect(updateMessageStatusAction(messageId, true)).rejects.toThrow('Database connection lost');
  });
});
