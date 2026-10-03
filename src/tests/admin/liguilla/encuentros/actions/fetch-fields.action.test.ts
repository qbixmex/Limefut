const { mockFieldFindMany } = vi.hoisted(() => ({
  mockFieldFindMany: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    field: { findMany: mockFieldFindMany },
  },
}));

import { fetchFieldsAction } from '@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/fetch-fields.action';
import { fieldsMock } from '../mocks/fields.mock';

describe('Tests on fetchFieldsAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockFieldFindMany.mockResolvedValue(fieldsMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return the fields ordered by name', async () => {
    const response = await fetchFieldsAction();

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/canchas fueron obtenidas/i);
    expect(response.fields).toEqual(fieldsMock);
    expect(mockFieldFindMany).toHaveBeenCalledWith({
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });
  });

  test('Should return the error message when the database throws an Error', async () => {
    mockFieldFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchFieldsAction();

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.fields).toEqual([]);
  });

  test('Should return a generic error on unexpected errors', async () => {
    mockFieldFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchFieldsAction();

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.fields).toEqual([]);
  });
});
