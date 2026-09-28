const { mockFindMany, mockCount } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockCount: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    coach: {
      findMany: mockFindMany,
      count: mockCount,
    },
  },
}));

import { fetchCoachesAction } from '@/app/admin/entrenadores/(actions)/fetch-coaches.action';
import { coachesMock } from '../mocks/coaches.mock';

const prismaCoaches = coachesMock.map((coach) => ({
  id: coach.id,
  name: coach.name,
  email: coach.email,
  phone: coach.phone,
  imageUrl: coach.imageUrl,
  active: coach.active,
  _count: { teams: coach.teamsCount },
}));

describe('Tests on fetchCoachesAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return all coaches with default pagination', async () => {
    mockFindMany.mockResolvedValue(prismaCoaches);
    mockCount.mockResolvedValue(2);

    const response = await fetchCoachesAction();

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/entrenadores fueron obtenidos/i);
    expect(response.coaches).toHaveLength(coachesMock.length);

    response.coaches!.forEach((coach, index) => {
      expect(coach.id).toBe(coachesMock[index].id);
      expect(coach.name).toBe(coachesMock[index].name);
      expect(coach.email).toBe(coachesMock[index].email);
      expect(coach.phone).toBe(coachesMock[index].phone);
      expect(coach.imageUrl).toBe(coachesMock[index].imageUrl);
      expect(coach.active).toBe(coachesMock[index].active);
      expect(coach.teamsCount).toBe(coachesMock[index].teamsCount);
    });

    expect(mockFindMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { name: 'asc' },
      take: 12,
      skip: 0,
      select: expect.objectContaining({
        id: true,
        name: true,
        email: true,
        phone: true,
        imageUrl: true,
        active: true,
        _count: { select: { teams: true } },
      }),
    });
    expect(mockCount).toHaveBeenCalledWith({ where: {} });
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
    });
  });

  test('Should search coaches by name', async () => {
    const searchTerm = 'Roberto';
    const filtered = prismaCoaches.filter((coach) => coach.name.includes(searchTerm));
    mockFindMany.mockResolvedValue(filtered);
    mockCount.mockResolvedValue(1);

    const response = await fetchCoachesAction({ searchTerm });

    expect(response.ok).toBe(true);
    expect(response.coaches).toHaveLength(1);
    expect(response.coaches![0].name).toContain(searchTerm);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
            { phone: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
      }),
    );
    expect(mockCount).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
          { phone: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
    });
  });

  test('Should search coaches by mail', async () => {
    const searchTerm = 'roberto@email.com';
    const filtered = prismaCoaches.filter((coach) => coach.email.includes(searchTerm));
    mockFindMany.mockResolvedValue(filtered);
    mockCount.mockResolvedValue(1);

    const response = await fetchCoachesAction({ searchTerm });

    expect(response.ok).toBe(true);
    expect(response.coaches).toHaveLength(1);
    expect(response.coaches![0].email).toContain(searchTerm);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
            { phone: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
      }),
    );
    expect(mockCount).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
          { phone: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
    });
  });

  test('Should search coaches by phone', async () => {
    const searchTerm = '+52-555-123-4567';
    const filtered = prismaCoaches.filter((coach) => coach.phone.includes(searchTerm));
    mockFindMany.mockResolvedValue(filtered);
    mockCount.mockResolvedValue(1);

    const response = await fetchCoachesAction({ searchTerm });

    expect(response.ok).toBe(true);
    expect(response.coaches).toHaveLength(1);
    expect(response.coaches![0].phone).toContain(searchTerm);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
            { phone: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
      }),
    );
    expect(mockCount).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
          { phone: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
    });
  });

  test('Should paginate results', async () => {
    const paginated = [prismaCoaches[0]];
    mockFindMany.mockResolvedValue(paginated);
    mockCount.mockResolvedValue(2);

    const response = await fetchCoachesAction({ page: 2, take: 1 });

    expect(response.ok).toBe(true);
    expect(response.coaches).toHaveLength(1);
    expect(response.coaches![0].id).toBe(coachesMock[0].id);
    expect(response.pagination).toEqual({
      currentPage: 2,
      totalPages: 2,
    });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 1, take: 1 }),
    );
  });

  test('Should handle NaN page and take with fallback defaults', async () => {
    mockFindMany.mockResolvedValue(prismaCoaches);
    mockCount.mockResolvedValue(2);

    const response = await fetchCoachesAction({
      page: Number('lorem'),
      take: Number('ipsum'),
    });

    expect(response.ok).toBe(true);
    expect(response.coaches).toHaveLength(2);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 12 }),
    );
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
    });
  });

  test('Should return empty array when no coaches match', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const response = await fetchCoachesAction();

    expect(response.ok).toBe(true);
    expect(response.coaches).toHaveLength(0);
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 0,
    });
  });

  test('Should return error when database throws', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchCoachesAction();

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.coaches).toBeNull();
    expect(response.pagination).toBeNull();
  });

  test('Should return error on unexpected server error', async () => {
    mockFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchCoachesAction();

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.coaches).toBeNull();
    expect(response.pagination).toBeNull();
  });
});
