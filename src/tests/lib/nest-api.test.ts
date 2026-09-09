const { mockCookieGet, mockCookies } = vi.hoisted(() => ({
  mockCookieGet: vi.fn(),
  mockCookies: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: mockCookies,
}));

import {
  callNestApi,
  checkNestTokenStatus,
  getNestAccessToken,
  loginWithNestApi,
  mapNestRoles,
  NEST_ACCESS_TOKEN_COOKIE,
} from '@/lib/nest-api';

const loginBody = {
  statusCode: 200,
  message: 'Success',
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
};

describe('Tests on nest-api lib', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('AUTH_API_BASE_URL', 'https://sportex-alpha.vercel.app/api/v1');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockCookieGet.mockReturnValue(null);
    mockCookies.mockResolvedValue({ get: mockCookieGet });
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  describe('loginWithNestApi', () => {
    test('Should return the user and token on a successful login', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify(loginBody), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        ),
      );

      const result = await loginWithNestApi('johnny@example.com', 'password123');

      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.user.email).toBe('johnny@example.com');
      expect(result.user.roles).toEqual(['user', 'admin']);
      expect(result.token).toBe('nest-jwt-token');
    });

    test('Should return the backend message when credentials are invalid', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify({ statusCode: 401, message: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }),
        ),
      );

      const result = await loginWithNestApi('johnny@example.com', 'wrong');

      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.message).toBe('Unauthorized');
    });

    test('Should return a generic message when the API cannot be reached', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));

      const result = await loginWithNestApi('johnny@example.com', 'password123');

      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.message).toContain('No se pudo conectar');
    });
  });

  describe('checkNestTokenStatus', () => {
    const checkStatusBody = {
      statusCode: 200,
      message: 'Success',
      user: {
        id: 'e4eab2dc-7d09-4326-815c-c747ac5146d2',
        name: 'John Doe',
        email: 'johnny@example.com',
        imageUrl: null,
        isActive: true,
        createdAt: '2026-02-07T07:56:32.741Z',
        updatedAt: '2026-02-07T10:48:43.856Z',
        roles: ['user', 'admin'],
      },
      token: 'new-jwt-token',
    };

    test('Should validate the token and return the refreshed token', async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify(checkStatusBody), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      vi.stubGlobal('fetch', fetchMock);

      const result = await checkNestTokenStatus('original-token');

      expect(result.ok).toBe(true);
      if (!result.ok) return;
      expect(result.user.id).toBe('e4eab2dc-7d09-4326-815c-c747ac5146d2');
      expect(result.user.isActive).toBe(true);
      expect(result.token).toBe('new-jwt-token');

      const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe(
        'https://sportex-alpha.vercel.app/api/v1/auth/check-status',
      );
      expect(init.method).toBe('GET');
      expect(new Headers(init.headers).get('Authorization')).toBe(
        'Bearer original-token',
      );
    });

    test('Should return the backend message when the token is invalid or expired', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(
            JSON.stringify({
              statusCode: 401,
              message: 'Token inválido o expirado',
            }),
            { status: 401, headers: { 'Content-Type': 'application/json' } },
          ),
        ),
      );

      const result = await checkNestTokenStatus('expired-token');

      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.message).toBe('Token inválido o expirado');
    });

    test('Should return a session expired message when the body is invalid', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockResolvedValue(
          new Response(JSON.stringify({ data: {} }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }),
        ),
      );

      const result = await checkNestTokenStatus('original-token');

      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.message).toContain('expirado');
    });

    test('Should return a generic message when the API cannot be reached', async () => {
      vi.stubGlobal(
        'fetch',
        vi.fn().mockRejectedValue(new TypeError('fetch failed')),
      );

      const result = await checkNestTokenStatus('original-token');

      expect(result.ok).toBe(false);
      if (result.ok) return;
      expect(result.message).toContain('No se pudo conectar');
    });
  });

  describe('mapNestRoles', () => {
    test('Should normalize and keep only valid local roles', () => {
      expect(mapNestRoles(['user', 'admin'])).toEqual(['user', 'admin']);
      expect(mapNestRoles(['Admin', 'User', 'guest'])).toEqual(['admin', 'user']);
      expect(mapNestRoles(['ADMIN'])).toEqual(['admin']);
    });

    test('Should default to user when roles are missing or empty', () => {
      expect(mapNestRoles([])).toEqual(['user']);
      expect(mapNestRoles(null)).toEqual(['user']);
      expect(mapNestRoles(undefined)).toEqual(['user']);
      expect(mapNestRoles(['guest'])).toEqual(['user']);
    });
  });

  describe('getNestAccessToken', () => {
    test('Should return the token stored in the nest cookie', async () => {
      mockCookieGet.mockReturnValue({ value: 'jwt-token' });

      const token = await getNestAccessToken();

      expect(mockCookieGet).toHaveBeenCalledWith(NEST_ACCESS_TOKEN_COOKIE);
      expect(token).toBe('jwt-token');
    });

    test('Should return null when the cookie is not present', async () => {
      const token = await getNestAccessToken();

      expect(token).toBeNull();
    });
  });

  describe('callNestApi', () => {
    test('Should attach the Bearer token and parse the response', async () => {
      mockCookieGet.mockReturnValue({ value: 'jwt-token' });
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ id: 'user-1', name: 'John' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      vi.stubGlobal('fetch', fetchMock);

      const result = await callNestApi<{ id: string; name: string }>('/users/1');

      expect(result.ok).toBe(true);
      expect(result.status).toBe(200);
      expect(result.data).toEqual({ id: 'user-1', name: 'John' });
      const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(url).toBe('https://sportex-alpha.vercel.app/api/v1/users/1');
      expect(new Headers(init.headers).get('Authorization')).toBe(
        'Bearer jwt-token',
      );
    });

    test('Should not send an Authorization header without a token', async () => {
      const fetchMock = vi.fn().mockResolvedValue(
        new Response(JSON.stringify({}), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
      vi.stubGlobal('fetch', fetchMock);

      await callNestApi<{ id: string }>('/users/1');

      const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
      expect(init.headers).toBeDefined();
      expect(new Headers(init.headers).has('Authorization')).toBe(false);
    });

    test('Should return ok false with status 0 on network error', async () => {
      vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));

      const result = await callNestApi('/users/1');

      expect(result.ok).toBe(false);
      expect(result.status).toBe(0);
      expect(result.data).toBeNull();
    });
  });
});
