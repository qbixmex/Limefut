const { mockFindFirst } = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    field: {
      findFirst: mockFindFirst,
    },
  },
}));

import { fetchFieldAction } from '@/app/admin/canchas/(actions)/fetchFieldAction';
import { fieldMock } from '../mocks/field.mock';

const fieldId = fieldMock.id;

describe('Tests on fetchFieldAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return field', async () => {
    mockFindFirst.mockResolvedValue(fieldMock);

    const response = await fetchFieldAction(fieldId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/cancha obtenida correctamente/i);
    expect(response.field).toEqual(fieldMock);
    expect(mockFindFirst).toHaveBeenCalledOnce();
    expect(mockFindFirst).toHaveBeenCalledWith({ where: { id: fieldId } });
  });

  test('Should return error when field is not found', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await fetchFieldAction(fieldId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe/i);
    expect(response.field).toBe(null);
  });

  test('Should return error on database failure', async () => {
    mockFindFirst.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchFieldAction(fieldId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo obtener la cancha/i);
    expect(response.field).toBe(null);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindFirst.mockRejectedValue('Something unexpected');

    const response = await fetchFieldAction(fieldId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.field).toBe(null);
  });
});
