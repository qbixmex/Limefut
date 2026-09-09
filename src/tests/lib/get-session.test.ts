const {
  mockGetNestAccessToken,
  mockCheckNestTokenStatus,
  mockCookieGet,
  mockCookieSet,
  mockCookies,
} = vi.hoisted(() => ({
  mockGetNestAccessToken: vi.fn(),
  mockCheckNestTokenStatus: vi.fn(),
  mockCookieGet: vi.fn(),
  mockCookieSet: vi.fn(),
  mockCookies: vi.fn(),
}));

vi.mock('@/lib/nest-api', () => ({
  getNestAccessToken: mockGetNestAccessToken,
  checkNestTokenStatus: mockCheckNestTokenStatus,
  mapNestRoles: (roles: string[] | null | undefined) => {
    const valid = new Set(['admin', 'user']);
    if (!Array.isArray(roles) || roles.length === 0) {
      return ['user'];
    }
    const normalized = Array.from(new Set(roles.map((role) => role.toLowerCase())));
    return normalized.filter((role) => valid.has(role));
  },
  NEST_ACCESS_TOKEN_COOKIE: 'nest_access_token',
  NEST_SESSION_MODE_COOKIE: 'nest_session_mode',
}));

vi.mock('next/headers', () => ({
  cookies: mockCookies,
}));

const adminUser = {
  id: 'user-1',
  name: 'John Doe',
  email: 'johnny@example.com',
  imageUrl: null,
  isActive: true,
  createdAt: '2026-02-07T07:56:32.741Z',
  updatedAt: '2026-02-07T10:48:43.856Z',
  roles: ['Admin'],
};

const importGetSession = async () => await import('@/lib/get-session');

describe('Tests on get-session lib', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockGetNestAccessToken.mockResolvedValue('original-token');
    mockCookieGet.mockReturnValue(null);
    mockCookies.mockResolvedValue({ get: mockCookieGet, set: mockCookieSet });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return null when there is no access token cookie', async () => {
    mockGetNestAccessToken.mockResolvedValue(null);

    const { getSession } = await importGetSession();

    await expect(getSession()).resolves.toBeNull();
    expect(mockCheckNestTokenStatus).not.toHaveBeenCalled();
  });

  test('Should return null when the check-status call fails', async () => {
    mockCheckNestTokenStatus.mockResolvedValue({
      ok: false,
      message: 'Session expired',
    });

    const { getSession } = await importGetSession();

    await expect(getSession()).resolves.toBeNull();
    expect(mockCheckNestTokenStatus).toHaveBeenCalledWith('original-token');
  });

  test('Should return null when the user is inactive', async () => {
    mockCheckNestTokenStatus.mockResolvedValue({
      ok: true,
      user: { ...adminUser, isActive: false },
      token: 'fresh-token',
    });

    const { getSession } = await importGetSession();

    await expect(getSession()).resolves.toBeNull();
  });

  test('Should return a session with normalized roles and the fresh token', async () => {
    mockCheckNestTokenStatus.mockResolvedValue({
      ok: true,
      user: adminUser,
      token: 'fresh-token',
    });

    const { getSession } = await importGetSession();

    const session = await getSession();

    expect(session?.user.email).toBe('johnny@example.com');
    expect(session?.user.roles).toEqual(['admin']);
    expect(session?.user.username).toBeNull();
    expect(session?.session.token).toBe('fresh-token');
  });

  test('Should return not authenticated when the session is invalid', async () => {
    mockCheckNestTokenStatus.mockResolvedValue({
      ok: false,
      message: 'Session expired',
    });

    const { requireAdmin } = await importGetSession();

    const response = await requireAdmin();

    expect(response).toEqual({
      ok: false,
      message: '¡ Debes estar autentificado para realizar esta acción !',
    });
    expect(mockCookieSet).not.toHaveBeenCalled();
  });

  test('Should return no admin permissions when the user lacks the admin role', async () => {
    mockCheckNestTokenStatus.mockResolvedValue({
      ok: true,
      user: { ...adminUser, roles: ['user'] },
      token: 'fresh-token',
    });

    const { requireAdmin } = await importGetSession();

    const response = await requireAdmin();

    expect(response).toEqual({
      ok: false,
      message: '¡ No tienes permisos administrativos para realizar esta acción !',
    });
    expect(mockCookieSet).not.toHaveBeenCalled();
  });

  test('Should rotate the cookies in persistent mode', async () => {
    mockCheckNestTokenStatus.mockResolvedValue({
      ok: true,
      user: adminUser,
      token: 'fresh-token',
    });
    mockCookieGet.mockImplementation((name: string) =>
      name === 'nest_session_mode' ? { value: 'persistent' } : null,
    );

    const { requireAdmin } = await importGetSession();

    const response = await requireAdmin();

    expect(response.ok).toBe(true);
    expect(mockCookieSet).toHaveBeenCalledWith(
      'nest_access_token',
      'fresh-token',
      expect.objectContaining({ httpOnly: true, path: '/', maxAge: 3600 }),
    );
    expect(mockCookieSet).toHaveBeenCalledWith(
      'nest_session_mode',
      'persistent',
      expect.objectContaining({ maxAge: 3600 }),
    );
  });

  test('Should not rotate the cookies in session mode', async () => {
    mockCheckNestTokenStatus.mockResolvedValue({
      ok: true,
      user: adminUser,
      token: 'fresh-token',
    });
    mockCookieGet.mockImplementation((name: string) =>
      name === 'nest_session_mode' ? { value: 'session' } : null,
    );

    const { requireAdmin } = await importGetSession();

    const response = await requireAdmin();

    expect(response.ok).toBe(true);
    expect(mockCookieSet).not.toHaveBeenCalled();
  });

  test('Should not rotate the cookies when there is no mode cookie', async () => {
    mockCheckNestTokenStatus.mockResolvedValue({
      ok: true,
      user: adminUser,
      token: 'fresh-token',
    });

    const { requireAdmin } = await importGetSession();

    const response = await requireAdmin();

    expect(response.ok).toBe(true);
    expect(mockCookieSet).not.toHaveBeenCalled();
  });
});
