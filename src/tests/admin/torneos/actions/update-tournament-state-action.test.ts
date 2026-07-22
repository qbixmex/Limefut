const { mockCount, mockUpdate } = vi.hoisted(() => ({
  mockCount: vi.fn(),
  mockUpdate: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    tournament: {
      count: mockCount,
      update: mockUpdate,
    },
  },
}));

import { updateTournamentStateAction } from '@/app/admin/torneos/(actions)';

describe('Tests on update tournament state server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should return error when authenticatedUserId is undefined', async () => {
    const response = await updateTournamentStateAction({
      id: 'some-id',
      state: true,
      authenticatedUserId: undefined,
      authenticatedUserRoles: ['admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('autentificado');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    const response = await updateTournamentStateAction({
      id: 'some-id',
      state: true,
      authenticatedUserId: 'user-1',
      authenticatedUserRoles: ['user'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when userRoles is null', async () => {
    const response = await updateTournamentStateAction({
      id: 'some-id',
      state: true,
      authenticatedUserId: 'user-1',
      authenticatedUserRoles: null,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when userRoles are empty', async () => {
    const response = await updateTournamentStateAction({
      id: 'some-id',
      state: true,
      authenticatedUserId: 'user-1',
      authenticatedUserRoles: [],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when tournament does not exist', async () => {
    mockCount.mockResolvedValue(0);

    const response = await updateTournamentStateAction({
      id: 'dc233c07-9790-439f-9f50-88b86a13eb62',
      state: true,
      authenticatedUserId: 'user-1',
      authenticatedUserRoles: ['admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('no existe');
    expect(mockCount).toHaveBeenCalledWith({
      where: { id: 'dc233c07-9790-439f-9f50-88b86a13eb62' },
    });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should activate a tournament', async () => {
    mockCount.mockResolvedValue(1);
    mockUpdate.mockResolvedValue({
      name: 'Torneo Jóvenes Promesas',
      permalink: 'torneo-jovenes-promesas',
      active: true,
    });

    const response = await updateTournamentStateAction({
      id: '17834fc4-afd8-490a-b07d-88d62e601521',
      state: true,
      authenticatedUserId: 'user-1',
      authenticatedUserRoles: ['admin'],
    });

    expect(response.ok).toBe(true);
    expect(response.message).toContain('activado');
    expect(response.message).toContain('Torneo Jóvenes Promesas');
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: '17834fc4-afd8-490a-b07d-88d62e601521' },
      data: { active: true },
      select: { name: true, permalink: true, active: true },
    });
  });

  test('Should deactivate a tournament', async () => {
    mockCount.mockResolvedValue(1);
    mockUpdate.mockResolvedValue({
      name: 'Torneo Jóvenes Promesas',
      permalink: 'torneo-jovenes-promesas',
      active: false,
    });

    const response = await updateTournamentStateAction({
      id: '17834fc4-afd8-490a-b07d-88d62e601521',
      state: false,
      authenticatedUserId: 'user-1',
      authenticatedUserRoles: ['admin'],
    });

    expect(response.ok).toBe(true);
    expect(response.message).toContain('desactivado');
    expect(response.message).toContain('Torneo Jóvenes Promesas');
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: '17834fc4-afd8-490a-b07d-88d62e601521' },
      data: { active: false },
      select: { name: true, permalink: true, active: true },
    });
  });
});
