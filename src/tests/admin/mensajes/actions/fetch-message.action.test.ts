const { mockFindUnique } = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    contactMessage: {
      findUnique: mockFindUnique,
    },
  },
}));

import { fetchMessageAction } from '@/app/admin/mensajes/(actions)/fetchMessageAction';
import { messageMock } from '../mocks/message.mock';

const messageId = messageMock.id as string;

describe('Tests on fetchMessageAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return message', async () => {
    mockFindUnique.mockResolvedValue(messageMock);

    const response = await fetchMessageAction(messageId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/mensaje obtenido correctamente/i);
    expect(response.contactMessage).toEqual(messageMock);
    expect(mockFindUnique).toHaveBeenCalledOnce();
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: messageId } });
  });

  test('Should return error when message is not found', async () => {
    mockFindUnique.mockResolvedValue(null);

    const response = await fetchMessageAction(messageId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no encontrado/i);
    expect(response.contactMessage).toBeNull();
  });

  test('Should return error on database failure', async () => {
    mockFindUnique.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchMessageAction(messageId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo obtener el mensaje/i);
    expect(response.contactMessage).toBeNull();
  });

  test('Should return error on unexpected server error', async () => {
    mockFindUnique.mockRejectedValue('Something unexpected');

    const response = await fetchMessageAction(messageId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.contactMessage).toBeNull();
  });
});
