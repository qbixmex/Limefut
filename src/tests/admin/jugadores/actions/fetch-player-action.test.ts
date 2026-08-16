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

  test('Should return player', async () => {
    mockFindUnique.mockResolvedValue(playerMock);

    const response = await fetchPlayerAction({
      playerId,
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
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no encontrado/i);
    expect(response.player).toBe(null);
  });

  test('Should return error on database failure', async () => {
    mockFindUnique.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchPlayerAction({
      playerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo obtener el jugador/i);
    expect(response.player).toBe(null);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindUnique.mockRejectedValue('Something unexpected');

    const response = await fetchPlayerAction({
      playerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.player).toBe(null);
  });
});
