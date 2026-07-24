const { mockFindUnique } = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    player: {
      findUnique: mockFindUnique,
    },
  },
}));

import { fetchPlayerAction } from '@/app/admin/jugadores/(actions)/fetchPlayerAction';
import { playerMock } from '../mocks/player.mock';

const playerId = playerMock.id;

describe('Tests on fetchPlayerAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should not allow to return a player if user is not authenticated', async () => {
    const response = await fetchPlayerAction({
      playerId,
      authenticatedUserId: null,
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/autentificado/i);
    expect(response.player).toBe(null);
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  test('Should not allow to return a player when userRoles is null', async () => {
    const response = await fetchPlayerAction({
      playerId,
      authenticatedUserId: '2a734ef5-f019-4fb4-85a8-1ebc032f440d',
      authenticatedUserRoles: null,
    });

    expect(response.ok).toBe(false);
    expect(response.player).toBe(null);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  test('Should reject when userRole does not include admin', async () => {
    const response = await fetchPlayerAction({
      playerId,
      authenticatedUserId: '2a734ef5-f019-4fb4-85a8-1ebc032f440d',
      authenticatedUserRoles: ['user'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(response.player).toBe(null);
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  test('Should reject when userRole is empty array', async () => {
    const response = await fetchPlayerAction({
      playerId,
      authenticatedUserId: '2a734ef5-f019-4fb4-85a8-1ebc032f440d',
      authenticatedUserRoles: [],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(response.player).toBeNull();
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  test('Should return player when user roles includes admin', async () => {
    mockFindUnique.mockResolvedValue(playerMock);

    const response = await fetchPlayerAction({
      playerId,
      authenticatedUserId: '2a734ef5-f019-4fb4-85a8-1ebc032f440d',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/correctamente/i);
    expect(response.player).toEqual(playerMock);
    expect(mockFindUnique).toHaveBeenCalledOnce();
  });

  test('Should return error when player is not found', async () => {
    mockFindUnique.mockResolvedValue(null);

    const response = await fetchPlayerAction({
      playerId,
      authenticatedUserId: '2a734ef5-f019-4fb4-85a8-1ebc032f440d',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no encontrado/i);
    expect(response.player).toBe(null);
  });

  test('Should return error on database failure', async () => {
    mockFindUnique.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchPlayerAction({
      playerId,
      authenticatedUserId: '2a734ef5-f019-4fb4-85a8-1ebc032f440d',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo obtener el jugador/i);
    expect(response.player).toBe(null);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindUnique.mockRejectedValue('Something unexpected');

    const response = await fetchPlayerAction({
      playerId,
      authenticatedUserId: '2a734ef5-f019-4fb4-85a8-1ebc032f440d',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.player).toBe(null);
  });
});
