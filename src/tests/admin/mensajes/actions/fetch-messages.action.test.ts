const { mockFindMany, mockCount } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockCount: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    contactMessage: {
      findMany: mockFindMany,
      count: mockCount,
    },
  },
}));

import { fetchMessagesAction } from '@/app/admin/mensajes/(actions)/fetchMessagesAction';
import { messagesMock } from '../mocks/messages.mock';

const prismaMessages = messagesMock.map((message) => ({
  id: message.id,
  name: message.name,
  email: message.email,
  message: message.message,
  read: message.read,
  createdAt: message.createdAt,
}));

describe('Tests on fetchMessagesAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return all messages with default pagination', async () => {
    mockFindMany.mockResolvedValue(prismaMessages);
    mockCount.mockResolvedValue(2);

    const response = await fetchMessagesAction();

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/mensajes fueron obtenidos/i);
    expect(response.messages).toHaveLength(messagesMock.length);

    response.messages!.forEach((message, index) => {
      expect(message.id).toBe(messagesMock[index].id);
      expect(message.name).toBe(messagesMock[index].name);
      expect(message.email).toBe(messagesMock[index].email);
      expect(message.message).toBe(messagesMock[index].message);
      expect(message.read).toBe(messagesMock[index].read);
      expect(message.createdAt).toEqual(messagesMock[index].createdAt);
    });

    expect(mockFindMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { createdAt: 'desc' },
      take: 12,
      skip: 0,
      select: {
        id: true,
        name: true,
        email: true,
        message: true,
        read: true,
        createdAt: true,
      },
    });
    expect(mockCount).toHaveBeenCalledWith({ where: {} });
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
    });
  });

  test('Should search messages by name and email', async () => {
    const searchTerm = 'juan';
    mockFindMany.mockResolvedValue([prismaMessages[0]]);
    mockCount.mockResolvedValue(1);

    const response = await fetchMessagesAction({ searchTerm });

    expect(response.ok).toBe(true);
    expect(response.messages).toHaveLength(1);

    const expectedWhere = {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { email: { contains: searchTerm, mode: 'insensitive' } },
      ],
    };

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expectedWhere }),
    );
    expect(mockCount).toHaveBeenCalledWith({ where: expectedWhere });
  });

  test('Should paginate results', async () => {
    mockFindMany.mockResolvedValue([prismaMessages[0]]);
    mockCount.mockResolvedValue(3);

    const response = await fetchMessagesAction({ page: 2, take: 1 });

    expect(response.ok).toBe(true);
    expect(response.messages).toHaveLength(1);
    expect(response.messages![0].id).toBe(messagesMock[0].id);
    expect(response.pagination).toEqual({
      currentPage: 2,
      totalPages: 3,
    });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 1, take: 1 }),
    );
  });

  test('Should handle NaN page and take with fallback defaults', async () => {
    mockFindMany.mockResolvedValue(prismaMessages);
    mockCount.mockResolvedValue(2);

    const response = await fetchMessagesAction({
      page: Number('lorem'),
      take: Number('ipsum'),
    });

    expect(response.ok).toBe(true);
    expect(response.messages).toHaveLength(messagesMock.length);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 12 }),
    );
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
    });
  });

  test('Should return empty array when there are no messages', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const response = await fetchMessagesAction();

    expect(response.ok).toBe(true);
    expect(response.messages).toHaveLength(0);
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 0,
    });
  });

  test('Should return error when database throws', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchMessagesAction();

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.messages).toBeNull();
    expect(response.pagination).toBeNull();
  });

  test('Should return error on unexpected server error', async () => {
    mockFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchMessagesAction();

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.messages).toBeNull();
    expect(response.pagination).toBeNull();
  });
});
