const { mockFetchUsersApi, mockCacheLife, mockCacheTag } = vi.hoisted(() => ({
  mockFetchUsersApi: vi.fn(),
  mockCacheLife: vi.fn(),
  mockCacheTag: vi.fn(),
}));

vi.mock('next/cache', () => ({
  cacheLife: mockCacheLife,
  cacheTag: mockCacheTag,
}));

vi.mock('@/app/admin/usuarios/(services)/fetch-users.api', () => ({
  fetchUsersApi: mockFetchUsersApi,
}));

import { fetchUsersCached } from '@/app/admin/usuarios/(services)/fetch-users-cached';

const apiResult = {
  ok: true,
  message: '! Los usuarios fueron obtenidos satisfactoriamente 👍',
  users: [
    {
      id: '0079fbf1-9e07-4b2a-9c29-d8bfb1a1e90f',
      name: 'Daniel',
      username: 'sonusbeat',
      email: 'qbixmex@gmail.com',
      imageUrl: 'https://example.com/daniel.webp',
      isActive: true,
      roles: [],
    },
  ],
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
};

describe('Tests on fetchUsersCached', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should configure the cache and return the result on success', async () => {
    mockFetchUsersApi.mockResolvedValue(apiResult);

    const result = await fetchUsersCached({ page: 1, take: 10, token: 'xyz' });

    expect(mockCacheLife).toHaveBeenCalledWith('max');
    expect(mockCacheTag).toHaveBeenCalledWith('admin-users');
    expect(mockFetchUsersApi).toHaveBeenCalledWith(
      { page: 1, take: 10 },
      'xyz',
    );
    expect(result).toEqual(apiResult);
  });

  test('Should forward the failure result from the service', async () => {
    mockFetchUsersApi.mockResolvedValue({
      ok: false,
      message: 'Unauthorized',
      users: null,
      pagination: null,
    });

    const result = await fetchUsersCached({ token: null });

    expect(result.ok).toBe(false);
    expect(result.message).toBe('Unauthorized');
    expect(result.users).toBeNull();
    expect(result.pagination).toBeNull();
  });

  test('Should work without options or token', async () => {
    mockFetchUsersApi.mockResolvedValue(apiResult);

    const result = await fetchUsersCached({});

    expect(mockFetchUsersApi).toHaveBeenCalledWith(
      { page: undefined, take: undefined },
      undefined,
    );
    expect(result.ok).toBe(true);
  });
});
