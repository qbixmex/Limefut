const { mockCallNestApi } = vi.hoisted(() => ({
  mockCallNestApi: vi.fn(),
}));

vi.mock('@/lib/nest-api', () => ({
  callNestApi: mockCallNestApi,
}));

import { updateUserApi } from '@/app/admin/usuarios/(services)/update-user.api';
import type { USER_ROLES_TYPE } from '@/shared/enums';

const userId = '5a6fad8a-e64d-4598-834c-800feff03e13';

const updatePayload = {
  name: 'Jackie Chan',
  isActive: true,
  password: 'new_password',
  roles: ['user', 'admin'] as USER_ROLES_TYPE[],
};

const backendUser = {
  id: userId,
  name: 'Jackie Chan',
  username: 'jackie',
  email: 'jackie@gmail.com',
  emailVerified: false,
  imageUrl: null,
  imagePublicId: null,
  isActive: false,
  roles: ['user', 'admin'],
  createdAt: '2026-09-11T03:07:27.413Z',
  updatedAt: '2026-09-11T03:24:14.648Z',
};

describe('Tests on updateUserApi service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should PATCH the payload to /users/{userId} and return the updated user on 200', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: true,
      status: 200,
      data: {
        statusCode: 200,
        message: 'Usuario actualizado exitosamente 👍',
        user: backendUser,
      },
    });

    const result = await updateUserApi(userId, updatePayload, 'abc-123');

    expect(mockCallNestApi).toHaveBeenCalledWith(
      `/users/${userId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updatePayload),
      },
      'abc-123',
    );
    expect(result.ok).toBe(true);
    expect(result.statusCode).toBe(200);
    expect(result.message).toMatch(/actualizado exitosamente/i);
    expect(result.user).toEqual(backendUser);
  });

  test('Should prefer the real message over the error category on a 404 response', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: false,
      status: 404,
      data: {
        statusCode: 404,
        message: `¡ El usuario con id: [${userId}], no existe en la base de datos !`,
        error: 'Not Found',
      },
    });

    const result = await updateUserApi(userId, updatePayload);

    expect(result.ok).toBe(false);
    expect(result.statusCode).toBe(404);
    expect(result.message).toMatch(/no existe en la base de datos/);
    expect(result.message).not.toBe('Not Found');
    expect(result.user).toBeNull();
  });

  test('Should propagate the statusCode and message on a 401 response', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: false,
      status: 401,
      data: {
        statusCode: 401,
        message: 'Token inválido o expirado',
        error: 'Unauthorized',
      },
    });

    const result = await updateUserApi(userId, updatePayload);

    expect(result.ok).toBe(false);
    expect(result.statusCode).toBe(401);
    expect(result.message).toBe('Token inválido o expirado');
    expect(result.user).toBeNull();
  });

  test('Should fall back to the error field when the message is missing', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: false,
      status: 400,
      data: {
        statusCode: 400,
        error: 'Bad Request',
      },
    });

    const result = await updateUserApi(userId, updatePayload);

    expect(result.ok).toBe(false);
    expect(result.statusCode).toBe(400);
    expect(result.message).toBe('Bad Request');
    expect(result.user).toBeNull();
  });

  test('Should return ok false with a generic message when the API cannot be reached', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: false,
      status: 0,
      data: null,
    });

    const result = await updateUserApi(userId, updatePayload);

    expect(result.ok).toBe(false);
    expect(result.statusCode).toBe(0);
    expect(result.message).toMatch(/no se pudo actualizar/i);
    expect(result.user).toBeNull();
  });

  test('Should forward an undefined token when none is provided', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: true,
      status: 200,
      data: {
        statusCode: 200,
        message: 'Usuario actualizado exitosamente 👍',
        user: backendUser,
      },
    });

    const result = await updateUserApi(userId, updatePayload);

    expect(mockCallNestApi).toHaveBeenCalledWith(
      `/users/${userId}`,
      {
        method: 'PATCH',
        body: JSON.stringify(updatePayload),
      },
      undefined,
    );
    expect(result.ok).toBe(true);
  });
});
