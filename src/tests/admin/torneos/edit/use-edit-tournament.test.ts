import { renderHook, act } from '@testing-library/react';
import { useEditTournament } from '@/app/admin/torneos/editar/[id]/use-edit-tournament';
import { mockTournament } from './mocks/tournament';
import { ROUTES } from '@/shared/constants/routes';

const { mockReplace, mockUpdateAction } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockUpdateAction: vi.fn<
    (params: {
      authenticatedUserId: string | undefined;
      authenticatedUserRoles: string[] | null | undefined;
      tournamentId: string;
      formData: FormData;
    }) => Promise<{ ok: boolean; message: string }>
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
  updateTournamentAction: mockUpdateAction,
}));

const defaultProps = {
  authenticatedUserId: '7589cfc5-2f26-4a5f-91b3-91fac387ae16',
  authenticatedUserRoles: ['user', 'admin'],
  tournament: mockTournament,
};

const validData = {
  name: mockTournament.name,
  permalink: mockTournament.permalink,
  categoriesIds: mockTournament.categoriesIds,
  cities: mockTournament.cities,
  country: mockTournament.country ?? undefined,
  season: mockTournament.season ?? undefined,
  description: mockTournament.description ?? undefined,
  startDate: mockTournament.startDate,
  endDate: mockTournament.endDate,
  active: mockTournament.active,
};

describe('Tests on useEditTournament hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateAction.mockResolvedValue({
      ok: true,
      message: 'Torneo actualizado correctamente',
    });
  });

  test('Should initialize form with tournament default values', () => {
    const { result } = renderHook(() => useEditTournament(defaultProps));

    const values = result.current.form.getValues();

    expect(values.name).toBe(mockTournament.name);
    expect(values.permalink).toBe(mockTournament.permalink);
    expect(values.country).toBe(mockTournament.country ?? undefined);
    expect(values.active).toBe(mockTournament.active);
    expect(values.startDate).toStrictEqual(mockTournament.startDate);
    expect(values.endDate).toStrictEqual(mockTournament.endDate);
  });

  test('handleNavigateBack should reset form and navigate to admin tournaments', () => {
    const { result } = renderHook(() => useEditTournament(defaultProps));

    act(() => result.current.handleNavigateBack());

    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_TOURNAMENTS);
  });

  test('onSubmit should call updateTournamentAction with correct params', async () => {
    const { result } = renderHook(() => useEditTournament(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(mockUpdateAction).toHaveBeenCalledWith(
      expect.objectContaining({
        authenticatedUserId: defaultProps.authenticatedUserId,
        authenticatedUserRoles: defaultProps.authenticatedUserRoles,
        tournamentId: mockTournament.id,
        formData: expect.any(FormData),
      }),
    );

    const { formData } = mockUpdateAction.mock.calls[0][0];
    expect(formData.get('name')).toBe(mockTournament.name);
    expect(formData.get('permalink')).toBe(mockTournament.permalink);
    expect(formData.get('active')).toBe(String(mockTournament.active));
  });

  test('onSubmit should show success toast and navigate on success', async () => {
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditTournament(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.success).toHaveBeenCalledWith('Torneo actualizado correctamente');
    expect(mockReplace).toHaveBeenCalledWith(ROUTES.ADMIN_TOURNAMENTS);
  });

  test('onSubmit should show error toast on failure', async () => {
    mockUpdateAction.mockResolvedValue({
      ok: false,
      message: 'Error al actualizar el torneo',
    });
    const { toast } = await import('sonner');
    const { result } = renderHook(() => useEditTournament(defaultProps));

    await act(async () => {
      await result.current.onSubmit(validData);
    });

    expect(toast.error).toHaveBeenCalledWith('Error al actualizar el torneo');
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
