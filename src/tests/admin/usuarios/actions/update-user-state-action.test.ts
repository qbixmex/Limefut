const {
  mockUpdateUserApi,
  mockRedirect,
  mockGetSession,
  mockGetNestAccessToken,
} = vi.hoisted(() => ({
  mockUpdateUserApi: vi.fn(),
  mockRedirect: vi.fn(),
  mockGetSession: vi.fn(),
  mockGetNestAccessToken: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('next/navigation', () => ({
  redirect: mockRedirect,
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

vi.mock('@/lib/nest-api', () => ({
  getNestAccessToken: mockGetNestAccessToken,
}));

vi.mock('@/app/admin/usuarios/(services)', () => ({
  updateUserApi: mockUpdateUserApi,
}));

import { updateUserStateAction } from '@/app/admin/usuarios/(actions)/updateUserStateAction';
import { updateTag } from 'next/cache';

const userId = '5a6fad8a-e64d-4598-834c-800feff03e12';

const successResponse = {
  ok: true,
  statusCode: 200,
  message: '¡ Usuario actualizado exitosamente 👍 !',
  user: {
    id: userId,
    name: 'Jackie Chan',
    username: 'jackie',
    email: 'jackie@gmail.com',
    emailVerified: false,
    imageUrl: null,
    isActive: true,
    roles: ['user', 'admin'],
    createdAt: '2026-09-11T03:07:27.413Z',
    updatedAt: '2026-09-11T03:24:14.648Z',
  },
};

describe('Tests on update user state server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'admin-1', roles: ['admin'] },
    });
    mockGetNestAccessToken.mockResolvedValue('nest-token');
    mockUpdateUserApi.mockResolvedValue(successResponse);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when there is no authenticated session', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateUserStateAction(userId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ Debes estar autentificado para realizar esta acción !');
    expect(mockUpdateUserApi).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['user'] },
    });

    const response = await updateUserStateAction(userId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockUpdateUserApi).not.toHaveBeenCalled();
  });

  test('Should return error when roles are null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: null },
    });

    const response = await updateUserStateAction(userId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockUpdateUserApi).not.toHaveBeenCalled();
  });

  test('Should return error when roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: [] },
    });

    const response = await updateUserStateAction(userId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockUpdateUserApi).not.toHaveBeenCalled();
  });

  test('Should activate the user and refresh the cache on success', async () => {
    const response = await updateUserStateAction(userId, true);

    expect(mockGetNestAccessToken).toHaveBeenCalled();
    expect(mockUpdateUserApi).toHaveBeenCalledWith(
      userId,
      { isActive: true },
      'nest-token',
    );
    expect(response).toEqual(successResponse);
    expect(updateTag).toHaveBeenCalledWith('admin-users');
    expect(updateTag).toHaveBeenCalledWith('admin-user');
  });

  test('Should deactivate the user and refresh the cache on success', async () => {
    const response = await updateUserStateAction(userId, false);

    expect(mockGetNestAccessToken).toHaveBeenCalled();
    expect(mockUpdateUserApi).toHaveBeenCalledWith(
      userId,
      { isActive: false },
      'nest-token',
    );
    expect(response.ok).toBe(true);
    expect(updateTag).toHaveBeenCalledWith('admin-users');
    expect(updateTag).toHaveBeenCalledWith('admin-user');
  });

  test('Should redirect to login when the API returns 401', async () => {
    mockUpdateUserApi.mockResolvedValue({
      ok: false,
      statusCode: 401,
      message: 'Token inválido o expirado',
      user: null,
    });

    const response = await updateUserStateAction(userId, true);

    expect(mockRedirect).toHaveBeenCalledWith('/auth/login');
    expect(response.ok).toBe(false);
    expect(updateTag).not.toHaveBeenCalled();
  });
});
