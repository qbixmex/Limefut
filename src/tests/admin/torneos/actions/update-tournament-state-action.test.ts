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
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
  });

  test('Should return error when there is no authenticated session', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateTournamentStateAction('some-id', true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ Debes estar autentificado para realizar esta acción !');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['user'] },
    });

    const response = await updateTournamentStateAction('some-id', true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when userRoles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: null },
    });

    const response = await updateTournamentStateAction('some-id', true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when userRoles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: [] },
    });

    const response = await updateTournamentStateAction('some-id', true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when tournament does not exist', async () => {
    mockCount.mockResolvedValue(0);

    const response = await updateTournamentStateAction('dc233c07-9790-439f-9f50-88b86a13eb62', true);

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

    const response = await updateTournamentStateAction('17834fc4-afd8-490a-b07d-88d62e601521', true);

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

    const response = await updateTournamentStateAction('17834fc4-afd8-490a-b07d-88d62e601521', false);

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
