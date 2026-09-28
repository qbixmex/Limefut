const { mockFindMany, mockCount } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockCount: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    field: {
      findMany: mockFindMany,
      count: mockCount,
    },
  },
}));

import { fetchFieldsAction } from '@/app/admin/canchas/(actions)/fetchFieldsAction';
import { fieldsMock } from '../mocks/fields.mock';

const prismaFields = fieldsMock.map((field) => ({
  id: field.id,
  name: field.name,
  permalink: field.permalink,
  city: field.city,
  state: field.state,
  country: field.country,
}));

describe('Tests on fetchFieldsAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return all fields with default pagination', async () => {
    mockFindMany.mockResolvedValue(prismaFields);
    mockCount.mockResolvedValue(2);

    const response = await fetchFieldsAction();

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/canchas fueron obtenidas/i);
    expect(response.fields).toHaveLength(fieldsMock.length);

    response.fields.forEach((field, index) => {
      expect(field.id).toBe(fieldsMock[index].id);
      expect(field.name).toBe(fieldsMock[index].name);
      expect(field.permalink).toBe(fieldsMock[index].permalink);
      expect(field.city).toBe(fieldsMock[index].city);
      expect(field.state).toBe(fieldsMock[index].state);
      expect(field.country).toBe(fieldsMock[index].country);
    });

    expect(mockFindMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { name: 'asc' },
      take: 12,
      skip: 0,
      select: {
        id: true,
        name: true,
        permalink: true,
        city: true,
        state: true,
        country: true,
      },
    });
    expect(mockCount).toHaveBeenCalledWith({ where: {} });
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
    });
  });

  test('Should search fields by name', async () => {
    const searchTerm = 'Unidad deportiva tucson';
    const filtered = prismaFields.filter((field) => field.name.includes(searchTerm));
    mockFindMany.mockResolvedValue(filtered);
    mockCount.mockResolvedValue(1);

    const response = await fetchFieldsAction({ searchTerm });

    expect(response.ok).toBe(true);
    expect(response.fields).toHaveLength(1);
    expect(response.fields[0].name).toContain(searchTerm);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
      }),
    );
    expect(mockCount).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
    });
  });

  test('Should paginate results', async () => {
    mockFindMany.mockResolvedValue([prismaFields[0]]);
    mockCount.mockResolvedValue(2);

    const response = await fetchFieldsAction({ page: 2, take: 1 });

    expect(response.ok).toBe(true);
    expect(response.fields).toHaveLength(1);
    expect(response.fields[0].id).toBe(fieldsMock[0].id);
    expect(response.pagination).toEqual({
      currentPage: 2,
      totalPages: 2,
    });
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 1, take: 1 }),
    );
  });

  test('Should handle NaN page and take with fallback defaults', async () => {
    mockFindMany.mockResolvedValue(prismaFields);
    mockCount.mockResolvedValue(2);

    const response = await fetchFieldsAction({
      page: Number('lorem'),
      take: Number('ipsum'),
    });

    expect(response.ok).toBe(true);
    expect(response.fields).toHaveLength(2);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 0, take: 12 }),
    );
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 1,
    });
  });

  test('Should return empty array when no fields match', async () => {
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);

    const response = await fetchFieldsAction();

    expect(response.ok).toBe(true);
    expect(response.fields).toHaveLength(0);
    expect(response.pagination).toEqual({
      currentPage: 1,
      totalPages: 0,
    });
  });

  test('Should return error when database throws', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchFieldsAction();

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.fields).toHaveLength(0);
    expect(response.pagination).toEqual({
      currentPage: 0,
      totalPages: 0,
    });
  });

  test('Should return error on unexpected server error', async () => {
    mockFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchFieldsAction();

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.fields).toHaveLength(0);
    expect(response.pagination).toEqual({
      currentPage: 0,
      totalPages: 0,
    });
  });
});
