import { renderHook, act } from '@testing-library/react';
import { useCreateTournament } from '@/app/admin/torneos/crear/use-create-tournament';
import { ROUTES } from '@/shared/constants/routes';

const { mockReplace, mockCreateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockCreateAction: vi.fn<
    (params: {
      authenticatedUserId: string | undefined;
      authenticatedUserRoles: string[] | null | undefined;
      formData: FormData;
    }) => Promise<{ ok: boolean; message: string; tournament: null }>
  >(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock('@/app/admin/torneos/(actions)', () => ({
  createTournamentAction: mockCreateAction,
}));

const defaultProps = {
  authenticatedUserId: '7589cfc5-2f26-4a5f-91b3-91fac387ae16',
  authenticatedUserRoles: ['user', 'admin'],
};

const validData = {
  name: 'Nuevo Torneo',
  permalink: 'nuevo-torneo',
  categoriesIds: [],
  cities: [],
  country: undefined,
  season: undefined,
  description: undefined,
  startDate: new Date('2025-01-01T00:00:00.000Z'),
  endDate: new Date('2025-12-31T00:00:00.000Z'),
  active: true,
};

describe('Tests on useCreateTournament hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateAction.mockResolvedValue({
      ok: true,
      message: '¡ Torneo creado satisfactoriamente 👍 !',
      tournament: null,
    });
  });

  test('Should initialize form with default values', () => {
    const { result } = renderHook(() => useCreateTournament(defaultProps));

    const values = result.current.form.getValues();

    expect(values.name).toBe('');
    expect(values.permalink).toBe('');
    expect(values.categoriesIds).toStrictEqual([]);
    expect(values.country).toBeUndefined();
    expect(values.active).toBe(false);
    expect(values.startDate).toBeUndefined();
    expect(values.endDate).toBeUndefined();
  });

  test('handleNavigateBack should reset form and navigate to admin tournaments', () => {
    const { result } = renderHook(() => useCreateTournament(defaultProps));

    act(() => result.current.handleNavigateBack());

    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_TOURNAMENTS);
  });

  test('onSubmit should call createTournamentAction with correct params', async () => {
    const { result } = renderHook(() => useCreateTournament(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockCreateAction).toHaveBeenCalledWith(
      expect.objectContaining({
        authenticatedUserId: defaultProps.authenticatedUserId,
        authenticatedUserRoles: defaultProps.authenticatedUserRoles,
        formData: expect.any(FormData),
      }),
    );

    const { formData } = mockCreateAction.mock.calls[0][0];
    expect(formData.get('name')).toBe(validData.name);
    expect(formData.get('permalink')).toBe(validData.permalink);
    expect(formData.get('active')).toBe(String(validData.active));
  });

  test('onSubmit should show success toast and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateTournament(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('¡ Torneo creado satisfactoriamente 👍 !');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_TOURNAMENTS);
  });

  test('onSubmit should show error toast on failure', async () => {
    mockCreateAction.mockResolvedValue({
      ok: false,
      message: 'Error al crear el torneo',
      tournament: null,
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useCreateTournament(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al crear el torneo');
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
