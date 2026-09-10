const { mockCallNestApi } = vi.hoisted(() => ({
  mockCallNestApi: vi.fn(),
}));

vi.mock('@/lib/nest-api', () => ({
  callNestApi: mockCallNestApi,
}));

import {
  createUserApi,
  type CreateUserApiInput,
} from '@/app/admin/usuarios/(services)/create-user.api';
import type { USER_ROLES_TYPE } from '@/shared/enums';

const userPayload: CreateUserApiInput = {
  name: 'Robert Smith',
  username: 'the_cure',
  email: 'robert@thecure.com',
  password: 'secret_password',
  isActive: false,
  roles: ['user'] as USER_ROLES_TYPE[],
};

const backendUser = {
  id: '22edb928-6fbb-4126-8a35-50eb8d77c695',
  name: 'Robert Smith',
  username: 'the_cure',
  email: 'robert@thecure.com',
  imageUrl: null,
  imagePublicId: null,
  isActive: false,
  roles: ['user'],
  createdAt: '2026-09-10T08:55:49.376Z',
  updatedAt: '2026-09-10T08:55:49.376Z',
};

describe('Tests on createUserApi service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should POST the payload to /users and return the created user on 201', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: true,
      status: 201,
      data: {
        statusCode: 201,
        message: 'Usuario creado satisfactoriamente 👍',
        user: backendUser,
      },
    });

    const result = await createUserApi(userPayload, 'abc-123');

    expect(mockCallNestApi).toHaveBeenCalledWith(
      '/users',
      {
        method: 'POST',
        body: JSON.stringify(userPayload),
      },
      'abc-123',
    );
    expect(result.ok).toBe(true);
    expect(result.statusCode).toBe(201);
    expect(result.message).toMatch(/satisfactoriamente/i);
    expect(result.user).toEqual(backendUser);
  });

  test('Should prefer the real message over the error category on a NestJS ConflictException', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: false,
      status: 409,
      data: {
        statusCode: 409,
        message: '¡ El usuario con el email [robert@thecure.com] ya existe, elija otro !',
        error: 'Conflict',
      },
    });

    const result = await createUserApi(userPayload);

    expect(result.ok).toBe(false);
    expect(result.statusCode).toBe(409);
    expect(result.message).toMatch(/ya existe, elija otro/);
    expect(result.message).not.toBe('Conflict');
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

    const result = await createUserApi(userPayload);

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
        error: '(juan@gmail.com) ya existe, elija otro',
      },
    });

    const result = await createUserApi(userPayload);

    expect(result.ok).toBe(false);
    expect(result.statusCode).toBe(400);
    expect(result.message).toBe('(juan@gmail.com) ya existe, elija otro');
    expect(result.user).toBeNull();
  });

  test('Should return ok false with a generic message when the API cannot be reached', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: false,
      status: 0,
      data: null,
    });

    const result = await createUserApi(userPayload);

    expect(result.ok).toBe(false);
    expect(result.statusCode).toBe(0);
    expect(result.message).toMatch(/no se pudo crear/i);
    expect(result.user).toBeNull();
  });

  test('Should forward an undefined token when none is provided', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: true,
      status: 201,
      data: {
        statusCode: 201,
        message: 'Usuario creado satisfactoriamente 👍',
        user: backendUser,
      },
    });

    const result = await createUserApi(userPayload);

    expect(mockCallNestApi).toHaveBeenCalledWith(
      '/users',
      {
        method: 'POST',
        body: JSON.stringify(userPayload),
      },
      undefined,
    );
    expect(result.ok).toBe(true);
  });
});
