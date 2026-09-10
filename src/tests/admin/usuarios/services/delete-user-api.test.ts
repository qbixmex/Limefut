const { mockCallNestApi } = vi.hoisted(() => ({
  mockCallNestApi: vi.fn(),
}));

vi.mock('@/lib/nest-api', () => ({
  callNestApi: mockCallNestApi,
}));

import { deleteUserApi } from '@/app/admin/usuarios/(services)/delete-user.api';

const userId = '94086d93-4689-40f5-944f-c50b2c841482';

describe('Tests on deleteUserApi service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should DELETE to /users/{userId} and return the success message on 200', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: true,
      status: 200,
      data: {
        statusCode: 200,
        message: 'Usuario eliminado satisfactoriamente 👍',
      },
    });

    const result = await deleteUserApi(userId, 'abc-123');

    expect(mockCallNestApi).toHaveBeenCalledWith(
      `/users/${userId}`,
      {
        method: 'DELETE',
      },
      'abc-123',
    );
    expect(result.ok).toBe(true);
    expect(result.statusCode).toBe(200);
    expect(result.message).toMatch(/eliminado satisfactoriamente/i);
  });

  test('Should prefer the real message over the error category on a 404 response', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: false,
      status: 404,
      data: {
        statusCode: 404,
        message: `El usuario con id: [${userId}], no existe en la base de datos`,
        error: 'Not Found',
      },
    });

    const result = await deleteUserApi(userId);

    expect(result.ok).toBe(false);
    expect(result.statusCode).toBe(404);
    expect(result.message).toMatch(/no existe en la base de datos/);
    expect(result.message).not.toBe('Not Found');
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

    const result = await deleteUserApi(userId);

    expect(result.ok).toBe(false);
    expect(result.statusCode).toBe(401);
    expect(result.message).toBe('Token inválido o expirado');
  });

  test('Should fall back to the error field when the message is missing', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: false,
      status: 500,
      data: {
        statusCode: 500,
        error: 'Internal Server Error',
      },
    });

    const result = await deleteUserApi(userId);

    expect(result.ok).toBe(false);
    expect(result.statusCode).toBe(500);
    expect(result.message).toBe('Internal Server Error');
  });

  test('Should return ok false with a generic message when the API cannot be reached', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: false,
      status: 0,
      data: null,
    });

    const result = await deleteUserApi(userId);

    expect(result.ok).toBe(false);
    expect(result.statusCode).toBe(0);
    expect(result.message).toMatch(/no se pudo eliminar/i);
  });

  test('Should forward an undefined token when none is provided', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: true,
      status: 200,
      data: {
        statusCode: 200,
        message: 'Usuario eliminado satisfactoriamente 👍',
      },
    });

    const result = await deleteUserApi(userId);

    expect(mockCallNestApi).toHaveBeenCalledWith(
      `/users/${userId}`,
      {
        method: 'DELETE',
      },
      undefined,
    );
    expect(result.ok).toBe(true);
  });
});
