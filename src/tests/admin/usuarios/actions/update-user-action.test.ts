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

import { updateUserAction } from '@/app/admin/usuarios/(actions)/updateUserAction';
import { updateTag } from 'next/cache';

const userId = '5a6fad8a-e64d-4598-834c-800feff03e12';

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('name', 'Jackie Chan');
  formData.append('username', 'jackie');
  formData.append('email', 'jackie@gmail.com');
  formData.append('roles', JSON.stringify(['user', 'admin']));
  formData.append('isActive', 'true');
  return formData;
};

const mockUpdatedUser = {
  id: '5a6fad8a-e64d-4598-834c-800feff03e13',
  name: 'Jackie Chan',
  username: 'jackie',
  email: 'jackie@gmail.com',
  emailVerified: false,
  imageUrl: null,
  imagePublicId: null,
  isActive: true,
  roles: ['user', 'admin'],
  createdAt: '2026-09-11T03:07:27.413Z',
  updatedAt: '2026-09-11T03:24:14.648Z',
};

const successResponse = {
  ok: true,
  statusCode: 200,
  message: 'Usuario actualizado exitosamente 👍',
  user: mockUpdatedUser,
};

describe('Tests on update user server action', () => {
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

    const response = await updateUserAction(validFormData(), userId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ Debes estar autentificado para realizar esta acción !');
    expect(response.user).toBe(null);
    expect(mockUpdateUserApi).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['user'] },
    });

    const response = await updateUserAction(validFormData(), userId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(response.user).toBe(null);
    expect(mockUpdateUserApi).not.toHaveBeenCalled();
  });

  test('Should return error when roles are null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: null },
    });

    const response = await updateUserAction(validFormData(), userId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(response.user).toBe(null);
    expect(mockUpdateUserApi).not.toHaveBeenCalled();
  });

  test('Should return error when roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: [] },
    });

    const response = await updateUserAction(validFormData(), userId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(response.user).toBe(null);
    expect(mockUpdateUserApi).not.toHaveBeenCalled();
  });

  test('Should return error when zod validation fails', async () => {
    const formData = validFormData();
    formData.set('email', 'invalid-email');

    const response = await updateUserAction(formData, userId);

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Formato incorrecto del correo electrónico');
    expect(response.user).toBe(null);
    expect(mockUpdateUserApi).not.toHaveBeenCalled();
  });

  test('Should return error when the password is insecure', async () => {
    const formData = validFormData();
    formData.set('password', '0123456789');
    formData.set('passwordConfirmation', '0123456789');

    const response = await updateUserAction(formData, userId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ La contraseña es insegura, elija otra por favor !');
    expect(response.user).toBe(null);
    expect(mockUpdateUserApi).not.toHaveBeenCalled();
  });

  test('Should update the user and refresh the cache on success', async () => {
    const response = await updateUserAction(validFormData(), userId);

    expect(mockGetNestAccessToken).toHaveBeenCalled();
    expect(mockUpdateUserApi).toHaveBeenCalledWith(
      userId,
      {
        name: 'Jackie Chan',
        username: 'jackie',
        email: 'jackie@gmail.com',
        roles: ['user', 'admin'],
        isActive: true,
      },
      'nest-token',
    );
    expect(response).toEqual(successResponse);
    expect(updateTag).toHaveBeenCalledWith('admin-users');
    expect(updateTag).toHaveBeenCalledWith('admin-user');
  });

  test('Should send the password to the API when a new one is provided', async () => {
    const formData = validFormData();
    formData.set('password', 'new_password');
    formData.set('passwordConfirmation', 'new_password');

    const response = await updateUserAction(formData, userId);

    expect(response.ok).toBe(true);
    expect(mockUpdateUserApi).toHaveBeenCalledWith(
      userId,
      {
        name: 'Jackie Chan',
        username: 'jackie',
        email: 'jackie@gmail.com',
        roles: ['user', 'admin'],
        isActive: true,
        password: 'new_password',
      },
      'nest-token',
    );
  });

  test('Should redirect to login when the API returns 401', async () => {
    mockUpdateUserApi.mockResolvedValue({
      ok: false,
      statusCode: 401,
      message: 'Token inválido o expirado',
      user: null,
    });

    const response = await updateUserAction(validFormData(), userId);

    expect(mockRedirect).toHaveBeenCalledWith('/auth/login');
    expect(response.ok).toBe(false);
    expect(updateTag).not.toHaveBeenCalled();
  });

  test('Should return the message when the user does not exist', async () => {
    mockUpdateUserApi.mockResolvedValue({
      ok: false,
      statusCode: 404,
      message: `¡ El usuario con id: [${userId}], no existe en la base de datos !`,
      user: null,
    });

    const response = await updateUserAction(validFormData(), userId);

    expect(response.ok).toBe(false);
    expect(response.statusCode).toBe(404);
    expect(response.message).toContain('no existe en la base de datos');
    expect(response.user).toBe(null);
    expect(updateTag).not.toHaveBeenCalled();
  });
});
