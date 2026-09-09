const { mockCallNestApi } = vi.hoisted(() => ({
  mockCallNestApi: vi.fn(),
}));

vi.mock('@/lib/nest-api', () => ({
  callNestApi: mockCallNestApi,
}));

import { fetchUsersApi } from '@/app/admin/usuarios/(services)/fetch-users.api';

const apiResponse = {
  statusCode: 200,
  message: 'Success',
  users: [
    {
      id: '0079fbf1-9e07-4b2a-9c29-d8bfb1a1e90f',
      name: 'Daniel',
      username: 'sonusbeat',
      email: 'qbixmex@gmail.com',
      imageUrl: 'https://example.com/daniel.webp',
      isActive: true,
    },
    {
      id: '5e0ac96a-f8a0-48ec-8824-2fcad4ecd645',
      name: 'Moises',
      username: 'limefut',
      email: 'limefutgdl@gmail.com',
      imageUrl: null,
      isActive: true,
    },
  ],
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
};

describe('Tests on fetchUsersApi service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should return mapped users and pagination on a successful response', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: true,
      status: 200,
      data: apiResponse,
    });

    const result = await fetchUsersApi({ page: 1, take: 12 });

    expect(mockCallNestApi).toHaveBeenCalledWith(
      '/users?page=1&take=12',
      undefined,
      undefined,
    );
    expect(result.ok).toBe(true);
    expect(result.message).toMatch(/obtenidos/i);
    expect(result.users).toHaveLength(2);
    expect(result.users![0]).toEqual({
      id: '0079fbf1-9e07-4b2a-9c29-d8bfb1a1e90f',
      name: 'Daniel',
      username: 'sonusbeat',
      email: 'qbixmex@gmail.com',
      imageUrl: 'https://example.com/daniel.webp',
      isActive: true,
      roles: [],
    });
    expect(result.pagination).toEqual({ currentPage: 1, totalPages: 1 });
  });

  test('Should return ok false when the response body has no data', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: true,
      status: 200,
      data: { statusCode: 200, message: 'Success' },
    });

    const result = await fetchUsersApi({ page: 1, take: 12 });

    expect(result.ok).toBe(false);
    expect(result.users).toBeNull();
    expect(result.pagination).toBeNull();
  });

  test('Should return the backend message when the response is not ok', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: false,
      status: 401,
      data: { statusCode: 401, message: 'Unauthorized' },
    });

    const result = await fetchUsersApi({ page: 1, take: 12 });

    expect(result.ok).toBe(false);
    expect(result.message).toBe('Unauthorized');
    expect(result.users).toBeNull();
    expect(result.pagination).toBeNull();
  });

  test('Should return a generic message when the API cannot be reached', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: false,
      status: 0,
      data: null,
    });

    const result = await fetchUsersApi();

    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/pudieron obtener/i);
    expect(result.users).toBeNull();
    expect(result.pagination).toBeNull();
  });

  test('Should call /users without params when no options are provided', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: true,
      status: 200,
      data: apiResponse,
    });

    const result = await fetchUsersApi();

    expect(mockCallNestApi).toHaveBeenCalledWith('/users', undefined, undefined);
    expect(result.ok).toBe(true);
  });

  test('Should send only the page param when take is not provided', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: true,
      status: 200,
      data: apiResponse,
    });

    const result = await fetchUsersApi({ page: 2 });

    expect(mockCallNestApi).toHaveBeenCalledWith(
      '/users?page=2',
      undefined,
      undefined,
    );
    expect(result.ok).toBe(true);
  });

  test('Should send only the take param when page is not provided', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: true,
      status: 200,
      data: apiResponse,
    });

    const result = await fetchUsersApi({ take: 5 });

    expect(mockCallNestApi).toHaveBeenCalledWith(
      '/users?take=5',
      undefined,
      undefined,
    );
    expect(result.ok).toBe(true);
  });

  test('Should return ok false without calling the API on invalid params', async () => {
    const result = await fetchUsersApi({
      page: Number('lorem'),
      take: Number('ipsum'),
    });

    expect(mockCallNestApi).not.toHaveBeenCalled();
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/números válidos/i);
    expect(result.users).toBeNull();
    expect(result.pagination).toBeNull();
  });

  test('Should reject zero, negative and decimal values', async () => {
    const invalidOptions = [
      { page: 0 },
      { take: 0 },
      { page: -1 },
      { take: -2 },
      { page: 1.5 },
      { take: 3.7 },
    ];

    for (const options of invalidOptions) {
      const result = await fetchUsersApi(options);
      expect(result.ok).toBe(false);
      expect(result.message).toMatch(/números válidos/i);
    }

    expect(mockCallNestApi).not.toHaveBeenCalled();
  });

  test('Should forward the provided token to the API', async () => {
    mockCallNestApi.mockResolvedValue({
      ok: true,
      status: 200,
      data: apiResponse,
    });

    const result = await fetchUsersApi({ page: 2, take: 10 }, 'abc-123');

    expect(mockCallNestApi).toHaveBeenCalledWith(
      '/users?page=2&take=10',
      undefined,
      'abc-123',
    );
    expect(result.ok).toBe(true);
  });
});
