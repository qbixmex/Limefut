const { mockCount, mockUpdate, mockGetSession } = vi.hoisted(() => ({
  mockCount: vi.fn(),
  mockUpdate: vi.fn(),
  mockGetSession: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: mockGetSession,
    },
  },
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    player: {
      count: mockCount,
      update: mockUpdate,
    },
  },
}));

import { updatePlayerStateAction } from '@/app/admin/jugadores/(actions)/updatePlayerStateAction';

describe('Tests on update player state server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updatePlayerStateAction({
      id: 'c93a8c24-ca76-493c-b1e3-f533454bbdae',
      state: true,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ Debes estar autentificado para realizar esta acción !');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['user'] },
    });

    const response = await updatePlayerStateAction({
      id: 'c93a8c24-ca76-493c-b1e3-f533454bbdae',
      state: true,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: null },
    });

    const response = await updatePlayerStateAction({
      id: 'c93a8c24-ca76-493c-b1e3-f533454bbdae',
      state: true,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: [] },
    });

    const response = await updatePlayerStateAction({
      id: 'c93a8c24-ca76-493c-b1e3-f533454bbdae',
      state: true,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when player does not exist', async () => {
    mockCount.mockResolvedValue(0);

    const response = await updatePlayerStateAction({
      id: 'c93a8c24-ca76-493c-b1e3-f533454bbdae',
      state: true,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe/i);
    expect(mockCount).toHaveBeenCalledWith({
      where: { id: 'c93a8c24-ca76-493c-b1e3-f533454bbdae' },
    });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should activate a player', async () => {
    mockCount.mockResolvedValue(1);
    mockUpdate.mockResolvedValue({
      name: 'Juan Pérez',
      active: true,
    });

    const response = await updatePlayerStateAction({
      id: 'c93a8c24-ca76-493c-b1e3-f533454bbdae',
      state: true,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/activado/i);
    expect(response.message).toMatch(/juan pérez/i);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'c93a8c24-ca76-493c-b1e3-f533454bbdae' },
      data: { active: true },
      select: { name: true, active: true },
    });
  });

  test('Should deactivate a player', async () => {
    mockCount.mockResolvedValue(1);
    mockUpdate.mockResolvedValue({
      name: 'Juan Pérez',
      active: false,
    });

    const response = await updatePlayerStateAction({
      id: 'c93a8c24-ca76-493c-b1e3-f533454bbdae',
      state: false,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/desactivado/i);
    expect(response.message).toMatch(/juan pérez/i);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'c93a8c24-ca76-493c-b1e3-f533454bbdae' },
      data: { active: false },
      select: { name: true, active: true },
    });
  });
});
