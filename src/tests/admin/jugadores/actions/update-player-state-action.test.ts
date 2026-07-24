const { mockCount, mockUpdate } = vi.hoisted(() => ({
  mockCount: vi.fn(),
  mockUpdate: vi.fn(),
}));

vi.mock('next/cache');

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
  });

  test('Should return error when authenticated user id is undefined', async () => {
    const response = await updatePlayerStateAction({
      id: 'c93a8c24-ca76-493c-b1e3-f533454bbdae',
      state: true,
      authenticatedUserId: undefined,
      authenticatedUserRoles: ['admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/autentificado/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user id is null', async () => {
    const response = await updatePlayerStateAction({
      id: 'c93a8c24-ca76-493c-b1e3-f533454bbdae',
      state: true,
      authenticatedUserId: null,
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/autentificado/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    const response = await updatePlayerStateAction({
      id: 'c93a8c24-ca76-493c-b1e3-f533454bbdae',
      state: true,
      authenticatedUserId: '4c20f4f2-21f5-47ca-9b4a-dafe2335a993',
      authenticatedUserRoles: null,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles does not include admin', async () => {
    const response = await updatePlayerStateAction({
      id: 'c93a8c24-ca76-493c-b1e3-f533454bbdae',
      state: true,
      authenticatedUserId: '4c20f4f2-21f5-47ca-9b4a-dafe2335a993',
      authenticatedUserRoles: ['user'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    const response = await updatePlayerStateAction({
      id: 'c93a8c24-ca76-493c-b1e3-f533454bbdae',
      state: true,
      authenticatedUserId: '4c20f4f2-21f5-47ca-9b4a-dafe2335a993',
      authenticatedUserRoles: [],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when player does not exist', async () => {
    mockCount.mockResolvedValue(0);

    const response = await updatePlayerStateAction({
      id: 'c93a8c24-ca76-493c-b1e3-f533454bbdae',
      state: true,
      authenticatedUserId: '4c20f4f2-21f5-47ca-9b4a-dafe2335a993',
      authenticatedUserRoles: ['user', 'admin'],
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
      authenticatedUserId: '4c20f4f2-21f5-47ca-9b4a-dafe2335a993',
      authenticatedUserRoles: ['admin'],
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
      authenticatedUserId: '4c20f4f2-21f5-47ca-9b4a-dafe2335a993',
      authenticatedUserRoles: ['admin'],
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
