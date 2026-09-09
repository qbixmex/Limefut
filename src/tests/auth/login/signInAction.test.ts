const { mockCookieSet, mockCookieDelete, mockCookies } = vi.hoisted(() => ({
  mockCookieSet: vi.fn(),
  mockCookieDelete: vi.fn(),
  mockCookies: vi.fn(),
}));

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
  cookies: mockCookies,
}));

import { signInAction } from '@/app/(auth)/signInAction';
import {
  NEST_ACCESS_TOKEN_COOKIE,
  NEST_SESSION_MODE_COOKIE,
} from '@/lib/nest-api';

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('email', 'johnny@example.com');
  formData.append('password', 'password123');
  return formData;
};

const loginBody = {
  statusCode: 200,
  message: 'Success',
  data: {
    message: 'Usuario autentificado satisfactoriamente 👍🎉',
    user: {
      id: 'e4eab2dc-7d09-4326-815c-c747ac5146d2',
      name: 'John Doe',
      username: 'johnny',
      email: 'johnny@example.com',
      imageUrl: 'https://example.com/image.webp',
      createdAt: '2026-02-07T07:56:32.741Z',
      updatedAt: '2026-02-07T10:48:43.856Z',
      roles: ['user', 'admin'],
    },
    token: 'nest-jwt-token',
  },
};

const cookieOptionsFor = (name: string): Record<string, unknown> | undefined => {
  const call = mockCookieSet.mock.calls.find(([cookieName]) => cookieName === name);
  return call?.[2] as Record<string, unknown> | undefined;
};

describe('Tests on signInAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockCookies.mockResolvedValue({
      set: mockCookieSet,
      delete: mockCookieDelete,
    });
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  test('Should return error when email is missing', async () => {
    const formData = new FormData();
    formData.append('password', 'password123');

    const response = await signInAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toContain('obligatorios');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('Should return error when password is missing', async () => {
    const formData = new FormData();
    formData.append('email', 'johnny@example.com');

    const response = await signInAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toContain('obligatorios');
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('Should return error when backend returns 401 invalid credentials', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ statusCode: 401, message: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    const response = await signInAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Unauthorized');
    expect(mockCookieSet).not.toHaveBeenCalled();
  });

  test('Should return backend message when login payload is invalid', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            statusCode: 400,
            data: { message: 'Credenciales inválidas' },
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } },
        ),
      ),
    );

    const response = await signInAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Credenciales inválidas');
    expect(mockCookieSet).not.toHaveBeenCalled();
  });

  test('Should return generic error when the API cannot be reached', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));

    const response = await signInAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toContain('No se pudo conectar');
    expect(mockCookieSet).not.toHaveBeenCalled();
  });

  test('Should store a persistent session cookie by default', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(loginBody), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const response = await signInAction(validFormData());

    expect(response.ok).toBe(true);
    expect(response.roles).toEqual(['user', 'admin']);

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/auth/login'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ email: 'johnny@example.com', password: 'password123' }),
      }),
    );

    expect(mockCookieSet).toHaveBeenCalledWith(
      NEST_ACCESS_TOKEN_COOKIE,
      'nest-jwt-token',
      expect.objectContaining({
        httpOnly: true,
        path: '/',
        maxAge: 3600,
      }),
    );
    expect(mockCookieSet).toHaveBeenCalledWith(
      NEST_SESSION_MODE_COOKIE,
      'persistent',
      expect.objectContaining({
        httpOnly: true,
        path: '/',
        maxAge: 3600,
      }),
    );
  });

  test('Should store a persistent session when rememberMe is true', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(loginBody), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    const formData = validFormData();
    formData.append('rememberMe', 'true');

    const response = await signInAction(formData);

    expect(response.ok).toBe(true);
    expect(cookieOptionsFor(NEST_ACCESS_TOKEN_COOKIE)?.maxAge).toBe(3600);
    expect(cookieOptionsFor(NEST_SESSION_MODE_COOKIE)?.maxAge).toBe(3600);
    expect(mockCookieSet).toHaveBeenCalledWith(
      NEST_SESSION_MODE_COOKIE,
      'persistent',
      expect.any(Object),
    );
  });

  test('Should store a session cookie when rememberMe is false', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(loginBody), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    const formData = validFormData();
    formData.append('rememberMe', 'false');

    const response = await signInAction(formData);

    expect(response.ok).toBe(true);
    expect(cookieOptionsFor(NEST_ACCESS_TOKEN_COOKIE)?.maxAge).toBeUndefined();
    expect(cookieOptionsFor(NEST_SESSION_MODE_COOKIE)?.maxAge).toBeUndefined();
    expect(mockCookieSet).toHaveBeenCalledWith(
      NEST_SESSION_MODE_COOKIE,
      'session',
      expect.any(Object),
    );
  });
});
